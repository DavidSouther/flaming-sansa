class BaseChart
    constructor: (@$scope)->
        @setOptions()

    setOptions: ->
        @$scope.$chartOptions =
            x: if angular.isString @$scope.chartOptions.x
                (_)=> _[@$scope.chartOptions.x]
            else if angular.isFunction @$scope.chartOptions.x
                @$scope.chartOptions.x
            else
                (_, i)-> _
            y: if angular.isString @$scope.chartOptions.y
                (_)=> _[@$scope.chartOptions.y]
            else if angular.isFunction @$scope.chartOptions.y
                @$scope.chartOptions.y
            else
                (_, i)-> i

            range: @$scope.chartOptions.range or {}
            axis: @$scope.chartOptions.axis or {}

        @calculateRanges()
        @setScales()
        @calculateMargins()

    calculateRanges: ->
        @$scope.$chartData =
            $x: @$scope.chartData.map (_, i)=> @$scope.$chartOptions.x(_, i)
            $y: @$scope.chartData.map (_, i)=> @$scope.$chartOptions.y(_, i)

        @$scope.$chartData.$x.$min = Math.min.apply Math, @$scope.$chartData.$x
        @$scope.$chartData.$x.$max = Math.max.apply Math, @$scope.$chartData.$x
        @$scope.$chartData.$y.$min = Math.min.apply Math, @$scope.$chartData.$y
        @$scope.$chartData.$y.$max = Math.max.apply Math, @$scope.$chartData.$y

        @$scope.$chartOptions.range =
            x: @$scope.$chartOptions.range.x or {}
            y: @$scope.$chartOptions.range.y or {}


        @$scope.$chartOptions.range.x.min or= @$scope.$chartData.$x.$min
        @$scope.$chartOptions.range.x.max or= @$scope.$chartData.$x.$max

        opts = @$scope.$chartOptions
        if opts.domain
            @$scope.$chartOptions.range.y.min or= opts.domain[0]
            @$scope.$chartOptions.range.y.max or= opts.domain[1]
        else
            @$scope.$chartOptions.range.y.min or= @$scope.$chartData.$y.$min
            @$scope.$chartOptions.range.y.max or= @$scope.$chartData.$y.$max

    setScales: ->
        @$scope.$chartOptions.scale = @$scope.chartOptions.scale or {}
        @$scope.$chartOptions.scale.x or= 'linear'
        @$scope.$chartOptions.scale.y or= 'linear'

    calculateMargins: ->
        @$scope.$chartOptions.margins = @$scope.chartOptions.margins or {}
        @$scope.$chartOptions.margins.top or= 10
        @$scope.$chartOptions.margins.bottom or= 30
        @$scope.$chartOptions.margins.left or= 50
        @$scope.$chartOptions.margins.right or= 10

BaseChart.$inject = [ '$scope' ]

angular.module('graphing.charts.base', [
    'graphing.svg.tooltip'
])
.controller('BaseChart', BaseChart)
.directive 'baseChart', ($compile)->
    priority: 10000
    controller: 'BaseChart'
