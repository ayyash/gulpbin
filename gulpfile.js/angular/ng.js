// TODO: make specific for listing out of state
// TODO: crate state service

// This version: all pipes directives and partial components are standalone
// default imports: CommonModule

const params = require('minimist')(process.argv.slice(2)); // those are params passed by cmd line
const fs = require('fs');
const gulp = require('gulp');
// const inject = require('gulp-inject');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const gulpif = require('gulp-if');
const angularTemplates = '/angulartemplates/';

let options = require('../config.json');
// TODO: remove barrels, they dont make sense

let ngConfig = {};

const setConfig = (config) => {
	options = {...config};

	const appPath = options.ng.appPath;

	ngConfig = {
		Templates: {
			Components: __dirname + angularTemplates + 'component.template',
			FormComponents: __dirname + angularTemplates + 'component.form.template',
			Views: __dirname + angularTemplates + 'view.template',
			FormViews: __dirname + angularTemplates + 'view.form.template',
			Directives: __dirname + angularTemplates + 'directive.standalone.template',
			Pipes: __dirname + angularTemplates + 'pipe.standalone.template',
			Route: __dirname + angularTemplates + 'route.template',
			RouteModule: __dirname + angularTemplates + 'routeModule.template',
			RouteStandalone: __dirname + angularTemplates + 'route.standalone.template',
			Declaration: 'MajorNamePartialComponent',
			Module: __dirname + angularTemplates + 'module.template',
			Model: __dirname + angularTemplates + 'model.template',
			Service: __dirname + angularTemplates + 'service.template',
			ApiConfig: __dirname + angularTemplates + 'config.template'
		},
		Destinations: {
			Components: appPath + 'components/',
			Views: appPath + 'components/',
			Directives: appPath + 'lib/directives/',
			Pipes: appPath + 'lib/pipes/',
			Routes: appPath + 'routes/',
			Models: appPath + 'models/',
			Services: appPath + 'services/',
			ApiConfig: appPath + ''
		},
		Core: {
		
			ApiConfigFile: appPath + 'config.ts'
		}
	}


};


// FIXME: withroute means nothing now, it either is withroute, or standalone
// or both, but never neither
const _createRouteModule = function () {
	let { major, standalone } = params;
	
	if (!major) {
		return gulp.src('.');
	}
	
	const majorName = major.substring(major.lastIndexOf('/') + 1);
	// if common or layouts, do not create module
	if (majorName === 'Common' || majorName === 'Layouts') {
		return gulp.src('.');
	}
	// avoid modules, keep adding to the same routemodule
	// const src = withroute ? ngConfig.Templates.RouteModule : ngConfig.Templates.Module;	
	// problem: what kind of route should i create? if standalone create a standalone route
	// if route already exists add, but if new, choose according to first component created
	const src = standalone ? ngConfig.Templates.RouteStandalone : ngConfig.Templates.RouteModule;
	return gulp
		.src(src)
		.pipe(replace('Major', majorName))
		.pipe(
			rename({
				basename: majorName.toLowerCase(),
				// suffix: withroute ? '.route' : '.module',
				suffix: '.route',
				extname: '.ts'
			})
		)
		.pipe(gulp.dest(ngConfig.Destinations.Routes, { overwrite: false }));
};

