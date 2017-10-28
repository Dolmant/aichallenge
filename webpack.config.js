const path = require('path');

module.exports = {
    entry: './src/main.js',
    target: 'node',
    output: {
        filename: 'main.js',
        libraryTarget: "commonjs2",
        library: "loop",
        path: path.resolve(__dirname, 'synced')
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: "babel-loader" }
        ],
    }
};