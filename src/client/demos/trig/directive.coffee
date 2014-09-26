angular.module('graphing.demos.trig', [
    'graphing.scales'
    'demos.trig.template'
])
.config ($stateProvider)->
    $stateProvider.state 'demo.trig',
        url: '/trig',
        views:
            'demo-trig':
                template: '<trig-demo />'
.directive 'trigDemo', ->
    restrict: 'E'
    templateUrl: 'demos/trig'
.controller 'TrigCtrl', ($scope)->
    $scope.data = []
    i = 0
    while i < 84
        $scope.data.push i * 10 / 84
        i++

    $scope.sine =
        x: (d, i)-> d
        y: (d, i)-> Math.sin(d - $scope.time)
