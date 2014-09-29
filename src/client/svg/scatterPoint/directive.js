function ScatterPointDirective(
    $parse, $animate, $timeout, StyleManager
){
    var scatterPointDestination = function scatterPointDestination(x, y){
        var time = 2 + ((x + y) / 1000);
        var className = StyleManager.makeClassName('scatterPoint');
        var scatterPoint = {
            selector: '.' + className,
            definition:
                'transform: translate(' + x + 'px, ' + y +'px);\n' +
                'transition: ' + time + 's ease-out transform;'
        };

        var active = {
            selector: '.' + className + '.ng-enter-active',
            definition: 'transform: translate(' + x + 'px, 0);'
        };

        StyleManager.addRules([scatterPoint, active]);

        return className;
    };

    return {
        restrict: 'A',
        link: function scatterPointPostLink($scope, $element, $attrs){
            var lastAnimation = null;
            var $exp = $parse($attrs.scatterPoint);

            $scope.$watchCollection(
                function(){
                    return $exp($scope);
                }, function setFrom(value){
                    if(value){
                        if(lastAnimation){
                            $animate.cancel(lastAnimation);
                        }
                        var x = value[0], y = value[1];

                        var className = scatterPointDestination(x, y);

                        $timeout(function(){
                            lastAnimation = $animate.addClass(
                                $element,
                                className,
                                function(){
                                    // removeDrawPath(className);
                                }
                            );
                        });
                    }
                }
            );
        }
    };
}

ScatterPointDirective.$inject = [
    '$parse', '$animate', '$timeout', 'StyleManager'
];

angular.module('graphing.svg.scatterPoint', [
    'ngAnimate',
    'graphing.animation.style'
]).directive('scatterPoint', ScatterPointDirective);
