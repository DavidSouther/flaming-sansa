angular.module('dolores.energize',[
    'ngAnimate'
]).directive 'animateOnChange', ($animate)->
    ($scope, elem, attrs)->
        klass = attrs.animateOnChangeClass
        $scope.$watch attrs.animateOnChange, (nv)->
            $animate.addClass elem, klass, ->
                $animate.removeClass elem, klass
