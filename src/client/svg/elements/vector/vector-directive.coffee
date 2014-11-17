angular.module('graphing.svg.vector', [
    'svg.elements.vector.vector-template.template'
]).directive 'vector', ->
    restrict: 'E'
    replace: yes
    templateUrl: 'svg/elements/vector/vector-template'
    scope:
        start: '@'
        end: '@'
        color: '@'
