(function(){
window.EPSILON = 1e-6;

}).call(this);

(function() {
  angular.module('graphing.demos', ['ionic', 'graphing.demos.trig', 'graphing.demos.bar', 'demos.template']).config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('demo', {
      abstract: true,
      url: '/demo',
      views: {
        "demo-tabs": {
          templateUrl: 'demos',
          controller: function($scope) {
            return $scope.demos = ['trig', 'bar'];
          }
        }
      }
    });
    return $urlRouterProvider.otherwise("/demo/trig");
  }).value('SalesData', [1.46220, 1.47004, 1.49253, 1.49118, 1.49722, 1.50138, 1.50008, 1.51493, 1.50781, 1.50899, 1.53037, 1.58137, 1.54299, 1.53307, 1.55845, 1.56213, 1.54488, 1.56927, 1.55305, 1.55710, 1.56235, 1.58847, 1.59309, 1.58303, 1.59470]);

}).call(this);

(function(){
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
                        var margins = ($scope.$chartOptions || {}).margins || {
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

}).call(this);

(function(){
angular.module('graphing.svg', [
    'graphing.svg.at',
    'graphing.svg.center',
    'graphing.svg.drawPath',
    'graphing.svg.from',
    'graphing.svg.graphTick',
    'graphing.svg.path',
    'graphing.svg.radius',
    'graphing.svg.scatterPoint',
    'graphing.svg.svg',
    'graphing.svg.to'
]);

}).call(this);

(function() {
  var groupByFilter;

  groupByFilter = function(array, groupKey, arrayKey, groupBase) {
    var a, grouped, k, reduction, _results;
    if (!(angular.isArray(array) && array.length > 0)) {
      return array;
    }
    if (!((arrayKey != null) && angular.isString(arrayKey))) {
      arrayKey = 'grouped';
    }
    if (!((groupBase != null) && angular.isFunction(groupBase))) {
      groupBase = function(val) {
        var base;
        return base = {};
      };
    }
    reduction = function(group, val) {
      var groupping;
      groupping = val[groupKey];
      if (!group[groupping]) {
        group[groupping] = groupBase(val);
        group[groupping][arrayKey] = [];
      }
      group[groupping][arrayKey].push(val);
      return group;
    };
    grouped = array.reduce(reduction, {});
    _results = [];
    for (k in grouped) {
      a = grouped[k];
      _results.push(a);
    }
    return _results;
  };

  angular.module('dolores.tools.groupBy.filter', []).filter('groupBy', function() {
    return groupByFilter;
  });

}).call(this);

(function() {
  angular.module('graphing.animation.style', []).service('StyleManager', function($document) {
    var addRules, makeClassName, makeRule, nextUid, pathStyles, uid;
    pathStyles = $document[0].createElement("style");
    pathStyles.type = "text/css";
    pathStyles.id = "graphing_drawPath_styles";
    $document.find("head").append(pathStyles);
    uid = 0;
    nextUid = function() {
      return ++uid;
    };
    makeRule = function(_arg) {
      var definition, selector;
      selector = _arg.selector, definition = _arg.definition;
      return "" + selector + " {\n" + definition + "\n}\n";
    };
    makeClassName = function(name) {
      return "" + name + "-" + (nextUid());
    };
    addRules = function(ruleList) {
      return pathStyles.innerHTML += ruleList.map(makeRule).join('');
    };
    return {
      makeClassName: makeClassName,
      addRules: addRules
    };
  });

}).call(this);

(function() {
  angular.module('dolores.tools.localStorage.service', []).service('$localStorage', function($window) {
    var storage;
    storage = $window.localStorage || {};
    return {
      get: function(key) {
        if (!angular.isString(key)) {
          throw new Error('Need string key.');
        }
        return JSON.parse(storage[key]);
      },
      set: function(key, val) {
        if (!angular.isString(key)) {
          throw new Error('Need string key.');
        }
        return storage[key] = JSON.stringify(val);
      },
      has: function(key) {
        if (!angular.isString(key)) {
          throw new Error('Need string key.');
        }
        return storage[key] != null;
      }
    };
  });

}).call(this);

(function() {
  angular.module('graphing.charts.axis', ['charts.axis.template']).directive('axis', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'charts/axis',
      controller: function($scope) {
        var i, range, xStep, yStep, _results;
        $scope.$ticks = {
          x: [],
          y: []
        };
        range = $scope.$chartOptions.range;
        xStep = (range.x.max - range.x.min) / 10;
        yStep = (range.y.max - range.y.min) / 10;
        i = 10;
        _results = [];
        while (i >= 0) {
          $scope.$ticks.x.push((xStep * i) + range.x.min);
          $scope.$ticks.y.push((yStep * i) + range.y.min);
          _results.push(i--);
        }
        return _results;
      }
    };
  });

}).call(this);

