global.root = __dirname
require('ng-stassets/express')(require('./server')).start()
