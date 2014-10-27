angular.module('graphing.charts.boxplot', [
    'graphing.svg'
    'graphing.scales'
    'graphing.charts.base'
    # 'graphing.charts.axis'
    'charts.boxplot.template'
])
.directive 'boxplot', ($compile, ScaleSvc)->
    restrict: 'AE'
    scope:
        chartData: '='
        chartOptions: '='
    templateUrl: 'charts/boxplot'
    priority: 500
    transclude: yes
    link: ($scope, $element)->
        $scope.width = 20
        $scope.height = 100
        d = $scope.d = $scope.chartData.map(Number).sort(d3.ascending)
        n = $scope.n = d.length
        min = $scope.min = d[0]
        max = $scope.max = d[n - 1]

        Quartiles = (d)-> [
            d3.quantile(d, .25)
            d3.quantile(d, .5)
            d3.quantile(d, .75)
        ]

        # Compute quartiles. Must return exactly 3 elements.
        $scope.quartiles = d.quartiles = Quartiles(d)

        #   // Compute whiskers. Must return exactly 2 elements, or null.
        $scope.chartOptions.whiskers or= (d)-> [0, d.length - 1]
        whiskerIndices = $scope.chartOptions.whiskers.call(this, d)
        $scope.whiskers = whiskerIndices && whiskerIndices.map (i)-> d[i]

        #   // Compute outliers. If no whiskers are specified, all data are "outliers".
        #   // We compute the outliers as indices, so that we can join across transitions!
        outlierIndices =
            if whiskerIndices
                topRange = d3.range(whiskerIndices[1] + 1, n)
                bottomRange = d3.range(0, whiskerIndices[0])
                bottomRange.concat(topRange)
            else
                d3.range(n);


        #   // Retrieve the old x-scale, if this is an update.
        #   var x0 = this.__chart__ || d3.scale.linear()
        #       .domain([0, Infinity])
        #       .range(x1.range());
          #
        #   // Stash the new scale.
        #   this.__chart__ = x1;
