export const getProcessedImage = (image, imageSettings) => {
  if (imageSettings.ratioMode === "OUTPUT_RATIO") {
    const params = getProcessingParameters(image, imageSettings);

    //  Ratio + Zoom + Translate
    let limg = image.crop({
      x: params.ctx + params.dx / 2,
      y: params.cty + params.dy / 2,
      width: params.innerWidth,
      height: params.innerHeight,
    });

    // Borders
    limg = limg.pad({
      size: params.pad,
      algorithm: "set",
      color: [255, 255, 255, 255],
    });

    return limg;
  }

  return image;
};

export const getProcessingParameters = (image, imageSettings) => {
  let dx = 0;
  let dy = 0;
  let ctx = 0;
  let cty = 0;
  let pad = 0;
  let innerWidth = image.width;
  let innerHeight = image.height;
  let totalWidth = image.width;
  let totalHeight = image.height;
  let cR = image.width / image.height;

  if (imageSettings.ratioMode === "OUTPUT_RATIO") {
    const b = imageSettings.borderSize;
    const oR = imageSettings.ratio;
    const cR = (1 - b / 100) / (1 / oR - b / 100);

    // Ratio is now fixed
    if (cR < image.width / image.height) {
      const cW = parseInt(image.height * cR);
      dx += parseInt(image.width - cW);
    } else {
      const cH = parseInt(image.width / cR);
      dy += parseInt(image.height - cH);
    }

    // Zoom *proportional* to ratio
    dx += image.width - dx - parseInt((image.width - dx) / imageSettings.zoom);
    dy +=
      image.height - dy - parseInt((image.height - dy) / imageSettings.zoom);

    // Padding relative to new width
    pad = parseInt(
      (b * parseInt((image.height - dy) * cR)) / 100 / (2 - b / 50),
    );

    // Inner and total width
    innerWidth = image.width - dx;
    innerHeight = image.height - dy;
    totalWidth = innerWidth + pad * 2;
    totalHeight = innerHeight + pad * 2;

    // Corrected translations
    ctx = Math.max(Math.min(imageSettings.translation.x, dx / 2), -dx / 2);
    cty = Math.max(Math.min(imageSettings.translation.y, dy / 2), -dy / 2);

    // Security
    dx = Math.max(Math.min(dx, image.width), 0);
    dy = Math.max(Math.min(dy, image.height), 0);
    pad = Math.max(pad, 0);
  }

  return {
    cR: cR,
    dx: dx,
    dy: dy,
    pad: pad,
    ctx: ctx,
    cty: cty,
    totalWidth: totalWidth,
    totalHeight: totalHeight,
    innerWidth: innerWidth,
    innerHeight: innerHeight,
  };
};

export const calcParams = (image, imageSettings, canvasSize, raw = false) => {
  const b = imageSettings.borderSize;
  const R = image.width / image.height; // raw image ratio
  const cW = canvasSize.w; // canvas width
  const cH = canvasSize.w / imageSettings.ratio; // canvas height
  const pad = cW * (b / 200); // padding in pixels per side
  const iH = cH - pad * 2; // inner height
  const iW = cW - pad * 2; // inner width
  const iR = iW / iH; // innerRatio

  let zW; // zoom=1 imageWidth
  let zH; // zoom=1 imageHeight
  let zZ = 1;
  if (R <= iR) {
    zW = iW;
    zH = iW / R;
    zZ = iR / R;
  } else {
    zH = iH;
    zW = iH * R;
    zZ = R / iR;
  }

  const dW = zW * imageSettings.zoom; // Sprite display width
  const dH = zH * imageSettings.zoom; // Sprite display height

  // Max translations
  const mtx = dW - iW; // width overlap (max)
  const mty = dH - iH; // height overlap (max)

  // assert(mtx >= 0)
  // assert(mty >= 0)

  // Cap translations
  const ctx = Math.max(
    Math.min(imageSettings.translation.x, mtx / 2),
    -mtx / 2,
  );
  const cty = Math.max(
    Math.min(imageSettings.translation.y, mty / 2),
    -mty / 2,
  );

  // Set position
  const px = cW / 2 + ctx; // Sprite x pos
  const py = cH / 2 + cty; // Sprite y pos

  return { pad, cW, cH, dW, dH, px, py, mtx, mty, zZ };
};