// add component to a module or create a new one
const _addComponentToModule = function () {
	// Eylul 15, remove component barrels, now adding to module will add a normal import
	// if not standalone add to route or module:
	const { major, name, ispartial, standalone } = params;
	if (!major) {
		return gulp.src('.');
	}
	// ComponentDestination_

	const majorName = major.substring(major.lastIndexOf('/') + 1);
	// if common or layouts, do not create module
	if (majorName === 'Common' || majorName === 'Layouts') {
		return gulp.src('.');
	}
	
	// route: path and component
	const route =
		fs
			.readFileSync(ngConfig.Templates.Route, 'utf8')
			.replace('major', majorName.toLowerCase())
			.replace('name', name.toLowerCase())
			.replace('Major', majorName)
			.replace('Name', name);


	let component = ngConfig.Templates.Declaration // MajorNamePartialComponent
		.replace('Major', majorName)
		.replace('Name', name);
	if (!ispartial) component = component.replace('Partial', '');

	// also replace  **gulpimport**
	// import and add to route declarations or imports list
	const importStatement = `import { ${component} } from '../components/${major.toLowerCase()}/${name.toLowerCase()}.${ispartial ? 'partial' : 'component'}';`;


	// place it inside the module, if **gulpcomponent_first exists, replace with  **gulpcomponent and dont add a comma
	// src from /routes folder, no subfolders
	// const src = withroute ? '.route.ts' : '.module.ts';
	return (
		gulp
			.src(ngConfig.Destinations.Routes + majorName.toLowerCase() + '.route.ts')
			// replace route and component
			// if it is not partial force a route for it, even if standalone
			.pipe(gulpif(!ispartial, replace('// **gulproute**', ',' + route + '\n// **gulproute**')))
			.pipe(gulpif(!ispartial, replace('// **gulproute_first**', route + '\n// **gulproute**')))
			// if not standalone place in declaration
			.pipe(gulpif(!standalone, replace('// **gulpcomponent**', ', ' + component + '\n// **gulpcomponent**')))
			.pipe(gulpif(!standalone, replace('// **gulpcomponent_first**', component + '\n// **gulpcomponent**')))
			// if standalone place in imports (a route module)
			.pipe(gulpif(standalone, replace('// **gulpcomponent_standalone**', component +', ' + '\n// **gulpcomponent_standalone**')))
			// if standalone, check if not partial before adding
			.pipe(gulpif(!(standalone && ispartial), replace('// **gulpimport**', importStatement + '\n// **gulpimport**')))
			.pipe(gulp.dest(ngConfig.Destinations.Routes))
	);
};



const _createView = function () {
	const { major, name, ispartial, isform } = params;
	//major now is Something/Something' place in destinationviews + the path

	if (!major) {
		return gulp.src('.');
	}
	const majorName = major.substring(major.lastIndexOf('/') + 1);

	return gulp
		.src(isform ? ngConfig.Templates.FormViews : ngConfig.Templates.Views)
		.pipe(replace('Major', majorName))
		.pipe(replace('major', majorName.toLowerCase()))
		.pipe(
			rename({
				basename: name.toLowerCase(),
				suffix: ispartial ? '.partial' : '',
				extname: '.html'
			})
		)
		.pipe(gulp.dest(ngConfig.Destinations.Views + major.toLowerCase(), { overwrite: false }));
};

const _createComponent = function () {
	const { major, name, ispartial, isform, standalone } = params;
	const prefix = options.prefix;

	const re = /\/\* STANDALONE \*\/[\s\S]*?\/\* ENDSTANDALONE \*\//gim;

	const comments = /(\/\* STANDALONE \*\/\s\s*|\/\* ENDSTANDALONE \*\/\s\s*)/gim;
	if (!major) {
		return gulp.src('.');
	}
	let _partialView = '';
	let _selector = '';
	let majorName = major.substring(major.lastIndexOf('/') + 1);
	// if common, or layout dont include name
	if (majorName === 'Common' || majorName === 'Layouts') {
		majorName = '';
	}
	if (ispartial) {
		_partialView = '.partial';
		_selector = `selector: '${prefix}${majorName ? '-' + majorName.toLowerCase() : ''}-${name.toLowerCase()}',`;
	}
	return gulp
		.src(isform ? ngConfig.Templates.FormComponents : ngConfig.Templates.Components)
		.pipe(replace('Major', majorName))
		.pipe(replace('Name', name))
		.pipe(replace('major', majorName.toLowerCase()))
		.pipe(gulpif(!ispartial, replace('Partial', '')))
		.pipe(replace('viewpath', name.toLowerCase() + _partialView))
		.pipe(replace('_selector_', _selector))
		.pipe(gulpif(!standalone, replace(re, '')))
		// remove comments
		.pipe(replace(comments, ''))
		.pipe(
			rename({
				basename: name.toLowerCase(),
				suffix: ispartial ? '.partial' : '.component',
				extname: '.ts'
			})
		)
		.pipe(gulp.dest(ngConfig.Destinations.Components + major.toLowerCase(), { overwrite: false }));
};

