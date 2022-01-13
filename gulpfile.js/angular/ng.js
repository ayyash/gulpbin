// TODO: more consts for files names
// TODO: split on seperate files


const  options = require('minimist')(process.argv.slice(2)); // those are params passed by cmd line
const  fs = require('fs');
const  gulp = require('gulp');
const  inject = require('gulp-inject');
const  rename = require('gulp-rename');
const  replace = require('gulp-replace');
const  gulpif = require('gulp-if');
const angularTemplates = '/angulartemplates/';

let  gulpConfig = require('../config.json');


let ngConfig = {};

exports.config = function (config) {
	gulpConfig = config;

	ngConfig = {
		Templates: {
			Components: __dirname + angularTemplates + 'component.template',
			FormComponents: __dirname + angularTemplates + 'component.form.template',
			Views: __dirname + angularTemplates + 'view.template',
			FormViews: __dirname + angularTemplates + 'view.form.template',
			Directives: __dirname + angularTemplates + 'directive.template',
			Pipes: __dirname + angularTemplates + 'pipe.template',
			Route: __dirname + angularTemplates + 'route.template',
			RouteModule: __dirname + angularTemplates + 'routeModule.template',
			Declaration: 'MajorNamePartialComponent',
			Module: __dirname + angularTemplates + 'module.template',
			Model: __dirname + angularTemplates + 'model.template',
			Service: __dirname + angularTemplates + 'service.template',
			ApiConfig: __dirname + angularTemplates + 'config.template'
		},
		Destinations: {
			Components: gulpConfig.appUrl + 'components/',
			Views: gulpConfig.appUrl + 'components/',
			Directives: gulpConfig.appUrl + 'lib/directives/',
			Pipes: gulpConfig.appUrl + 'lib/pipes/',
			// Modules: gulpConfig.appUrl + '', // root route location
			Routes: gulpConfig.appUrl + 'routes/',
			// RouteFile: 'routing.module.ts',
			Models: gulpConfig.appUrl + 'models/',
			Services: gulpConfig.appUrl + 'services/',
			ApiConfig: gulpConfig.appUrl + ''
		},
		Core: {
			Components: gulpConfig.appUrl + 'core/', // barrel // TODO: remove
			ComponentsFile: 'components.ts',
			Services: gulpConfig.appUrl + 'core/', // barrel
			ServicesFile: 'services.ts',
			CoreModule: gulpConfig.appUrl + 'core/', // module
			CoreModuleFile: 'core.module.ts',
			// Libs: gulpConfig.appUrl + 'core/', // barrel
			// LibFile: 'lib.ts',
			LibModule: gulpConfig.appUrl + 'lib/', // module
			LibModuleFile: 'lib.module.ts',
			ApiConfigFile: gulpConfig.appUrl + 'config.ts'
		}
	};
	
};

const classRe = /export\s+(?:abstract )?class (\w+)/;

function getClassName(file) {
    const str = file.contents.toString('utf8');
    const className = str.match(classRe);
    if (className && className.length > 1) return className[1];
    else return '';
}
function transformClass(filePath, file, isImport) {
    // for every export class /name/ generate export {{name}} from {{path}}
    // if (filePath.indexOf('module') > -1 || filePath.indexOf('_') > -1) return '';

    const className = getClassName(file);
    if (className === '') return '';

    return `${isImport ? 'import' : 'export'} { ${className} } from '${filePath.substring(
        0,
        filePath.lastIndexOf('.')
    )}';`;
}
function transformExport(filePath, file) {
    return transformClass(filePath, file, false);
}
function transformImport(filePath, file) {
    return transformClass(filePath, file, true);
}

function transformClassName(filePath, file) {
    const className = getClassName(file);
    if (className === '') return '';

    return className + ',';
}

function transformModel(filePath, file) {
    return `export * from '${filePath.substring(0, filePath.lastIndexOf('.'))}';`;
}

// inject components in components.ts
// Eylul 15, remove comnent barrel, function obsolete
const _injectComponents = function() {
    // core components
    return gulp
        .src(ngConfig.Core.Components + ngConfig.Core.ComponentsFile)
        .pipe(
            inject(
                gulp.src([
                    ngConfig.Destinations.Components + '**/*.component.ts',
                    ngConfig.Destinations.Components + '**/*.partial.ts',
                    ngConfig.Destinations.Components + '**/*.dialog.ts',
                    '!' + ngConfig.Destinations.Components + '**/abstract/*.ts',
                    '!' + ngConfig.Destinations.Components + '**/_*.ts'
                ]),
                {
                    relative: true,
                    starttag: '// inject:components',
                    endtag: '// endinject',
                    transform: transformExport
                }
            )
        )
        .pipe(gulp.dest(ngConfig.Core.Components));
};

