angular.module('graphing.demos', [
    'ionic'

    'graphing.demos.trig'
    'graphing.demos.tension'
    'graphing.demos.line'
    'graphing.demos.bar'
    'graphing.demos.boxplot'
    'graphing.demos.forcelayout'
])
.config ($urlRouterProvider)->
    $urlRouterProvider.otherwise '/line'
.controller 'DemoList', ($scope, demos)->
    $scope.demos = demos
.controller 'DemoMenu', ($scope, $ionicSideMenuDelegate)->
    $scope.open = -> $ionicSideMenuDelegate.toggleLeft()
