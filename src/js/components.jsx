import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ImageIcon from '@mui/icons-material/Image';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import MenuIcon from '@mui/icons-material/Menu';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
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
import { useMemo } from 'react'


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
        return [[1, 1], [10, 8], [5, 4], [4, 3], [3, 2], [8, 5], [16, 9], [2, 1]]
    }, [])

    const ratioMarks = useMemo(() => {
        switch (imageSettings.orientation) {
            case 'LANDSCAPE':
                return allowedRatios.map((el) => {
                    return { value: el[0] / el[1], label: `${el[0]}:${el[1]}` }
                });
            case 'PORTRAIT':
                return allowedRatios.map((el) => {
                    return { value: el[1] / el[0], label: `${el[1]}:${el[0]}` }
                });
            default:
                return allowedRatios.map((el) => {
                    return { value: el[0] / el[1], label: `${el[0]}:${el[1]}` }
                });
        }
    }, [imageSettings.orientation, allowedRatios])

    //TODO COMPUTE MIN
    const minV = useMemo(() => {
        return imageSettings.orientation == 'LANDSCAPE' ? 1 : 1 / 2
    }, [imageSettings.orientation])

    //TODO COMPUTE MAX
    const maxV = useMemo(() => {
        return imageSettings.orientation == 'LANDSCAPE' ? 2 : 1
    }, [imageSettings.orientation])

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
                getAriaValueText={(v) => { `${v}` }}
                onChange={onSliderChange}
            />
            <IconButton onClick={onRotateClick}>
                <Rotate90DegreesCcwIcon />
            </IconButton>
        </Stack>
    );
}


export function SliderBorderSize({ imageSettings, onChange }) {
    return (
        <Stack spacing={2} direction="row" sx={{ mb: 0.5 }} alignItems="center">
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
                getAriaValueText={(v) => { `${v}%` }}
                onChange={onChange}
            />
        </Stack>
    );
}


export function SliderZoom({ imageSettings, onChange }) {
    return (
        <Stack spacing={2} direction="row" sx={{ mb: 0.5 }} alignItems="center">
            <ZoomInIcon />
            <Slider
                defaultValue={1}
                min={1}
                max={3}
                step={0.01}
                aria-label="Default"
                valueLabelDisplay="auto"
                value={imageSettings.zoom}
                getAriaValueText={(v) => { `${parseInt(v * 100)}%` }}
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


