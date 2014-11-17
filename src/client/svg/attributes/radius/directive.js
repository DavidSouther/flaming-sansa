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
