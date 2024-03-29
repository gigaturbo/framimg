import { Box, Container } from "@mui/material";
import { Graphics, Sprite, Stage } from "@pixi/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { calcParams } from "./utils";
import { useAppSettings, useImageSettings } from "./providers";

export default function PixiCanvas({ image, maxSize }) {
  const { imageSettings, imageSettingsDispatch } = useImageSettings();
  const { appSettings, appSettingsDispatch } = useAppSettings();

  const { pad, cW, cH, dW, dH, px, py, mtx, mty } = useMemo(
    () => calcParams(image, imageSettings, maxSize),
    [image, imageSettings, maxSize],
  );

  const touchBoxRef = useRef(null);
  const isMouseDown = useRef(false);
  const mouseInitialPosition = useRef(null);
  const previousTranslation = useRef({ x: 0, y: 0 });

  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(imageSettings.borderColor, imageSettings.borderAlpha);
      g.drawRect(0, 0, cW, pad);
      g.drawRect(0, cW / imageSettings.ratio - pad, cW, pad + 1);
      g.drawRect(0, pad, pad, cW / imageSettings.ratio - 2 * pad);
      g.drawRect(cW - pad, pad, pad, cW / imageSettings.ratio - 2 * pad);
      g.endFill();
    },
    [image, imageSettings, maxSize],
  );

  useEffect(() => {
    if (touchBoxRef.current) {
      touchBoxRef.current.onpointermove = handleMouseMove;
      touchBoxRef.current.onpointerdown = handleMouseDown;
      touchBoxRef.current.onpointerup = handleMouseUpOrLeave;
      touchBoxRef.current.onpointerout = handleMouseUpOrLeave;
      touchBoxRef.current.onpointerleave = handleMouseUpOrLeave;
      touchBoxRef.current.onpointercancel = handleMouseUpOrLeave;
    }
  }, [image, imageSettings, maxSize]);

  function handleMouseMove(e) {
    if (
      touchBoxRef.current &&
      mouseInitialPosition.current &&
      e.buttons === 1 &&
      isMouseDown.current
    ) {
      const { ctx, cty } = getTranslation(e.offsetX / cW, e.offsetY / cH);
      imageSettingsDispatch({
        type: "image_translated",
        newvalue: { x: ctx, y: cty },
      });
    }
  }

  function handleMouseUpOrLeave(e) {
    if (touchBoxRef.current && mouseInitialPosition.current) {
      isMouseDown.current = false;
      const { ctx, cty } = getTranslation(e.offsetX / cW, e.offsetY / cH);
      previousTranslation.current.x = ctx;
      previousTranslation.current.y = cty;
      mouseInitialPosition.current = null;
      imageSettingsDispatch({
        type: "image_translated",
        newvalue: { x: ctx, y: cty },
      });
    }
  }

  function handleMouseDown(e) {
    if (touchBoxRef.current && e.buttons === 1 && !isMouseDown.current) {
      isMouseDown.current = true;
      mouseInitialPosition.current = { x: e.offsetX / cW, y: e.offsetY / cH };
    }
  }

  function getTranslation(nx, ny) {
    // Compute displacement
    const dx = nx - mouseInitialPosition.current.x;
    const dy = ny - mouseInitialPosition.current.y;
    // Add to previous translations
    const ttx = dx + previousTranslation.current.x;
    const tty = dy + previousTranslation.current.y;
    // Cap translations
    const ctx = Math.max(Math.min(ttx, mtx / 2), -mtx / 2);
    const cty = Math.max(Math.min(tty, mty / 2), -mty / 2);
    return { ctx, cty };
  }

  return (
    <>
      <Container
        ref={touchBoxRef}
        sx={{
          // backgroundColor: "#FF9999", // tmp. for debug
          width: "min-content",
          height: "min-content",
        }}
        disableGutters
        pointerEvents={"auto"}
      >
        <Stage
          width={cW}
          height={cH}
          options={{
            backgroundColor: imageSettings.backgroundColor,
            backgroundAlpha: imageSettings.backgroundAlpha,
            // TODO Add app settings here?
          }}
        >
          <Sprite
            image={image.dataURL}
            width={dW}
            height={dH}
            anchor={0.5}
            x={px}
            y={py}
          />
          <Graphics draw={draw} />
        </Stage>
      </Container>
    </>
  );
}
