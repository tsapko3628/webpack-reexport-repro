const { resolve, relative } = require('path');
const glob = require('glob');

const srcPath = resolve(__dirname, 'src');
const inputFiles = glob.sync(`${srcPath}/**/*.ts`);

const entries = inputFiles.reduce((result, next) => {
	const outputFileName = relative(srcPath, next).replace('ts', 'js');
	result[outputFileName.replace('js', '')] = {
		filename: outputFileName,
		import: next,
		chunkLoading: 'import',
	};

	return result;
}, {});

module.exports = {
	mode: 'production',
	devtool: false,
	entry: entries,
	target: [
		'node',
		'es2022',
	],
	output: {
		path: resolve(__dirname, 'dist'),
		module: true,
		clean: true,
		chunkFormat: 'module',
		library: { type: 'module' },
	},
	externalsPresets: { node: true },
	externals: (data, callback) => {
		const request = data.request;
		const context = data.context;

		if (context === __dirname) {
			callback();
		} else {
			callback(null, request);
		}
	},
	module: {
		rules: [
			{
				loader: 'ts-loader',
				test: /\.ts/u,
				exclude: /node_modules/u,
				options: { configFile: resolve(__dirname, 'tsconfig.json') },
			},
		],
	},
	resolve: {
		extensions: ['.json', '.ts', '.js'],
	},
	experiments: {
		topLevelAwait: true,
		outputModule: true,
	},
	optimization: {
		concatenateModules: false,
		minimize: false,
		sideEffects: false,
	},
	node: false,
};
