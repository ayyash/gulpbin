

// run gulp with config
// const defaultConfig = require('../gulpfile.js/config.json');
// const j = require('../gulpfile.js/angular/ng');

// const gulpBin = function (config) {

// 	// Merge configs
// 	const gulpConfig = config ? { ...defaultConfig, ...config } : defaultConfig;

// 	// using two ways to get tasks, TODO: choose one or the other
// 	const assets = require('../gulpfile.js/shut/assets')(gulpConfig);
// 	const icons = require('../gulpfile.js/shut/icons')(gulpConfig);

// 	// or config global then retrieve exports
// 	// this is the worse option because even though it exposes exports, it uses global var for config
// 	// wht is wrong with that? nothing, just not enough context
// 	// although this is better to break apart for client
// 	j.config(gulpConfig);
// 	const t = require('./angular/translate')(gulpConfig);
// 	const p =  require('../gulpfile.js/angular/postbuild')(gulpConfig);

// 	// mapping exports to nicer names
// 	const ng = {
// 		injectComponents: j.injectComponents,
// 		injectServices: j.injectServices,
// 		injectLib: j.injectLibModule,
// 		injectModels: j.injectModels,
// 		inject: j.injectAll,
// 		routemodule: j.createRouteModule,
// 		component: j.createComponent,
// 		pipe: j.createPipe,
// 		directive: j.createDirective,
// 		model: j.createModel,
// 		service: j.createService,
// 		fullService: j.createFullService,
// 		// extract all translation pipes in resources.ar.ts to be ready for transation
// 		// this is done once, redoing will overwrite existing translations
// 		extract: t.extract,

// 		// copy locales to server for ssr
// 		locales: p.locales,
// 		// generate index files
// 		generateIndex: p.generateIndex,

// 		// post build both:
// 		postbuild: p.postbuild

// 	};

// 	return { shut: { ...assets, ...icons }, ng };
// };



// const bins = gulpBin();

// Object.keys(bins).forEach(i => {
//     Object.keys(bins[i]).forEach( x =>  {
//         exports[x] = bins[i][x];
//     });
// });

