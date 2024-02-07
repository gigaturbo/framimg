import { useMemo } from 'react';
import { Stage, Sprite } from '@pixi/react';
import { getProcessingParameters } from './utils'


export default function PixiCanvas({ image, imageSettings, canvasSize, onImageDrag }) {

    const params = getProcessingParameters(image, imageSettings)
    const imgDataURL = useMemo(() => { return image.toDataURL() }, [image])

    return (
        <Stage width={canvasSize.w} height={canvasSize.w / imageSettings.ratio}>
            <Sprite
                image={imgDataURL}
                width={params.innerWidth}
                height={params.innerWidth / params.cR}
                x={0}
                y={0}
            />
        </Stage>
    );
}