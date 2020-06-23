const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const merge = require('webpack-merge')
const commonModule = require('./webpack.common')
const webpack = require('webpack')
const buildModule = {
    mode: 'production',
    devtool: 'none',
    module: {
        rules: [
            {
                test: /\.css/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader, //link的方式注入
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ]
            },
            {
                test: /\.less/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader, //link的方式注入
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2
                        }
                    },
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: {
                    loader: 'eslint-loader'
                },
                enforce: 'pre'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public', to: 'public' }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-[hash:8].css'
        }),
        new webpack.DefinePlugin({
            'BASE_URL': JSON.stringify('./public/')
        })
    ],
    optimization: {
        usedExports: true, //不会导出未引用的代码
        minimize: true,//开启压缩，去除冗余代码
        concatenateModules: true, //分析出模块之间的依赖关系,合并模块，减少体积
        sideEffects: true,//标记副作用
        splitChunks: {
            chunks: 'all'// 公共模块提取 代码分割
        },
        minimizer: [
            new TerserWebpackPlugin(),//压缩js
            new OptimizeCssAssetsWebpackPlugin() //压缩css
        ]
    },
}
module.exports = merge(commonModule, buildModule)