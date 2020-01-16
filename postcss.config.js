module.exports = {
    ident: 'postcss',
    plugins: {
        'autoprefixer': {
            "overrideBrowserslist": [
                "defaults",
                "not ie < 11",
                "last 2 versions",
                "> 1%",
                "iOS 7",
                "last 3 iOS versions"
            ]
        },
        // "postcss-pxtorem": {
        //     rootValue: 750,
        //     unitPrecision: 5,
        //     propList: ['*'],
        //     selectorBlackList: [],
        //     replace: true,
        //     mediaQuery: false,
        //     minPixelValue: 0
        // }
    }
}