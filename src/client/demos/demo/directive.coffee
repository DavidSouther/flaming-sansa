angular.module('graphing.demos.demo',[
    'graphing.demos.provider'
    'demos.demo.template'
]).directive 'demo', ->
    restrict: 'E'
    templateUrl: 'demos/demo'
    transclude: yes
    scope:
        title: '@'
