export const calcParams = (image, imageSettings, maxSize) => {
  /*

  Alors ya :
  1.  une taille de canvas qui donne les dimensions maximales
      l'image finale sera scale sur cette taille
      en prenant en compte le ratio de sortie => ratio, cW, cH
  2.  ensuite on calcule les padding sur cW
  3.  on détermine les innerW, iH, iR, en utilisant le padding
  4.  on calcule la largeur d'image pour faire fitter sur iW/iH a zoom=1 => zW, zH
  5.  on utilise  deduit dW, dH de l'image après application du zoom
  6.  calcul des translations max et capped translations cty, cty = f(cW, cH)
  7.  calcul de la position px,py

  Problemo:
  1. les translations sauvegardées dans imageSettings sont fonction des anciens cW, cH

*/
  const b = imageSettings.borderSize;
  const R = image.width / image.height; // raw image ratio
  let cW, cH;
  if (maxSize.h >= maxSize.w / imageSettings.ratio) {
    cW = parseInt(maxSize.w);
    cH = parseInt(cW / imageSettings.ratio);
  } else {
    cH = parseInt(maxSize.h);
    cW = parseInt(cH * imageSettings.ratio);
  }
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
  const mtx = (dW - iW) / cW; // width overlap (max)
  const mty = (dH - iH) / cH; // height overlap (max)

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
  const px = cW / 2 + ctx * cW; // Sprite x pos
  const py = cH / 2 + cty * cH; // Sprite y pos

  return { pad, cW, cH, dW, dH, px, py, mtx, mty, zZ };
};
