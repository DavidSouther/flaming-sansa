/* global d3_svg_lineHermite: true */
/* global d3_svg_lineMonotoneTangents: true */

angular.module('graphing.svg.path', [

])
.filter('pathFn', function(){
    return function PathFn(valfunc, tmin, tmax, tstep, tscale, xscale, yscale){
        function getVal(t){
            t = tscale(t);
            var val = valfunc(t), x, y;
            if(val.length){
                y = val[1];
                x = val[0];
            } else {
                y = val;
                x = t;
            }
            return [xscale(x), yscale(y)];
        }
        var points = [];

        while(tmin <= tmax) {
            points.push(getVal(tmin));
            tmin += tstep;
        }

        var p0 = points[0];
        var m = '' + p0[0] + ',' + p0[1];

        var path = 'M' + m + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
        return path;
    };
})
.filter('path', function(){
    return function Path(data, interp, xscale, yscale){
        var points = data.map(function(d, i){
            return [xscale(interp.x(d, i)), yscale(interp.y(d, i))];
        });
        var p0 = points[0];
        var m = '' + p0[0] + ',' + p0[1];

        var path = 'M' + m + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
        return path;
    };
})
;
