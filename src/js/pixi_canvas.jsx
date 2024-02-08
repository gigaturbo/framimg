import { useMemo, useCallback, useRef, useEffect } from 'react';
import { Stage, Sprite, Graphics } from '@pixi/react';

export default function PixiCanvas({ image, imageSettings, canvasSize, onImageDrag }) {

    const imgDataURL = useMemo(() => { return image.toDataURL() }, [image])

    const { b, R, cH, cW, pad, iW, iH, iR, zW, zH } = useMemo(
        () => { return calcParams(image, imageSettings, canvasSize) },
        [image, imageSettings, canvasSize]
    )

    const ref = useRef(null)
    const isMouseDown = useRef(false)
    const mouseInitialPosition = useRef({ x: 0, y: 0 })
    const previousTranslation = useRef({ x: 0, y: 0 })

    function handleMouseMove(e) {
        if (ref != null && mouseInitialPosition.current && e.buttons === 1 && isMouseDown.current) {
            const { ttx, tty } = getTranslation(e)
            onImageDrag(ttx, tty)
        }
    }

    function handleMouseUpOrLeave(e) {
        if (ref != null && mouseInitialPosition.current) {
            isMouseDown.current = false
            const { ttx, tty } = getTranslation(e)
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

    const getTranslation = (e) => {
        const dx = (e.offsetX - mouseInitialPosition.current.x)
        const dy = (e.offsetY - mouseInitialPosition.current.y)
        ttx = parseInt(dx + previousTranslation.current.x)
        tty = parseInt(dy + previousTranslation.current.y)
        return ({ ttx, tty })
    }


    const draw = useCallback((g) => {
        g.clear();
        g.beginFill(0xFFFFFF, 1);
        g.drawRect(0, 0, cW, pad);
        g.drawRect(0, (cW / imageSettings.ratio) - pad, cW, pad);
        g.drawRect(0, pad, pad, cW / imageSettings.ratio - 2 * pad);
        g.drawRect(cW - pad, pad, pad, cW / imageSettings.ratio - 2 * pad);
        g.endFill();
    }, [image, imageSettings, canvasSize]);


    // useEffect(() => {
    //     ref.current.onmousemove = handleMouseMove;
    //     ref.current.onmousedown = handleMouseDown;
    //     ref.current.onmouseup = handleMouseUpOrLeave;
    //     ref.current.onmouseleave = handleMouseUpOrLeave;
    // }, [image, imageSettings, canvasSize, onImageDrag])

    return (
        // <div ref={ref}>
        <Stage
            width={cW}
            height={cW / imageSettings.ratio}
            options={{ backgroundColor: 0xAABBBB }}>
            <Sprite
                image={imgDataURL}
                width={zW * imageSettings.zoom}
                height={zH * imageSettings.zoom}
                anchor={0.5}
                x={parseInt(cW / 2) + imageSettings.translation.x}
                y={parseInt(cH / 2) + imageSettings.translation.y}
            />
            <Graphics draw={draw} />
        </Stage>
        // </div>
    );
}

const calcParams = (image, imageSettings, canvasSize) => {

    const b = imageSettings.borderSize
    const R = image.width / image.height
    const cH = canvasSize.w / imageSettings.ratio
    const cW = canvasSize.w
    const pad = cW * (b / 200)
    const iH = cH - pad * 2
    const iW = cW - pad * 2
    const iR = iW / iH

    let zW
    let zH
    if (R <= iR) {
        zW = iW
        zH = iW / R
    }
    else {
        zH = iH
        zW = iH * R
    }

    return { b, R, cH, cW, pad, iW, iH, iR, zW, zH }

};