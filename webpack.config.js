const path = require('node:path');

const html = require('html-webpack-plugin');
const css = require('mini-css-extract-plugin');
const fileManager = require('filemanager-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const meta = require('./_config');

module.exports = {
	mode: 'none',
	entry: {
		index: path.resolve(__dirname, 'src/index.js')
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: isProduction ? '[name].[fullhash].js' : '[name].js',
		clean: true,
		publicPath: '/'
	},
	optimization: {
		minimize: isProduction
	},
	devServer: {
		static: {
			directory: isProduction ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'src')
		},
		hot: true,
		server: 'http',
		historyApiFallback: true
	},
	devtool: isProduction ? false : 'source-map',

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: '/node_modules/',
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true
					}
				}
			},
			{
				test: /\.(sass|scss|css)$/i,
				use: [
					{
						loader: css.loader
					},
					'css-loader',
					'sass-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/i,
				loader: 'file-loader',
				options: {
					outputPath: 'assets'
				}
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext][query]'
				}
			}
		]
	},

	plugins: [
		new html({
			meta: {
				title: meta.title,
				'application-name': meta.title,
				description: meta.description,
				keywords: meta.keywords,
				'apple-mobile-web-app-title': meta.title
			},
			title: meta.title,
			icon192: isProduction ? '/favicon/favicon-192.png' : '/assets/favicon/favicon-192.png',
			icon512: isProduction ? '/favicon/favicon-512.png' : '/assets/favicon/favicon-512.png',
			manifest: isProduction ? '/app.webmanifest' : '/assets/app.webmanifest',
			template: path.resolve(__dirname, 'src/index.html'),
			minify: {
				collapseWhitespace: true,
				keepClosingSlash: false,
				removeComments: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				useShortDoctype: true
			}
		}),
		new css({
			filename: isProduction ? '[name].[fullhash].css' : '[name].css'
		}),
		new fileManager({
			events: {
				onEnd: [
					{
						copy: [
							{
								source: path.resolve(__dirname, 'src/assets/favicon/**'),
								destination: 'dist/favicon'
							}
						]
					},
					{
						copy: [
							{
								source: path.resolve(__dirname, 'src/assets/app.webmanifest'),
								destination: 'dist/'
							}
						]
					}
				]
			}
		})
	]
};
