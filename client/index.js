/****
 * This is an example folder to be used in client that uses the gulpBin commands.
 ***/
 const config = require('./config.json');
 const gulpBin = require('sekrab-gulpbin');
 
 const localConfig = { ...gulpBin.defaultConfig, ...config };
 
 // assets, css and mirroring
 const allAssets = gulpBin.assets(localConfig);
 // generate css from less
 exports.rawless = allAssets.rawless;
 // also clean, and minify into public (no critical)
 exports.buildcss = allAssets.buildcss;
 // generate critical seperated css files
 exports.critical = allAssets.critical;
 // watch and rawless
 exports.watch = allAssets.watch;
 
 // gererate icons from ico-moon generated files and less
 exports.icons = gulpBin.icons(localConfig);
 
 // extract translation terms into src/locale/prefix-lang.js files
 exports.extract = gulpBin.extract(localConfig);
 
 // genreate index.lang.html into host client, from placeholder
 exports.locales = gulpBin.locales(localConfig);
 
 // example CUSTOM task
//  exports.writesurge = gulpBin.locales({
// 	 ...localConfig,
// 	 locales: {
// 		 source: '../surge/client/placeholder.html',
// 		 destination: '../surge/client/',
// 		 fileName: '200.html',
// 		 withFolders: true,
// 		 isUrlBased: false
// 	 }
//  });
 
 // ng generators
 const ng = gulpBin.ng(localConfig);

 // no longer needed
//  exports.injectServices = ng.injectServices;
//  exports.injectLib = ng.injectLibModule;
//  exports.injectModels = ng.injectModels;
//  exports.inject = ng.injectAll;

 exports.routemodule = ng.createRouteModule;
 exports.component = ng.createComponent;
 exports.pipe = ng.createPipe;
 exports.directive = ng.createDirective;
 exports.model = ng.createModel;
 exports.service = ng.createService;
 exports.fullService = ng.createFullService;
 
