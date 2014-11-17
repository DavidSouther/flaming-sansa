angular.module('graphing.scales', [])
.run(function($window, $rootScope){
    /* Do angular things when the window resizes. */
    $window.onresize = function(){
        $rootScope.$broadcast('Window Resized');
        $rootScope.$digest();
    };
})
.run(function($window, $rootScope){
    $rootScope.TWO_PI = 2 * Math.PI;
    $rootScope.Math = Math;
})
.service('ScaleSvc', function(){
    var getScales = function getScales(scales, $element, options){
        var e = $element[0];
        var margins = (options || {}).margins || {
            top: 10,
            right: 10,
            bottom: 30,
            left: 30
        };

        margins.leftRight = margins.left + margins.right;
        margins.topBottom = margins.top + margins.bottom;

        // Get the bounds of the parent element
        var height = (
            e.offsetHeight || e.clientHeight
        ) - margins.leftRight;
        var width = (
            e.offsetWidth || e.clientWidth
        ) - margins.topBottom;

        // Reset the scales
        var $scales = function $scale(array){
            return [
                $scales.x(array[0]),
                $scales.y(array[1])
            ]
        };

        // Evaluate the expression to get the scale params

        for (var name in scales) { // Iterate the object
            var scale = scales[name];
            // The scale object is an array
            var type = scale.shift();
            var maxima = 0, minima = 0;
            if (name === 'x' || name === 'y'){
                maxima = {
                    x: width,
                    y: height
                }[name] || scale[2] || ((width + height) / 2);
                minima = {
                    x: margins.left,
                    y: margins.top
                }[name];
            } else {
                minima = scale[2];
                maxima = scale[3];
            }
            $scales[name] = d3.scale[type]()
                .domain([scale[0], scale[1]])
                .range([minima, maxima])
                ;
        }

        return $scales;
    };

    return {getScales: getScales};
})
.filter('scale', function(){
    return function Scale(value, scale){
        if(angular.isFunction(scale)){
            return scale(value);
        } else {
            return value;
        }
    };
})
.directive('graphScales', function($parse, ScaleSvc){
    return {
        priority: 400,
        compile: function(){
            return {
                pre: function($scope, $element, attrs){
                    var $exp = $parse(attrs.graphScales);
                    var setScales = (function setScales(){
                        $scope.$scales = ScaleSvc.getScales(
                            $exp($scope),
                            $element,
                            $scope.$chartOptions
                        );
                        return arguments.callee;
                    }());
                    $scope.$on('Window Resized', setScales);
                }
            };
        }
    };
})
;
