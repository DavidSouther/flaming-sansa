angular.module('graphing.svg.drawPath', [
    'ngAnimate',
    'graphing.animation.style'
])
.directive('drawPath', function($animate, $parse, $timeout, StyleManager){
    var addDrawPathClass = function addDrawPathClass(length){
        var skip = 2 * length;
        var time = length / 1000;
        var className = StyleManager.makeClassName('drawPath');

        var drawPath = {
            selector: '.' + className,
            definition:
                'stroke-dasharray: ' + length + ', ' + skip + ';' +
                'transition: ' + time + 's ease-out stroke-dasharray;'
        };

        var active = {
            selector: '.' + className + '-add-active',
            definition: 'stroke-dasharray: 0, ' + skip + ';'
        };

        StyleManager.addRules([drawPath, active]);

        return className;
    };

    return {
        restrict: 'A',
        link: function drawPathPostLink($scope, $element, $attrs){
            var lastAnimation = null;
            var element = $element[0];
            var $exp = $parse($attrs.drawPath);

            $scope.$watch(
                function(){
                    return $exp($scope);
                }, function setFrom(value){
                    if(value){
                        if(lastAnimation){
                            $animate.cancel(lastAnimation);
                        }
                        element.setAttribute('d', value);

                        // Find length of the path
                        var length = element.getTotalLength();

                        var className = addDrawPathClass(length);

                        // $timeout(function(){
                        lastAnimation = $animate.addClass(
                            $element,
                            className,
                            function(){
                                // removeDrawPath(className);
                            }
                        );
                        // });
                    }
                }
            );
        }
    };
})
;
