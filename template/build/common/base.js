/* webpack基础配置 */
let path = require('path')
let config = require("../config")

let codeBase = path.join(__dirname,  '../../src'),
    _dir = process.env.NODE_ENV === 'production' ? './static' : 'static'


module.exports = {
    entry: config.entry,
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': codeBase
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader',
                include: [codeBase]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(_dir, 'image/[name].[hash:5].[ext]') //image 文件夹
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(_dir, 'media/[name].[hash:5].[ext]') //media 文件夹
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: path.posix.join(_dir, 'fonts/[name].[hash:5].[ext]') //fonts 文件夹
                }
            }
        ]
    }
}
