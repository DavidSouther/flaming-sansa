// Computes the slope from points p0 to p1.
window.d3_svg_lineSlope = function d3_svg_lineSlope(p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
};
