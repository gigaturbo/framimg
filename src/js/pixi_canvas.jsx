import Box from '@mui/material/Box';
import { Graphics, Sprite, Stage } from '@pixi/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { calcParams } from './utils';

export default function PixiCanvas({ image, imageSettings, canvasSize, onImageDrag, ...props }) {

    const imgDataURL = useMemo(() => { return image.toDataURL() }, [image])

    const { pad, cW, cH, dW, dH, px, py, mtx, mty } = useMemo(
        () => calcParams(image, imageSettings, canvasSize),
        [image, imageSettings, canvasSize]
    )

    const touchBoxRef = useRef(null)
    const isMouseDown = useRef(false)
    const mouseInitialPosition = useRef(null)
    const previousTranslation = useRef({ x: 0, y: 0 })

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
        touchBoxRef.current.onpointermove = handleMouseMove;
        touchBoxRef.current.onpointerdown = handleMouseDown;
        touchBoxRef.current.onpointerup = handleMouseUpOrLeave;
        touchBoxRef.current.onpointerout = handleMouseUpOrLeave;
        touchBoxRef.current.onpointerleave = handleMouseUpOrLeave;
        touchBoxRef.current.onpointercancel = handleMouseUpOrLeave;
    }, [image, imageSettings, canvasSize, onImageDrag])


    function handleMouseMove(e) {
        if (touchBoxRef.current && mouseInitialPosition.current && e.buttons === 1 && isMouseDown.current) {
            const { ctx, cty } = getTranslation(e.offsetX, e.offsetY)
            onImageDrag(ctx, cty)
        }
    }

    function handleMouseUpOrLeave(e) {
        if (touchBoxRef.current && mouseInitialPosition.current) {
            isMouseDown.current = false
            const { ctx, cty } = getTranslation(e.offsetX, e.offsetY)
            previousTranslation.current.x = ctx
            previousTranslation.current.y = cty
            mouseInitialPosition.current = null
            onImageDrag(ctx, cty)
        }

    }

    function handleMouseDown(e) {
        if (touchBoxRef.current && e.buttons === 1 && !isMouseDown.current) {
            isMouseDown.current = true
            mouseInitialPosition.current = { x: e.offsetX, y: e.offsetY }
        }
    }

    function getTranslation(nx, ny) {
        // Compute displacement
        const dx = (nx - mouseInitialPosition.current.x)
        const dy = (ny - mouseInitialPosition.current.y)
        // Add to previous translations
        const ttx = dx + previousTranslation.current.x
        const tty = dy + previousTranslation.current.y
        // Cap translations
        const ctx = Math.max(Math.min(ttx, mtx / 2), -mtx / 2)
        const cty = Math.max(Math.min(tty, mty / 2), -mty / 2)
        return ({ ctx, cty })
    }


    return (
        <>
            <Box ref={touchBoxRef}
                sx={{ backgroundColor: "#FF0000", height: "auto" }}
                pointerEvents={"auto"}
            >
                <Stage
                    width={cW}
                    height={cW / imageSettings.ratio}
                    options={{ backgroundColor: 0xFFFFFF }}
                >
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
            </Box>
        </>
    );
}
