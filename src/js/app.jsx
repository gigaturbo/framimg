import React from "react";
import { useState, useEffect, useRef } from 'react';
import { Image } from 'image-js';
import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';

import { getProcessedImage } from './utils'
import { MainAppBar, SliderRatio, SliderBorderSize, SliderZoom, InteractiveImageViewer, ImageInputButton, ImageDownloadButton } from './components'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export function App() {

    const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
    const [file, setFile] = useState(null);
    const [isImageLoading, setIsImageLoading] = useState(false)
    const [image, setImage] = useState(null);
    const [imageSettings, setImageSettings] = useState({
        zoom: 1,
        borderSize: 10,
        ratio: 8 / 5,
        angle: 0,
        ratioMode: 'OUTPUT_RATIO',
        translation: { x: 0, y: 0 }
    })

    const canvasGridContainerRef = useRef(null)

    // EVENTS --------------------------------------------------------------------------------------

    // Window resize
    useEffect(() => {
        function handleWindowResize() {
            const w = canvasGridContainerRef.current.offsetWidth
            const h = canvasGridContainerRef.current.offsetHeight
            setCanvasSize({ w: w, h: h });
        }
        window.addEventListener('resize', handleWindowResize);
        handleWindowResize()
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
                let settings = { ...imageSettings }
                settings.zoom = 1
                settings.translation = { x: 0, y: 0 }
                settings.angle = 0
                setImageSettings(settings)
                setImage(i)
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


    // Zoom changed
    const handleZoomChanged = (e) => {
        let settings = { ...imageSettings }
        settings.zoom = e.target.value
        setImageSettings(settings)
    }


    // Image dragging
    const handleImageDrag = (tx, ty) => {
        let nSettings = { ...imageSettings }
        nSettings.translation.x = tx
        nSettings.translation.y = ty
        setImageSettings(nSettings)
    }


    const handleDownload = (e) => {
        const link = document.createElement('a');
        link.download = 'image';
        link.href = getProcessedImage(image, imageSettings).toDataURL();
        link.click();
    };


    // HTML ----------------------------------------------------------------------------------------


    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            backgroundColor: "#666666"
        }}>

            {/* APP BAR */}
            <Grid container>
                <Grid xs={12}>
                    <MainAppBar
                        loadButton={<ImageInputButton loading={isImageLoading} onChange={handleFileChange} />}
                        downloadButton={<ImageDownloadButton disabled={isImageLoading || image === null} onClick={handleDownload} />}
                    />
                </Grid>
            </Grid>

            {/* CANVAS */}
            <Box ref={canvasGridContainerRef}>
                <InteractiveImageViewer
                    image={image}
                    imageSettings={imageSettings}
                    canvasSize={canvasSize}
                    onImageDrag={handleImageDrag} />
            </Box>

            {/* FILL */}
            <Box sx={{ marginTop: "auto" }}></Box>

            {/* BUTTONS */}
            <Grid xs={12} container spacing={2}>
                <Grid xs={12} container sx={{ px: '1.5rem', py: '2rem' }} >
                    <Grid xs={12}>
                        <SliderBorderSize
                            imageSettings={imageSettings}
                            onChange={(e) => handleImageSettingsChanged(e, "borderSize")} />
                    </Grid>

                    <Grid xs={12}>
                        <SliderZoom
                            imageSettings={imageSettings}
                            onChange={(e) => handleZoomChanged(e)} />
                    </Grid>

                    <Grid xs={12}>
                        <SliderRatio
                            imageSettings={imageSettings}
                            onChange={(e) => handleImageSettingsChanged(e, "ratio")} />
                    </Grid>
                </Grid>
            </Grid>

        </Box >
    );
}
