angular.module('graphing.svg.svg', [

])
.directive('svg', function($rootScope){
    return {
        priority: 650,
        restrict: 'E',
        link: function($scope, $element){
            var e = $element[0];
            var set = function set(){
                $scope.$width = e.offsetWidth || e.clientWidth;
                $scope.$height = e.offsetHeight || e.clientHeight;
            };
            set();
            $rootScope.$on('Window Resized', set);
        }
    };
})
;
