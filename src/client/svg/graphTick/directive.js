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
