toKeyVal = (attributes, separator = ' ')->
    ("#{key}=\"#{val}\"" for key, val of attributes)
        .join separator

if angular.mock
    window.render =
    angular.mock.render = (string, data = {})->
        $element = null
        inject ($compile, $rootScope)->
            if data.constructor?.name is 'Scope'
                $scope = data
            else
                $scope = $rootScope.$new()
                $scope[key] = val for key, val of data

            template = $compile(string)
            $element = template($scope)

            try
                $scope.$digest()
            catch exception
                err = "Exception when rendering #{directive}"
                console.error err, exception
                throw exception
        $element

    window.renderElement =
    angular.mock.renderElement = (directive, data, attributes)->
        attributes = toKeyVal attributes
        string = "<#{directive} #{attributes}></#{directive}>"
        render(string, data)

    window.renderAttribute =
    angular.mock.renderAttribute = (directive, data, attributes)->
        attributes = toKeyVal attributes
        string = "<div #{directive} #{attributes}></div>"
        render(string, data)
