const path = require('path')
const config = require('../config/index')
module.exports = {
    // 处理文件路径
    pathResolve: (file) => {
        return path.join(__dirname, '..', file)
    },
    env: process.env.NODE_ENV,
    createNotifierCallback () {
        const notifier = require('node-notifier')
        return (severity, errors) => {
            if (severity !== 'error') {
                return
            }
            const error = errors[0]
            notifier.notify({
                title: 'Webpack error',
                message: severity + ': ' + error.name,
                subtitle: error.file || '',
                icon: path.join(__dirname, 'icon.png')
            })
        }
    },
    assetsPath (_path) {
        const assetsSubDirectory = process.env.NODE_ENV === 'development'
            ?   config.dev.assetsSubDirectory
            :   config.prod.assetsSubDirectory
        return path.posix.join(assetsSubDirectory, _path)
    }
}