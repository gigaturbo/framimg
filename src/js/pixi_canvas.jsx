import { useMemo, useCallback } from 'react';
import { Stage, Sprite, Graphics } from '@pixi/react';
import { getProcessingParameters2 } from './utils'


export default function PixiCanvas({ image, imageSettings, canvasSize, onImageDrag }) {

    const params = getProcessingParameters2(image, imageSettings)
    const imgDataURL = useMemo(() => { return image.toDataURL() }, [image])

    const mwidth = parseInt(canvasSize.w - params.pad)
    const cpad = parseInt(canvasSize.w * (imageSettings.borderSize / 100))

    const draw = useCallback((g) => {
        g.clear();
        g.beginFill(0xFFFFFF);
        g.drawRect(0, 0, canvasSize.w, cpad);
        g.drawRect(0, 0, cpad, canvasSize.w / imageSettings.ratio);
        g.drawRect(canvasSize.w - cpad, 0, canvasSize.w, cpad);
        g.drawRect(0, (canvasSize.w / imageSettings.ratio) - cpad, cpad, canvasSize.w / imageSettings.ratio);
        g.endFill();
    }, [imageSettings]);

    return (
        <Stage
            width={canvasSize.w}
            height={canvasSize.w / imageSettings.ratio}
            options={{ backgroundColor: 0xAABBBB }}>
            <Sprite
                image={imgDataURL}
                width={mwidth}
                height={mwidth / params.cR}
                anchor={0.5}
                x={parseInt(canvasSize.w / 2)}
                y={parseInt((canvasSize.w / imageSettings.ratio) / 2)}
            />
            <Graphics draw={draw} />
        </Stage>
    );
}