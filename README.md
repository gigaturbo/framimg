### Pipeline 

**Cas 1 crop**

cR = (1 - b)/(oH/oW - b)
d = (b*cW)/2(1-b)

### 

https://www.digitalocean.com/community/tutorials/how-to-handle-async-data-loading-lazy-loading-and-code-splitting-with-react
https://www.w3schools.com/js/js_api_web_workers.asp
https://parceljs.org/languages/javascript/#web-workers
https://mui.com/material-ui/
https://mui.com/material-ui/material-icons/?query=image
https://flow.org/
https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage
https://stackoverflow.com/questions/23268322/how-to-load-images-using-web-worker
https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
https://stackoverflow.com/questions/5789239/calculate-largest-inscribed-rectangle-in-a-rotated-rectangle#7513445
https://stackoverflow.com/questions/65815511/make-child-of-material-ui-grid-item-stretch-to-fit-the-remaining-height-of-the-p
https://sharp.pixelplumbing.com/
https://askubuntu.com/questions/426750/how-can-i-update-my-nodejs-to-the-latest-version#480642
https://github.com/callstack/react-native-image-editor
https://www.npmjs.com/package/react-remove-scroll
https://www.npmjs.com/package/sharp
https://stackoverflow.com/questions/44480053/how-to-detect-if-screen-size-has-changed-to-mobile-in-react
https://www.npmjs.com/package/react-touch-canvas
https://observablehq.com/@hubgit/gpu-js-canvas
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
https://github.com/pixijs/pixi-react
https://fr.wikipedia.org/wiki/Canvas_(HTML)
https://react.dev/learn/extracting-state-logic-into-a-reducer
https://github.com/retyui/react-quick-pinch-zoom/blob/master/docs/api/README.md
https://necolas.github.io/react-native-web/docs/setup/
https://necolas.github.io/react-native-web/docs/multi-platform/#compiling-and-bundling


optionalDependencies:
    "@img/sharp-darwin-arm64" "0.33.2"
    "@img/sharp-darwin-x64" "0.33.2"
    "@img/sharp-libvips-darwin-arm64" "1.0.1"
    "@img/sharp-libvips-darwin-x64" "1.0.1"
    "@img/sharp-libvips-linux-arm" "1.0.1"
    "@img/sharp-libvips-linux-arm64" "1.0.1"
    "@img/sharp-libvips-linux-s390x" "1.0.1"
    "@img/sharp-libvips-linux-x64" "1.0.1"
    "@img/sharp-libvips-linuxmusl-arm64" "1.0.1"
    "@img/sharp-libvips-linuxmusl-x64" "1.0.1"
    "@img/sharp-linux-arm" "0.33.2"
    "@img/sharp-linux-arm64" "0.33.2"
    "@img/sharp-linux-s390x" "0.33.2"
    "@img/sharp-linux-x64" "0.33.2"
    "@img/sharp-linuxmusl-arm64" "0.33.2"
    "@img/sharp-linuxmusl-x64" "0.33.2"
    "@img/sharp-wasm32" "0.33.2"
    "@img/sharp-win32-ia32" "0.33.2"
    "@img/sharp-win32-x64" "0.33.2"



pilege
imageSettings    : border | out_ratio | zoom
computedSettings : max_translation=f(out_ratio, zoom) | crp_ratio=f(border, out_ratio) | padding=f(border, crp_ratio, crp_size)


Rotate                  [-180; 180]
Zoom                    [1; 10]
Border %                [0%; 50%]
Ratio                   [1:1; 5:1]
Ratio Orient            {LANDSCAPE; PORTRAIT}
Ratio Mode              {OUTPUT_RATIO; INPUT_RATIO} OR {CONSTANT_BORDER_PX; CONSTANT_BORDER_%}
Translation_X           [0, ?]
Translation_y           [0, ?]

_OPERATIONS_:
1. Rotate
2. Crop to max zoomed+rotated+ratio rectangle
3. Compute max translations
4. Translate
5. Add borders
6. Display/Export

