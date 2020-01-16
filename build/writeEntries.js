const fs = require('fs');
// const join = require('path').join;
const path = require('path')
const ora = require('ora')
const spinner = ora('正在编写入口文件\n')
spinner.start()
function findsync (startPath) {
    let result = []
    function finder (fpath) {
        let files = fs.readdirSync(fpath);
        files.forEach((val) => {
            let p = path.join(fpath, val)
            if (path.extname(p) == '.js') {
                let obj = {}
                obj.name = val.substring(0, val.indexOf('.js'))
                obj.root = p.substring(10, p.indexOf('.js'))
                obj.title = '零跑'
                obj.path = p
                let res = {
                    name: val.substring(0, val.indexOf('.js')),
                    root: p.substring(10, p.indexOf('.js')),
                    title: '零跑',
                    path: p
                }
                result.push(res)
            }
            let stats = fs.statSync(p)
            if(stats.isDirectory()) finder(p)
        })
    }
    finder(startPath)
    return result
}
const re = findsync('./src/pages')
// console.log(re)
const fileContent = 'const entries = ' + JSON.stringify(re) + '\n' + 'module.exports = entries'
fs.writeFile(path.join(__dirname, 'entries.js'), fileContent , (err) => {
    spinner.stop()
    if (err) throw err
    console.log('写入成功')
})