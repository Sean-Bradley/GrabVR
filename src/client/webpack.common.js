const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        demo1: path.resolve(__dirname, './demo1.ts'),
        demo2: path.resolve(__dirname, './demo2.ts')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        alias: {
            three: path.resolve('./node_modules/three')
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '../../dist/client'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./demo1.html"),
            filename: path.resolve(__dirname, '../../dist/client/demo1.html'),
            chunks: ['demo1']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./demo2.html"),
            filename: path.resolve(__dirname, '../../dist/client/demo2.html'),
            chunks: ['demo2']
        })
    ]
};