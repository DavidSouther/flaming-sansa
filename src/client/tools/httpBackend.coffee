
if angular.mock
    window.httpBackend = angular.mock.httpBackend = (data, afterEach = ->)->
        inject ($httpBackend)->
            for path, body of data
                if angular.isString body
                    status = 200
                else
                    status = body.status
                    body = body.body
                $httpBackend.whenGET(path).respond(status, body)
            afterEach ->
                $httpBackend.verifyNoOutstandingExpectation()
                $httpBackend.verifyNoOutstandingRequest()