const _injectLibModule = function() {
    // inject classes into the lib module
    return gulp
        .src(ngConfig.Core.LibModule + ngConfig.Core.LibModuleFile)
        .pipe(
            inject(
                gulp.src([
                    ngConfig.Destinations.Directives + '**/*.directive.ts',
                    ngConfig.Destinations.Pipes + '**/*.pipe.ts',
                    '!**/_*.ts'
                ]),
                {
                    relative: true,
                    starttag: '// inject:libs',
                    endtag: '// endinject',
                    transform: transformClassName
                }
            )
        )
        .pipe(
            inject(
                gulp.src([
                    ngConfig.Destinations.Directives + '**/*.directive.ts',
                    ngConfig.Destinations.Pipes + '**/*.pipe.ts',
                    '!**/_*.ts'
                ]),
                {
                    relative: true,
                    starttag: '// inject:importlibs',
                    endtag: '// endinject',
                    addPrefix: '.',
                    transform: transformImport
                }
            )
        )
        .pipe(gulp.dest(ngConfig.Core.LibModule));
};

const _injectModels = function() {
    return gulp
        .src(ngConfig.Core.Services + ngConfig.Core.ServicesFile)
        .pipe(
            inject(gulp.src([ngConfig.Destinations.Models + '**/*.model.ts', '!**/_*.ts']), {
                relative: true,
                starttag: '// inject:models',
                endtag: '// endinject',
                transform: transformModel
            })
        )

        .pipe(gulp.dest(ngConfig.Core.Services));
};

const _injectServices = function() {
    // inect in core.module all services, guards and resolves
    // until u figure o
    return gulp
        .src(ngConfig.Core.Services + ngConfig.Core.ServicesFile)
        .pipe(
            inject(
                gulp.src([
                    ngConfig.Destinations.Services + '**/*.ts',
                    '!' + ngConfig.Destinations.Services + '**/*.abstract.ts',
                    '!' + ngConfig.Destinations.Services + '**/_*.ts'
                ]),
                {
                    relative: true,
                    starttag: '// inject:services',
                    endtag: '// endinject',
                    transform: transformExport
                }
            )
        )
        .pipe(gulp.dest(ngConfig.Core.Services));
};


const _createRouteModule = function() {
    let { major, withroute } = options;

    if (!major) {
        return gulp.src('.');
    }

    const majorName = major.substring(major.lastIndexOf('/') + 1);
    // if common or layouts, do not create module
    if (majorName === 'Common' || majorName === 'Layouts') {
        return gulp.src('.');
    }

    const src = withroute ? ngConfig.Templates.RouteModule : ngConfig.Templates.Module;
    return gulp
        .src(src)
        .pipe(replace('Major', majorName))
        .pipe(
            rename({
                basename: majorName.toLowerCase(),
                suffix: withroute ? '.route' : '.module',
                extname: '.ts'
            })
        )
        .pipe(gulp.dest(ngConfig.Destinations.Routes, { overwrite: false }));
};

// add component to a module or create a new one
const _addComponentToModule = function() {
	// Eylul 15, remove component barrels, now adding to module will add a normal import
    const { major, name, ispartial, withroute } = options;
    if (!major) {
        return gulp.src('.');
    }

	// ComponentDestination_

    const majorName = major.substring(major.lastIndexOf('/') + 1);
    // if common or layouts, do not create module
    if (majorName === 'Common' || majorName === 'Layouts') {
        return gulp.src('.');
    }
    const route =
        fs
            .readFileSync(ngConfig.Templates.Route, 'utf8')
            .replace('major', majorName.toLowerCase())
            .replace('name', name.toLowerCase())
            .replace('Major', majorName)
            .replace('Name', name);


    let component =  ngConfig.Templates.Declaration // MajorNamePartialComponent
            .replace('Major', majorName)
            .replace('Name', name);
    if (!ispartial) component = component.replace('Partial', '');

	// also replace  **gulpimport**
	// TODO: fix this by using inject

	const importStatement = `import { ${component} } from '../components/${major.toLowerCase()}/${name.toLowerCase()}.${ ispartial ? 'partial' : 'component'}';`;

    // place it inside the module, if **gulpcomponent_first exists, replace with  **gulpcomponent and dont add a comma
    // src from /routes folder, no subfolders
    const src = withroute ? '.route.ts' : '.module.ts';
    return (
        gulp
            .src(ngConfig.Destinations.Routes + majorName.toLowerCase() + src)
            // replace route and component
            .pipe(gulpif(!ispartial, replace('// **gulproute**', ','+ route + '\n// **gulproute**')))
            .pipe(gulpif(!ispartial, replace('// **gulproute_first**', route + '\n// **gulproute**')))
            .pipe(replace('// **gulpcomponent**',  ', ' + component + '\n// **gulpcomponent**' ))
            .pipe(replace('// **gulpcomponent_first**',  component + '\n// **gulpcomponent**' ))
            .pipe(replace('// **gulpimport**',  importStatement + '\n// **gulpimport**' ))
            .pipe(gulp.dest(ngConfig.Destinations.Routes))
    );
};

