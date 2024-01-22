// https://stackoverflow.com/questions/5789239/calculate-largest-inscribed-rectangle-in-a-rotated-rectangle#7513445
function getCropCoordinates(angleInRadians, imageDimensions) {
    var ang = angleInRadians;
    var img = imageDimensions;

    var quadrant = Math.floor(ang / (Math.PI / 2)) & 3;
    var sign_alpha = (quadrant & 1) === 0 ? ang : Math.PI - ang;
    var alpha = (sign_alpha % Math.PI + Math.PI) % Math.PI;

    var bb = {
        w: img.w * Math.cos(alpha) + img.h * Math.sin(alpha),
        h: img.w * Math.sin(alpha) + img.h * Math.cos(alpha)
    };

    var gamma = img.w < img.h ? Math.atan2(bb.w, bb.h) : Math.atan2(bb.h, bb.w);

    var delta = Math.PI - alpha - gamma;

    var length = img.w < img.h ? img.h : img.w;
    var d = length * Math.cos(alpha);
    var a = d * Math.sin(alpha) / Math.sin(delta);

    var y = a * Math.cos(gamma);
    var x = y * Math.tan(gamma);

    return {
        x: x,
        y: y,
        w: bb.w - 2 * x,
        h: bb.h - 2 * y
    };
}


function getBorderParameters(percentBorderWidth, inputRatio, outputRatio) {

    r = (W - m * W) / (H - m * W)
    p = 1 - inputRatio / r
    rf = W / H

    // def f(m, W = 8, H = 5, RP = 1.5):
    //     r = (W - m * W) / (H - m * W)
    //     p = 1 - RP / r
    //     rf = W / H
    //     return r, p, rf
}