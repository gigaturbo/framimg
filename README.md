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