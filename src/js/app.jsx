import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Image } from "image-js";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { InteractiveImageViewer } from "./components";
import { MainAppBar } from "./components";
import { ControlsTabs } from "./components";
import { useAppSettings, useImageSettings } from "./providers";
import { calcParams } from "./utils";
import * as PIXI from "pixi.js";

export function App() {
  const [maxSize, setMaxSize] = useState({ w: 0, h: 0 });
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [image, setImage] = useState(null);
  const { imageSettings, imageSettingsDispatch } = useImageSettings();
  const { appSettings, appSettingsDispatch } = useAppSettings();
  const canvasGridContainerRef = useRef(null);

  // EVENTS --------------------------------------------------------------------------------------

  // Window resize
  useEffect(() => {
    function handleWindowResize() {
      const w = canvasGridContainerRef.current.offsetWidth;
      const h = canvasGridContainerRef.current.offsetHeight;
      console.log(`Resize window ${w} ${h}`);
      setMaxSize({ w: w, h: h });
    }
    window.addEventListener("resize", handleWindowResize);
    handleWindowResize();
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  // Canvas size
  useEffect(() => {
    if (canvasGridContainerRef.current) {
      const w = canvasGridContainerRef.current.offsetWidth;
      const h = canvasGridContainerRef.current.offsetHeight;
      console.log(`Set size ${w} ${h}`);
      setMaxSize({ w: w, h: h });
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
      imageSettingsDispatch({ type: "reset_settings" });
      setImage(image);
      setIsImageLoading(false);
    };
    setIsImageLoading(true);
    reader.readAsDataURL(file);
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
    container.mask = mask;

    const background = new PIXI.Graphics();
    container.addChild(background);
    background.beginFill(
      imageSettings.backgroundColor,
      imageSettings.backgroundAlpha,
    );
    background.drawRect(0, 0, cW, cH);
    background.endFill();

    const photo = PIXI.Sprite.from(image.dataURL);
    container.addChild(photo);
    photo.anchor.set(0.5);
    photo.x = px;
    photo.y = py;
    photo.width = dW;
    photo.height = dH;

    const frame = new PIXI.Graphics();
    container.addChild(frame);
    frame.beginFill(imageSettings.borderColor, imageSettings.borderAlpha);
    frame.drawRect(0, 0, cW, pad);
    frame.drawRect(0, cW / imageSettings.ratio - pad, cW, pad);
    frame.drawRect(0, pad, pad, cW / imageSettings.ratio - 2 * pad);
    frame.drawRect(cW - pad, pad, pad, cW / imageSettings.ratio - 2 * pad);
    frame.endFill();

    container.getBounds();
    frame.getBounds();

    const outputImage = await app.renderer.extract.image(
      container,
      appSettings.export.type,
      appSettings.export.quality,
      frame.getBounds(),
    );
    const link = document.createElement("a");
    const extension = appSettings.export.type.split("/")[1];
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
            disableDownload={image === null}
          />
        </Grid>
      </Grid>
      {/* CANVAS */}
      <Container
        ref={canvasGridContainerRef}
        sx={{
          // backgroundColor: "#9999FF", // tmp. for debug
          display: "flex",
          flexDirection: "column",
          height: "60vh",
          mx: "auto",
        }}
        maxWidth="sm"
        disableGutters
        fixed
      >
        <InteractiveImageViewer image={image} maxSize={maxSize} />
      </Container>
      {/* SPACER */}
      <Container
        sx={{
          // backgroundColor: "#99ff99", // tmp. for debug
          display: "flex",
          flexDirection: "column",
          height: "2vh",
          mx: "auto",
        }}
      ></Container>
      {/* EXP TABS */}
      <ControlsTabs
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "38vh",
          mx: "auto",
          display: "fixed",
        }}
      ></ControlsTabs>
    </Box>
  );
}
