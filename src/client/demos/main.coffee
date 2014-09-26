angular.module('graphing.demos', [
    'ionic'

    'graphing.demos.trig'
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
    $urlRouterProvider.otherwise "/demo/trig"

.value 'SalesData', [
    1.46220
    1.47004
    1.49253
    1.49118
    1.49722
    1.50138
    1.50008
    1.51493
    1.50781
    1.50899
    1.53037
    1.58137
    1.54299
    1.53307
    1.55845
    1.56213
    1.54488
    1.56927
    1.55305
    1.55710
    1.56235
    1.58847
    1.59309
    1.58303
    1.59470
]
