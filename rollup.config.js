export default [
	{
		input: 'src/_js/mrbmc.js',
		output: {
			file: 'www/js/mrbmc.js',
			format: 'es',
			sourcemap: true,
			compact: true,
		}
	},
	{
		input: 'src/_js/portfolio.js',
		output: {
			file: 'www/js/portfolio.js',
			format: 'es'
		}
	},
	{
		input: 'src/_js/blogpost.js',
		output: {
			file: 'www/js/blogpost.js',
			format: 'es'
		}
	}
];