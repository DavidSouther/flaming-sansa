Path = require('path')

module.exports = (grunt)->
    require('rupert-grunt')(grunt, {
        server: Path.resolve './app'
        jshint: files: [ '!src/client/d3/*' ]
    })

    grunt.registerTask 'watcher', [ 'rupert-watch' ]
    grunt.registerTask 'default', [ 'rupert-default' ]
