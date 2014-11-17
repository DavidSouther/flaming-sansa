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
