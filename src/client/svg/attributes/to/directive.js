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
