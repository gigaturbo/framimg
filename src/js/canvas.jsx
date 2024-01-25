import { useRef, useEffect } from 'react'
import { getProcessedImage, getProcessingParameters } from './utils'

export default Canvas = props => {

    const { image, imageSettings, canvasSize, onImageDrag, ...other } = props
    const canvasRef = useRef(null)
    const isMouseDown = useRef(null)
    const mouseInitialPosition = useRef(null)
    const previousTranslation = useRef({ x: 0, y: 0 })


    function handleMouseMove(e) {
        if (canvasRef != null && mouseInitialPosition.current && e.buttons === 1 && isMouseDown.current) {
            const { ttx, tty } = getTranslation(image, imageSettings, e)
            onImageDrag(ttx, tty)
        }
    }


    function handleMouseUpOrLeave(e) {
        if (canvasRef != null && mouseInitialPosition.current) {
            isMouseDown.current = false
            const { ttx, tty } = getTranslation(image, imageSettings, e)
            previousTranslation.current.x = ttx
            previousTranslation.current.y = tty
            mouseInitialPosition.current = null
            onImageDrag(ttx, tty)
        }
    }


    function handleMouseDown(e) {
        isMouseDown.current = true
        mouseInitialPosition.current = { x: e.offsetX, y: e.offsetY }
    }


    const getTranslation = (image, imageSettings, e) => {
        const params = getProcessingParameters(image, imageSettings)
        const canvasZoom = params.totalWidth / canvasSize.w
        const dx = - (e.offsetX - mouseInitialPosition.current.x)
        const dy = - (e.offsetY - mouseInitialPosition.current.y)
        ttx = parseInt(dx * canvasZoom + previousTranslation.current.x)
        tty = parseInt(dy * canvasZoom + previousTranslation.current.y)
        const minx = -params.dx / 2
        const maxx = params.dx / 2
        const miny = -params.dy / 2
        const maxy = params.dy / 2
        ttx = Math.max(Math.min(ttx, maxx), minx)
        tty = Math.max(Math.min(tty, maxy), miny)
        return ({ ttx, tty })
    }


    useEffect(() => {

        const context = canvasRef.current.getContext('2d')
        canvasRef.current.onmousemove = handleMouseMove;
        canvasRef.current.onmousedown = handleMouseDown;
        canvasRef.current.onmouseup = handleMouseUpOrLeave;
        canvasRef.current.onmouseleave = handleMouseUpOrLeave;

        const limg = getProcessedImage(image, imageSettings).resize({ width: canvasSize.w })
        const data = new ImageData(limg.getRGBAData({ clamped: true }), limg.width, limg.height);
        context.putImageData(data, 0, 0);

    }, [image, imageSettings, canvasSize, onImageDrag])

    return <canvas
        ref={canvasRef}
        width={canvasSize.w}
        height={canvasSize.w / imageSettings.ratio}
        {...other} />
}
