class Vector2
    constructor: (@x, @y)->
    clone: -> new Vector2(@x, @y)
    add: (v)->
        @x += v.x
        @y += v.y
        this
    subtract: (v)->
        @x += v.x
        @y += v.y
        this
    multiply: (n)->
        @x *= n
        @y *= n
        this
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
    constructor: (@anchors = [new Vector2(0, 0), new Vector2(1, 0)])->
        @anchors[0].load = Vector2.ZERO
        @anchors[1].load = Vector2.ZERO
    addLoad: (position, weight)->
        position =
            if position instanceof Vector2
                position
            else
                @anchors[@anchors.length - 1].clone()
                .subtract(@anchors[0]).multiply(position)
        position.y += weight
        position.load = position.clone().add(Vector2.UP.clone().multiply(weight))
        @anchors.push(position)
        @anchors.sort(Vector2.leftright)

angular.module('graphing.demos.tension', [
    'graphing.scales'
    'graphing.demos.demo'
    'demos.tension.template'
])
.config (demosProvider)->
    demosProvider.demo 'tension',
        template: '<tension-demo />'
.directive 'tensionDemo', ->
    restrict: 'E'
    templateUrl: 'demos/tension'
.controller 'TensionCtrl', ($scope, ScaleSvc)->
    $scope.string = string = new String()
    string.addLoad(0.5, 1)
