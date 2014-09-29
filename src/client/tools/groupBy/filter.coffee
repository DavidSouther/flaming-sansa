groupByFilter = (array, groupKey, arrayKey, groupBase)->
    return array unless angular.isArray(array) and array.length > 0

    unless arrayKey? and angular.isString arrayKey
        arrayKey = 'grouped'

    unless groupBase? and angular.isFunction groupBase
        groupBase = (val)->
            base = {}

    reduction = (group, val)->
        groupping = val[groupKey]
        unless group[groupping]
            group[groupping] = groupBase(val)
            group[groupping][arrayKey] = []
        group[groupping][arrayKey].push val
        group

    grouped = array.reduce reduction, {}
    a for k, a of grouped

angular.module('dolores.tools.groupBy.filter', [

]).filter 'groupBy', -> groupByFilter
