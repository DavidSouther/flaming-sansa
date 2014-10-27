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
