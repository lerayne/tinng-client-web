/**
 * Created by lerayne on 03.02.16.
 */

var webpack = require('webpack');
var HTMLWebpackPlugin = require('html-webpack-plugin');

var NODE_ENV = process.env.NODE_ENV || 'production';
var DEV = NODE_ENV == 'development';
var PROD = NODE_ENV == 'production';

module.exports = {

    entry: "./src/main.jsx",

    output: {
        path: "./dist",
        filename: "bundle.js"
    },

    resolve:{
        extensions:['', '.webpack.js', '.web.js', '.ts', '.js', '.min.js', '.jsx']
    },

    plugins: [

        new webpack.DefinePlugin({
            "process.env":{
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),

        new HTMLWebpackPlugin({
            template: './src/index.html',
            inject: false
        }),

        new webpack.optimize.UglifyJsPlugin({
            compress: PROD,
            mangle: PROD,
            comments: DEV
        })
    ],

    module:{
        loaders:[
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loaders: DEV ? ['react-hot', 'babel'] : ['babel']
            }, {
                test: /\.(png|jpg|jpeg)$/i,
                loader: "url?limit="+ (32 * 12014) +"&name=[name]-[hash:base64:5].[ext]"
            }, {
                test: /.css$/,
                loader:'style!css?localIdentName=[name]-[local]-[hash:base64:5]'
            }
        ]
    },

    devtool: 'source-map'
};

if (DEV) {
    module.exports.devtool = 'source-map'
}
