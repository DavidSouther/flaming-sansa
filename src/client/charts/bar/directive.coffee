angular.module('graphing.charts.bar', [
    'graphing.scales'
    'graphing.charts.base'
    'graphing.charts.axis'
    'charts.bar.template'
])
.directive 'barChart', ($animate)->
    restrict: 'AE'
    scope:
        chartData: '='
        chartOptions: '='
    templateUrl: 'charts/bar'
    require: 'baseChart'
