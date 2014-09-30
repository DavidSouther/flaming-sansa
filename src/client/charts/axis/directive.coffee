angular.module('graphing.charts.axis', [
    'charts.axis.template'
]).directive 'axis', ->
    restrict: 'EA'
    replace: yes
    templateUrl: 'charts/axis'
