import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import { Image } from 'image-js';
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { ImageDownloadButton, ImageInputButton, InteractiveImageViewer, MainAppBar, SliderBorderSize, SliderRatio, SliderZoom } from './components';
import { calcParams } from './utils';
import * as PIXI from 'pixi.js';

export function App() {

    const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
    const [file, setFile] = useState(null);
    const [isImageLoading, setIsImageLoading] = useState(false)
    const [image, setImage] = useState(null);
    const [imageSettings, setImageSettings] = useState({
        zoom: 1,
        borderSize: 10,
        ratio: 3 / 2,
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
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            Image.load(event.target.result).then(function (i) {
                let settings = { ...imageSettings }
                settings.zoom = 1
                settings.translation = { x: 0, y: 0 }
                settings.angle = 0
                setImageSettings(settings)
                setImage(i)
                setIsImageLoading(false)
                const txt = PIXI.Texture.fromBuffer(event.target.result, i.width, i.height)

            });
        });
        setFile(window.URL.createObjectURL(e.target.files[0]))
        setIsImageLoading(true)
        reader.readAsArrayBuffer(e.target.files[0]);
        // let s = sharp(e.target.files[0])
        // console.log(s)
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


    const handleExportImage = useCallback(async (e) => {

        const { pad, cW, cH, dW, dH, px, py, mtx, mty } = calcParams(image, imageSettings, { w: image.width, h: 0 })
        const app = new PIXI.Application({ background: '#CCBBBB', width: cW, height: cH, antialias: true })

        const mask = new PIXI.Graphics();
        mask.beginFill(0xFF0000);
        mask.drawRect(0, 0, cW, cH);
        mask.endFill();

        const container = new PIXI.Container();
        app.stage.addChild(container)
        container.x = cW / 2
        container.y = cH / 2
        container.pivot.x = cW / 2
        container.pivot.y = cH / 2
        container.mask = mask

        const photo = PIXI.Sprite.from(image.toDataURL())
        container.addChild(photo)
        photo.anchor.set(0.5)
        photo.x = px
        photo.y = py
        photo.width = dW
        photo.height = dH

        const frame = new PIXI.Graphics();
        photo.anchor.set(0.5)
        frame.beginFill(0xFFFFFF, 1);
        frame.drawRect(0, 0, cW, pad);
        frame.drawRect(0, (cW / imageSettings.ratio) - pad, cW, pad);
        frame.drawRect(0, pad, pad, cW / imageSettings.ratio - 2 * pad);
        frame.drawRect(cW - pad, pad, pad, cW / imageSettings.ratio - 2 * pad);
        frame.endFill();
        container.addChild(frame);

        container.getBounds()
        frame.getBounds()

        const outputImage = await app.renderer.extract.image(container,
            "image/jpeg",
            0.97,
            frame.getBounds()
        );
        const link = document.createElement("a");
        link.href = outputImage.src;
        link.download = "image.jpg";
        link.click();
        link.remove();
        app.destroy()

    }, [image, imageSettings])




    // HTML ----------------------------------------------------------------------------------------


    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            backgroundColor: "#666666"
        }}
        >

            {/* APP BAR */}
            <Grid container>
                <Grid xs={12}>
                    <MainAppBar
                        loadButton={<ImageInputButton loading={isImageLoading} onChange={handleFileChange} />}
                        downloadButton={<ImageDownloadButton disabled={isImageLoading || image === null} onClick={handleExportImage} />}
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
