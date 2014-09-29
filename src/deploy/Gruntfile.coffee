module.exports = (grunt)->
    release =
        demos:
            options:
                releaseBranch: 'gh-pages'
                remoteRepository: 'origin'
                distDir: 'www'
                commitMessage: 'Publishing Demo Pages...'
                commit: yes
                push: yes

    grunt.Config =
        releaseBranchPre: release
        releaseBranch: release


    grunt.registerTask 'deployDemo', [
        'releaseBranchPre:demos'
        'releaseBranch:demos'
    ]
