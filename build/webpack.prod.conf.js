// const ora = require('ora');
// const rm = require('rm');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成html模板
// const TerserPlugin = require('terser-webpack-plugin')
const entriesArray = require('./entries');
const path = require('path');
const webpack = require('webpack');
const util = require('./util');
const webpackCommonConfig = require('./webpack.common.conf.js')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AddAssetsHtmlPlugin = require('add-asset-html-webpack-plugin')
const config = require('../config')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
console.log('env======>', util.env)
const env = util.env == 'development' ? require('../config/dev') : util.env == 'test' ? require('../config/test') : util.env == 'production' ? require('../config/prod') : require('../config/local')

const dllPlugin = () => {
    const { dll } = config
    return Object.keys(dll).map(item => new webpack.DllReferencePlugin({
        manifest: require(path.join(config.prod.assetsRoot, config.prod.assetsMainfestPath, item + '_manifest.json'))
    }))
}
const webpackhtmlplugin = () => {
    return entriesArray.map(item => new HtmlWebpackPlugin({
        filename: config.prod.assetsViewPath + '/' + `${item.root}.html`,
        favicon: '',
        title: item.title,
        template: util.pathResolve('index.html'),
        hash: true, // 给html 中引入的js加一段hash值
        // chunks: ['vendors', item.name]
        chunks: ['manifest', 'vendor', item.name],
        inject: true // js文件放在最下面
    }))
}
const webpackProdConfig = merge(webpackCommonConfig, {
    devtool: "#source-map",
    output: {
        path: config.prod.assetsRoot,
        filename: util.assetsPath('js/[name][contenthash:7].js'),
        chunkFilename: util.assetsPath('js/[name][contenthash:7].js'),
        publicPath: config.prod.assetsPublicPath
    },
    performance: {
        hints: "warning",
        maxEntrypointSize: 50000000, 
        maxAssetSize: 50000000,
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    },
    optimization: {
        noEmitOnErrors: true,
        // minimize: true, // 启用terserPlugin压缩
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            name: true,
            cacheGroups: {
                vendor: {
                    chunks: "all",
                    name: 'vendor',
                    minChunks: 2,
                    minSize: 0,
                    test: /[\\/]node_modules[\\/]/,
                    priority: 96
                }
            }
        },
        minimizer: [
            new OptimizeCssAssetsPlugin({})
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        ...webpackhtmlplugin(),
        new AddAssetsHtmlPlugin({
            publicPath: `${config.prod.assetsPublicPath}${config.prod.assetsDllPath}`,
            outputPath: '/static/dll',
            filepath: path.join(config.prod.assetsRoot, '/static/dll/*.dll.js')
        }),
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        }),
        ...dllPlugin(),
        // new BundleAnalyzerPlugin()
    ]
})

module.exports = webpackProdConfig
