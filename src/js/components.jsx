import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ImageIcon from '@mui/icons-material/Image';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import MenuIcon from '@mui/icons-material/Menu';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CropRotateIcon from '@mui/icons-material/CropRotate';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { RemoveScroll } from 'react-remove-scroll';
import PixiCanvas from './pixi_canvas.jsx';
import { useCallback, useMemo } from 'react'


export function MainAppBar({ loadButton, downloadButton }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Framimg
                    </Typography>
                    {loadButton}
                    {downloadButton}
                </Toolbar>
            </AppBar>
        </Box>
    )
}


export function InteractiveImageViewer({ image, imageSettings, canvasSize, onImageDrag }) {
    if (image != null) {
        return (
            <RemoveScroll allowPinchZoom={false}>
                <PixiCanvas
                    image={image}
                    imageSettings={imageSettings}
                    canvasSize={canvasSize}
                    onImageDrag={onImageDrag}
                />
            </RemoveScroll>
        )
    }
    else {
        return (<RemoveScroll allowPinchZoom={false}></RemoveScroll>)
    }
}


export function SliderRatio({ imageSettings, onSliderChange, onRotateClick }) {

    const allowedRatios = useMemo(() => {
        return [[1, 1], [7, 6], [5, 4], [4, 3], [3, 2], [8, 5], [16, 9], [2, 1]]
    }, [])

    const ratioMarks = useMemo(() => {
        const [i, j] = imageSettings.orientation == 'LANDSCAPE' ? [0, 1] : [1, 0]
        return allowedRatios.map((el) => { return { value: el[i] / el[j], label: `${el[i]}:${el[j]}` } });
    }, [allowedRatios, imageSettings.orientation])

    const minV = useMemo(() => {
        const [i, j] = imageSettings.orientation == 'LANDSCAPE' ? [0, 1] : [1, 0]
        const v = allowedRatios.reduce((a, b) => (a[i] / a[j] < b[i] / b[j]) ? a : b)
        return v[i] / v[j];
    }, [allowedRatios, imageSettings.orientation])

    const maxV = useMemo(() => {
        const [i, j] = imageSettings.orientation == 'LANDSCAPE' ? [0, 1] : [1, 0]
        const v = allowedRatios.reduce((a, b) => (a[i] / a[j] > b[i] / b[j]) ? a : b)
        return v[i] / v[j];
    }, [allowedRatios, imageSettings.orientation])

    const valueRatioFormat = useCallback((value) => value.toFixed(2), [])

    return (
        <Stack spacing={2} direction="row" sx={{ mb: 2 }} alignItems="center">
            <AspectRatioIcon />
            <Slider
                defaultValue={1.0}
                min={minV}
                max={maxV}
                step={null}
                marks={ratioMarks}
                aria-label="Default"
                valueLabelDisplay="auto"
                value={imageSettings.ratio}
                valueLabelFormat={valueRatioFormat}
                getAriaValueText={(v) => { `${valueRatioFormat(v)}` }}
                onChange={onSliderChange}
            />
            <IconButton onClick={onRotateClick}>
                <CropRotateIcon />
            </IconButton>
        </Stack>
    );
}


export function SliderBorderSize({ imageSettings, onChange }) {

    const valueBorderFormat = useCallback((value) => `${value.toFixed(0)}%`, [])

    return (
        <Stack spacing={2} direction="row" sx={{ mb: 0.2 }} alignItems="center">
            <LineWeightIcon />
            <Slider
                defaultValue={0}
                min={0}
                max={50}
                step={1}
                marks
                aria-label="Default"
                valueLabelDisplay="auto"
                value={imageSettings.borderSize}
                valueLabelFormat={valueBorderFormat}
                getAriaValueText={(v) => { `${valueBorderFormat(v)}%` }}
                onChange={onChange}
            />
        </Stack>
    );
}


export function SliderZoom({ imageSettings, onChange }) {

    const valueZoomFormat = useCallback((value) => `${(value * 100).toFixed(0)}%`, [])

    return (
        <Stack spacing={2} direction="row" sx={{ mb: 0.2 }} alignItems="center">
            <ZoomInIcon />
            <Slider
                defaultValue={1}
                min={1}
                max={3}
                step={0.01}
                aria-label="Default"
                valueLabelDisplay="auto"
                value={imageSettings.zoom}
                valueLabelFormat={valueZoomFormat}
                getAriaValueText={(v) => { `${valueZoomFormat(v)}%` }}
                onChange={onChange}
            />
        </Stack>
    );
}


export function ImageInputButton({ loading, onChange }) {
    return (
        <IconButton aria-label="load image" component="label">
            <ImageIcon />
            <VisuallyHiddenInput
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={onChange}
                disabled={loading} />
        </IconButton >
    );
}


export function ImageDownloadButton({ disabled, onClick }) {

    return (
        <IconButton aria-label="load image" component="label" onClick={onClick}
            disabled={disabled} >
            <FileDownloadIcon />
        </IconButton >
    );
}



// --------------

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


