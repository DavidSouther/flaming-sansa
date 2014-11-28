class Vector2
    constructor: (@x, @y)->
    clone: -> new Vector2(@x, @y)
    add: (v)->
        @x += v.x
        @y += v.y
        this
    addc: (v)->
        @clone().add(v)
    subtract: (v)->
        @x += v.x
        @y += v.y
        this
    subtractc: (v)->
        @clone().subtract(v)
    multiply: (n)->
        @x *= n
        @y *= n
        this
    multiplyc: (n)->
        @clone().multiply(n)
    length: ->
        Math.sqrt(@x * @x + @y * @y)
    direction: ->
        Math.atan(@x / @y)
    normalize: ->
        @multiply(1 / @length())
    dot: (v)->
        @x * v.x + @y * v.y
    array: -> [@x, @y]

Vector2.ZERO = new Vector2 0, 0
Vector2.UP = new Vector2 0, 1
Vector2.RIGHT = new Vector2 1, 0
Vector2.leftright = (a, b)->
    if a.x < b.x
        return -1
    else if a.x is b.x
        if a.y <= b.y
            return -1
    return 1

class String
    constructor: (
        @anchors = [
            new Vector2(-1, 0),
            new Vector2(0, 0),
            new Vector2(1, 0)
        ]
    )->
        @anchors[0].load = Vector2.ZERO
        @anchors[2].load = Vector2.ZERO
        @anchors[1].load = Vector2.ZERO
        @addLoad 0.2

    addLoad: (weight)->
        @anchors[1].y += weight
        @anchors[1].load = @anchors[1].addc(Vector2.UP.multiplyc(weight))

    setLoad: (weight)->
        @anchors[1].y = weight
        # @anchors[1].load = @anchors[1].addc(Vector2.UP.multiplyc(weight))

angular.module('graphing.demos.tension', [
    'graphing.scales'
    'graphing.demos.demo'
    'demos.tension.template'
    'demos.tension.visualization.template'
])
.config (demosProvider)->
    demosProvider.demo 'tension',
        template: '<tension-demo />'
.directive 'tensionDemo', ->
    restrict: 'E'
    templateUrl: 'demos/tension'
.controller 'TensionCtrl', ($scope, ScaleSvc, $ionicScrollDelegate)->
    $scope.string = string = new String()
    $scope.components = string.anchors[1].subtractc(string.anchors[0])
    $scope.pull = (distance)->
        console.log distance
        string.setLoad distance
        $scope.components = string.anchors[1].subtractc(string.anchors[0])

        scrollPos = $ionicScrollDelegate.getScrollPosition().top
        $ionicScrollDelegate.scrollTo(0, scrollPos, false)
