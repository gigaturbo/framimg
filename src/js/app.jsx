import React from "react";
import { useState, useEffect, useRef } from 'react';
import { Image } from 'image-js';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import ImageIcon from '@mui/icons-material/Image';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { TransformWrapper, TransformComponent, useTransformEffect } from "react-zoom-pan-pinch";
import { RemoveScroll } from 'react-remove-scroll';

import { getProcessedImage } from './utils'

import Grid from '@mui/material/Unstable_Grid2';
import Box from '@mui/material/Box';
import Canvas from './canvas.jsx'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export function App() {

    const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
    const [file, setFile] = useState(null); // File
    const [isImageLoading, setIsImageLoading] = useState(false) // Boolean
    const [image, setImage] = useState(null); // IJSImage
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
                // setImage(i.resize({ width: 2048 }))
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
                <ImageCanvas
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

// ELEMENTS ----------------------------------------------------------------------------------------

function MainAppBar({ loadButton, downloadButton }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Framimg
                    </Typography>
                    {loadButton}
                    {downloadButton}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

function SliderRatio({ imageSettings, onChange }) {
    return (
        <Stack spacing={2} direction="row" sx={{ mb: 2 }} alignItems="center">
            <AspectRatioIcon />
            <Slider
                defaultValue={1.0}
                min={1}
                max={2}
                step={null}
                marks={ratioMarks}
                aria-label="Default"
                valueLabelDisplay="auto"
                value={imageSettings.ratio}
                getAriaValueText={(v) => { `${v}` }}
                onChange={onChange}
            />
        </Stack>
    );
}

function SliderBorderSize({ imageSettings, onChange }) {
    return (
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <LineWeightIcon />
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
        </Stack>
    );
}

function SliderZoom({ imageSettings, onChange }) {
    return (
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
            <ZoomInIcon />
            <Slider
                defaultValue={1}
                min={1}
                max={3}
                step={0.01}
                aria-label="Default"
                valueLabelDisplay="auto"
                value={imageSettings.zoom}
                getAriaValueText={(v) => { `${parseInt(v * 100)}%` }}
                onChange={onChange}
            />
        </Stack>
    );
}

function ImageCanvas({ image, imageSettings, canvasSize, onImageDrag }) {
    if (image != null) {
        return (
            <RemoveScroll allowPinchZoom={true}>
                <TransformWrapper>
                    <TransformComponent>
                        <Canvas
                            image={image}
                            imageSettings={imageSettings}
                            canvasSize={canvasSize}
                            // onImageDrag={onImageDrag}
                            onImageDrag={() => { }} // TODO replace by pinchzoompan
                        />
                    </TransformComponent>
                </TransformWrapper>
            </RemoveScroll>
        )
    }
    else {
        return (<>
            <RemoveScroll allowPinchZoom={true}>
                <TransformWrapper>
                    <TransformComponent>
                    </TransformComponent>
                </TransformWrapper>
            </RemoveScroll>
        </>)
    }
}

function ImageInputButton({ loading, onChange }) {
    return (
        <IconButton aria-label="load image" component="label">
            <ImageIcon color="contrastText" />
            <VisuallyHiddenInput
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={onChange}
                disabled={loading} />
        </IconButton >
    );
}

function ImageDownloadButton({ disabled, onClick }) {

    return (
        <IconButton aria-label="load image" component="label" onClick={onClick}
            disabled={disabled} >
            <FileDownloadIcon color="contrastText" />
        </IconButton >
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


const ratioMarks = [
    {
        value: 1,
        label: '1:1',
    },
    {
        value: 5 / 4,
        label: '5:4',
    },
    {
        value: 4 / 3,
        label: '4:3',
    },
    {
        value: 3 / 2,
        label: '3:2',
    },
    {
        value: 8 / 5,
        label: '8:5',
    },
    {
        value: 16 / 9,
        label: '16:9',
    },
    {
        value: 2,
        label: '2:1',
    }
];