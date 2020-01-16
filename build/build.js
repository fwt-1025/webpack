const webpack = require('webpack')
const webpackProdConfig = require('./webpack.prod.conf')
const chalk = require('chalk')
const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const config = require('../config/index')
const util = require('./util')
const spinner = ora('caroflingpao-project is building for '+ util.env + '\n');
spinner.start()
rm(path.join(config.prod.assetsRoot, config.prod.assetsSubDirectory), (err) => {
    if (err) throw err
    console.log('删除' + path.join(config.prod.assetsRoot, config.prod.assetsSubDirectory) + '文件夹下的文件')
    webpack(webpackProdConfig, (err, stats) => {
        if (err) throw err;
        spinner.stop();
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n');
        if (stats.hasErrors()) {
            console.log(chalk.red('Production build failed with errors.\n'));
            process.exit(1);
        }
        console.log(chalk.cyan('Production build complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ));
    })
})