import { useMemo, useCallback } from 'react';
import { Stage, Sprite, Graphics } from '@pixi/react';
import { getProcessingParameters2 } from './utils'


export default function PixiCanvas({ image, imageSettings, canvasSize, onImageDrag }) {

    const params = getProcessingParameters2(image, imageSettings)
    const imgDataURL = useMemo(() => { return image.toDataURL() }, [image])

    const real_pad = parseInt(canvasSize.w * (imageSettings.borderSize / 200))
    const inner_width = parseInt(canvasSize.w - real_pad * 2)


    const draw = useCallback((g) => {
        g.clear();
        g.beginFill(0xFFFFFF);
        g.drawRect(0, 0, canvasSize.w, real_pad);
        g.drawRect(0, 0, real_pad, canvasSize.w / imageSettings.ratio);
        g.drawRect(canvasSize.w - real_pad, 0, real_pad, canvasSize.w / imageSettings.ratio);
        g.drawRect(0, (canvasSize.w / imageSettings.ratio) - real_pad, canvasSize.w, real_pad);
        g.endFill();
    }, [imageSettings]);

    return (
        <Stage
            width={canvasSize.w}
            height={canvasSize.w / imageSettings.ratio}
            options={{ backgroundColor: 0xAABBBB }}>
            <Sprite
                image={imgDataURL}
                width={inner_width * imageSettings.zoom}
                height={(inner_width / params.cR) * imageSettings.zoom}
                anchor={0.5}
                x={parseInt(canvasSize.w / 2) + imageSettings.translation.x}
                y={parseInt((canvasSize.w / imageSettings.ratio) / 2) + imageSettings.translation.y}
            />
            <Graphics draw={draw} />
        </Stage>
    );
}