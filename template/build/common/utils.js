/* 公共方法 */
var origin_config = require("../config")
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')


/* 端口 */
var port = origin_config.dev.port;


// 为sever 添加入口 (多)
exports.addServerEntry = function (entrys) {
    var entryArr = Object.keys(entrys)

    entryArr.map(function (e) {
        entrys[e].unshift("webpack-dev-server/client?http://localhost:" + port + "/", "webpack/hot/dev-server")
    })
}


var otherChuks = function (key, obj) { /* 剔除其他入口 避免冗余 */
    var arr = []
    for (var i in obj) {
        if (i != key) arr.push(i)
    }
    return arr;
}

// 配置HtmlWebpackPlugin (多)
exports.HtmlWPMaker = function (config) {
    var arr = []

    for (var i in config.htmlOption) {
        var temp = Object.assign({}, {
            title: 'Spotlight template', // 默认标题
            template: 'index.html', // 源模板文件
            filename: 'index.html', // 输出文件
            inject: true
        }, config.htmlOption[i])

        if (config.env == '"development"') {
            temp.chunks = [i];
        } else { /* production */
            temp = Object.assign(temp, {
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'dependency',
                excludeChunks: otherChuks(i, config.htmlOption) //屏蔽其它入口
            })
        }
        arr.push(new HtmlWebpackPlugin(temp))
    }
    return arr;
}

/* webpack styles loader maker */
var cssLoaders = function (options) {
    options = options || {}

    var cssLoader = {
            loader: 'css-loader',
            options: {
                minimize: process.env.NODE_ENV === 'production',
                sourceMap: options.sourceMap
            }
        },
        generateLoaders = function (loader, loaderOptions) {
            var loaders = [cssLoader]
            if (loader) {
                loaders.push({
                    loader: loader + '-loader',
                    options: Object.assign({}, loaderOptions, {
                        sourceMap: options.sourceMap
                    })
                })
            }

            if (options.extract) {
                return ExtractTextPlugin.extract({
                    use: loaders,
                    publicPath: '../../', // 解决二级目录问题
                    fallback: 'style-loader'
                })
            } else {
                return ['style-loader'].concat(loaders)
            }

        }

    return {
        css: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', {
            indentedSyntax: true
        }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}


// less sass css ...  loders
exports.styleLoaders = function (options) {
    var output = [],
        loaders = cssLoaders(options)
    for (var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}