import { useMemo, useCallback, useRef, useEffect } from 'react';
import { Stage, Sprite, Graphics } from '@pixi/react';
import assert from 'assert';

export default function PixiCanvas({ image, imageSettings, canvasSize, onImageDrag }) {

    const imgDataURL = useMemo(() => { return image.toDataURL() }, [image])

    const { pad, cW, dW, dH, px, py, mtx, mty } = useMemo(
        () => { return calcParams(image, imageSettings, canvasSize) },
        [image, imageSettings, canvasSize]
    )

    const ref = useRef(null)
    const isMouseDown = useRef(false)
    const mouseInitialPosition = useRef(null)
    const previousTranslation = useRef({ x: 0, y: 0 })

    function handleMouseMove(e) {
        if (ref != null && mouseInitialPosition.current && e.buttons === 1 && isMouseDown.current) {
            const { ctx, cty } = getTranslation(e)
            onImageDrag(ctx, cty)
        }
    }

    function handleMouseUpOrLeave(e) {
        if (ref != null && mouseInitialPosition.current) {
            isMouseDown.current = false
            const { ctx, cty } = getTranslation(e)
            previousTranslation.current.x = ctx
            previousTranslation.current.y = cty
            mouseInitialPosition.current = null
            onImageDrag(ctx, cty)
        }
    }

    function handleMouseDown(e) {
        isMouseDown.current = true
        mouseInitialPosition.current = { x: e.offsetX, y: e.offsetY }
    }

    const getTranslation = (e) => {
        // Compute displacement
        const dx = (e.offsetX - mouseInitialPosition.current.x)
        const dy = (e.offsetY - mouseInitialPosition.current.y)
        // Add to previous translations
        ttx = dx + previousTranslation.current.x
        tty = dy + previousTranslation.current.y
        // Cap translations
        const ctx = Math.max(Math.min(ttx, mtx / 2), -mtx / 2)
        const cty = Math.max(Math.min(tty, mty / 2), -mty / 2)
        return ({ ctx, cty })
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

    useEffect(() => {
        ref.current.onpointermove = handleMouseMove;
        ref.current.onpointerdown = handleMouseDown;
        ref.current.onpointerup = handleMouseUpOrLeave;
        ref.current.onpointerleave = handleMouseUpOrLeave;
    }, [image, imageSettings, canvasSize, onImageDrag])

    return (
        <div ref={ref}>
            <Stage
                width={cW}
                height={cW / imageSettings.ratio}
                options={{ backgroundColor: 0xCCBBBB }}>
                <Sprite
                    image={imgDataURL}
                    width={dW}
                    height={dH}
                    anchor={0.5}
                    x={px}
                    y={py}
                />
                <Graphics draw={draw} />
            </Stage>
        </div>
    );
}

const calcParams = (image, imageSettings, canvasSize) => {

    const b = imageSettings.borderSize
    const R = image.width / image.height            // raw image ratio
    const cH = canvasSize.w / imageSettings.ratio   // canvas height
    const cW = canvasSize.w                         // canvas width
    const pad = cW * (b / 200)                      // padding in pixels per side
    const iH = cH - pad * 2                         // inner height
    const iW = cW - pad * 2                         // inner width
    const iR = iW / iH                              // innerRatio

    let zW                                          // zoom=1 imageWidth
    let zH                                          // zoom=1 imageHeight
    if (R <= iR) {
        zW = iW
        zH = iW / R
    }
    else {
        zH = iH
        zW = iH * R
    }

    const dW = zW * imageSettings.zoom              // Sprite display width
    const dH = zH * imageSettings.zoom              // Sprite display height

    // Max translations
    const mtx = dW - iW // width overlap (max)
    const mty = dH - iH // height overlap (max)

    assert(mtx >= 0)
    assert(mty >= 0)

    // Cap translations
    const ctx = Math.max(Math.min(imageSettings.translation.x, mtx / 2), -mtx / 2)
    const cty = Math.max(Math.min(imageSettings.translation.y, mty / 2), -mty / 2)

    // Set position
    const px = (cW / 2) + ctx   // Sprite x pos
    const py = (cH / 2) + cty   // Sprite y pos

    console.log(`mtx ${mtx} mty ${mty}`)

    return { pad, cW, dW, dH, px, py, mtx, mty }
};