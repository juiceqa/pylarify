const path = require('path');

module.exports = {
    entry: {
        main: './src/main.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
};