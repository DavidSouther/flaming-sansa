angular.module('graphing.demos.provider', [

]).provider 'demos', ($stateProvider)->
    demolist = []

    demo: (name, args)->
        demolist.push(name)
        if arguments.length is 1
            args = name
        else
            args.name = name

        $stateProvider.state name,
            url: "/#{name}"
            views: "demos": args
    $get: -> demolist
