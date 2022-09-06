/****
 * This is an example folder to be used in client that uses the gulpBin commands.
 ***/

const config = require('./config.json');
// setup config


// TODO: a bit more helpful content

// or bring them all in
const gulpBin = require('sekrab-gulpbin')(config);

// expose them all
Object.keys(gulpBin).forEach(i => {
    Object.keys(gulpBin[i]).forEach( x =>  {
        exports[x] = gulpBin[i][x];

    });
});

