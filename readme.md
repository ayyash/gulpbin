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

3. Create `gulpfile.js` folder (or create `gulpfile.js` file)

4. Add `config.json` [example config](client/config.json)

5. Add `index.js` (or use the `gulpfile.js`) [example index](client/gulpfile.js)

Find in code, example client of those two files.

## Gulp commands for Angular

You can optionally use these instead of the angular cli packaged commands (or you can create files manually). here is a quick explanation of each command under ng.js, with the most useful at the top

> general rule: name, and major name should start with uppercase letter: like Example, the file names and selectors generated are all lowercase

> To know what each one generates, have a look under */gulpfile.js/angulartemplates* folder

### Generate

- `gulp component --name Example --major Container --ispartial false --isform false --standalone false --isdialog false`  
    **Useful and common** This task creates a component inside a folder indicated in *major* (could be a folder path like Container/SubContainer), with the name `example.component.ts`. The folder is placed under */app/components*
    
    If **ispartial** is set to true, the file name is `example.partial.ts` (and it specifies a selector `cr-example` ready to be used). This is a standalone component. 
    
    If **isform** is set to true, the code is ready with minimum form elements. This is a standalone component. It's better coupled with **ispartial**.
	 
	 The task aslo adds the component to the correct route under */routes/major.route.ts* (creates it if it does not exist), and adds a dummy route for it if it were not partial, nor dialog, and declares the component.

	 If **standalone** is set to true, it creates a standalone component with basic **CommonModule** and **RouteModule** as imports

	 If **standalone** is set to true and **ispartial** is set to false, the component gets its route in */routes/major.route.ts*.

	 Creating a componetn with **standalone** and **ispartial** is ideal for creating shared components.

    If **isdialog** is set to true, the file name is `example.dialog.ts` and it's a standalone component that implements the cricket service `DialogService`. The component class name is `MajorMainDialog`.

	 Leaving out *--major* property, failes silently

	 Choosing *--major* to **Common** or **Layout** excludes the major name from file and component name. It also does not declare the generated component in any module. You must declare it manually anywhere you see fit. (Usually, common and layout components are included in the most base app module, which I intentionally do not touch dynamically.)
	
	 Your job is to implement the component, and head to `src/app/app.routes.ts` (root routing module) to add the lazy loaded path to the new module or standalone route.


- `gulp model --name Example`  
    Creates an `example.model.ts` in */models* folder with a single property 'id', your job is to implement it.

- `gulp service --name Example`  
    Creates an `example.service.ts` in */services* folder with the basic get, post, delete, and put functions. The service is `providedIn: root`. Your job is to implement the service correctly and create an api mapping points in *config.ts*

- `gulp fullService --name Example`  
    **Useful but rare** In addition to the creating the model, and service and injecting them in their correct locations, it also creates an api config point in *config.ts*. Your job is to implement the service as requested. The service is ready to be injected in any component.

- `gulp pipe --name Example`  
    Create an `example.pipe.ts` as as standalone pipe. 

- `gulp directive --name Example`   
    Create an `example.directive.ts` as a standalone directive. The selector of the directive is prefixed with configuration property: **prefix**.



## Assets

To generate assets after changing less files (this is a very critical task, you should not modify styles unless 100% sure of what you're doing)

- `gulp rawless`: prepares *src/assets/css/cr.css* and *cr.rtl.css*
- `gulp watch`: does the same as rawless while watching sh.\*.less, ui.\*.less and rtl.\*.less in *mockups* less folder (change in config)
- `gulp icons`: this takes files from the icomoon generated files and copies them in */dummy* folder in preparetion to generate icons, then generates icons produced by icomoon tool in `dummy/iconset.html` and in `mockup/less/ui.icons.less`, run `gulp rawless` afterwords to generate the css files. Browse to `localhost/~projectname/mockup/dummy/iconset.html` to see a list of icons generated. 
- `gulp critical`: generates four files: `cr.general.css` and `cr.critical.css`, `cr.general.rtl.css` and `cr.critical.rtl.css` into `assets` folder (in addition to the cr.css and cr.rtl.css). The general files are injected through `angular.json` into html, the critical files are added to html header (they are referenced in `placeholder.html`). This is to downsize the initial style file, and have better performance. The rules of which what gets placed in critical is very basic, any group of styles in any `mockup/less/*.less` file wrapped inside `/* CRITICAL BEGIN */` and `/* CRITICAL END */`. 



> PS: Using less in components, is possible, remember to start with `@import "sh.vars.less"`; and avoid styles that need to be mirrored for RTL.

Notes:

- `all.less` and `all.rtl.less` in */mockup/less* are auto generated by gulp tasks, do not update directly
- icons rely on files generated by icomoon app: https://icomoon.io/app
