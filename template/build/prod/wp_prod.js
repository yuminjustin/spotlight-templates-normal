/* prod webpack 配置 */
var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin');
var WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;
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
            chunkFilename: path.posix.join(_dir, 'js/[id].[chunkhash].js'),
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
            new WebpackDeepScopeAnalysisPlugin(),
            new OptimizeCSSPlugin({}),
            new CopyWebpackPlugin([{
                from: _build.static,
                to: _build.newStatic,
                ignore: ['.*']
            }])
        ]),
        optimization: {
            splitChunks: {
                chunks: "async",
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                name: true,
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    }
                }
            }
        }
    }


// webpack 打包报告 
if (_build.bundleAnalyzerReport) {
    var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}


module.exports = merge(webpackBase, webpackConfig)