(function() {
  angular.module('graphing.charts.bar', ['graphing.scales', 'graphing.charts.axis', 'charts.bar.template']).directive('barChart', function($animate) {
    return {
      restrict: 'AE',
      templateUrl: 'charts/bar',
      scope: {
        chartData: '=',
        chartOptions: '='
      },
      controller: function($scope) {
        var _base, _base1, _base2, _base3, _base4, _base5, _base6, _base7, _base8;
        $scope.$chartOptions = {
          x: angular.isString($scope.chartOptions.x) ? function(_) {
            return _[$scope.chartOptions.x];
          } : angular.isFunction($scope.chartOptions.x) ? $scope.chartOptions.x : void 0,
          y: angular.isString($scope.chartOptions.y) ? function(_) {
            return _[$scope.chartOptions.y];
          } : angular.isFunction($scope.chartOptions.y) ? $scope.chartOptions.y : void 0,
          range: $scope.chartOptions.range || {}
        };
        $scope.$chartData = {
          $x: $scope.chartData.map(function(_, i) {
            return $scope.$chartOptions.x(_, i);
          }),
          $y: $scope.chartData.map(function(_, i) {
            return $scope.$chartOptions.y(_, i);
          })
        };
        $scope.$chartData.$x.$min = Math.min.apply(Math, $scope.$chartData.$x);
        $scope.$chartData.$x.$max = Math.max.apply(Math, $scope.$chartData.$x);
        $scope.$chartData.$y.$min = Math.min.apply(Math, $scope.$chartData.$y);
        $scope.$chartData.$y.$max = Math.max.apply(Math, $scope.$chartData.$y);
        $scope.$chartOptions.range = {
          x: $scope.$chartOptions.range.x || {},
          y: $scope.$chartOptions.range.y || {}
        };
        (_base = $scope.$chartOptions.range.x).min || (_base.min = $scope.$chartData.$x.$min);
        (_base1 = $scope.$chartOptions.range.x).max || (_base1.max = $scope.$chartData.$x.$max);
        (_base2 = $scope.$chartOptions.range.y).min || (_base2.min = $scope.$chartData.$y.$min);
        (_base3 = $scope.$chartOptions.range.y).max || (_base3.max = $scope.$chartData.$y.$max);
        (_base4 = $scope.$chartOptions).margins || (_base4.margins = {});
        (_base5 = $scope.$chartOptions.margins).top || (_base5.top = 10);
        (_base6 = $scope.$chartOptions.margins).bottom || (_base6.bottom = 30);
        (_base7 = $scope.$chartOptions.margins).left || (_base7.left = 50);
        return (_base8 = $scope.$chartOptions.margins).right || (_base8.right = 10);
      }
    };
  });

}).call(this);

