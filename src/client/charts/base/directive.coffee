angular.module('graphing.charts.base', [
])
.directive 'baseChart', ->
    priority: 10000
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

            range: $scope.chartOptions.range or {}
            axis: $scope.chartOptions.axis or {}

        $scope.$chartData =
            $x: $scope.chartData.map (_, i)-> $scope.$chartOptions.x(_, i)
            $y: $scope.chartData.map (_, i)-> $scope.$chartOptions.y(_, i)

        $scope.$chartData.$x.$min = Math.min.apply Math, $scope.$chartData.$x
        $scope.$chartData.$x.$max = Math.max.apply Math, $scope.$chartData.$x
        $scope.$chartData.$y.$min = Math.min.apply Math, $scope.$chartData.$y
        $scope.$chartData.$y.$max = Math.max.apply Math, $scope.$chartData.$y

        $scope.$chartOptions.range =
            x: $scope.$chartOptions.range.x or {}
            y: $scope.$chartOptions.range.y or {}

        $scope.$chartOptions.range.x.min or= $scope.$chartData.$x.$min
        $scope.$chartOptions.range.x.max or= $scope.$chartData.$x.$max
        $scope.$chartOptions.range.y.min or= $scope.$chartData.$y.$min
        $scope.$chartOptions.range.y.max or= $scope.$chartData.$y.$max

        $scope.$chartOptions.margins or= {}
        $scope.$chartOptions.margins.top or= 10
        $scope.$chartOptions.margins.bottom or= 30
        $scope.$chartOptions.margins.left or= 50
        $scope.$chartOptions.margins.right or= 10
