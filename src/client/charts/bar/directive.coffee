angular.module('graphing.charts.bar', [
    'graphing.scales'
    'charts.bar.template'
])
.directive 'barChart', ->
    restrict: 'AE'
    templateUrl: 'charts/bar'
    scope:
        chartData: '='
        chartOptions: '='
    controller: ($scope)->
        $scope.$chartOptions =
            x: if angular.isString $scope.chartOptions.x
                (_)-> _[$scope.chartOptions.x]
            else if angular.isFunction $scope.chartOptions.x
                $scope.chartOptions.x
            y: if angular.isString $scope.chartOptions.y
                (_)-> _[$scope.chartOptions.y]
            else if angular.isFunction $scope.chartOptions.y
                $scope.chartOptions.y


        $scope.$chartData =
            $x: $scope.chartData.map (_, i)-> $scope.$chartOptions.x(_, i)
            $y: $scope.chartData.map (_, i)-> $scope.$chartOptions.y(_, i)

        $scope.$chartData.$x.$min = Math.min.apply Math, $scope.$chartData.$x
        $scope.$chartData.$x.$max = Math.max.apply Math, $scope.$chartData.$x
        $scope.$chartData.$y.$min = Math.min.apply Math, $scope.$chartData.$y
        $scope.$chartData.$y.$max = Math.max.apply Math, $scope.$chartData.$y