(function() {
  angular.module('graphing.demos.bar', ['graphing.svg', 'graphing.charts.bar', 'demos.bar.template']).config(function($stateProvider) {
    return $stateProvider.state('demo.bar', {
      url: '/bar',
      views: {
        'demo-bar': {
          template: '<bar-demo />'
        }
      }
    });
  }).directive('barDemo', function() {
    return {
      restrict: 'E',
      templateUrl: 'demos/bar',
      controller: function($scope, SalesData) {
        return $scope.demoData = SalesData.map(function(_, i) {
          return {
            year: i + 1980,
            sales: _
          };
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module('graphing.demos.trig', ['graphing.scales', 'demos.trig.template']).config(function($stateProvider) {
    return $stateProvider.state('demo.trig', {
      url: '/trig',
      views: {
        'demo-trig': {
          template: '<trig-demo />'
        }
      }
    });
  }).directive('trigDemo', function() {
    return {
      restrict: 'E',
      templateUrl: 'demos/trig'
    };
  }).controller('TrigCtrl', function($scope) {
    var i;
    $scope.data = [];
    i = 0;
    while (i < 84) {
      $scope.data.push(i * 10 / 84);
      i++;
    }
    $scope.sine = {
      x: function(d, i) {
        return d;
      },
      y: function(d, i) {
        return Math.sin(d - $scope.time);
      }
    };
    $scope.cosine = {
      x: function(d, i) {
        return d;
      },
      y: function(d, i) {
        return Math.cos(d - $scope.time);
      }
    };
    return $scope.tangent = {
      x: function(d, i) {
        return d;
      },
      y: function(d, i) {
        return Math.tan(d - $scope.time);
      }
    };
  });

}).call(this);

(function(){
angular.module('graphing.svg.at', [

])
/**
 * @ngdoc directive
 * @name at
 * @restrict A
 *
 * @description Attach the `x` and `y` attributes to a `text` element. The
 * attribute will be parsed and should be evaluated to a two-element array, with
 * `x` at index `0` and `y` at index `1`.
 */
.directive('at', function($parse){
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs){
            var element = $element[0];
            var $exp = $parse($attrs.at);
            $scope.$watchCollection(
                function(){
                    return $exp($scope);
                }, function setFrom(value){
                    if(value[0]){element.setAttribute('x', value[0]);}
                    if(value[1]){element.setAttribute('y', value[1]);}
                }
            );
        }
    };
})
;

}).call(this);

(function(){
angular.module('graphing.svg.center', [

])
/**
 * @ngdoc directive
 * @name center
 * @restrict A
 *
 * @description Attach the `x1` and `y1` attributes to a `text` element. The
 * attribute will be parsed and should be evaluated to a two-element array, with
 * `x1` at index `0` and `y1` at index `1`.
 */
.directive('center', function($parse){
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs){
            var element = $element[0];
            var $exp = $parse($attrs.center);
            $scope.$watchCollection(
                function(){
                    return $exp($scope);
                }, function setFrom(value){
                    if(value[0]){element.setAttribute('cx', value[0]);}
                    if(value[1]){element.setAttribute('cy', value[1]);}
                }
            );
        }
    };
})
;

}).call(this);

(function(){
angular.module('graphing.svg.drawPath', [
    'ngAnimate',
    'graphing.animation.style'
])
.directive('drawPath', function($animate, $parse, $timeout, StyleManager){
    var addDrawPathClass = function addDrawPathClass(length){
        var skip = 2 * length;
        var time = length / 1000;
        var className = StyleManager.makeClassName('drawPath');

        var drawPath = {
            selector: '.' + className,
            definition:
                'stroke-dasharray: ' + length + ', ' + skip + ';' +
                'transition: ' + time + 's ease-out stroke-dasharray;'
        };

        var active = {
            selector: '.' + className + '-add-active',
            definition: 'stroke-dasharray: 0, ' + skip + ';'
        };

        StyleManager.addRules([drawPath, active]);

        return className;
    };

    return {
        restrict: 'A',
        link: function drawPathPostLink($scope, $element, $attrs){
            var lastAnimation = null;
            var element = $element[0];
            var $exp = $parse($attrs.drawPath);

            $scope.$watch(
                function(){
                    return $exp($scope);
                }, function setFrom(value){
                    if(value){
                        if(lastAnimation){
                            $animate.cancel(lastAnimation);
                        }
                        element.setAttribute('d', value);

                        // Find length of the path
                        var length = element.getTotalLength();

                        var className = addDrawPathClass(length);

                        // $timeout(function(){
                        lastAnimation = $animate.addClass(
                            $element,
                            className,
                            function(){
                                // removeDrawPath(className);
                            }
                        );
                        // });
                    }
                }
            );
        }
    };
})
;

}).call(this);

(function(){
angular.module('graphing.svg.from', [

])
/**
 * @ngdoc directive
 * @name from
 * @restrict A
 *
 * @description Attach the `x1` and `y1` attributes to a `text` element. The
 * attribute will be parsed and should be evaluated to a two-element array, with
 * `x1` at index `0` and `y1` at index `1`.
 */
.directive('from', function($parse){
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs){
            var element = $element[0];
            var $exp = $parse($attrs.from);
            $scope.$watchCollection(
                function(){
                    return $exp($scope);
                }, function setFrom(value){
                    if(value[0]){element.setAttribute('x1', value[0]);}
                    if(value[1]){element.setAttribute('y1', value[1]);}
                }
            );
        }
    };
})
;

}).call(this);

