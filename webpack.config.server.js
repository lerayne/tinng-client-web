/**
 * Created by lerayne on 26.03.17.
 */

const webpack = require('webpack')
const path = require('path')
const getExternals = require('webpack-node-externals')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function (env) {

    // environment definitions (prod/dev)
    console.log('BUILD MODE:', env)

    if (!env.mode) {
        env.mode = 'production'
    }

    const DEV = env.mode === 'development'
    const PROD = env.mode === 'production'
    const ECO = !!env.eco

    // babel options
    const babelOptions = {
        babelrc: false,
        presets: [
            ["env", {
                targets: {node: DEV ? "current" : 6}
            }],
            "react",
            "stage-0",
            "flow"
        ]
    }

    // webpack plugins
    const plugins = [

        // global variables export
        new webpack.DefinePlugin({
            'process.env.BROWSER': JSON.stringify(false),
            'process.env.NODE_ENV': JSON.stringify(env.mode),
            'process.env.ECO': JSON.stringify(ECO)
        }),

        // prod: minimize for babel & possible other loaders
        // dev: run loader in debug mode
        new webpack.LoaderOptionsPlugin({
            debug: DEV,
            minimize: PROD
        })
    ]

    // prod options
    if (PROD) {

        // uglify code
        plugins.push(new UglifyJsPlugin({
            mangle: true,
            comments: false
        }))
    }

    return {
        target: 'node',

        node: {
            __dirname: false,
            __filename: false,
        },

        entry: path.join(__dirname, 'src', 'server.js'),

        output: {
            path: path.join(__dirname),
            filename: 'tinng-client-web.js'
        },

        resolve: {
            extensions: ['.js', '.jsx']
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: babelOptions
                    }
                }, {
                    test: /\.css$/i,
                    use: {
                        loader: 'css-loader/locals',
                        options: {
                            localIdentName: '[name]-[local]--[hash:base64:5]'
                        }
                    }
                }
            ]
        },

        /**
         * Server should not embed external dependencies, it should require them as regular
         * ES6/CommonJS so we list every dependency as an webpack "external"
         */
        externals: [
            {
                // require 'config' as separate file
                'config': 'require("./config.js")'
            },
            getExternals({
                whitelist: [
                    /\.css$/i //CSS files whitelisted so we can explicitly omit them by loader
                ]
            })
        ],

        plugins,

        devtool: DEV ? 'inline-source-map' : false
    }
}
