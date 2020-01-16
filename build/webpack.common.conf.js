const HappyPack = require('happypack');
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path')
const utils = require('./util')
const config = require('../config/index')
const entriesArray = require('./entries')
const devMode = process.env.NODE_ENV == 'production' ? false : true
// const VConsole = require('vconsole-webpack-plugin')
// const argv = require('yargs')
//     .describe('debug', 'debug 环境')
//     .argv;
const isDev = utils.env === 'development' || !utils.env ? true : false
const createEntry = () => {
    let entries = {}
    entriesArray.map((item => {
        const {name, path} = item
        entries[name] = utils.pathResolve(path)
    }))
    return entries
}

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    enforce: 'pre',
    include: utils.pathResolve('src'),
    loader: 'eslint-loader',
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: !config.dev.showEslintErrorsInOverlay
    }
})
const webpackCommonConfig = {
    mode: isDev ? 'development' : 'production',
    devtool: devMode ? config.dev.devtool : config.prod.devtool,
    entry: createEntry(),
    output: {
        path: isDev ? config.dev.assetsRoot : config.prod.assetsRoot,
        filename: '[name].js',
        publicPath: isDev ? config.dev.assetsPublicPath : config.prod.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.json', '.vue'],
        alias: {
            '@': utils.pathResolve('src'),
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=js',
                include: path.resolve(__dirname, '../src'),
                exclude: /node_modules/
            },
            {
                test: /.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: utils.assetsPath('images/[name].[hash:7].[ext]'),
                        limit: 10000
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(eot|ttf|woff|woff2|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                    }
                }
            }
        ]
    },
    optimization: {
        usedExports: true // 启动treeshaking，但是会对所有的文件进行treeshaking，如果想排除一些文件，可以在package.json中设置
    },
    plugins: [
        new HappyPack({
            id: 'js',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader?cacheDirectory=true',
            }],
            //共享进程池
            threadPool: happyThreadPool
        }),
        new VueLoaderPlugin(),
        // new VConsole({
        //     enable: !!argv.debug
        // }),
        new webpack.ProvidePlugin({
            '$moment': 'moment'
        }),
        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/,
            contextRegExp: /moment$/
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new MiniCssExtractPlugin({
            filename: utils.assetsPath('css/[name].[hash:7].css'),
            chunkFilename: utils.assetsPath('css/[name].chunk.[hash:7].css')
        })
    ]
}

module.exports = webpackCommonConfig