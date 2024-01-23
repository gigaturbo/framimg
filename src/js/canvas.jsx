import React, { useRef, useEffect } from 'react'
import { getProcessedImage } from './utils'

//  https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258


const Canvas = props => {

    const { image, imageSettings, width, height, ...other } = props
    const canvasRef = useRef(null)

    function handleMouseMove(e) {
        if (canvasRef != null) {
            if (e.buttons === 1) {
                const c = canvasRef.current;
                const pos = getMousePos(c, e);
                console.log('Mouse position: ' + pos.x + ',' + pos.y);
                console.log('Buttons: ' + e.buttons);
            }
        }
    }

    useEffect(() => {

        const context = canvasRef.current.getContext('2d')
        canvasRef.current.onmousemove = handleMouseMove;

        const limg = getProcessedImage(image, imageSettings).resize({ width: width })
        const data = new ImageData(limg.getRGBAData({ clamped: true }), limg.width, limg.height);
        context.putImageData(data, 0, 0);

    }, [image, imageSettings, width, height])

    return <canvas ref={canvasRef} width={width} height={width / imageSettings.ratio} {...other} />
}

export default Canvas

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}