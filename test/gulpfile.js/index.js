const config = require('./config.json');
const gulpBin = require('../../gulpfile.js/index')(config);


Object.keys(gulpBin).forEach(i => {
    Object.keys(gulpBin[i]).forEach( x =>  {
        exports[x] = gulpBin[i][x];

    });
});
