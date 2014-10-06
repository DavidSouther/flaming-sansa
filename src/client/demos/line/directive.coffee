angular.module('graphing.demos.line', [
    'graphing.svg'
    'graphing.charts.line'
    'demos.line.template'
])
.config ($stateProvider)->
    $stateProvider.state 'demo.line',
        url: '/line'
        views:
            'demo-line':
                template: '<line-demo />'

.directive 'lineDemo', ->
    restrict: 'E'
    templateUrl: 'demos/line'
    controller: ($scope, SalesData)->
        $scope.demoData = SalesData.map (_, i)-> {year: i + 1980, sales: _}
