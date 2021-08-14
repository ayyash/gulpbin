
// run gulp with config
const defaultConfig = require('./config.json');


module.exports = function(config) {
	
	// Merge configs
	const gulpConfig = config ? {...defaultConfig, ...config} : defaultConfig;
	
	const assets = require('./shut/assets')(gulpConfig);
	const icons = require('./shut/icons')(gulpConfig);

	const ng = require('./angular/ng');
	const postbuild = require('./angular/postbuild');
	const translate = require('./angular/translate');

	return {shut: {...assets, ...icons}, ng: {...ng, ...postbuild, ...translate}};
  };

