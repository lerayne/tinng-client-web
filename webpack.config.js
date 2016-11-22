/**
 * Created by lerayne on 03.02.16.
 */

const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const cmdArgs = require('minimist')(process.argv.slice(2));
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const NODE_ENV = process.env.NODE_ENV || cmdArgs.NODE_ENV || 'production';
const DEV = NODE_ENV === 'development';
const PROD = NODE_ENV === 'production';

console.log('MODE:', NODE_ENV);

let plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        names: ['app',],
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
    })
]

if (PROD) {

    plugins = [
        ...plugins,
        new webpack.optimize.DedupePlugin(),
        new webpack.LoaderOptionsPlugin({minimize: true}),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'report.html',
            openAnalyzer: true,
        })
    ]
}

module.exports = {

    entry: {
        app: path.join(__dirname, "src", "main.jsx"),
    },

    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },

    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.min.js', '.jsx']
    },

    plugins,

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader:"babel-loader?cacheDirectory",
                exclude:/node_modules/
            },{
                test: /\.js$/,
                loader:"file-loader?name=[name].[ext]",
                exclude:/node_modules/
            },{
                test: /\.json$/,
                loader:"file-loader?name=[name].[ext]",
                exclude:/node_modules/
            }, {
                test: /\.(png|jpg|jpeg)$/i,
                loader: "url-loader",
                query: {
                    limit: (5 * 1024),
                    name: "[name]-[hash:base64:5].[ext]"
                }
            }, {
                test: /.css$/,
                loaders: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        query: { localIdentName: "[name]-[local]-[hash:base64:5]" }
                    }
                ]
            }
        ]
    },
    
    externals:{
        "global-config":"globalConfig"
    },

    devtool: DEV ? 'inline-source-map' : 'source-map'
};
