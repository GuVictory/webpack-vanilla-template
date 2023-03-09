/* eslint-disable unicorn/prefer-module */
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');

const compiler = webpack(config);

const PORT = process.env.PORT || 3000;

app.use(
	webpackDevMiddleware(compiler, {
		publicPath: config.output.publicPath
	})
);

app.listen(PORT, function () {
	console.log(`Webpack app listening on port ${PORT}!\n`);
});
