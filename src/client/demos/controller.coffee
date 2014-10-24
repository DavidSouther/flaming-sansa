angular.module('graphing.demos.controller', [
  'graphing.demos.provider'
])
.controller 'DemoList', ($scope, demos)->
    $scope.demos = demos
.controller 'DemoMenu', ($scope, $ionicSideMenuDelegate)->
    $scope.open = -> $ionicSideMenuDelegate.toggleLeft()
