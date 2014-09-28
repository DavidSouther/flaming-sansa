angular.module('graphing.demos.bar', [
    'graphing.svg'
    'graphing.charts.bar'
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
        $scope.demoData = SalesData.map (_, i)-> {year: i + 1980, sales: _}
