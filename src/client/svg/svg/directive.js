angular.module('graphing.svg.svg', [

])
.directive('svg', function($rootScope){
    return {
        priority: 650,
        restrict: 'E',
        link: function($scope, $element){
            var set = function set(){
                $scope.$width = $element[0].offsetWidth;
                $scope.$height = $element[0].offsetWidth;
            };
            set();
            $rootScope.$on('Window Resized', set);
        }
    };
})
;
