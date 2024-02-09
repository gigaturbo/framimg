import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LineWeightIcon from '@mui/icons-material/LineWeight';
import ImageIcon from '@mui/icons-material/Image';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { styled } from '@mui/material/styles';
import { RemoveScroll } from 'react-remove-scroll';

// import HTMLCanvas from './html_canvas.jsx'
import PixiCanvas from './pixi_canvas.jsx'


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
            <RemoveScroll allowPinchZoom={true}>
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
        return (
            <>
                <RemoveScroll allowPinchZoom={true}></RemoveScroll>
            </>)
    }
}


export function SliderRatio({ imageSettings, onChange }) {
    return (
        <Stack spacing={2} direction="row" sx={{ mb: 2 }} alignItems="center">
            <AspectRatioIcon />
            <Slider
                defaultValue={1.0}
                min={1}
                max={2}
                step={null}
                marks={ratioMarks}
                aria-label="Default"
                valueLabelDisplay="auto"
                value={imageSettings.ratio}
                getAriaValueText={(v) => { `${v}` }}
                onChange={onChange}
            />
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


const ratioMarks = [
    {
        value: 1,
        label: '1:1',
    },
    {
        value: 5 / 4,
        label: '5:4',
    },
    {
        value: 4 / 3,
        label: '4:3',
    },
    {
        value: 3 / 2,
        label: '3:2',
    },
    {
        value: 8 / 5,
        label: '8:5',
    },
    {
        value: 16 / 9,
        label: '16:9',
    },
    {
        value: 2,
        label: '2:1',
    }
];