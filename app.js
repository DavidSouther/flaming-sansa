global.root = __dirname;
module.exports = require('rupert')(require('./server'));
if(module === require.main){
    module.exports.start();
}
