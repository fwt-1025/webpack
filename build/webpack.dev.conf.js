const webpack = require('webpack')
const merge = require('webpack-merge')
const WebpackCommonPlugin = require('./webpack.common.conf.js')
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成html模板
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// const AddAssetsHtmlPlugin = require('add-asset-html-webpack-plugin')
const path = require('path')
const portfinder = require('portfinder');
const entriesArray = require('./entries');
const util = require('./util');
const config = require('../config/index');
const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);

const webpackhtmlplugin = () => {
    return entriesArray.map(item => new HtmlWebpackPlugin({
        filename: `${item.name}.html`,
        favicon: '',
        title: item.title,
        template: util.pathResolve('index.html'),
        inject: true,
        chunks: [item.name]
    }))
}
const webpackDevConfig = merge(WebpackCommonPlugin, {
    mode: 'development',
    devServer: {
        compress: true,
        port: HOST || config.dev.port,
        host: PORT || config.dev.host,
        open: false,
        historyApiFallback: true,
        contentBase: false,
        hot: true,
        // hotOnly: true,
        clientLogLevel: 'warning',
        quiet: true,
        overlay: {
            errors: true
        },
        watchOptions: {
            poll: false
        },
        proxy: {
            "/api": {
                target: 'http://localhost:3002/',
                changeOrigin: true
            }
        },
        publicPath: config.dev.assetsPublicPath
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev')
        }),
        ...webpackhtmlplugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin({})
    ]
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err);
        } else {
            process.env.PORT = port;
            webpackDevConfig.devServer.port = port;
            webpackDevConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`caroflingpao website is listening at http://${webpackDevConfig.devServer.host}:${port}`]
                },
                onErrors: config.dev.notifyOnErrors
                    ? util.createNotifierCallback()
                    : undefined
            }));
            resolve(webpackDevConfig);
        }
    });
});