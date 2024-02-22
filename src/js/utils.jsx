export const calcParams = (image, imageSettings, canvasSize) => {
  const b = imageSettings.borderSize;
  const R = image.width / image.height; // raw image ratio
  let cW, cH;
  // console.log(`CALC: avail canvas ${canvasSize.w} ${canvasSize.h}`);
  if (canvasSize.h >= canvasSize.w / imageSettings.ratio) {
    cW = parseInt(canvasSize.w);
    cH = parseInt(cW / imageSettings.ratio);
  } else {
    cH = parseInt(canvasSize.h);
    cW = parseInt(cH * imageSettings.ratio);
  }
  // console.log(`CALC: final canvas  ${cW} ${cH}`);
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