const _createView = function() {
    const { major, name, ispartial, isform } = options;
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
        .pipe(gulp.dest(ngConfig.Destinations.Views + major.toLowerCase(), { overwrite: false}));
};

const _createComponent = function() {
    const { major, name, ispartial, isform } = options;
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
        _selector = `selector: '${gulpConfig.angularPrefix}${majorName ? '-'+ majorName.toLowerCase() : ''}-${name.toLowerCase()}',`;
    }
    return gulp
        .src(isform ? ngConfig.Templates.FormComponents : ngConfig.Templates.Components)
        .pipe(replace('Major', majorName))
        .pipe(replace('Name', name))
        .pipe(replace('major', majorName.toLowerCase()))
        .pipe(gulpif(!ispartial, replace('Partial', '')))
        .pipe(replace('viewpath', name.toLowerCase() + _partialView))
        .pipe(replace('_selector_', _selector))
        .pipe(
            rename({
                basename: name.toLowerCase(),
                suffix: ispartial ? '.partial' : '.component',
                extname: '.ts'
            })
        )
        .pipe(gulp.dest(ngConfig.Destinations.Components + major.toLowerCase(), {overwrite: false}));
};

const _createPipe = function() {
    const name = options.name;
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
        .pipe(gulp.dest(ngConfig.Destinations.Pipes, {overwrite: false}));
};

const _createDirective = function() {
    const name = options.name;
    if (!name) {
        return gulp.src('.');
    }

    // prefix directive with angularPrefix
    return gulp
        .src(ngConfig.Templates.Directives)
        .pipe(replace('_Name_', gulpConfig.angularPrefix + name))
        .pipe(replace('_name_', name.toLowerCase()))
        .pipe(
            rename({
                basename: name.toLowerCase(),
                suffix: '.directive',
                extname: '.ts'
            })
        )
        .pipe(gulp.dest(ngConfig.Destinations.Directives, {overwrite: false}));
};

const _createModel = function() {
    const name = options.name;

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
        .pipe(gulp.dest(ngConfig.Destinations.Models, {overwrite: false}));
};

const _createService = function(){
    const name = options.name;
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
        .pipe(gulp.dest(ngConfig.Destinations.Services, {overwrite: false}));
}

const _addToConfig = function(){
    // add a node to config to be used with newly created config
    const name = options.name;

    const apiconfig =	
    fs
        .readFileSync(ngConfig.Templates.ApiConfig, 'utf8')
        .replace(/_name_/gim, name.toLowerCase());


    return (
        gulp
            .src(ngConfig.Core.ApiConfigFile)
            .pipe(replace('// **gulpmodel**',', '+ apiconfig + '\n// **gulpmodel**'))
            .pipe(gulp.dest(ngConfig.Destinations.ApiConfig))
    );

}


// TODO: create guard and resolve


exports.injectComponents = _injectComponents;
exports.injectServices = _injectServices;
exports.injectLibModule = _injectLibModule;
exports.injectModels = _injectModels;

// Eylul 15, removed component barrels, they are not shakable in angualr 
exports.injectAll = gulp.parallel(  gulp.series(_injectModels, _injectServices), _injectLibModule, );

// exports.createModule = _createModule; // create a module

exports.createRouteModule = _createRouteModule; // create a module with routing

exports.createComponent = gulp.series(
    gulp.parallel(
        _createView,
        _createComponent,
        _createRouteModule
    ),
	// Eylul 15, removed component barrel
    // _injectComponents,
    _addComponentToModule
);

exports.createPipe = gulp.series(_createPipe, _injectLibModule);
exports.createDirective = gulp.series(_createDirective, _injectLibModule);
exports.createModel = gulp.series(_createModel, _injectModels);
exports.createService = gulp.series(_createService, _injectServices);
exports.createFullService = gulp.series(gulp.parallel(_createModel, _createService, _addToConfig), _injectModels, _injectServices);


