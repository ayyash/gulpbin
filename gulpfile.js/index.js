
// run gulp with config
const defaultConfig = require('./config.json');
const ng = require('./angular/ng');


module.exports = function (config) {

	// Merge configs
	const gulpConfig = config ? { ...defaultConfig, ...config } : defaultConfig;

	const assets = require('./shut/assets')(gulpConfig);
	const icons = require('./shut/icons')(gulpConfig);

	const t = require('./angular/translate')(gulpConfig);
	const p =  require('../gulpfile.js/angular/postbuild')(gulpConfig);
	
	// TODO: i want to change that in some parallet universe
	ng.config(gulpConfig);
	// mapping exports to nicer names
	const angular = {
		injectComponents: ng.injectComponents,
		injectServices: ng.injectServices,
		injectLib: ng.injectLibModule,
		injectModels: ng.injectModels,
		inject: ng.injectAll,
		routemodule: ng.createRouteModule,
		component: ng.createComponent,
		pipe: ng.createPipe,
		directive: ng.createDirective,
		model: ng.createModel,
		service: ng.createService,
		fullService: ng.createFullService,
		// extract all translation pipes in resources.ar.ts to be ready for transation
		// this is done once, redoing will overwrite existing translations
		extract: t.extract,

		// copy locales to server for ssr
		locales: p.locales,
		// generate index files
		generateIndex: p.generateIndex,

		// post build both:
		postbuild: p.postbuild

	};

	return { shut: { ...assets, ...icons }, angular };
};

