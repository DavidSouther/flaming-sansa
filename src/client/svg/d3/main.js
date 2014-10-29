angular.module('graphing.svg.d3', [

]).run(function($rootScope){
    var _d3_dispatch = d3.dispatch;
    d3.dispatch = function(){
        var dispatch = _d3_dispatch.apply(this, arguments);
        [].forEach.call(arguments, function(event){
            var event_fn = dispatch[event];
            dispatch[event] = function(){
                event_fn.apply(this, arguments);
                if(!$rootScope.$$phase) {
                    $rootScope.$digest();
                    // TODO also consider limiting to once per animation frame.
                }
                return dispatch;
            };
        });
        return dispatch;
    }
});
