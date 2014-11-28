angular.module('graphing.demos.boxplot', [
    'graphing.demos.provider'

    'graphing.charts.boxplot'

    'demos.boxplot.template'
])
.config (demosProvider)->
    demosProvider.demo 'boxplot',
        template: '<boxplot-demo />'

.directive 'boxplotDemo', ->
    restrict: 'E'
    templateUrl: 'demos/boxplot'
    controller: ($scope, BoxplotData, IQR)->
        min = Infinity
        max = -Infinity

        $scope.demoData = []

        BoxplotData.forEach (a, i)->
            $scope.demoData[i] = []
            a.forEach (s)->
                s = Math.floor s
                $scope.demoData[i].push s
                if s > max then max = s
                if s < min then min = s
        $scope.domain = [min, max]

        $scope.iqr = IQR(1.5)

.value 'IQR', (k)->
    (d, i)->
        q1 = d.quartiles[0]
        q3 = d.quartiles[2]
        iqr = (q3 - q1) * k
        i = -1
        j = d.length

        `while (d[++i] < q1 - iqr)`
        `while (d[--j] > q3 + iqr)`

        [i, j]

.value 'BoxplotData',
    [
        [
            850, 740, 900, 1070, 930, 850, 950, 980, 980, 880,
            1000, 980, 930, 650, 760, 810, 1000, 1000, 960, 960
        ]
        [
            960, 940, 960, 940, 880, 800, 850, 880, 900, 840,
            830, 790, 810, 880, 880, 830, 800, 790, 760, 800
        ]
        [
            880, 880, 880, 860, 720, 720, 620, 860, 970, 950,
            880, 910, 850, 870, 840, 840, 850, 840, 840, 840
        ]
        [
            890, 810, 810, 820, 800, 770, 760, 740, 750, 760,
            910, 920, 890, 860, 880, 720, 840, 850, 850, 780
        ]
        [
            890, 840, 780, 810, 760, 810, 790, 810, 820, 850,
            870, 870, 810, 740, 810, 940, 950, 800, 810, 870
        ]
    ]
