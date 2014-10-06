angular.module('graphing.charts.line', [
    'graphing.scales'
    'graphing.charts.base'
    'graphing.charts.axis'
    'charts.line.template'
])
.directive 'lineChart', ($animate)->
    restrict: 'AE'
    scope:
        chartData: '='
        chartOptions: '='
    require: 'baseChart'
    templateUrl: 'charts/line'