(function(){
angular.module('graphing.svg.graphTick', [

])
.directive('graphTick', function($parse, $window){
    return {
        priority: -1000,
        link: function($scope, $element, $attrs){
            var frame = $window.requestAnimationFrame =
                $window.requestAnimationFrame ||
                $window.mozRequestAnimationFrame ||
                $window.webkitRequestAnimationFrame ||
                $window.oRequestAnimationFrame
            ;

            var step = function step(){
                $scope.$apply(function(){
                    $scope.$eval($attrs.graphTick);
                });
                frame(step);
            };
            frame(step);
        }
    };
})
;

}).call(this);

(function(){
/* global d3_svg_lineHermite: true */
/* global d3_svg_lineMonotoneTangents: true */

angular.module('graphing.svg.path', [

])
.filter('pathFn', function(){
    return function PathFn(valfunc, tmin, tmax, tstep, tscale, xscale, yscale){
        function getVal(t){
            t = tscale(t);
            var val = valfunc(t), x, y;
            if(val.length){
                y = val[1];
                x = val[0];
            } else {
                y = val;
                x = t;
            }
            return [xscale(x), yscale(y)];
        }
        var points = [];

        while(tmin <= tmax) {
            points.push(getVal(tmin));
            tmin += tstep;
        }

        var p0 = points[0];
        var m = '' + p0[0] + ',' + p0[1];

        var path = 'M' + m + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
        return path;
    };
})
.filter('path', function(){
    return function Path(data, interp, xscale, yscale){
        var points = data.map(function(d, i){
            return [xscale(interp.x(d, i)), yscale(interp.y(d, i))];
        });
        var p0 = points[0];
        var m = '' + p0[0] + ',' + p0[1];

        var path = 'M' + m + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
        return path;
    };
})
;

}).call(this);

(function(){
angular.module('graphing.svg.radius', [

])
/**
 * @ngdoc directive
 * @name radius
 * @restrict A
 *
 * @description Attach the `r` attribute to a `circle` element. The
 * attribute will be parsed and should be evaluated to a float value.
 */
.directive('radius', function($parse){
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs){
            var element = $element[0];
            var $exp = $parse($attrs.radius);
            $scope.$watchCollection(
                function(){
                    return $exp($scope);
                }, function setFrom(value){
                    if(value){element.setAttribute('r', value);}
                }
            );
        }
    };
})
;

}).call(this);

