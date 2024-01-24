### Pipeline 

1. Calcul crop selon ratio de sortie
    - dx/dy, cR     =>  croppedImage

2. Rotation
    - ... rotate ...

3. Translation + Zoom
    - z, tx, ty        =>  transImage

5. Panorama
    - ... panorama ...



###

1. soit on veut une marge constante avec ratio de sortie
2. soit on veut une marge var. + ratio de sortie + ratio d'entrée (réglable ou non)

**Donc Cas 1 crop**

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

