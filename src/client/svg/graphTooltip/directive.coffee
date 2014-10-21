angular.module('graphing.svg.tooltip', [
    'svg.graphTooltip.template'
])
.value('DefaultTooltipTemplate', "<div>{{ tooltipData.text }}</div>")

.service 'TooltipTemplateService', ($compile, DefaultTooltipTemplate)->
    tooltipTemplate = null
    _tooltipTemplate = null
    set = (template)->
        _tooltipTemplate = template
        tooltipTemplate = $compile(template)
    get = -> tooltipTemplate
    raw = -> _tooltipTemplate
    render = ($scope, fn = angular.noop)-> get()($scope, fn)

    set(DefaultTooltipTemplate)

    { get, set, render, raw }

.directive 'chartTooltipTemplate', (TooltipTemplateService)->
    restrict: 'EA'
    compile: (tElement)->
        TooltipTemplateService.set tElement.children()
        tElement.remove()

.directive 'graphTooltip', ($templateCache, $compile, TooltipTemplateService)->
    restrict: 'A'
    compile: (tElement, tAttrs, tTransclude)->
        tooltipOffset = 0
        tooltip = null
        tooltipData =
            show: no
            position: [-50, -50]
            text: "Tooltip!"
        tooltipStyle = null

        showTooltipAt = ($scope, at, text = tooltipData.text)->
            $scope.tooltipData.show = yes
            $scope.tooltipData.text = text
            $scope.tooltipData.position = at
            tooltip.empty().append TooltipTemplateService.render $scope

        hideTooltip = ($scope)->
            $scope.tooltipData.show = no

        pre: ($scope, iElement, iAttrs)->
            $scope.tooltipData = tooltipData
            unless tooltip
                parent = iElement
                lastSvg = null
                while (parent = parent.parent()).length
                    if parent[0].tagName is 'svg'
                        lastSvg = parent
                tooltipTemplate = $templateCache.get('svg/graphTooltip')
                tooltipExp = $compile(tooltipTemplate)
                tooltip = tooltipExp($scope)
                lastSvg.parent().append tooltip

        post: ($scope, iElement, iAttrs)->
            iElement.bind 'mouseover', (event)->
                $scope.$apply ->
                    position = [event.x, 50]
                    showTooltipAt $scope, position, iAttrs.graphTooltip
            iElement.bind 'mouseout', ->
                $scope.$apply ->
                    hideTooltip $scope
