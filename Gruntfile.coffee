Path = require('path')

module.exports = (grunt)->
    require('rupert-grunt')(grunt, {
        server: Path.resolve './app'
        jshint: files: [ '!src/client/d3/*' ]
        client: files: [
            'angular.min.js'
        ].map (_)-> __dirname + '/node_modules/angular-builds/' + _
    })

    grunt.registerTask 'watcher', [ 'rupert-watch' ]
    grunt.registerTask 'default', [ 'rupert-default' ]
