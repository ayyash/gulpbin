
// run gulp with config
const defaultConfig = require('./config.json');

const j = require('./angular/ng');
const translate = require('./angular/translate');
const postbuild = require('./angular/postbuild');


module.exports = function (config) {

	// Merge configs
	const gulpConfig = config ? { ...defaultConfig, ...config } : defaultConfig;

	// using two ways to get tasks, TODO: choose one or the other
	const assets = require('./shut/assets')(gulpConfig);
	const icons = require('./shut/icons')(gulpConfig);

	// or config global then retrieve exports
	// this is the worse option because even though it exposes exports, it uses global var for config
	// wht is wrong with that? nothing, just not enough context
	// although this is better to break apart for client
	j.config(gulpConfig);
	translate.config(gulpConfig);
	postbuild.config(gulpConfig);

	// mapping exports to nicer names
	const ng = {
		injectComponents: j.injectComponents,
		injectServices: j.injectServices,
		injectLib: j.injectLibModule,
		injectModels: j.injectModels,
		inject: j.injectAll,
		routemodule: j.createRouteModule,
		component: j.createComponent,
		pipe: j.createPipe,
		directive: j.createDirective,
		model: j.createModel,
		service: j.createService,
		fullService: j.createFullService,
		// extract all translation pipes in resources.ar.ts to be ready for transation
		// this is done once, redoing will overwrite existing translations
		extract: translate.extract,

		// copy locales to server for ssr
		locales: postbuild.locales,
		// generate index files
		generateIndex: postbuild.generateIndex,

		// post build both:
		postbuild: postbuild.postbuild

	};

	return { shut: { ...assets, ...icons }, ng };
};

