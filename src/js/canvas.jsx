import React, { useRef, useEffect } from 'react'

//  https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
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

const Canvas = props => {

    const { image, imageSettings, width, height, ...other } = props
    const canvasRef = useRef(null)

    useEffect(() => {

        const context = canvasRef.current.getContext('2d')

        const padPx = imageSettings.borderSize / 100 * image.width

        let limg = image.pad({
            size: [padPx, padPx],
            algorithm: 'set',
            color: [255, 255, 255, 255]
        }).resize({ width: width })

        const data = new ImageData(
            limg.getRGBAData({ clamped: true }),
            limg.width,
            limg.height,
        );
        context.putImageData(data, 0, 0);

    }, [image, imageSettings, width, height])

    return <canvas ref={canvasRef} width={width} height={width * image.height / image.width} {...other} />
}

export default Canvas