/* prod webpack 配置 */
var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin');
var utils = require('../common/utils')
var webpackBase = require("../common/base")
var config = require('../config')

var _build = config.build,
    _dir = './static',
    HWP_arr = utils.HtmlWPMaker(_build),
    webpackConfig = {
        mode: 'production',
        module: {
            rules: utils.styleLoaders({
                sourceMap: true,
                extract: true
            })
        },
        output: {
            filename: path.posix.join(_dir, 'js/[name].[chunkhash].js'),
            chunkFilename: path.posix.join(_dir, 'js/[name].[chunkhash].js'),
            path: path.resolve(__dirname, _build.outputPath)
        },
        devtool: '#source-map',
        plugins: HWP_arr.concat([
            new webpack.DefinePlugin({
                'process.env': _build.env
            }),
            new ExtractTextPlugin({
                filename: path.posix.join(_dir, 'css/[name].[chunkhash].css')
            }),
            new CleanWebpackPlugin(_build.outputPathName, {
                root: path.resolve(__dirname, '../../')
            }),
            new OptimizeCSSPlugin({}),
            new CopyWebpackPlugin([{
                from: _build.static,
                to: _build.newStatic,
                ignore: ['.*']
            }])
        ]),
        optimization: { /* 参考 webpack 官方示例配置 特殊要求自行配置*/
            /* https://github.com/webpack/webpack/tree/master/examples */
            splitChunks: {
                cacheGroups: {
                    commons: {
                        chunks: "initial",
                        minChunks: 2,
                        maxInitialRequests: 5, 
                        minSize: 0 
                    },
                    vendor: {
                        test: /node_modules/,
                        chunks: "initial",
                        name: "vendor",
                        priority: 10,
                        enforce: true
                    }
                }
            },
            runtimeChunk: {
                name: "manifest"
            }
        }
    }


// webpack 打包报告 
if (_build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}


module.exports = merge(webpackBase, webpackConfig)
