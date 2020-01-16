module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "commonjs": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "$moment": true
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "parser": "babel-eslint",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
      "indent": ["error", 4],
      "no-var": 2, // 不允许使用var 变量
      "semi": ["error", "always"], // 结尾必须使用分号
      "no-else-return": ["error", { "allowElseIf": true }] // 禁止if语句中有return，后面还有else语句的操作，allowElseIf:true => 可以有else if
    }
};