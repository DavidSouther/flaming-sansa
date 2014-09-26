angular.module('graphing.demos.bar', [
    'graphing.scales'
    'demos.bar.template'
])
.config ($stateProvider)->
    $stateProvider.state 'demo.bar',
        url: '/bar'
        views:
            'demo-bar':
                template: '<bar-demo />'

.directive 'barDemo', ->
    restrict: 'E'
    templateUrl: 'demos/bar'
    controller: ($scope, SalesData)->
        $scope.demoData = SalesData
