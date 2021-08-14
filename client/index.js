/****
 * This is an example folder to be used in client that uses the gulpBin commands.
 ***/

const config = require('./config.json');
// setup config

// one specific way to run only assets
// const assets = require('@sekrab/gulpbin/gulpfiles.js/shut/assets')(config);
// const ng = require('@sekrab/gulpbin/gulpfiles.js/angular/ng');
// ng.config(config);
// export all ng[keys], or select ones: exports.inject = ng.injectAll; masalan

// Object.keys(assets).forEach(i => {
// 	exports[i] = assets[i];
// });

// TODO: a bit more helpful content

// or bring them all in
const gulpBin = require('@sekrab/gulpbin')(config);

// expose them all
Object.keys(gulpBin).forEach(i => {
    Object.keys(gulpBin[i]).forEach( x =>  {
        exports[x] = gulpBin[i][x];

    });
});

