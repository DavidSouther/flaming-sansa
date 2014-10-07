angular.module('graphing.svg.tooltip', [
    'svg.graphTooltip.template'
])
.directive 'graphTooltip', ($templateCache, $compile)->
    tooltip = null
    tooltipData =
        show: no
        position: [-50, -50]
        text: "Tooltip!"

    showTooltipAt = ($scope, at, text = tooltipData.text)->
        console.log 'Showing tooltip at', at
        $scope.tooltipData.show = yes
        $scope.tooltipData.text = text
        $scope.tooltipData.position = at

    hideTooltip = ($scope)->
        console.log 'Hiding tooltip'
        $scope.tooltipData.show = no

    restrict: 'A'
    # templateUrl: 'svg/graphTooltip'
    compile: (tElement, tAttrs, tTransclude)->
        pre: ($scope, iElement, iAttrs)->
            unless tooltip
                parent = iElement
                lastSvg = null
                while (parent = parent.parent()).length
                    if parent[0].tagName is 'svg'
                        lastSvg = parent
                tooltipTemplate = $templateCache.get('svg/graphTooltip')
                tooltipExp = $compile(tooltipTemplate)
                tooltip = tooltipExp($scope)
                lastSvg.append tooltip
        post: ($scope, iElement, iAttrs)->
            iElement.bind 'mouseover', ->
                $scope.$apply ->
                    showTooltipAt $scope, [50, 50]
            iElement.bind 'mouseout', ->
                $scope.$apply ->
                    hideTooltip $scope
    controller: ($scope)->
        $scope.tooltipData = tooltipData
