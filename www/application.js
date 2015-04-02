(function() {
  angular.module('graphing.animation', ['graphing.animation.style']);

}).call(this);

(function(){
angular.module('graphing', [
  'graphing.svg',
  'graphing.scales',
  'graphing.animation',
  //'graphing.charts....', // Include individually.
]);

}).call(this);

(function(){
/* global d3: true */
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
        var bounds = e.getBoundingClientRect();
        var height = (
            bounds.height || e.offsetHeight || e.clientHeight || e.scrollHeight
        ) - margins.leftRight;
        var width = (
            bounds.width || e.offsetWidth || e.clientWidth || e.scrollWidth
        ) - margins.topBottom;

        // Reset the scales
        var $scales = function $scale(array){
            return [
                $scales.x(array[0]),
                $scales.y(array[1])
            ];
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

}).call(this);

(function(){
/* global d3: true */
angular.module('graphing.svg.d3', [

]).run(function($rootScope){
    var _d3_dispatch = d3.dispatch;
    d3.dispatch = function(){
        var dispatch = _d3_dispatch.apply(this, arguments);
        [].forEach.call(arguments, function(event){
            var event_fn = dispatch[event];
            dispatch[event] = function(){
                event_fn.apply(this, arguments);
                if(!$rootScope.$$phase) {
                    $rootScope.$digest();
                    // TODO also consider limiting to once per animation frame.
                }
                return dispatch;
            };
        });
        return dispatch;
    };
});

}).call(this);

(function(){
angular.module('graphing.svg', [
    'graphing.svg.d3',

    'graphing.svg.at',
    'graphing.svg.center',
    'graphing.svg.from',
    'graphing.svg.path',
    'graphing.svg.to',

    'graphing.svg.drawPath',
    'graphing.svg.graphTick',
    'graphing.svg.radius',
    'graphing.svg.rescale',
    'graphing.svg.scatterPoint',
    'graphing.svg.svg',

    'graphing.svg.vector',
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

    /*
        A service to dynamically create and manage styles, especially for
        js-controlled animations.
     */
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
  var AxisCtrl;

  AxisCtrl = (function() {
    function AxisCtrl() {
      AxisCtrl.prototype.calcTicks.apply(this);
      AxisCtrl.prototype.formats.apply(this);
    }

    AxisCtrl.prototype.calcTicks = function() {
      var i, range, tickCount, xStep, yStep;
      this.$ticks = {
        x: [],
        y: []
      };
      range = this.$chartOptions.range;
      tickCount = this.$chartOptions.axis.tickCount || 10;
      xStep = (range.x.max - range.x.min) / tickCount;
      yStep = (range.y.max - range.y.min) / tickCount;
      i = 10;
      while (i >= 0) {
        this.$ticks.x.push((xStep * i) + range.x.min);
        this.$ticks.y.push((yStep * i) + range.y.min);
        i--;
      }
      return this;
    };

    AxisCtrl.prototype.formats = function() {
      var _base, _base1, _ref;
      this.$format = ((_ref = this.$chartOptions.axis) != null ? _ref.format : void 0) || {};
      (_base = this.$format).x || (_base.x = ['number', 2]);
      (_base1 = this.$format).y || (_base1.y = ['number', 2]);
      this.$format.x = {
        type: this.$format.x[0],
        args: this.$format.x.slice(1)
      };
      this.$format.y = {
        type: this.$format.y[0],
        args: this.$format.y.slice(1)
      };
      return this;
    };

    return AxisCtrl;

  })();

  angular.module('graphing.charts.axis', ['charts.axis.template']).filter('chooseFilter', function($filter) {
    return function(value, filter, args) {
      if (args == null) {
        args = [];
      }
      return $filter(filter).apply(null, [value].concat(args));
    };
  }).controller('AxisCtrl', AxisCtrl).directive('axis', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'charts/axis',
      templateNamespace: 'svg',
      controller: function($scope) {
        return AxisCtrl.apply($scope);
      }
    };
  });

}).call(this);

(function() {
  angular.module('graphing.charts.bar', ['graphing.svg', 'graphing.scales', 'graphing.charts.base', 'graphing.charts.axis', 'charts.bar.template']).directive('barChart', function($compile) {
    return {
      restrict: 'AE',
      scope: {
        chartData: '=',
        chartOptions: '='
      },
      templateUrl: 'charts/bar',
      priority: 500,
      replace: true,
      transclude: true,
      link: function($scope) {
        return $scope.barWidth = Math.max(4, Math.min(760 / $scope.chartData.length));
      }
    };
  });

}).call(this);

(function() {
  var BaseChart;

  BaseChart = (function() {
    function BaseChart($scope) {
      this.$scope = $scope;
      this.setOptions();
    }

    BaseChart.prototype.setOptions = function() {
      this.$scope.$chartOptions = {
        x: angular.isString(this.$scope.chartOptions.x) ? (function(_this) {
          return function(_) {
            return _[_this.$scope.chartOptions.x];
          };
        })(this) : angular.isFunction(this.$scope.chartOptions.x) ? this.$scope.chartOptions.x : function(_, i) {
          return _;
        },
        y: angular.isString(this.$scope.chartOptions.y) ? (function(_this) {
          return function(_) {
            return _[_this.$scope.chartOptions.y];
          };
        })(this) : angular.isFunction(this.$scope.chartOptions.y) ? this.$scope.chartOptions.y : function(_, i) {
          return i;
        },
        range: this.$scope.chartOptions.range || {},
        axis: this.$scope.chartOptions.axis || {}
      };
      this.calculateRanges();
      this.setScales();
      return this.calculateMargins();
    };

    BaseChart.prototype.calculateRanges = function() {
      var opts, _base, _base1, _base2, _base3, _base4, _base5;
      this.$scope.$chartData = {
        $x: this.$scope.chartData.map((function(_this) {
          return function(_, i) {
            return _this.$scope.$chartOptions.x(_, i);
          };
        })(this)),
        $y: this.$scope.chartData.map((function(_this) {
          return function(_, i) {
            return _this.$scope.$chartOptions.y(_, i);
          };
        })(this))
      };
      this.$scope.$chartData.$x.$min = Math.min.apply(Math, this.$scope.$chartData.$x);
      this.$scope.$chartData.$x.$max = Math.max.apply(Math, this.$scope.$chartData.$x);
      this.$scope.$chartData.$y.$min = Math.min.apply(Math, this.$scope.$chartData.$y);
      this.$scope.$chartData.$y.$max = Math.max.apply(Math, this.$scope.$chartData.$y);
      this.$scope.$chartOptions.range = {
        x: this.$scope.$chartOptions.range.x || {},
        y: this.$scope.$chartOptions.range.y || {}
      };
      (_base = this.$scope.$chartOptions.range.x).min || (_base.min = this.$scope.$chartData.$x.$min);
      (_base1 = this.$scope.$chartOptions.range.x).max || (_base1.max = this.$scope.$chartData.$x.$max);
      opts = this.$scope.$chartOptions;
      if (opts.domain) {
        (_base2 = this.$scope.$chartOptions.range.y).min || (_base2.min = opts.domain[0]);
        return (_base3 = this.$scope.$chartOptions.range.y).max || (_base3.max = opts.domain[1]);
      } else {
        (_base4 = this.$scope.$chartOptions.range.y).min || (_base4.min = this.$scope.$chartData.$y.$min);
        return (_base5 = this.$scope.$chartOptions.range.y).max || (_base5.max = this.$scope.$chartData.$y.$max);
      }
    };

    BaseChart.prototype.setScales = function() {
      var _base, _base1;
      this.$scope.$chartOptions.scale = this.$scope.chartOptions.scale || {};
      (_base = this.$scope.$chartOptions.scale).x || (_base.x = 'linear');
      return (_base1 = this.$scope.$chartOptions.scale).y || (_base1.y = 'linear');
    };

    BaseChart.prototype.calculateMargins = function() {
      var _base, _base1, _base2, _base3;
      this.$scope.$chartOptions.margins = this.$scope.chartOptions.margins || {};
      (_base = this.$scope.$chartOptions.margins).top || (_base.top = 10);
      (_base1 = this.$scope.$chartOptions.margins).bottom || (_base1.bottom = 30);
      (_base2 = this.$scope.$chartOptions.margins).left || (_base2.left = 50);
      return (_base3 = this.$scope.$chartOptions.margins).right || (_base3.right = 10);
    };

    return BaseChart;

  })();

  BaseChart.$inject = ['$scope'];

  angular.module('graphing.charts.base', ['graphing.svg.tooltip']).controller('BaseChart', BaseChart).directive('baseChart', function($compile) {
    return {
      priority: 10000,
      controller: 'BaseChart'
    };
  });

}).call(this);

(function() {
  angular.module('graphing.charts.boxplot', ['graphing.svg', 'graphing.scales', 'graphing.charts.base', 'charts.boxplot.template']).directive('boxplot', function($compile, ScaleSvc) {
    return {
      restrict: 'AE',
      scope: {
        chartData: '=',
        chartOptions: '='
      },
      templateUrl: 'charts/boxplot',
      priority: 500,
      transclude: true,
      link: function($scope, $element) {
        var Quartiles, bottomRange, d, max, min, n, outlierIndices, topRange, whiskerIndices, _base;
        $scope.width = 20;
        $scope.height = 100;
        d = $scope.d = $scope.chartData.map(Number).sort(d3.ascending);
        n = $scope.n = d.length;
        min = $scope.min = d[0];
        max = $scope.max = d[n - 1];
        Quartiles = function(d) {
          return [d3.quantile(d, .25), d3.quantile(d, .5), d3.quantile(d, .75)];
        };
        $scope.quartiles = d.quartiles = Quartiles(d);
        (_base = $scope.chartOptions).whiskers || (_base.whiskers = function(d) {
          return [0, d.length - 1];
        });
        whiskerIndices = $scope.chartOptions.whiskers.call(this, d);
        $scope.whiskers = whiskerIndices && whiskerIndices.map(function(i) {
          return d[i];
        });
        return outlierIndices = whiskerIndices ? (topRange = d3.range(whiskerIndices[1] + 1, n), bottomRange = d3.range(0, whiskerIndices[0]), bottomRange.concat(topRange)) : d3.range(n);
      }
    };
  });

}).call(this);

(function() {
  angular.module('graphing.charts.line', ['graphing.scales', 'graphing.charts.base', 'graphing.charts.axis', 'charts.line.template']).directive('lineChart', function($animate) {
    return {
      restrict: 'AE',
      scope: {
        chartData: '=',
        chartOptions: '='
      },
      require: 'baseChart',
      templateUrl: 'charts/line'
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
/* global d3: true */

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

        return d3.svg.line().interpolate('monotone')(points);
    };
})
.filter('path', function(){
    return function Path(data, interp, xscale, yscale){
        var points = data.map(function(d, i){
            return [xscale(interp.x(d, i)), yscale(interp.y(d, i))];
        });

        return d3.svg.line().interpolate('monotone')(points);
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
  angular.module('graphing.svg.vector', ['svg.elements.vector.vector-template.template']).directive('vector', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'svg/elements/vector/vector-template',
      scope: {
        start: '@',
        end: '@',
        color: '@'
      }
    };
  });

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

(function() {
  angular.module('graphing.svg.tooltip', ['svg.utilities.graphTooltip.template']).value('DefaultTooltipTemplate', "<div>{{ tooltipData.text }}</div>").service('TooltipTemplateService', function($compile, DefaultTooltipTemplate) {
    var get, raw, render, set, tooltipTemplate, _tooltipTemplate;
    tooltipTemplate = null;
    _tooltipTemplate = null;
    set = function(template) {
      _tooltipTemplate = template;
      return tooltipTemplate = $compile(template);
    };
    get = function() {
      return tooltipTemplate;
    };
    raw = function() {
      return _tooltipTemplate;
    };
    render = function($scope, fn) {
      if (fn == null) {
        fn = angular.noop;
      }
      return get()($scope, fn);
    };
    set(DefaultTooltipTemplate);
    return {
      get: get,
      set: set,
      render: render,
      raw: raw
    };
  }).directive('chartTooltipTemplate', function(TooltipTemplateService) {
    return {
      restrict: 'EA',
      compile: function(tElement) {
        TooltipTemplateService.set(tElement.children());
        return tElement.addClass('ng-hide');
      }
    };
  }).directive('graphTooltip', function($templateCache, $compile, TooltipTemplateService) {
    return {
      restrict: 'A',
      compile: function(tElement, tAttrs, tTransclude) {
        var hideTooltip, showTooltipAt, tooltip, tooltipData, tooltipOffset, tooltipStyle;
        tooltipOffset = 0;
        tooltip = null;
        tooltipData = {
          show: false,
          position: [-50, -50],
          text: "Tooltip!"
        };
        tooltipStyle = null;
        showTooltipAt = function($scope, at, text) {
          if (text == null) {
            text = tooltipData.text;
          }
          $scope.tooltipData.show = true;
          $scope.tooltipData.text = text;
          $scope.tooltipData.position = at;
          return tooltip.empty().append(TooltipTemplateService.render($scope));
        };
        hideTooltip = function($scope) {
          return $scope.tooltipData.show = false;
        };
        return {
          pre: function($scope, iElement, iAttrs) {
            var lastSvg, parent, tooltipExp, tooltipTemplate;
            $scope.tooltipData = tooltipData;
            if (!tooltip) {
              parent = iElement;
              lastSvg = null;
              while ((parent = parent.parent()).length) {
                if (parent[0].tagName === 'svg') {
                  lastSvg = parent;
                }
              }
              tooltipTemplate = $templateCache.get('svg/graphTooltip');
              tooltipExp = $compile(tooltipTemplate);
              tooltip = tooltipExp($scope);
              return lastSvg.parent().append(tooltip);
            }
          },
          post: function($scope, iElement, iAttrs) {
            iElement.bind('mouseover', function(event) {
              return $scope.$apply(function() {
                var bounds, position;
                bounds = event.toElement.getBoundingClientRect();
                position = [event.x, event.y - 73];
                return showTooltipAt($scope, position, iAttrs.graphTooltip);
              });
            });
            return iElement.bind('mouseout', function() {
              return $scope.$apply(function() {
                return hideTooltip($scope);
              });
            });
          }
        };
      }
    };
  });

}).call(this);

(function(){
angular.module('graphing.svg.rescale', [

]).directive('svgRescale', function($rootScope){
    return {
        restrict: 'A',
        priority: 450,
        link: function($scope, $element, $attrs){
            var run = function run(){
                $scope.$eval($attrs.svgRescale);
            };
            run();
            $rootScope.$on('Window Resized', run);
        }
    };
});

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
        compile: function(){
            return {
                pre: function($scope, $element){
                    var e = $element[0];
                    var set = function set(){
                        $scope.$width = e.offsetWidth || e.clientWidth;
                        $scope.$height = e.offsetHeight || e.clientHeight;
                    };
                    set();
                    $rootScope.$on('Window Resized', set);
                }
            };
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
