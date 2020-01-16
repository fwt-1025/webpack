const webpack = require('webpack');
const ora = require('ora');
const spinner = require('chalk');
const rm = require('rimraf');
const path = require('path');
const util = require('./util');
const config = require('../config/index');
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: config.dll,
    output: {
        path: path.resolve(config.prod.assetsRoot, config.prod.assetsDllPath),
        filename: '[name]_[hash].dll.js',
        library: '[name]_[hash]_dll'
    },
    performance: {
        hints: "warning",
        maxEntrypointSize: 50000000, 
        maxAssetSize: 50000000,
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.js');
        }
    },
    plugins: [
        new webpack.DllPlugin({ // name === ouput.library
            name: '[name]_[hash]_dll',
            path: path.join(config.prod.assetsRoot, config.prod.assetsMainfestPath, '[name]_manifest.json')
        }),
        new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
    ]
}