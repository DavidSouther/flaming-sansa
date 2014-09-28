angular.module('graphing.svg.drawPath', [
    'ngAnimate'
])
.directive('drawPath', function($animate, $parse, $document){
    var pathStyles = $document[0].createElement('style');
    pathStyles.type = 'text/css';
    pathStyles.id = "graphing_drawPath_styles"
    $document.find('head').append(pathStyles);

    var uid = 0;
    function nextUid(){
        return ++uid;
    }

    function addDrawPathClass(length){
        var className = "drawPath_" + nextUid();
        var classDef = [
            "stroke-dasharray: " + length + ", " + length + ";",
            "stroke-dashoffset: " + length + ";",
            "transition: " + (length / 1000) + "s ease stroke-dashoffset;"
        ].join('\n');
        var classActiveDef = "stroke-dashoffset: " + '0' + ";";

        var rule = "." + className + "{\n" + classDef + "\n}\n";
        var ruleActive = "." + className + "-active {\n" + classActiveDef + "\n}\n";
        pathStyles.innerText += rule + ruleActive;

        return className;
    }

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
                            $animation.cancel(lastAnimation);
                        }
                        element.setAttribute('d', value);

                        // Find length of the path
                        var length = element.getTotalLength();

                        var className = addDrawPathClass(length);

                        lastAnimation = $animate.addClass($element, className);
                    }
                }
            );
        }
    }
})
;
