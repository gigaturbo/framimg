import { useMemo, useCallback } from 'react';
import { Stage, Sprite, Graphics } from '@pixi/react';
import { checkDataUrl } from 'pixi.js';

export default function PixiCanvas({ image, imageSettings, canvasSize, onImageDrag }) {

    const imgDataURL = useMemo(() => { return image.toDataURL() }, [image])

    const { b, R, cH, cW, pad, iW, iH, iR, zW, zH } = useMemo(
        () => { return calcParams(image, imageSettings, canvasSize) },
        [image, imageSettings, canvasSize]
    )

    const draw = useCallback((g) => {
        g.clear();
        g.beginFill(0xFFFFFF, 1);
        g.drawRect(0, 0, cW, pad);
        g.drawRect(0, (cW / imageSettings.ratio) - pad, cW, pad);
        g.drawRect(0, pad, pad, cW / imageSettings.ratio - 2 * pad);
        g.drawRect(cW - pad, pad, pad, cW / imageSettings.ratio - 2 * pad);
        g.endFill();
    }, [image, imageSettings, canvasSize]);


    return (
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