(function(){
function ScatterPointDirective(
    $parse, $animate, $timeout, StyleManager
){
    var scatterPointDestination = function scatterPointDestination(x, y){
        var time = 2 + ((x + y) / 1000);
        var className = StyleManager.makeClassName('scatterPoint');
        var scatterPoint = {
            selector: '.' + className,
            definition:
                'transform: translate(' + x + 'px, ' + y +'px);\n' +
                'transition: ' + time + 's ease-out transform;'
        };

        var active = {
            selector: '.' + className + '.ng-enter-active',
            definition: 'transform: translate(' + x + 'px, 0);'
        };

        StyleManager.addRules([scatterPoint, active]);

        return className;
    };

    return {
        restrict: 'A',
        link: function scatterPointPostLink($scope, $element, $attrs){
            var lastAnimation = null;
            var $exp = $parse($attrs.scatterPoint);

            $scope.$watchCollection(
                function(){
                    return $exp($scope);
                }, function setFrom(value){
                    if(value){
                        if(lastAnimation){
                            $animate.cancel(lastAnimation);
                        }
                        var x = value[0], y = value[1];

                        var className = scatterPointDestination(x, y);

                        $timeout(function(){
                            lastAnimation = $animate.addClass(
                                $element,
                                className,
                                function(){
                                    // removeDrawPath(className);
                                }
                            );
                        });
                    }
                }
            );
        }
    };
}

ScatterPointDirective.$inject = [
    '$parse', '$animate', '$timeout', 'StyleManager'
];

angular.module('graphing.svg.scatterPoint', [
    'ngAnimate',
    'graphing.animation.style'
]).directive('scatterPoint', ScatterPointDirective);

}).call(this);

(function(){
angular.module('graphing.svg.svg', [

])
.directive('svg', function($rootScope){
    return {
        priority: 650,
        restrict: 'E',
        link: function($scope, $element){
            var e = $element[0];
            var set = function set(){
                $scope.$width = e.offsetWidth || e.clientWidth;
                $scope.$height = e.offsetHeight || e.clientHeight;
            };
            set();
            $rootScope.$on('Window Resized', set);
        }
    };
})
;

}).call(this);

(function(){
angular.module('graphing.svg.to', [

])
/**
 * @ngdoc directive
 * @name to
 * @restrict A
 *
 * @description Attach the `x2` and `y2` attributes to a `line` element. The
 * attribute will be parsed and should be evaluated to a two-element array, with
 * `x2` at index `0` and `y2` at index `1`.
 */
.directive('to', function($parse){
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs){
            var element = $element[0];
            var $exp = $parse($attrs.to);
            $scope.$watchCollection(
                function(){
                    return $exp($scope);
                }, function setFrom(value){
                    if(value[0]){element.setAttribute('x2', value[0]);}
                    if(value[1]){element.setAttribute('y2', value[1]);}
                }
            );
        }
    };
})
;

}).call(this);

(function() {
  angular.module('dolores.energize', ['ngAnimate']).directive('animateOnChange', function($animate) {
    return function($scope, elem, attrs) {
      var klass;
      klass = attrs.animateOnChangeClass;
      return $scope.$watch(attrs.animateOnChange, function(nv) {
        return $animate.addClass(elem, klass, function() {
          return $animate.removeClass(elem, klass);
        });
      });
    };
  });

}).call(this);

(function(){
Math.sign = function sign(x) {
    x = +x; // convert to a number
    if (x === 0 || isNaN(x))
        return x;
    return x > 0 ? 1 : -1;
};

}).call(this);

(function(){
// Generates tangents for a cardinal spline.
window.d3_svg_lineCardinalTangents = function d3_svg_lineCardinalTangents(points, tension) {
    var tangents = [],
        a = (1 - tension) / 2,
        p0,
        p1 = points[0],
        p2 = points[1],
        i = 1,
        n = points.length;
    while (++i < n) {
        p0 = p1;
        p1 = p2;
        p2 = points[i];
        tangents.push([a * (p2[0] - p0[0]), a * (p2[1] - p0[1])]);
    }
    return tangents;
};

}).call(this);

