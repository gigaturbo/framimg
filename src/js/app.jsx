import Canvas from './canvas'
import { useState } from 'react';
import { useEffect } from 'react';
import { Image } from 'image-js';
import { styled } from '@mui/material/styles';
import { Slider } from '@mui/material';
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { RotateLeft, Photo } from '@mui/icons-material';

// https://www.digitalocean.com/community/tutorials/how-to-handle-async-data-loading-lazy-loading-and-code-splitting-with-react
// https://www.w3schools.com/js/js_api_web_workers.asp
// https://parceljs.org/languages/javascript/#web-workers
// https://mui.com/material-ui/
// https://mui.com/material-ui/material-icons/?query=image
// https://flow.org/
// https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
// https://stackoverflow.com/questions/23268322/how-to-load-images-using-web-worker

export function App() {

    const [windowSize, setWindowSize] = useState(getWindowSize());
    const [file, setFile] = useState(null); // File
    const [isImageLoading, setIsImageLoading] = useState(false) // Boolean
    const [image, setImage] = useState(null); // IJSImage
    const [imageSettings, setImageSettings] = useState({
        zoom: 1,
        borderSize: 0,
        ratio: 5 / 5,
        angle: 0,
        ratioMode: 'OUTPUT_RATIO'
    })

    // EVENTS --------------------------------------------------------------------------------------

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

    // handle file change
    function handleFileChange(e) {
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

    const handleImageSettingsChanged = (e, keyToUpdate) => {
        let settings = { ...imageSettings }
        settings[keyToUpdate] = e.target.value
        setImageSettings(settings)
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
                <ImageCanvas image={image} imageSettings={imageSettings} windowSize={windowSize} />
                {/* <SliderRotate angle={angle} onChange={handleAngleChange} /> */}
                <SliderBorderSize imageSettings={imageSettings} onChange={(e) => handleImageSettingsChanged(e, "borderSize")}
                />
            </Stack>
        </div>
    );

}

// ELEMENTS ----------------------------------------------------------------------------------------

function SliderRotate({ angle, onChange }) {
    return (<>
        <RotateLeft />
        <Slider
            defaultValue={0}
            min={-180}
            max={180}
            aria-label="Default"
            valueLabelDisplay="auto"
            value={angle}
            getAriaValueText={(v) => { `${v} degres` }}
            onChange={onChange}
        />
    </>
    );
}

function SliderBorderSize({ imageSettings, onChange }) {
    return (<>
        {/* <RotateLeft /> */}
        <Slider
            defaultValue={0}
            min={0}
            max={50}
            aria-label="Default"
            valueLabelDisplay="auto"
            value={imageSettings.borderSize}
            getAriaValueText={(v) => { `${v}%` }}
            onChange={onChange}
        />
    </>
    );
}

function ImageCanvas({ image, imageSettings, windowSize }) {
    if (image != null) {
        return (
            <>
                <Canvas
                    image={image}
                    imageSettings={imageSettings}
                    width={windowSize.innerWidth}
                    height={windowSize.innerHeight} />
            </>
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