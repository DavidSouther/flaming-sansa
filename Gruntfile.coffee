Path = require('path')

module.exports = (grunt)->
    require('rupert-grunt')(grunt, { server: Path.resolve './app' })

    grunt.registerTask 'watcher', [ 'rupert-watch' ]
    grunt.registerTask 'default', [ 'rupert-default' ]
