angular.module('dolores.tools.localStorage.service', [

]).service '$localStorage', ($window)->
    storage = $window.localStorage or {}

    get: (key)->
        throw new Error 'Need string key.' unless angular.isString key
        JSON.parse storage[key]

    set: (key, val)->
        throw new Error 'Need string key.' unless angular.isString key
        storage[key] = JSON.stringify val

    has: (key)->
        throw new Error 'Need string key.' unless angular.isString key
        storage[key]?
