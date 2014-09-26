// Interpolates the given points using Fritsch-Carlson Monotone cubic Hermite
// interpolation. Returns an array of tangent vectors. For details, see
// http://en.wikipedia.org/wiki/Monotone_cubic_interpolation
window.d3_svg_lineMonotoneTangents = function d3_svg_lineMonotoneTangents(points) {
    var tangents = [],
        d,
        a,
        b,
        s,
        m = d3_svg_lineFiniteDifferences(points),
        i = -1,
        j = points.length - 1;
    // The first two steps are done by computing finite-differences:
    // 1. Compute the slopes of the secant lines between successive points.
    // 2. Initialize the tangents at every point as the average of the secants.
    // Then, for each segment…
    while (++i < j) {
        d = d3_svg_lineSlope(points[i], points[i + 1]);
        // 3. If two successive yk = y{k + 1} are equal (i.e., d is zero), then set
        // mk = m{k + 1} = 0 as the spline connecting these points must be flat to
        // preserve monotonicity. Ignore step 4 and 5 for those k.
        if (Math.abs(d) < EPSILON) {
            m[i] = m[i + 1] = 0;
        } else {
            // 4. Let ak = mk / dk and bk = m{k + 1} / dk.
            a = m[i] / d;
            b = m[i + 1] / d;
            // 5. Prevent overshoot and ensure monotonicity by restricting the
            // magnitude of vector <ak, bk> to a circle of radius 3.
            s = a * a + b * b;
            if (s > 9) {
                s = d * 3 / Math.sqrt(s);
                m[i] = s * a;
                m[i + 1] = s * b;
            }
        }
    }
    // Compute the normalized tangent vector from the slopes. Note that if x is
    // not monotonic, it's possible that the slope will be infinite, so we protect
    // against NaN by setting the coordinate to zero.
    i = -1;
    while (++i <= j) {
        s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
        tangents.push([s || 0, m[i] * s || 0]);
    }
    return tangents;
}
