import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Image } from "image-js";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { InteractiveImageViewer } from "./components";
import { MainAppBar } from "./components";
import { SliderBorderSize } from "./components";
import { SliderRatio } from "./components";
import { SliderZoom } from "./components";
import { useAppSettings, useImageSettings } from "./providers";
import { calcParams } from "./utils";
import * as PIXI from "pixi.js";

export function App() {
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { imageSettings, setImageSettings } = useImageSettings();
  const { appSettings } = useAppSettings();
  const canvasGridContainerRef = useRef(null);

  // EVENTS --------------------------------------------------------------------------------------

  // Window resize
  useEffect(() => {
    function handleWindowResize() {
      const w = canvasGridContainerRef.current.offsetWidth;
      const h = canvasGridContainerRef.current.offsetHeight;
      console.log(`Resize window ${w} ${h}`);
      setCanvasSize({ w: w, h: h });
    }
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Canvas size
  useEffect(() => {
    const w = canvasGridContainerRef.current.offsetWidth;
    const h = canvasGridContainerRef.current.offsetHeight;
    if (canvasGridContainerRef.current) {
      console.log(`Set size ${w} ${h}`);
      setCanvasSize({ w: w, h: h });
    }
  }, [canvasGridContainerRef.current]);

  // File change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (er) => {
      const imgjs = await Image.load(er.target.result);
      const image = {
        imagejs: imgjs,
        width: imgjs.width,
        height: imgjs.height,
        dataURL: er.target.result,
        file: file,
      };
      let settings = { ...imageSettings };
      settings.zoom = 1;
      settings.translation = { x: 0, y: 0 };
      settings.angle = 0;
      setImageSettings(settings);
      setImage(image);
      setIsImageLoading(false);
    };
    setIsImageLoading(true);
    reader.readAsDataURL(file);
  };

  // Settings changed
  const handleImageSettingsChanged = (e, keyToUpdate) => {
    console.log(appSettings);
    let settings = { ...imageSettings };
    settings[keyToUpdate] = e.target.value;
    setImageSettings(settings);
  };

  // Zoom changed
  const handleZoomChanged = (e) => {
    let settings = { ...imageSettings };
    settings.zoom = e.target.value;
    setImageSettings(settings);
  };

  // Image dragging
  const handleImageDrag = (tx, ty) => {
    let nSettings = { ...imageSettings };
    nSettings.translation.x = tx;
    nSettings.translation.y = ty;
    setImageSettings(nSettings);
  };

  const handleOrientationChange = (e) => {
    let nSettings = { ...imageSettings };
    nSettings.orientation =
      nSettings.orientation == "LANDSCAPE" ? "PORTRAIT" : "LANDSCAPE";
    nSettings.ratio = 1.0 / nSettings.ratio;
    setImageSettings(nSettings);
  };

  const handleExportImage = useCallback(async () => {
    const fakeSize = {
      w: parseInt(image.width / imageSettings.zoom), // TODO compute real needed width here!
      h: parseInt(image.width / imageSettings.ratio / imageSettings.zoom),
    };

    const { pad, cW, cH, dW, dH, px, py } = calcParams(
      image,
      imageSettings,
      fakeSize,
    );

    const app = new PIXI.Application({
      width: cW,
      height: cH,
    });

    const mask = new PIXI.Graphics();
    mask.beginFill(0xff0000);
    mask.drawRect(0, 0, cW, cH);
    mask.endFill();

    const container = new PIXI.Container();
    app.stage.addChild(container);
    container.x = cW / 2;
    container.y = cH / 2;
    container.pivot.x = cW / 2;
    container.pivot.y = cH / 2;
    container.mask = mask;

    const background = new PIXI.Graphics();
    background.beginFill(appSettings.image.backgroundColor, 1);
    background.drawRect(0, 0, cW, cH);
    background.endFill();
    container.addChild(background);

    const photo = PIXI.Sprite.from(image.dataURL);
    container.addChild(photo);
    photo.anchor.set(0.5);
    photo.x = px;
    photo.y = py;
    photo.width = dW;
    photo.height = dH;

    const frame = new PIXI.Graphics();
    frame.beginFill(appSettings.image.borderColor, 1);
    frame.drawRect(0, 0, cW, pad);
    frame.drawRect(0, cW / imageSettings.ratio - pad, cW, pad);
    frame.drawRect(0, pad, pad, cW / imageSettings.ratio - 2 * pad);
    frame.drawRect(cW - pad, pad, pad, cW / imageSettings.ratio - 2 * pad);
    frame.endFill();
    container.addChild(frame);

    container.getBounds();
    frame.getBounds();

    const outputImage = await app.renderer.extract.image(
      container,
      appSettings.export.type,
      appSettings.export.quality,
      frame.getBounds(),
    );
    const link = document.createElement("a");
    const extension = "jpg";
    const suffix = "_frame";
    link.href = outputImage.src;
    link.download = `${image.file.name.split(".").slice(0, -1).join(".")}${suffix}.${extension}`;
    link.click();
    link.remove();
    app.destroy();
  }, [image, imageSettings]);

  // HTML ----------------------------------------------------------------------------------------

  // Custom element

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: appSettings.ui.backgroundColor,
      }}
    >
      {/* APP BAR */}
      <Grid container>
        <Grid xs={12}>
          <MainAppBar
            onImageExport={handleExportImage}
            onImageLoad={handleFileChange}
            isImageLoading={isImageLoading}
          />
        </Grid>
      </Grid>

      {/* CANVAS */}
      <Container
        ref={canvasGridContainerRef}
        sx={{
          backgroundColor: "#9999FF", // tmp. for debug
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          mx: "auto",
        }}
        maxWidth="sm"
        disableGutters
        fixed
      >
        <InteractiveImageViewer
          image={image}
          canvasSize={canvasSize}
          onImageDrag={handleImageDrag}
        />
      </Container>

      {/* BUTTONS */}
      <Grid xs={12} container spacing={2}>
        <Grid xs={12} container sx={{ px: "1.5rem", py: "2rem" }}>
          <Grid xs={12}>
            <SliderBorderSize
              onChange={(e) => handleImageSettingsChanged(e, "borderSize")}
            />
          </Grid>

          <Grid xs={12}>
            <SliderZoom onChange={(e) => handleZoomChanged(e)} />
          </Grid>

          <Grid xs={12}>
            <SliderRatio
              onSliderChange={(e) => handleImageSettingsChanged(e, "ratio")}
              onRotateClick={handleOrientationChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
