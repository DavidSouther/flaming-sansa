angular.module('graphing.charts.axis', [
    'charts.axis.template'
]).directive 'axis', ->
    restrict: 'EA'
    replace: yes
    templateUrl: 'charts/axis'
    controller: ($scope)->
        $scope.$ticks = {x: [], y: []}
        range = $scope.$chartOptions.range
        xStep = (range.x.max - range.x.min) / 10
        yStep = (range.y.max - range.y.min) / 10
        i = 10
        while i >= 0
            $scope.$ticks.x.push (xStep * i) + range.x.min
            $scope.$ticks.y.push (yStep * i) + range.y.min
            i--
