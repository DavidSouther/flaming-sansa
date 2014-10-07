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
    controller: ($scope, $timeout)->
        $scope.barWidth = Math.max(4,
            Math.min(760 / $scope.chartData.length)
        )
