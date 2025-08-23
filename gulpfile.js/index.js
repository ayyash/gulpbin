
// run gulp with config
const ng = require('./angular/ng');
const extract = require('./angular/extract');
const locales = require('./angular/locales');

const svelteExtract = require('./svelte/extract');

const assets = require('./shut/assets');
const icons = require('./shut/icons');

const defaultConfig = require('./config.json');

module.exports = {
	 ng, defaultConfig, extract, locales, icons, assets, svelteExtract
};
//extract, locales,  assets, icons,