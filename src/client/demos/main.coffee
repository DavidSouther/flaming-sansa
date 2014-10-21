angular.module('graphing.demos', [
    'ionic'

    'graphing.demos.trig'
    'graphing.demos.line'
    'graphing.demos.bar'

    'demos.template'
])
.config ($stateProvider, $urlRouterProvider)->
    $stateProvider.state 'demo',
        abstract: yes
        url: '/demo'
        views:
            "demo-tabs":
                templateUrl: 'demos'
                controller: ($scope)->
                    $scope.demos = [
                        'trig'
                        'bar'
                    ]
    # $urlRouterProvider.otherwise "/demo/trig"
