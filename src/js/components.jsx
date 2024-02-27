import React, { useCallback, useMemo, useState } from "react";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ImageIcon from "@mui/icons-material/Image";
import LineWeightIcon from "@mui/icons-material/LineWeight";
import MenuIcon from "@mui/icons-material/Menu";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CropRotateIcon from "@mui/icons-material/CropRotate";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TuneIcon from "@mui/icons-material/Tune";
import PaletteIcon from "@mui/icons-material/Palette";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";
import { MuiColorInput } from "mui-color-input";
import { RemoveScroll } from "react-remove-scroll";
import PixiCanvas from "./pixi_canvas.jsx";
import { useAppSettings, useImageSettings } from "./providers";

export function MainAppBar({
  onImageLoad,
  onImageExport,
  isImageLoading,
  disableDownload,
}) {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
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
          <ImageInputButton loading={isImageLoading} onChange={onImageLoad} />
          <ImageDownloadButton
            disabled={disableDownload}
            onClick={onImageExport}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export function InteractiveImageViewer({ image, maxSize }) {
  if (image != null) {
    return (
      <RemoveScroll allowPinchZoom={false}>
        <PixiCanvas image={image} maxSize={maxSize} />
      </RemoveScroll>
    );
  } else {
    return <RemoveScroll allowPinchZoom={false}></RemoveScroll>;
  }
}

export function SliderRatio() {
  const { imageSettings, imageSettingsDispatch } = useImageSettings();

  const allowedRatios = useMemo(() => {
    return [
      [1, 1],
      [7, 6],
      [5, 4],
      [4, 3],
      [3, 2],
      [8, 5],
      [16, 9],
      [2, 1],
    ];
  }, []);

  const ratioMarks = useMemo(() => {
    const [i, j] = imageSettings.orientation == "LANDSCAPE" ? [0, 1] : [1, 0];
    return allowedRatios.map((el) => {
      return { value: el[i] / el[j], label: `${el[i]}:${el[j]}` };
    });
  }, [allowedRatios, imageSettings.orientation]);

  const minV = useMemo(() => {
    const [i, j] = imageSettings.orientation == "LANDSCAPE" ? [0, 1] : [1, 0];
    const v = allowedRatios.reduce((a, b) =>
      a[i] / a[j] < b[i] / b[j] ? a : b,
    );
    return v[i] / v[j];
  }, [allowedRatios, imageSettings.orientation]);

  const maxV = useMemo(() => {
    const [i, j] = imageSettings.orientation == "LANDSCAPE" ? [0, 1] : [1, 0];
    const v = allowedRatios.reduce((a, b) =>
      a[i] / a[j] > b[i] / b[j] ? a : b,
    );
    return v[i] / v[j];
  }, [allowedRatios, imageSettings.orientation]);

  const valueRatioFormat = useCallback((value) => value.toFixed(2), []);

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 2 }} alignItems="center">
      <AspectRatioIcon color="action" />
      <Slider
        defaultValue={1.0}
        min={minV}
        max={maxV}
        step={null}
        size="medium"
        marks={ratioMarks}
        aria-label="Default"
        valueLabelDisplay="auto"
        value={imageSettings.ratio}
        valueLabelFormat={valueRatioFormat}
        getAriaValueText={(v) => {
          `${valueRatioFormat(v)}`;
        }}
        onChange={(e) =>
          imageSettingsDispatch({
            type: "ratio_changed",
            newvalue: e.target.value,
          })
        }
      />
      <IconButton
        onClick={() =>
          imageSettingsDispatch({
            type: "orientation_changed",
          })
        }
      >
        <CropRotateIcon />
      </IconButton>
    </Stack>
  );
}

export function SliderBorderSize() {
  const { imageSettings, imageSettingsDispatch } = useImageSettings();
  const valueBorderFormat = useCallback((value) => `${value.toFixed(0)}%`, []);

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0.2 }} alignItems="center">
      <LineWeightIcon color="action" />
      <Slider
        defaultValue={0}
        min={0}
        max={50}
        step={1}
        marks
        size="medium"
        aria-label="Default"
        valueLabelDisplay="auto"
        value={imageSettings.borderSize}
        valueLabelFormat={valueBorderFormat}
        getAriaValueText={(v) => {
          `${valueBorderFormat(v)}%`;
        }}
        onChange={(e) =>
          imageSettingsDispatch({
            type: "border_size_changed",
            newvalue: e.target.value,
          })
        }
      />
    </Stack>
  );
}

export function SliderZoom() {
  const { imageSettings, imageSettingsDispatch } = useImageSettings();

  const valueZoomFormat = useCallback(
    (value) => `${(value * 100).toFixed(0)}%`,
    [],
  );

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0.2 }} alignItems="center">
      <ZoomInIcon color="action" />
      <Slider
        defaultValue={1}
        min={1}
        max={3}
        step={0.01}
        size="medium"
        aria-label="Default"
        valueLabelDisplay="auto"
        value={imageSettings.zoom}
        valueLabelFormat={valueZoomFormat}
        getAriaValueText={(v) => `${valueZoomFormat(v)}%`}
        onChange={(e) =>
          imageSettingsDispatch({
            type: "zoom_changed",
            newvalue: e.target.value,
          })
        }
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
        disabled={loading}
      />
    </IconButton>
  );
}

