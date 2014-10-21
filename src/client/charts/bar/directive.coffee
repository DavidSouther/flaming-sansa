angular.module('graphing.charts.bar', [
    'graphing.svg'
    'graphing.scales'
    'graphing.charts.base'
    'graphing.charts.axis'
    'charts.bar.template'
])
.directive 'barChart', ($compile)->
    restrict: 'AE'
    scope:
        chartData: '='
        chartOptions: '='
    templateUrl: 'charts/bar'
    priority: 500
    replace: yes
    transclude: yes
    link: ($scope)->
        $scope.barWidth = Math.max(4,
            Math.min(760 / $scope.chartData.length)
        )
