import Canvas from './canvas'
import { useState } from 'react';
import { useEffect } from 'react';
// import { useEffectEvent } from 'react';
import Image from 'image-js';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import LoadingButton from '@mui/lab/LoadingButton';
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

    const [image, setImage] = useState(null); // IJSImage
    const [file, setFile] = useState(null); // File
    const [isImageLoading, setIsImageLoading] = useState(false) // Boolean
    const [angle, setAngle] = useState(0); // Number

    // EVENTS --------------------------------------------------------------------------------------

    // async image loading
    // useEffect(() => {
    //     if (file != null) {
    //         let worker = new Worker(new URL("load_image.jsx", import.meta.url), { type: 'module' });
    //         worker.postMessage(file);
    //         setIsImageLoading(true)
    //         worker.onmessage = function (event) {
    //             console.log("Main thread received" + event.data);
    //             let limg = Image.bind(event.data)
    //             if (limg != null) {
    //                 setImage(limg)
    //                 setIsImageLoading(false)
    //             }
    //         };
    //         worker.onerror = function (e) {
    //             console.log("Main thread received error");
    //             setIsImageLoading(false)
    //         };
    //     }
    // }, [file])

    // handle file change
    function handleFileChange(e) {
        setFile(e.target.files[0])
        const reader = new FileReader();
        reader.addEventListener('load', event => {
            Image.load(event.target.result).then(function (i) {
                setImage(i.resize({ width: 256 }))
            });
        });
        reader.readAsDataURL(e.target.files[0]);
    }

    // handle angle change
    const handleAngleChange = (e, v) => {
        setAngle(v);
    };

    // HTML ----------------------------------------------------------------------------------------

    function getFileNameText(f) {
        if (f == null) {
            return '-'
        }
        return f.name
    }

    return (
        <>
            <h3>framimg</h3>
            <ImageInputButton loading={isImageLoading} onChange={handleFileChange} />
            <p>{getFileNameText(file)}</p>
            <div className="responsive-img">
                <ImageCanvas img={image} angle={angle} />
            </div>
            <SliderRotate angle={angle} onChange={handleAngleChange} />
        </>
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

function ImageCanvas({ img: image, angle }) {
    if (image != null) {
        return (<Canvas img={image} angle={angle} width={300} height={300} />)
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
