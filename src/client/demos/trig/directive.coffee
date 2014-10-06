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
.controller 'TrigCtrl', ($scope, ScaleSvc)->
    $scope.data = []

    $scope.x = { min: -1.2, max: 5 };
    $scope.y = {};
    $scope.y.max = (260 * (x.max - x.min)) * (1 / (2 * 760));
    $scope.y.min = -y.max;
    $scope.time = 0;
    $scope.delta = .015 / 2;
    $scope.value = {x: Math.PI, y: 0};

    $scope.scales = ScaleSvc({
        x: ['linear', $scope.x.min, $scope.x.max],
        y: ['linear', $scope.y.min, $scope.y.max]
    });

    i = 0
    while i < 84
        $scope.data.push i * 10 / 84
        i++

    $scope.sine =
        x: (d, i)-> d
        y: (d, i)-> Math.sin(d - $scope.time)

    $scope.cosine =
        x: (d, i)-> d
        y: (d, i)-> Math.cos(d - $scope.time)

    $scope.tangent =
        x: (d, i)-> d
        y: (d, i)-> Math.tan(d - $scope.time)
