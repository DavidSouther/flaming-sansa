class AxisCtrl
    constructor: ->
        AxisCtrl::calcTicks.apply(@)
        AxisCtrl::formats.apply(@)

    calcTicks: ->
        @$ticks = {x: [], y: []}
        range = @$chartOptions.range
        tickCount = @$chartOptions.axis.tickCount or 10
        xStep = (range.x.max - range.x.min) / tickCount
        yStep = (range.y.max - range.y.min) / tickCount
        i = 10
        while i >= 0
            @$ticks.x.push (xStep * i) + range.x.min
            @$ticks.y.push (yStep * i) + range.y.min
            i--
        return @

    formats: ->
        @$format = @$chartOptions.axis?.format or {}
        @$format.x or= ['number', 2]
        @$format.y or= ['number', 2]

        @$format.x =
            type: @$format.x[0]
            args: @$format.x[1..]
        @$format.y =
            type: @$format.y[0]
            args: @$format.y[1..]
        return @

angular.module('graphing.charts.axis', [
    'charts.axis.template'
])
.filter 'chooseFilter', ($filter)->
    (value, filter, args = [])->
        $filter(filter).apply(null, [value].concat args)
.controller 'AxisCtrl', AxisCtrl
.directive 'axis', ->
    restrict: 'EA'
    replace: yes
    templateUrl: 'charts/axis'
    templateNamespace: 'svg'
    controller: ($scope)->
        AxisCtrl.apply($scope)
