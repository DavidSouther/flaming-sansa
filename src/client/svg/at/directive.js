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
