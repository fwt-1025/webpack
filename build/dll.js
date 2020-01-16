const webpack = require('webpack')
const webpackDllConfig = require('./webpack.dll.conf')
const chalk = require('chalk')
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const config = require('../config/index')

const spinner = ora('dll 开始打包...\n');
spinner.start()
rm(path.join(config.prod.assetsRoot, 'static'), (err) => {
    if (err) throw err
    webpack(webpackDllConfig, (err, stats) => {
        if (err) throw err;
        // const spinner = ora('dll 开始打包...\n');
        spinner.stop();
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');
        if (stats.hasErrors()) {
            console.log(chalk.red('DLL build failed with errors.\n'));
            process.exit(1);
        }
        console.log(chalk.cyan('Dll 打包完成.\n'));
    })
})