export function ImageDownloadButton({ disabled, onClick }) {
  return (
    <IconButton
      aria-label="load image"
      component="label"
      onClick={onClick}
      disabled={disabled}
    >
      <FileDownloadIcon />
    </IconButton>
  );
}

const ToggleImageExportTypeButton = () => {
  const { appSettings, appSettingsDispatch } = useAppSettings();

  const getSliderIfJpg = useCallback((type) => {
    switch (type) {
      case "image/jpeg":
        return (
          <Box sx={{ pl: 1, pr: 2 }}>
            <Slider
              defaultValue={appSettings.export.quality}
              min={1}
              max={100}
              step={1}
              value={appSettings.export.quality}
              valueLabelDisplay="on"
              valueLabelFormat={(v) => `quality: ${appSettings.export.quality}`}
              onChange={(e, nv) =>
                appSettingsDispatch({
                  type: "export_quality_changed",
                  newvalue: nv,
                })
              }
            />
          </Box>
        );
      default:
        return <></>;
    }
  });

  return (
    <>
      <Grid container>
        <Grid xs={3}>
          <ToggleButtonGroup
            value={appSettings.export.type}
            size="small"
            exclusive
            onChange={(e, nv) => {
              if (nv !== null) {
                appSettingsDispatch({
                  type: "export_type_changed",
                  newvalue: nv,
                });
              }
            }}
            aria-label="text alignment"
          >
            <ToggleButton value="image/jpeg" aria-label="jpg">
              <Typography variant="button">JPG</Typography>
            </ToggleButton>
            <ToggleButton value="image/png" aria-label="png">
              <Typography variant="button">PNG</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid xs={9}>{getSliderIfJpg(appSettings.export.type)}</Grid>
      </Grid>
    </>
  );
};

const ToggleRoundPixelsButton = () => {
  const { appSettings, appSettingsDispatch } = useAppSettings();

  return (
    <Grid xs={12}>
      <FormControlLabel
        control={
          <Switch
            checked={appSettings.render.roundPixels}
            onChange={(e) => {
              appSettingsDispatch({
                type: "render_roundpixels_toggled",
                newvalue: e.target.checked,
              });
            }}
          />
        }
        label="Round pixels"
      />
    </Grid>
  );
};

const ToggleAntialiasButton = () => {
  const { appSettings, appSettingsDispatch } = useAppSettings();

  return (
    <Grid xs={12}>
      <FormControlLabel
        control={
          <Switch
            checked={appSettings.render.antialias}
            onChange={(e) => {
              appSettingsDispatch({
                type: "render_antialias_toggled",
                newvalue: e.target.checked,
              });
            }}
          />
        }
        label="Antialiasing"
      />
    </Grid>
  );
};

const BorderColorInput = () => {
  const { imageSettings, imageSettingsDispatch } = useImageSettings();

  return (
    <>
      <Typography gutterBottom>Border color</Typography>
      <MuiColorInput
        format="hex"
        value={imageSettings.borderColor}
        isAlphaHidden="true"
        onChange={(c) =>
          imageSettingsDispatch({ type: "border_color_changed", newvalue: c })
        }
        size="small"
        fallbackValue="#ffffff"
      />
    </>
  );
};

function ControlsTabTuning() {
  return (
    <>
      <Grid xs={12}>
        <SliderBorderSize />
      </Grid>
      <Grid xs={12}>
        <SliderZoom />
      </Grid>
      <Grid xs={12}>
        <SliderRatio />
      </Grid>
    </>
  );
}

function ColorsTuningTab() {
  return (
    <>
      <BorderColorInput />
    </>
  );
}

function ExportTuningTab() {
  return (
    <>
      <ToggleImageExportTypeButton />
      <ToggleRoundPixelsButton />
      <ToggleAntialiasButton />
    </>
  );
}

export function ControlsTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (e, nv) => setValue(nv);

  const getActiveTab = useCallback((v) => {
    switch (v) {
      case 0:
        return <ControlsTabTuning />;
      case 1:
        return <ColorsTuningTab />;
      case 2:
        return <ExportTuningTab />;
      default:
        return <div>Error, not tab found</div>;
    }
  });

  return (
    <Container
      maxWidth="sm"
      sx={{
        mb: 2, //  backgroundColor: "#99ffff"
      }}
      fixed
    >
      <Grid container spacing={1}>
        <Grid xs={12}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Controls tabs"
            sx={{ mb: 2 }}
          >
            <Tab icon={<TuneIcon />} aria-label="Image tuning" />
            <Tab icon={<PaletteIcon />} aria-label="Colors tuning" />
            <Tab icon={<ImportExportIcon />} aria-label="Export tuning" />
          </Tabs>
        </Grid>
        <Grid xs={12} sx={{ p: 2 }}>
          {getActiveTab(value)}
        </Grid>
      </Grid>
    </Container>
  );
}

// --------------

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
