var Scales = {
    linear: function(a, b, x, y){
        var brange = b - a;
        var yrange = y - x;
        return function Scale(z){
            var bottom = z - a;
            var scaling = bottom / brange;
            var expansion = scaling * yrange;
            var position = x + expansion;
            return position;
        };
    },
    log: function(a, b, x, y){
        function log10(z){
            return Math.log(z) / Math.LN10;
        }
        var linA = a === 0 ? 0 : log10(a);
        var linB = b === 0 ? 0 : log10(b);
        var linear = Scales.linear(linA, linB, x, y);
        return function Scale(z){
            return linear(log10(z));
        };
    },
    threshold: function(domain, range){
        var buckets = domain.length;
        return function FindThreshold(z){
            var i = -1, x = null;
            do {
                x = domain[++i];
            } while(i < buckets && x < z);
            return range[i];
        };
    }
};

angular.module('graphing.scales', [

])
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
.filter('scale', function(){
    return function Scale(value, scale){
        if(angular.isFunction(scale)){
            return scale(value);
        } else {
            return value;
        }
    };
})
.directive('graphScales', function($parse){
    return {
        priority: 400,
        compile: function(){
            return {
                pre: function($scope, $element, attrs){
                    var e = $element[0];
                    var $exp = $parse(attrs.graphScales);
                    var setScales = (function setScales(){
                        var margins = $scope.$chartOptions.margin || {
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
                        $scope.$scales = {};

                        // Evaluate the expression to get the scale params
                        var scales = $exp($scope);
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
                            $scope.$scales[name] = Scales[type](
                                scale[0], scale[1], minima, maxima
                            );
                        }
                        return arguments.callee;
                    }());
                    $scope.$on('Window Resized', setScales);
                }
            };
        }
    };
})
;
