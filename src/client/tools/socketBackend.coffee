SocketSvc = ($rootScope)->
    events = {}
    socket =
        on: (event, fn)->
            (events[event] or= []).push fn
        emit: (event, data)->
            (events[event] or= []).forEach (fn)->
                try
                    fn data
                catch e
                    console.error "Error in emit `#{event}`"
                    console.log e, e.stack
    socket.$on = (event, fn)->
        socket.on event, (data)->
            $rootScope.$apply ->
                fn data
    {socket}

SocketSvc.$inject = ['$rootScope']

angular.module('dolores.socket.service', [

]).service 'SocketSvc', SocketSvc
