angular.module('graphing.demos.demo',[
    'demos.demo.template'
]).directive 'demo', ->
    restrict: 'E'
    templateUrl: 'demos/demo'
    transclude: yes
    scope:
        title: '@'