(function(){
// Compute three-point differences for the given points.
// http://en.wikipedia.org/wiki/Cubic_Hermite_spline#Finite_difference
/* global d3_svg_lineSlope: true */
window.d3_svg_lineFiniteDifferences = function d3_svg_lineFiniteDifferences(points) {
    var i = 0,
        j = points.length - 1,
        m = [],
        p0 = points[0],
        p1 = points[1],
        d = m[0] = d3_svg_lineSlope(p0, p1);
    while (++i < j) {
        m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
    }
    m[i] = d;
    return m;
};

}).call(this);

(function(){
// Hermite spline construction; generates 'C' commands.
window.d3_svg_lineHermite = function d3_svg_lineHermite(points, tangents) {
    var quad = points.length !== tangents.length,
        path = '',
        p0 = points[0],
        p = points[1],
        t0 = tangents[0],
        t = t0,
        pi = 1;

    if (quad) {
        path += 'Q' + (p[0] - t0[0] * 2 / 3) + ',' + (p[1] - t0[1] * 2 / 3) + ',' + p[0] + ',' + p[1];
        p0 = points[1];
        pi = 2;
    }
    if (tangents.length > 1) {
        t = tangents[1];
        p = points[pi];
        pi++;
        path += 'C' + (p0[0] + t0[0]) + ',' + (p0[1] + t0[1]) + ',' + (p[0] - t[0]) + ',' + (p[1] - t[1]) + ',' + p[0] + ',' + p[1];
        for (var i = 2; i < tangents.length; i++, pi++) {
            p = points[pi];
            t = tangents[i];
            path += 'S' + (p[0] - t[0]) + ',' + (p[1] - t[1]) + ',' + p[0] + ',' + p[1];
        }
    }
    if (quad) {
        var lp = points[pi];
        path += 'Q' + (p[0] + t[0] * 2 / 3) + ',' + (p[1] + t[1] * 2 / 3) + ',' + lp[0] + ',' + lp[1];
    }

    return path;
};

}).call(this);

(function(){
// Interpolates the given points using Fritsch-Carlson Monotone cubic Hermite
// interpolation. Returns an array of tangent vectors. For details, see
// http://en.wikipedia.org/wiki/Monotone_cubic_interpolation
/* global d3_svg_lineSlope: true */
/* global d3_svg_lineFiniteDifferences: true */
window.d3_svg_lineMonotoneTangents = function d3_svg_lineMonotoneTangents(points) {
    var tangents = [],
        d,
        a,
        b,
        s,
        m = d3_svg_lineFiniteDifferences(points),
        i = -1,
        j = points.length - 1;
    // The first two steps are done by computing finite-differences:
    // 1. Compute the slopes of the secant lines between successive points.
    // 2. Initialize the tangents at every point as the average of the secants.
    // Then, for each segment…
    while (++i < j) {
        d = d3_svg_lineSlope(points[i], points[i + 1]);
        // 3. If two successive yk = y{k + 1} are equal (i.e., d is zero), then set
        // mk = m{k + 1} = 0 as the spline connecting these points must be flat to
        // preserve monotonicity. Ignore step 4 and 5 for those k.
        if (Math.abs(d) < EPSILON) {
            m[i] = m[i + 1] = 0;
        } else {
            // 4. Let ak = mk / dk and bk = m{k + 1} / dk.
            a = m[i] / d;
            b = m[i + 1] / d;
            // 5. Prevent overshoot and ensure monotonicity by restricting the
            // magnitude of vector <ak, bk> to a circle of radius 3.
            s = a * a + b * b;
            if (s > 9) {
                s = d * 3 / Math.sqrt(s);
                m[i] = s * a;
                m[i + 1] = s * b;
            }
        }
    }
    // Compute the normalized tangent vector from the slopes. Note that if x is
    // not monotonic, it's possible that the slope will be infinite, so we protect
    // against NaN by setting the coordinate to zero.
    i = -1;
    while (++i <= j) {
        s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
        tangents.push([s || 0, m[i] * s || 0]);
    }
    return tangents;
};

}).call(this);

(function(){
// Computes the slope from points p0 to p1.
window.d3_svg_lineSlope = function d3_svg_lineSlope(p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
};

}).call(this);
