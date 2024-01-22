import React, { useRef, useEffect } from 'react'

//  https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
const Canvas = props => {

    const { img, angle, width, height, ...other } = props
    const canvasRef = useRef(null)

    useEffect(() => {

        const context = canvasRef.current.getContext('2d')

        let limg = img.rotate(angle)

        const data = new ImageData(
            limg.getRGBAData({ clamped: true }),
            limg.width,
            limg.height,
        );
        context.putImageData(data, 0, 0);

    }, [img, angle])

    return <canvas ref={canvasRef} width={width} height={height} {...other} />
}

export default Canvas