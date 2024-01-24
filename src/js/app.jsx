import Canvas from './canvas'
import { useState, useEffect, useRef } from 'react';
import { Image } from 'image-js';
import { styled } from '@mui/material/styles';
import { Slider } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Photo } from '@mui/icons-material';
import { getProcessingParameters } from './utils'


export function App() {

    const [windowSize, setWindowSize] = useState(getWindowSize());
    const [file, setFile] = useState(null); // File
    const [isImageLoading, setIsImageLoading] = useState(false) // Boolean
    const [image, setImage] = useState(null); // IJSImage
    const [imageSettings, setImageSettings] = useState({
        zoom: 1,
        borderSize: 0,
        ratio: 8 / 8,
        angle: 0,
        ratioMode: 'OUTPUT_RATIO',
        translation: { x: 0, y: 0 }
    })

    // EVENTS --------------------------------------------------------------------------------------

    // Window resize
    useEffect(() => {
        function handleWindowResize() {
            const ws = getWindowSize()
            setWindowSize(ws);
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);


    // File change
    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        const reader = new FileReader();
        reader.addEventListener('load', event => {
            Image.load(event.target.result).then(function (i) {
                setImage(i.resize({ width: 1024 }))
                setIsImageLoading(false)
            });
        });
        setIsImageLoading(true)
        reader.readAsDataURL(e.target.files[0]);
    }


    // Settings changed
    const handleImageSettingsChanged = (e, keyToUpdate) => {
        let settings = { ...imageSettings }
        settings[keyToUpdate] = e.target.value
        setImageSettings(settings)
    }


    // Image dragging
    const handleImageDrag = (tx, ty) => {
        let nSettings = { ...imageSettings }
        nSettings.translation.x = tx
        nSettings.translation.y = ty

        setImageSettings(nSettings)
    }


    // HTML ----------------------------------------------------------------------------------------

    function getFileNameText(f) {
        if (f == null) {
            return ' - '
        }
        return f.name
    }

    return (
        <div style={{ backgroundColor: '#AAAAAA' }}>
            <Stack spacing={2}>
                <h3>framimg</h3>
                <ImageInputButton loading={isImageLoading} onChange={handleFileChange} />
                <p>{getFileNameText(file)}</p>
                <ImageCanvas
                    image={image}
                    imageSettings={imageSettings}
                    windowSize={windowSize}
                    onImageDrag={handleImageDrag} />
                <SliderBorderSize
                    imageSettings={imageSettings}
                    onChange={(e) => handleImageSettingsChanged(e, "borderSize")} />
                <SliderZoom
                    imageSettings={imageSettings}
                    onChange={(e) => handleImageSettingsChanged(e, "zoom")} />
            </Stack>
        </div>
    );

}

// ELEMENTS ----------------------------------------------------------------------------------------

function SliderBorderSize({ imageSettings, onChange }) {
    return (<>
        {/* <RotateLeft /> */}
        <Slider
            defaultValue={0}
            min={0}
            max={50}
            step={1}
            marks
            aria-label="Default"
            valueLabelDisplay="auto"
            value={imageSettings.borderSize}
            getAriaValueText={(v) => { `${v}%` }}
            onChange={onChange}
        />
    </>
    );
}

function SliderZoom({ imageSettings, onChange }) {
    return (<>
        {/* <RotateLeft /> */}
        <Slider
            defaultValue={1}
            min={1}
            max={2}
            step={0.01}
            aria-label="Default"
            valueLabelDisplay="auto"
            value={imageSettings.zoom}
            getAriaValueText={(v) => { `${parseInt(v * 100)}%` }}
            onChange={onChange}
        />
    </>
    );
}

function ImageCanvas({ image, imageSettings, windowSize, onImageDrag }) {
    if (image != null) {
        return (
            <Canvas
                image={image}
                imageSettings={imageSettings}
                width={windowSize.innerWidth}
                height={windowSize.innerHeight}
                onImageDrag={onImageDrag} />
        )
    }
    else { return (<></>) }
}

function ImageInputButton({ loading, onChange }) {
    return (
        <LoadingButton
            loading={loading}
            loadingPosition="start"
            component="label"
            variant="contained"
            startIcon={<Photo />}
        >
            Load photo
            <VisuallyHiddenInput type="file" accept=".jpg, .jpeg, .png" onChange={onChange} disabled={loading} />
        </LoadingButton>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}