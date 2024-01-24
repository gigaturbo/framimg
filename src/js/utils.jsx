

export const getProcessedImage = (image, imageSettings) => {

    if (imageSettings.ratioMode === "OUTPUT_RATIO") {

        const params = getProcessingParameters(image, imageSettings)

        //  Ratio + Zoom + Translate
        let limg = image.crop({
            x: params.ctx,
            y: params.cty,
            width: params.innerWidth,
            height: params.innerHeight
        })

        // Borders
        limg = limg.pad({ size: params.pad, algorithm: "set", color: [255, 255, 255, 255] })

        return (limg)

    }

    return (image)
}

export const getProcessingParameters = (image, imageSettings) => {

    let dx = 0
    let dy = 0
    let ctx = 0
    let cty = 0
    let pad = 0
    let innerWidth = image.width
    let innerHeight = image.height
    let totalWidth = image.width
    let totalHeight = image.height
    let cR = image.width / image.height

    if (imageSettings.ratioMode === "OUTPUT_RATIO") {

        const b = imageSettings.borderSize
        const oR = imageSettings.ratio
        const cR = (1 - b / 100) / (1 / oR - b / 100)

        // Ratio is now fixed
        if (cR < image.width / image.height) {
            const cW = parseInt(image.height * cR)
            dx += parseInt(image.width - cW)
        } else {
            const cH = parseInt(image.width / cR)
            dy += parseInt(image.height - cH)
        }

        // Zoom *proportional* to ratio
        dx += (image.width - dx) - parseInt((image.width - dx) / imageSettings.zoom)
        dy += (image.height - dy) - parseInt((image.height - dy) / imageSettings.zoom)

        // Corrected translations
        ctx = Math.max(Math.min(imageSettings.translation.x, dx), 0)
        cty = Math.max(Math.min(imageSettings.translation.y, dy), 0)

        // Padding relative to new width
        pad = parseInt((b * parseInt((image.height - dy) * cR) / 100) / (2 - b / 50))

        // Inner and total width
        innerWidth = image.width - dx
        innerHeight = image.height - dy
        totalWidth = innerWidth + pad * 2
        totalHeight = innerHeight + pad * 2

        // Security
        dx = Math.max(Math.min(dx, image.width - 1), 1)
        dy = Math.max(Math.min(dy, image.height - 1), 1)
        pad = Math.max(pad, 0)

    }

    return ({ cR: cR, dx: dx, dy: dy, pad: pad, ctx: ctx, cty: cty, totalWidth: totalWidth, totalHeight: totalHeight, innerWidth: innerWidth, innerHeight: innerHeight })

}
