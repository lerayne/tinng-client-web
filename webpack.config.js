/**
 * Created by lerayne on 03.02.16.
 */

var webpack = require('webpack');

var NODE_ENV = process.env.NODE_ENV || 'production';
var DEV = NODE_ENV == 'development';
var PROD = NODE_ENV == 'production';

module.exports = {

    entry: "./src/main.js",

    output: {
        path: "./dist",
        filename: "bundle.js"
    },

    plugins: [

        new webpack.DefinePlugin({
            "process.env":{
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
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
                test: /\.js?$/,
                exclude: /node_modules/,
                loaders: DEV ? ['react-hot', 'babel'] : ['babel']
            }, {
                test: /\.(png|jpg|jpeg)$/i,
                loader: "url?limit=1000&name=[path][name]-[hash:base64:5].[ext]"
            }, {
                test: /.css$/,
                loader:'style!css?localIdentName=[path]-[local]-[hash:base64:5]'
            }
        ]
    }
};

if (DEV) {
    module.exports.devtool = 'eval-source-map'
}
