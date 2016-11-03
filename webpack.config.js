/**
 * Created by lerayne on 03.02.16.
 */

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');
var cmdArgs = require('minimist')(process.argv.slice(2));
var path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var NODE_ENV = process.env.NODE_ENV || cmdArgs.NODE_ENV || 'production';
var DEV = NODE_ENV == 'development';
var PROD = NODE_ENV == 'production';

console.log('MODE:', NODE_ENV);

var plugins = [
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
    plugins.push(new webpack.optimize.DedupePlugin())

    plugins.push(new webpack.LoaderOptionsPlugin({minimize: true}))

    plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'report.html',
        openAnalyzer: true,
    }))
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

    plugins: plugins,

    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader:"babel?cacheDirectory",
                exclude:/node_modules/
            },{
                test: /\.js$/,
                loader:"file?name=[name].[ext]",
                exclude:/node_modules/
            },{
                test: /\.json$/,
                loader:"file?name=[name].[ext]",
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
    
    externals:{
        "global-config":"globalConfig"
    },

    devtool: DEV ? 'cheap-inline-source-map' : 'source-map'
};
