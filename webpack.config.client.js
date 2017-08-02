/**
 * Created by lerayne on 03.02.16.
 */

const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = function (env) {

    // environment definitions (prod/dev)
    console.log('BUILD MODE:', env)

    if (!env.mode) {
        env.mode = 'production'
    }

    const PROD = env.mode === 'production'
    const DEV = env.mode === 'development'
    const ECO = !!env.eco

    // babel options
    const babelOptions = {
        babelrc: false,
        presets: [
            ["env", {modules: false}],
            "react",
            "stage-0",
            "flow"
        ],
        plugins: []
    }

    // webpack plugins
    const plugins = [

        // global variables export
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify(env.mode),
                ECO: JSON.stringify(ECO)
            }
        }),

        // initialize extract-text plugin
        new ExtractTextPlugin('styles.css'),

        // prod: minimize for babel & possible other loaders
        // dev: run loader in debug mode
        new webpack.LoaderOptionsPlugin({
            debug: DEV,
            minimize: PROD
        }),

        // include only US and russian language packs in moment
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-us|ru/)
    ]

    // dev options:
    if (DEV) {
        // build for chrome to reduce script size and execution time, and ease of debugging
        babelOptions.presets[0][1].targets = {
            chrome: 57
        }
        // run in hot loader mode
        babelOptions.plugins.push('react-hot-loader/babel')
    }

    // prod options
    if (PROD) {
        // uglify code
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            comments: false
        }))

        // analyze bundle
        plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'webpack-analyzer-report.html',
            openAnalyzer: false
        }))

        // optimize react code
        babelOptions.presets.push('react-optimize')
    }

    const publicPath = (DEV && !ECO) ? '//localhost:8050/public/' : '/public/'

    return {
        entry: {
            client: path.join(__dirname, "src", "client.jsx")
        },

        output: {
            path: path.join(__dirname, "public"),
            filename: "[name].js",
            publicPath
        },

        resolve: {
            extensions: ['.webpack.js', '.web.js', '.js', '.min.js', '.jsx']
        },

        plugins,

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/i,
                    exclude: [/node_modules/, /public/],
                    use: {loader: "babel-loader", options: babelOptions}
                }, {
                    test: /\.json$/i,
                    exclude: /node_modules/,
                    use: {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]"
                        }
                    }
                }, {
                    test: /\.(png|jpg|jpeg|svg)$/i,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: (5 * 1024),
                            name: "[name]-[hash:base64:5].[ext]",
                            mimetype: "image/[ext]" // check importance
                        }
                    }
                }, {
                    test: /.css$/i,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: {
                            loader: 'css-loader',
                            options: {
                                localIdentName: '[name]-[local]--[hash:base64:5]'
                            }
                        }
                    })
                }
            ]
        },

        externals: {
            "global-config": "globalConfig"
        },

        devtool: DEV ? 'inline-source-map' : false,

        devServer: {
            headers: {'Access-Control-Allow-Origin': '*'}
        }
    }
}