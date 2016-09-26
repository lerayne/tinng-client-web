/**
 * Created by lerayne on 03.02.16.
 */

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var cmdArgs = require('minimist')(process.argv.slice(2));
var path = require('path');

var NODE_ENV = process.env.NODE_ENV || cmdArgs.NODE_ENV || 'production';
var DEV = NODE_ENV == 'development';
var PROD = NODE_ENV == 'production';

module.exports = {

    entry: {
        js: path.join(__dirname, "src", "main.jsx"),
        vendor:[
            "react",
            "react-dom",
            "redux",
            "react-redux",
            "react-router",
            "react-router-redux",
            "redux-thunk",
            "babel-polyfill",
            "isomorphic-fetch"
        ]
    },

    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },

    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.min.js', '.jsx']
    },

    plugins: [

        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: Infinity,
            filename: '[name].bundle.js'
        }),

        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),

        new HTMLWebpackPlugin({
            template: './src/index.html',
            inject: false
        }),

        new webpack.optimize.UglifyJsPlugin({
            mangle: PROD,
            compress: {
                warnings: false
            },
            output:{
                comments:DEV
            },
            sourceMap: true
        }),

        new webpack.LoaderOptionsPlugin({
            minimize: PROD
        })
    ],

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader:"babel?cacheDirectory",
                exclude:/node_modules/
            }, {
                test: /\.(png|jpg|jpeg)$/i,
                loader: "url",
                query: {
                    limit: (5 * 1024),
                    name: "[name]-[hash:base64:5].[ext]"
                }
            }, {
                test: /.css$/,
                loaders: [
                    "style",
                    {
                        loader: "css",
                        query: { localIdentName: "[name]-[local]-[hash:base64:5]" }
                    }
                ]
            }
        ]
    },

    devtool:'source-map'
};
