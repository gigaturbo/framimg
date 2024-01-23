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

        // const ratio = getBorderParameters(
        //     percentBorderWidth = imageSettings.borderSize,
        //     inputRatio = image.width / image.height,
        //     outputRatio = imageSettings.ratio)
        const b = imageSettings.borderSize
        const oR = imageSettings.ratio
        const cR = (1 - b / 100) / (1 / oR - b / 100)

        // console.log(`W=${image.width} H=${image.height} iR=${image.width / image.height}`)
        // console.log(` m=${imageSettings.borderSize / 100} oR=${oR} cR=${cR}`)

        // Crop to obtain working ratio
        if (cR < image.width / image.height) {
            const cW = parseInt(image.height * cR)
            const dx = parseInt(image.width - cW)
            console.log(` dx=${dx}`)
            limg = image.crop({ x: dx / 2, y: 0, width: cW, height: image.height })
        } else {
            const cH = parseInt(image.width / cR)
            const dy = parseInt(image.height - cH)
            console.log(` dy=${dy}`)
            limg = image.crop({ x: 0, y: dy / 2, width: image.width, height: cH })
        }

        // Add border
        const padPx = parseInt((b * limg.width / 100) / (2 - b / 50))
        // console.log(` Padding=${padPx}`)
        limg = limg.pad({ size: padPx, algorithm: "set", color: [255, 255, 255, 255] })

        // Done
        // console.log(` Real output ratio = ${limg.width / limg.height}`)
        return (limg)

    }

    return (image)
}

const getProcessingParameters = (image, imageSettings) => {

    let dx = 0
    let dy = 0
    let pad = 0
    let cR = image.width / image.heights

    if (imageSettings.ratioMode === "OUTPUT_RATIO") {

        let limg

        const b = imageSettings.borderSize
        const oR = imageSettings.ratio
        const cR = (1 - b / 100) / (1 / oR - b / 100)

        if (cR < image.width / image.height) {
            const cW = parseInt(image.height * cR)
            const dx = parseInt(image.width - cW)
            limg = image.crop({ x: dx / 2, y: 0, width: cW, height: image.height })
        } else {
            const cH = parseInt(image.width / cR)
            const dy = parseInt(image.height - cH)
            limg = image.crop({ x: 0, y: dy / 2, width: image.width, height: cH })
        }

        pad = parseInt((b * limg.width / 100) / (2 - b / 50))

        limg = limg.pad({ size: pad })
        return (limg)

    }

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