(function(){
window.EPSILON = 1e-6;

}).call(this);

(function() {
  angular.module('graphing.demos', ['ionic', 'graphing.demos.trig', 'graphing.demos.line', 'graphing.demos.bar', 'demos.template']).config(function($stateProvider, $urlRouterProvider) {
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
  });

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
        var $scales = {};

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
            $scales[name] = Scales[type](
                scale[0], scale[1], minima, maxima
            );
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
      controller: function($scope) {
        return AxisCtrl.apply($scope);
      }
    };
  });

}).call(this);

(function() {
  angular.module('graphing.charts.bar', ['graphing.scales', 'graphing.charts.base', 'graphing.charts.axis', 'charts.bar.template']).directive('barChart', function($animate) {
    return {
      restrict: 'AE',
      scope: {
        chartData: '=',
        chartOptions: '='
      },
      templateUrl: 'charts/bar',
      require: 'baseChart',
      controller: function($scope, $timeout) {
        return $scope.barWidth = Math.max(4, Math.min(760 / $scope.chartData.length));
      }
    };
  });

}).call(this);

(function() {
  angular.module('graphing.charts.base', ['graphing.svg.tooltip']).directive('baseChart', function() {
    return {
      priority: 10000,
      controller: function($scope) {
        var _base, _base1, _base10, _base2, _base3, _base4, _base5, _base6, _base7, _base8, _base9;
        $scope.$chartOptions = {
          x: angular.isString($scope.chartOptions.x) ? function(_) {
            return _[$scope.chartOptions.x];
          } : angular.isFunction($scope.chartOptions.x) ? $scope.chartOptions.x : void 0,
          y: angular.isString($scope.chartOptions.y) ? function(_) {
            return _[$scope.chartOptions.y];
          } : angular.isFunction($scope.chartOptions.y) ? $scope.chartOptions.y : void 0,
          range: $scope.chartOptions.range || {},
          axis: $scope.chartOptions.axis || {}
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
        $scope.$chartOptions.scale = $scope.chartOptions.scale || {};
        (_base = $scope.$chartOptions.scale).x || (_base.x = 'linear');
        (_base1 = $scope.$chartOptions.scale).y || (_base1.y = 'linear');
        $scope.$chartOptions.range = {
          x: $scope.$chartOptions.range.x || {},
          y: $scope.$chartOptions.range.y || {}
        };
        (_base2 = $scope.$chartOptions.range.x).min || (_base2.min = $scope.$chartData.$x.$min);
        (_base3 = $scope.$chartOptions.range.x).max || (_base3.max = $scope.$chartData.$x.$max);
        (_base4 = $scope.$chartOptions.range.y).min || (_base4.min = $scope.$chartData.$y.$min);
        (_base5 = $scope.$chartOptions.range.y).max || (_base5.max = $scope.$chartData.$y.$max);
        (_base6 = $scope.$chartOptions).margins || (_base6.margins = {});
        (_base7 = $scope.$chartOptions.margins).top || (_base7.top = 10);
        (_base8 = $scope.$chartOptions.margins).bottom || (_base8.bottom = 30);
        (_base9 = $scope.$chartOptions.margins).left || (_base9.left = 50);
        return (_base10 = $scope.$chartOptions.margins).right || (_base10.right = 10);
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
      controller: function($scope, ChartData) {
        return $scope.demoData = ChartData.map(function(activity) {
          activity.timestamp = Date.parse(activity.timestamp);
          return activity;
        });
      }
    };
  }).value('ChartData', [
    {
      "timestamp": "2014-10-07T12:21:39.156Z",
      "ip": "12.34.222.24",
      "rtt": 168.08160845641805
    }, {
      "timestamp": "2014-10-07T12:21:40.233Z",
      "ip": "12.34.222.80",
      "rtt": 182.67290809530695
    }, {
      "timestamp": "2014-10-07T12:21:41.604Z",
      "ip": "12.34.222.196",
      "rtt": 90.39461855716031
    }, {
      "timestamp": "2014-10-07T12:21:44.215Z",
      "ip": "12.34.222.183",
      "rtt": 196.83835953615997
    }, {
      "timestamp": "2014-10-07T12:21:47.099Z",
      "ip": "12.34.222.210",
      "rtt": 185.73609346015866
    }, {
      "timestamp": "2014-10-07T12:21:50.006Z",
      "ip": "12.34.222.45",
      "rtt": 136.22120089509895
    }, {
      "timestamp": "2014-10-07T12:21:52.745Z",
      "ip": "12.34.222.202",
      "rtt": 127.713853331557
    }, {
      "timestamp": "2014-10-07T12:21:54.617Z",
      "ip": "12.34.222.104",
      "rtt": 196.45782668000285
    }, {
      "timestamp": "2014-10-07T12:21:56.903Z",
      "ip": "12.34.222.121",
      "rtt": 169.3510848600195
    }, {
      "timestamp": "2014-10-07T12:21:59.894Z",
      "ip": "12.34.222.65",
      "rtt": 192.26293245514398
    }, {
      "timestamp": "2014-10-07T12:22:02.795Z",
      "ip": "12.34.222.48",
      "rtt": 137.19813341560965
    }, {
      "timestamp": "2014-10-07T12:22:05.165Z",
      "ip": "12.34.222.95",
      "rtt": 176.43940796556373
    }, {
      "timestamp": "2014-10-07T12:22:08.163Z",
      "ip": "12.34.222.200",
      "rtt": 54.2772852229231
    }, {
      "timestamp": "2014-10-07T12:22:11.150Z",
      "ip": "12.34.222.103",
      "rtt": 172.52015491044085
    }, {
      "timestamp": "2014-10-07T12:22:14.123Z",
      "ip": "12.34.222.104",
      "rtt": 188.96025383757743
    }, {
      "timestamp": "2014-10-07T12:22:16.384Z",
      "ip": "12.34.222.186",
      "rtt": 160.31279474381805
    }, {
      "timestamp": "2014-10-07T12:22:19.255Z",
      "ip": "12.34.222.77",
      "rtt": 198.44986714991137
    }, {
      "timestamp": "2014-10-07T12:22:21.369Z",
      "ip": "12.34.222.139",
      "rtt": 145.30029339294018
    }, {
      "timestamp": "2014-10-07T12:22:21.625Z",
      "ip": "12.34.222.66",
      "rtt": 124.38252212018374
    }, {
      "timestamp": "2014-10-07T12:22:24.617Z",
      "ip": "12.34.222.145",
      "rtt": 198.66957575832197
    }, {
      "timestamp": "2014-10-07T12:22:27.481Z",
      "ip": "12.34.222.193",
      "rtt": 190.3397347987629
    }, {
      "timestamp": "2014-10-07T12:22:29.813Z",
      "ip": "12.34.222.133",
      "rtt": 192.58725408500638
    }, {
      "timestamp": "2014-10-07T12:22:32.328Z",
      "ip": "12.34.222.202",
      "rtt": 194.01061680203696
    }, {
      "timestamp": "2014-10-07T12:22:34.537Z",
      "ip": "12.34.222.236",
      "rtt": 172.81765827096362
    }, {
      "timestamp": "2014-10-07T12:22:37.295Z",
      "ip": "12.34.222.130",
      "rtt": 174.7213335262897
    }, {
      "timestamp": "2014-10-07T12:22:40.041Z",
      "ip": "12.34.222.237",
      "rtt": 190.46782695647124
    }, {
      "timestamp": "2014-10-07T12:22:42.592Z",
      "ip": "12.34.222.110",
      "rtt": 198.96502036365038
    }, {
      "timestamp": "2014-10-07T12:22:45.421Z",
      "ip": "12.34.222.150",
      "rtt": 199.8107335759425
    }, {
      "timestamp": "2014-10-07T12:22:47.395Z",
      "ip": "12.34.222.123",
      "rtt": 198.68002449378008
    }, {
      "timestamp": "2014-10-07T12:22:49.999Z",
      "ip": "12.34.222.156",
      "rtt": 199.98966969626002
    }, {
      "timestamp": "2014-10-07T12:22:51.791Z",
      "ip": "12.34.222.62",
      "rtt": 175.3739035975376
    }, {
      "timestamp": "2014-10-07T12:22:54.785Z",
      "ip": "12.34.222.17",
      "rtt": 199.62480727564326
    }, {
      "timestamp": "2014-10-07T12:22:57.402Z",
      "ip": "12.34.222.68",
      "rtt": 182.54399104039305
    }, {
      "timestamp": "2014-10-07T12:22:59.997Z",
      "ip": "12.34.222.69",
      "rtt": 189.0918499842584
    }, {
      "timestamp": "2014-10-07T12:23:02.812Z",
      "ip": "12.34.222.44",
      "rtt": 160.55392995522607
    }, {
      "timestamp": "2014-10-07T12:23:05.239Z",
      "ip": "12.34.222.69",
      "rtt": 189.98334413487444
    }, {
      "timestamp": "2014-10-07T12:23:07.371Z",
      "ip": "12.34.222.118",
      "rtt": 196.07290456011705
    }, {
      "timestamp": "2014-10-07T12:23:10.307Z",
      "ip": "12.34.222.125",
      "rtt": 188.1014765717045
    }, {
      "timestamp": "2014-10-07T12:23:12.992Z",
      "ip": "12.34.222.19",
      "rtt": 196.63671783512098
    }, {
      "timestamp": "2014-10-07T12:23:15.206Z",
      "ip": "12.34.222.221",
      "rtt": 187.58746681635557
    }, {
      "timestamp": "2014-10-07T12:23:17.546Z",
      "ip": "12.34.222.171",
      "rtt": 112.6714822941861
    }, {
      "timestamp": "2014-10-07T12:23:20.154Z",
      "ip": "12.34.222.148",
      "rtt": 196.12136260321824
    }, {
      "timestamp": "2014-10-07T12:23:22.277Z",
      "ip": "12.34.222.49",
      "rtt": 187.4246988357871
    }, {
      "timestamp": "2014-10-07T12:23:24.413Z",
      "ip": "12.34.222.236",
      "rtt": 181.19368646574137
    }, {
      "timestamp": "2014-10-07T12:23:26.377Z",
      "ip": "12.34.222.167",
      "rtt": 198.41559693547117
    }, {
      "timestamp": "2014-10-07T12:23:29.337Z",
      "ip": "12.34.222.153",
      "rtt": 181.73043817764778
    }, {
      "timestamp": "2014-10-07T12:23:31.876Z",
      "ip": "12.34.222.16",
      "rtt": 188.79585835996502
    }, {
      "timestamp": "2014-10-07T12:23:34.856Z",
      "ip": "12.34.222.48",
      "rtt": 192.79632528781204
    }, {
      "timestamp": "2014-10-07T12:23:37.793Z",
      "ip": "12.34.222.210",
      "rtt": 193.45238013848692
    }, {
      "timestamp": "2014-10-07T12:23:40.743Z",
      "ip": "12.34.222.232",
      "rtt": 143.91544645844087
    }, {
      "timestamp": "2014-10-07T12:23:43.633Z",
      "ip": "12.34.222.243",
      "rtt": 170.72592524363057
    }, {
      "timestamp": "2014-10-07T12:23:46.510Z",
      "ip": "12.34.222.175",
      "rtt": 195.639246196663
    }, {
      "timestamp": "2014-10-07T12:23:49.482Z",
      "ip": "12.34.222.235",
      "rtt": 176.0325000611148
    }, {
      "timestamp": "2014-10-07T12:23:52.356Z",
      "ip": "12.34.222.43",
      "rtt": 194.23462842081463
    }, {
      "timestamp": "2014-10-07T12:23:55.328Z",
      "ip": "12.34.222.102",
      "rtt": 194.0951997907922
    }, {
      "timestamp": "2014-10-07T12:23:56.541Z",
      "ip": "12.34.222.3",
      "rtt": 192.45070670667914
    }, {
      "timestamp": "2014-10-07T12:23:59.109Z",
      "ip": "12.34.222.239",
      "rtt": 188.3944087836643
    }, {
      "timestamp": "2014-10-07T12:24:02.059Z",
      "ip": "12.34.222.98",
      "rtt": 191.36307832639517
    }, {
      "timestamp": "2014-10-07T12:24:04.412Z",
      "ip": "12.34.222.234",
      "rtt": 85.62785129379532
    }, {
      "timestamp": "2014-10-07T12:24:07.290Z",
      "ip": "12.34.222.64",
      "rtt": 196.09847875360725
    }, {
      "timestamp": "2014-10-07T12:24:10.247Z",
      "ip": "12.34.222.202",
      "rtt": 199.2172917277107
    }, {
      "timestamp": "2014-10-07T12:24:12.624Z",
      "ip": "12.34.222.68",
      "rtt": 186.52607354607076
    }, {
      "timestamp": "2014-10-07T12:24:14.414Z",
      "ip": "12.34.222.128",
      "rtt": 179.58414968503666
    }, {
      "timestamp": "2014-10-07T12:24:17.381Z",
      "ip": "12.34.222.195",
      "rtt": 198.22636559428543
    }, {
      "timestamp": "2014-10-07T12:24:19.377Z",
      "ip": "12.34.222.223",
      "rtt": 116.46987605364527
    }, {
      "timestamp": "2014-10-07T12:24:22.256Z",
      "ip": "12.34.222.162",
      "rtt": 192.99315157565573
    }, {
      "timestamp": "2014-10-07T12:24:24.499Z",
      "ip": "12.34.222.30",
      "rtt": 199.83366743501648
    }, {
      "timestamp": "2014-10-07T12:24:26.676Z",
      "ip": "12.34.222.129",
      "rtt": 128.43489961883859
    }, {
      "timestamp": "2014-10-07T12:24:29.666Z",
      "ip": "12.34.222.195",
      "rtt": 199.3477162597989
    }, {
      "timestamp": "2014-10-07T12:24:32.275Z",
      "ip": "12.34.222.5",
      "rtt": 194.19350957998677
    }, {
      "timestamp": "2014-10-07T12:24:35.269Z",
      "ip": "12.34.222.232",
      "rtt": 193.22077703573197
    }, {
      "timestamp": "2014-10-07T12:24:37.810Z",
      "ip": "12.34.222.142",
      "rtt": 199.99227108843544
    }, {
      "timestamp": "2014-10-07T12:24:40.810Z",
      "ip": "12.34.222.87",
      "rtt": 175.75343225410802
    }, {
      "timestamp": "2014-10-07T12:24:43.465Z",
      "ip": "12.34.222.121",
      "rtt": 197.90272345834956
    }, {
      "timestamp": "2014-10-07T12:24:46.078Z",
      "ip": "12.34.222.135",
      "rtt": 167.24729219343976
    }, {
      "timestamp": "2014-10-07T12:24:48.472Z",
      "ip": "12.34.222.48",
      "rtt": 153.3313019394164
    }, {
      "timestamp": "2014-10-07T12:24:51.378Z",
      "ip": "12.34.222.93",
      "rtt": 199.9945908861114
    }, {
      "timestamp": "2014-10-07T12:24:53.825Z",
      "ip": "12.34.222.65",
      "rtt": 142.68204210614115
    }, {
      "timestamp": "2014-10-07T12:24:56.735Z",
      "ip": "12.34.222.147",
      "rtt": 199.716363088137
    }, {
      "timestamp": "2014-10-07T12:24:59.198Z",
      "ip": "12.34.222.51",
      "rtt": 186.30883414098417
    }, {
      "timestamp": "2014-10-07T12:25:02.198Z",
      "ip": "12.34.222.143",
      "rtt": 108.81980888815741
    }, {
      "timestamp": "2014-10-07T12:25:04.364Z",
      "ip": "12.34.222.28",
      "rtt": 197.9969325156788
    }, {
      "timestamp": "2014-10-07T12:25:06.866Z",
      "ip": "12.34.222.110",
      "rtt": 190.8143130221
    }, {
      "timestamp": "2014-10-07T12:25:09.700Z",
      "ip": "12.34.222.101",
      "rtt": 197.10897819030092
    }, {
      "timestamp": "2014-10-07T12:25:12.423Z",
      "ip": "12.34.222.86",
      "rtt": 198.19821900393384
    }, {
      "timestamp": "2014-10-07T12:25:14.634Z",
      "ip": "12.34.222.172",
      "rtt": 199.37934664520802
    }, {
      "timestamp": "2014-10-07T12:25:17.557Z",
      "ip": "12.34.222.200",
      "rtt": 162.60238332819748
    }, {
      "timestamp": "2014-10-07T12:25:20.560Z",
      "ip": "12.34.222.143",
      "rtt": 199.41398388739478
    }, {
      "timestamp": "2014-10-07T12:25:23.498Z",
      "ip": "12.34.222.224",
      "rtt": 199.3374226563996
    }, {
      "timestamp": "2014-10-07T12:25:26.498Z",
      "ip": "12.34.222.130",
      "rtt": 188.16966125632857
    }, {
      "timestamp": "2014-10-07T12:25:29.382Z",
      "ip": "12.34.222.133",
      "rtt": 193.4168271917877
    }, {
      "timestamp": "2014-10-07T12:25:32.363Z",
      "ip": "12.34.222.209",
      "rtt": 183.01776449930148
    }, {
      "timestamp": "2014-10-07T12:25:35.239Z",
      "ip": "12.34.222.95",
      "rtt": 164.72794964851568
    }
  ]);

}).call(this);

(function() {
  angular.module('graphing.demos.line', ['graphing.svg', 'graphing.charts.line', 'demos.line.template']).config(function($stateProvider) {
    return $stateProvider.state('demo.line', {
      url: '/line',
      views: {
        'demo-line': {
          template: '<line-demo />'
        }
      }
    });
  }).directive('lineDemo', function() {
    return {
      restrict: 'E',
      templateUrl: 'demos/line',
      controller: function($scope, SalesData) {
        return $scope.demoData = SalesData.map(function(_, i) {
          return {
            year: i + 1980,
            sales: _
          };
        });
      }
    };
  }).value('SalesData', [1.46220, 1.47004, 1.49253, 1.49118, 1.49722, 1.50138, 1.50008, 1.51493, 1.50781, 1.50899, 1.53037, 1.58137, 1.54299, 1.53307, 1.55845, 1.56213, 1.54488, 1.56927, 1.55305, 1.55710, 1.56235, 1.58847, 1.59309, 1.58303, 1.59470]);

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
  }).controller('TrigCtrl', function($scope, ScaleSvc) {
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

(function() {
  angular.module('graphing.svg.tooltip', ['svg.graphTooltip.template']).directive('graphTooltip', function($templateCache, $compile) {
    var hideTooltip, showTooltipAt, tooltip, tooltipData, tooltipOffset;
    tooltipOffset = 0;
    tooltip = null;
    tooltipData = {
      show: false,
      position: [-50, -50],
      text: "Tooltip!"
    };
    showTooltipAt = function($scope, at, text) {
      if (text == null) {
        text = tooltipData.text;
      }
      console.log('Showing tooltip at', at);
      $scope.tooltipData.show = true;
      $scope.tooltipData.text = text;
      return $scope.tooltipData.position = at;
    };
    hideTooltip = function($scope) {
      console.log('Hiding tooltip');
      return $scope.tooltipData.show = false;
    };
    return {
      restrict: 'A',
      compile: function(tElement, tAttrs, tTransclude) {
        return {
          pre: function($scope, iElement, iAttrs) {
            var lastSvg, parent, tooltipExp, tooltipTemplate;
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
              lastSvg.append(tooltip);
              return tooltipOffset = lastSvg[0].offsetLeft;
            }
          },
          post: function($scope, iElement, iAttrs) {
            iElement.bind('mouseover', function(event) {
              return $scope.$apply(function() {
                var position;
                position = [event.x - tooltipOffset, 50];
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
      },
      controller: function($scope) {
        return $scope.tooltipData = tooltipData;
      }
    };
  });

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
