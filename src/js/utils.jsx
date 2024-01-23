import { Image } from 'image-js';

/*
    Rotate                  [-180; 180]
    Zoom                    [1; 10]
    Border %                [0%; 50%]
    Ratio                   [1:1; 5:1]
    Ratio Orient            {LANDSCAPE; PORTRAIT}
    Ratio Mode              {OUTPUT_RATIO; INPUT_RATIO} OR {CONSTANT_BORDER_PX; CONSTANT_BORDER_%}
    Translation_X           [0, ?]
    Translation_y           [0, ?]

    _OPERATIONS_:
        1. Rotate
        2. Crop to max zoomed+rotated+ratio rectangle
        3. Compute max translations
        4. Translate
        5. Add borders
        6. Display/Export

    https://stackoverflow.com/questions/5789239/calculate-largest-inscribed-rectangle-in-a-rotated-rectangle#7513445

*/

export const getProcessedImage = (image, imageSettings) => {

    if (imageSettings.ratioMode === "OUTPUT_RATIO") {

        let limg

        let params = getProcessingParameters(image, imageSettings)


        limg = image.crop({
            x: 0,
            y: 0,
            width: image.width - params.dx,
            height: image.height - params.dy
        })


        limg = limg.pad({ size: params.pad, algorithm: "set", color: [255, 255, 255, 255] })

        return (limg)

    }

    return (image)
}

const getProcessingParameters = (image, imageSettings) => {

    let dx = 0
    let dy = 0
    let pad = 0
    let cR = image.width / image.height

    if (imageSettings.ratioMode === "OUTPUT_RATIO") {

        const b = imageSettings.borderSize
        const oR = imageSettings.ratio
        const cR = (1 - b / 100) / (1 / oR - b / 100)

        // Ratio is now fixed
        if (cR < image.width / image.height) {
            const cW = parseInt(image.height * cR)
            dx += parseInt(image.width - cW)
        } else {
            const cH = parseInt(image.width / cR)
            dy += parseInt(image.height - cH)
        }

        // Zoom *proportional* to ratio
        dx += (image.width - dx) - parseInt((image.width - dx) / imageSettings.zoom)
        dy += (image.height - dy) - parseInt((image.height - dy) / imageSettings.zoom)

        // Padding relative to new width
        pad = parseInt((b * parseInt((image.height - dy) * cR) / 100) / (2 - b / 50))

        // Security
        dx = Math.max(Math.min(dx, image.width - 1), 1)
        dy = Math.max(Math.min(dy, image.height - 1), 1)
        pad = Math.max(pad, 0)

    }

    return ({ cR: cR, dx: dx, dy: dy, pad: pad })

}

// // https://stackoverflow.com/questions/5789239/calculate-largest-inscribed-rectangle-in-a-rotated-rectangle#7513445
// function getCropCoordinates(angleInRadians, imageDimensions) {
//     var ang = angleInRadians;
//     var img = imageDimensions;

//     var quadrant = Math.floor(ang / (Math.PI / 2)) & 3;
//     var sign_alpha = (quadrant & 1) === 0 ? ang : Math.PI - ang;
//     var alpha = (sign_alpha % Math.PI + Math.PI) % Math.PI;

//     var bb = {
//         w: img.w * Math.cos(alpha) + img.h * Math.sin(alpha),
//         h: img.w * Math.sin(alpha) + img.h * Math.cos(alpha)
//     };

//     var gamma = img.w < img.h ? Math.atan2(bb.w, bb.h) : Math.atan2(bb.h, bb.w);

//     var delta = Math.PI - alpha - gamma;

//     var length = img.w < img.h ? img.h : img.w;
//     var d = length * Math.cos(alpha);
//     var a = d * Math.sin(alpha) / Math.sin(delta);

//     var y = a * Math.cos(gamma);
//     var x = y * Math.tan(gamma);

//     return {
//         x: x,
//         y: y,
//         w: bb.w - 2 * x,
//         h: bb.h - 2 * y
//     };
// }


function getBorderParameters(percentBorderWidth, inputRatio, outputRatio) {

    W = 1
    H = 1 / outputRatio

    r = (W - percentBorderWidth / 100 * W) / (H - percentBorderWidth / 100 * W)
    p = 1 - inputRatio / r
    rf = W / H

    return r

}