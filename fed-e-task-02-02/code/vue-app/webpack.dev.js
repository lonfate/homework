const commonModule = require('./webpack.common')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const devModule = {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
        contentBase: [path.join(__dirname, 'public'), path.join(__dirname, 'src/assets')],
        hot: true,
        port: 3000,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.(less|css)$/,
                exclude: /node_modules/,
                use: [
                    'vue-style-loader',
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2 //对@import语法，进行less-loader和postcss-loader处理
                        }
                    },
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(js|vue)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'eslint-loader'
                },
                enforce: 'pre'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'BASE_URL': JSON.stringify('./')
        })
    ]
}
module.exports = merge(commonModule, devModule)