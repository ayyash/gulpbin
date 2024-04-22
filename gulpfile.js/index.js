
// run gulp with config
const ng = require('./angular/ng');
const extract = require('./angular/extract');
const locales = require('./angular/locales');


const assets = require('./shut/assets');
const icons = require('./shut/icons');

const defaultConfig = require('./config.json');

module.exports = {
	 ng, defaultConfig, extract, locales, icons, assets
};
//extract, locales,  assets, icons,