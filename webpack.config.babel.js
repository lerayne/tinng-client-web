/**
 * Created by lerayne on 03.02.16.
 */

import webpack from 'webpack'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'

export default env => {

    // environment definitions (prod/dev)
    console.log('env', env)

    if (!env.mode) {
        env.mode = 'production'
    }

    const PROD = env.mode == 'production'
    const DEV = env.mode == 'development'

    // webpack plugins
    const plugins = [

        // global variables export
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify(env.mode)
            }
        }),

        // html template
        new HTMLWebpackPlugin({
            template: './src/index.html',
            inject: false
        })
    ]

    // babel options
    const babelOptions = {
        babelrc: false,
        presets: [
            ["env", {
                modules: false
            }],
            "react",
            "stage-0",
            "flow"
        ]
    }

    // dev babel options (build for chrome to reduce script size and execution time)
    if (DEV) {
        babelOptions.presets[0][1].targets = {
            chrome: 57
        }
    }

    if (PROD) {
        // prod: uglify code
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            comments: false
        }))

        // prod: minimize for babel & possible other loaders
        plugins.push(new webpack.LoaderOptionsPlugin({minimize: true}))

        // prod: analyze bundle
        plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'webpack-analyzer-report.html',
            openAnalyzer: true
        }))

        // prod: optimize react code
        babelOptions.presets.push('react-optimize')
    }

    return {
        entry: path.join(__dirname, "src", "main.jsx"),

        output: {
            path: path.join(__dirname, "dist"),
            filename: "bundle.js"
        },

        resolve: {
            extensions: ['.webpack.js', '.web.js', '.js', '.min.js', '.jsx']
        },

        plugins,

        module: {
            rules: [
                {
                    test: /\.jsx$/i,
                    exclude: /node_modules/,
                    use: [{
                        loader: "babel-loader",
                        options: babelOptions
                    }]
                }, {
                    test: /\.(js|json)$/i,
                    exclude: /node_modules/,
                    use: [{
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]"
                        }
                    }]
                }, {
                    test: /\.(png|jpg|jpeg)$/i,
                    use: [{
                        loader: "url-loader",
                        options: {
                            limit: (5 * 1024),
                            name: "[name]-[hash:base64:5].[ext]"
                        }
                    }]
                }, {
                    test: /.css$/i,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                localIdentName: "[name]-[local]-[hash:base64:5]"
                            }
                        }
                    ]
                }
            ]
        },

        externals: {
            "global-config": "globalConfig"
        },

        devtool: DEV ? 'inline-source-map' : false
    }
}