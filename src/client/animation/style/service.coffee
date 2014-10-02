angular.module('graphing.animation.style', [

])
.service 'StyleManager', ($document)->
    ###
        A service to dynamically create and manage styles, especially for
        js-controlled animations.
    ###
    # Prepare a style sheet to scratch on
    pathStyles = $document[0].createElement("style")
    pathStyles.type = "text/css"
    pathStyles.id = "graphing_drawPath_styles"
    $document.find("head").append pathStyles

    # Little ID manager
    uid = 0
    nextUid = -> ++uid
    makeRule = ({selector, definition})-> "#{selector} {\n#{definition}\n}\n"
    makeClassName = (name)-> "#{name}-#{nextUid()}"

    addRules = (ruleList)->
        pathStyles.innerHTML += ruleList.map(makeRule).join('')

    {
        makeClassName
        addRules
    }
