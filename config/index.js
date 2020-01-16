const path = require('path')

module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        host: '0.0.0.0',
        port: 8080,
        notifyOnErrors: true,
        devtool: 'cheap-module-eval-source-map',
        useEslint: true,
        showEslintErrorsInOverlay: false
    },
    prod: {
        assetsPublicPath: '/public/',
        assetsRoot: path.resolve('../leap-community-server/project/public/'),
        assetsSubDirectory: 'static/webpack',
        assetsDllPath: 'static/dll',
        assetsMainfestPath: 'static/mainfest',
        assetsViewPath: path.resolve('../leap-community-server/project/page/'),
        devtool: '#source-map'
    },
    dll: {
        vue: ['vue'],
        axios: ['axios'],
        qs: ['qs'],
        moment: ['moment'],
        // echarts: ['echarts']
    }
}