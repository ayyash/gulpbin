
// run gulp with config
const defaultConfig = require('./config.json');


module.exports = function(config) {
	
	// Merge configs
	const gulpConfig = config ? {...defaultConfig, ...config} : defaultConfig;
	
	const assets = require('./assets')(gulpConfig);
	const icons = require('./icons')(gulpConfig);

	return {...assets, ...icons};
  };

