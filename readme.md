### Gulp tasks

This is a list of tasks used for multiple projects that I find handy, though they are only garnish to the projects that use them. Currently used in [Shut framework](https://npmjs.com/package/shut) and [Cricket starter](https://github.com/ayyash/cricket)

1. To install

```
npm install sekrab-gulpbin --save-dev
```

2. Install `gulp` locally
```
npm install gulp --save-dev
```

3. Create `gulpfile.js` folder

4. Add `config.json` [example config](client/config.json)

5. Add `index.js` [example index](client/index.js)

Find in code, example client of those two files.

> Keep an eye on https://github.com/gulp-community/gulp-less/issues/312, if not yet resolved, update node_modules/gulp-less/index file with the content of the pull request https://github.com/gulp-community/gulp-less/pull/313

## Gulp commands for Angular

You can optionally use these instead of the angular cli packaged commands (or you can create files manually). here is a quick explanation of each command under ng.js, with the most useful at the top

> general rule: name, and major name should start with uppercase letter: like Example, the file names and selectors generated are all lowercase

> To know what each one generates, have a look under */gulpfile.js/angulartemplates* folder

### Generate

- `gulp component --name Example --major Container --ispartial false --isform false --withroute false`  
    **Useful and common** This task creates a component inside a folder indicated in *major* (could be a folder path like Container/SubContainer), with the name `example.component.ts`. The folder is placed under */app/components*, and exported int he barrel under */core/components*
    
    If **ispartial** is set to true, the file name is `example.partial.ts` (and it specifies a selector `cr-example` ready to be used). 
    
    If **isform** is set to true, the code is ready with minimum form elements. 
    
    If **withroute** is set to true, the task adds the component to the correct module under */routes/major.route.ts* (creates it if it does not exist), and adds a dummy route for it if it were not partial, and declares the component. 
    
    If set to false, the component is added to */routes/major.module.ts*, declares the component, and addes to the list of exported components. Use withroute to seperate components of a routed module, from those you will export to use in other modules.

    Leaving out *--major* property, failes silently

    Choosing *--major* to **Common** or **Layout** excludes the major name from file and component name. It also does not declare the generated component in any module. You must declare it manually anywhere you see fit. (Usually, common and layout components are included in the most base app module, which I intentionally do not touch dynamically.)
    
    Your job is to implement the component, and head to `src/app/routes.module.ts` (root routing module) to add the lazy loaded path to the new module (`MainLayout` component can be used as the wrapper default component.)

- `gulp model --name Example`  
    Creates an `example.model.ts` in */models* folder with a single property 'id', your job is to implement it. It also performs an inject into */core/services*

- `gulp service --name Example`  
    Creates an `example.service.ts` in */services* folder with the basic get, post, delete, and put functions, also injects the service in */core/services*. The service is `providedIn: root`. Your job is to implement the service correctly and create an api mapping points in *config.ts*

- `gulp fullService --name Example`  
    **Useful but rare** In addition to the creating the model, and service and injecting them in their correct locations, it also creates an api config point in *config.ts*. Your job is to implement the service as requested. The service is ready to be injected in any component.

- `gulp pipe --name Example`  
    Create an `example.pipe.ts` and places it in */lib/pipes*, then exports it in *lib.module.ts*. This is already imported inside */core/shared.module* which is imported into *app.module*, you can immidiately start using it, if however you want to use it in a specific group of conrols, your job is to remove it from */lib/lib.module.ts* and declare it elsehwere. 

    > Note: `gulp inject` reinjects the file in lib.module.ts, to prevent that, rename the file and remove 'pipe' keyword, move the file out of /lib/pipes folder, or prefix name with _.

- `gulp directive --name Example`   
    Create an `example.directive.ts` and places it in */lib/directives*, then exports it in *lib.module.ts*. This is already imported inside */core/shared.module* which is imported into *app.module*, you can immidiately start using it, if however you want to use it in a specific group of conrols, your job is to remove it from */lib/lib.module.ts* and declare it elsehwere. The selector of the directive is prefixed with configuration property: **angularPrefix**.

    > Note: `gulp inject` reinjects the file in lib.module.ts, to prevent that, rename the file and remove 'directive' keyword, move the file out of /lib/directives folder, or prefix name with _.


### Inject

TODO: change this, no longer injecting components

Following are quick calls to inject all classes in specific folders into their barrels in the core folder, to make them easier to use throughout the project. Classes should not be imported individually but through their barrel, to keep maintenance of their folder path under control.

> A general rule, all files prefixed with "_" are excluded from injection. Also no files under the following folders are included in injection: components/layouts, components/common, components/abstract.

- `gulp injectComponents`: inject all components in **/components**  into **/core/componetns** barrel

    Patterns: `*.component.ts`, `*.partial.ts`, `*.dialog.ts`

- `gulp injectServices`: inject all services in **/services**  into **/core/services** barrel

    Patterns: `*.ts`, excludes `*.abstract.ts`

- `gulp injectLib`: inject all directives, and pipes from **/lib** into **/lib/lib.module** which is in turn imported into *core/shared.module*

    Patterns: `pipes/*.pipe.ts`, `directives/*.directive.ts`

- `gulp injectModels`: inject all models in **/models** into **/core/services** barrel

    Patterns: `*.model.ts`

- `gulp inject`: **Useful** Injects all above, do this when in doubt that you missed something, or you deleted a file.

## Assets

To generate assets after changing less files (this is a very critical task, you should not modify styles unless 100% sure of what you're doing)

- `gulp rawless`: prepares *src/assets/css/cr.css* and *cr.rtl.css*
- `gulp`: the default task does the same as rawless while watching sh.\*.less, ui.\*.less and rtl.\*.less in *mockups* less folder (see gulp config)
- `gulp prepicons`: this takes files from the icomoon generated files and copies them in */dummy* folder in preparetion to generate icons
- `gulp iconset`: generates icons produced by icomoon tool in `dummy/iconset.html` and in `mockup/less/ui.icons.less`, run `gulp rawless` afterwords to generate the css files. Browse to `localhost/~projectname/mockup/dummy/iconset.html` to see a list of icons generated. 
- `gulp createicons`: does both `prepicons` and `iconset`
- `gulp critical`: generates four files: `cr.general.css` and `cr.critical.css`, `cr.general.rtl.css` and `cr.critical.rtl.css` into `assets` folder (in addition to the cr.css and cr.rtl.css). The general files are injected through `angular.json` into html, the critical files are added to html header (they are referenced in `placeholder.html`). This is to downsize the initial style file, and have better performance. The rules of which what gets placed in critical is very basic, any group of styles in any `mockup/less/*.less` file wrapped inside `/* CRITICAL BEGIN */` and `/* CRITICAL END */`. 



> PS: Using less in components, is possible, remember to start with `@import "sh.vars.less"`; and avoid styles that need to be mirrored for RTL.

Notes:

- `all.less` and `all.rtl.less` in */mockup/less* are auto generated by gulp tasks, do not update directly
- icons rely on files generated by icomoon app: https://icomoon.io/app


### Testing is hard

But here is a starting point

`gulp xxx --gulpfile ./test/internal.js`