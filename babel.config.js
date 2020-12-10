module.exports = api => {
	const babelEnv = api.env();
	let x = babelEnv !== 'development';
	console.log("y "  + x + " babelEnv " + babelEnv);
	const plugins = [];
	//change to 'production' to check if this is working in 'development' mode
	//if (babelEnv !== 'development') {
//	  plugins.push(['transform-remove-console', {exclude: ['error', 'warn']}]);
	//}
	return {
	  presets: ['module:metro-react-native-babel-preset'],
	  plugins,
	};
  };