const _createPipe = function () {
	const name = params.name;
	if (!name) {
		return gulp.src('.');
	}

	return gulp
		.src(ngConfig.Templates.Pipes)
		.pipe(replace('_Name_', name))
		.pipe(replace('_name_', name.toLowerCase()))
		.pipe(
			rename({
				basename: name.toLowerCase(),
				suffix: '.pipe',
				extname: '.ts'
			})
		)
		.pipe(gulp.dest(ngConfig.Destinations.Pipes, { overwrite: false }));
};

const _createDirective = function () {
	const name = params.name;
	const prefix = options.prefix;
	if (!name) {
		return gulp.src('.');
	}

	// prefix directive with prefix
	return gulp
		.src(ngConfig.Templates.Directives)
		.pipe(replace('_Name_', prefix + name))
		.pipe(replace('_name_', name.toLowerCase()))
		.pipe(
			rename({
				basename: name.toLowerCase(),
				suffix: '.directive',
				extname: '.ts'
			})
		)
		.pipe(gulp.dest(ngConfig.Destinations.Directives, { overwrite: false }));
};

const _createModel = function () {
	const name = params.name;

	if (!name) {
		return gulp.src('.');
	}

	return gulp
		.src(ngConfig.Templates.Model)
		.pipe(replace('_Name_', name))
		.pipe(replace('_name_', name.toLowerCase()))
		.pipe(
			rename({
				basename: name.toLowerCase(),
				suffix: '.model',
				extname: '.ts'
			})
		)
		.pipe(gulp.dest(ngConfig.Destinations.Models, { overwrite: false }));
};

const _createService = function () {
	const name = params.name;
	// create service from template and save in services folder with name
	// then inject in services.ts
	// then inject in coremodules

	return gulp
		.src(ngConfig.Templates.Service)
		.pipe(replace('_Name_', name))
		.pipe(replace('_name_', name.toLowerCase()))
		.pipe(
			rename({
				basename: name.toLowerCase(),
				suffix: '.service',
				extname: '.ts'
			})
		)
		.pipe(gulp.dest(ngConfig.Destinations.Services, { overwrite: false }));
}

const _addToConfig = function () {
	// add a node to config to be used with newly created config
	const name = params.name;

	const apiconfig =
		fs
			.readFileSync(ngConfig.Templates.ApiConfig, 'utf8')
			.replace(/_name_/gim, name.toLowerCase());


	return (
		gulp
			.src(ngConfig.Core.ApiConfigFile)
			.pipe(replace('// **gulpmodel**', ', ' + apiconfig + '\n// **gulpmodel**'))
			.pipe(gulp.dest(ngConfig.Destinations.ApiConfig))
	);

}

module.exports = (config) => {

	// one time use, cannot replace
	setConfig(config);

	const ret = {};

	// i am retiring these too, no need
	// ret.injectServices = _injectServices;
	// ret.injectLibModule = _injectLibModule;
	// ret.injectModels = _injectModels;

	// ret.injectAll = gulp.parallel(gulp.series(_injectModels, _injectServices), _injectLibModule,);


	ret.createRouteModule = _createRouteModule; // create a module with routing

	ret.createComponent = gulp.series(
		gulp.parallel(
			_createView,
			_createComponent,
			_createRouteModule
		),
		_addComponentToModule
	);

	ret.createPipe = _createPipe;
	ret.createDirective = _createDirective;
	ret.createModel = _createModel;
	ret.createService = _createService;
	ret.createFullService = gulp.parallel(_createModel, _createService, _addToConfig);

	return ret;

};