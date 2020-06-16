const { src, dest, parallel, series, watch } = require('gulp')
const gulpLoadPlugins = require('gulp-load-plugins')
const plugins = gulpLoadPlugins()
const del = require('del')
const browserAsync = require('browser-sync')
const bs = browserAsync.create()
const cwd = process.cwd()
let config = {
    build: {
        src: 'src',
        dist: 'dist',
        temp: 'temp',
        public: 'public',
        paths: {
            styles: 'assets/styles/*.scss',
            fonts: 'assets/fonts/**',
            images: 'assets/images/**',
            scripts: 'assets/scripts/*.js',
            pages: '*.html',
        }
    }
}
try {
    const loadConfig = require(`${cwd}/pages.config.js`)
    config = Object.assign({}, config, loadConfig)
} catch (e) {

}
const clean = () => {
    return del([config.build.dist, config.build.temp])
}
const page = () => {
    return src(config.build.paths.pages, { base: config.build.src, cwd: config.build.src })
        .pipe(plugins.swig({ data: config.data }))
        .pipe(dest(config.build.temp))
}
const style = () => {
    return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src })
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest(config.build.temp))
}

const script = () => {
    return src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src })
        .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest(config.build.temp))
}

const image = () => {
    return src(config.build.paths.images, { base: config.build.src, cwd: config.build.src })
        .pipe(plugins.imagemin())
        .pipe(dest(config.build.dist))
}
const font = () => {
    return src(config.build.paths.fonts, { base: config.build.src, cwd: config.build.src })
        .pipe(plugins.imagemin())
        .pipe(dest(config.build.dist))
}
const extra = () => {
    return src('**', { base: config.build.public, cwd: config.build.src })
        .pipe(dest(config.build.dist))
}

const lint = () => {
    return src(config.build.paths.scripts, {base: config.build.src, cwd: config.build.src})
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
    .pipe(plugins.eslint.failAfterError())
}
const useref = () => {
    return src('**', { base: config.build.temp, cwd: config.build.temp})
        .pipe(plugins.useref({ searchPath: [config.build.temp, '.'] }))
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true })))
        .pipe(dest(config.build.dist))
}
const serve = () => {
    watch(config.build.paths.styles, { cwd: config.build.src }, style)
    watch(config.build.paths.scripts, { cwd: config.build.src }, script)
    watch(config.build.paths.pages, { cwd: config.build.src }, page)
    watch([
        config.build.paths.images,
        config.build.paths.fonts,
    ], { cwd: config.build.src }, bs.reload)
    watch('**', { cwd: config.build.public }, bs.reload)
    bs.init({
        notify: false,
        port: 3000,
        open: true,
        files: config.build.dist,
        server: {
            baseDir: [config.build.temp, config.build.src, config.build.public],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    })
}

const compile = parallel(page, style, script)
const build = series(
    clean,
    parallel(
        series(compile, useref),
        image,
        extra,
        font
    )
)
const start = series(compile, serve)
module.exports = {
    clean, //清除文件
    build, //编译及压缩处理
    serve, // 热加载
    start, //编辑及热加载
    lint   //eslint语法检测
}