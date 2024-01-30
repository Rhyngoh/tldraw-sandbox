import React, {
  useState,
  createContext,
  useContext,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  LayerOptions,
  SizeOverride,
} from '../../containers/shapes/shared/types';
import { Upload, Download } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  IconButton,
  Button,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
} from '@mui/material';
import clsx from 'clsx';
import { useLayerStyle } from './LayerContext.styles';
import Papa from 'papaparse';
import InlineEdit from '../../components/InlineEdit/InlineEdit';
import { ColorChangeHandler, ColorResult, SketchPicker } from 'react-color';
import ColorPicker from '../../components/ColorPicker/ColorPicker';
interface Layers {
  [key: string]: LayerOptions;
}

interface Layer {
  layers: Layers;
  setLayers: React.Dispatch<React.SetStateAction<Layers>>;
  selectedLayerName: string;
  setSelectedLayerName: React.Dispatch<React.SetStateAction<string>>;
  selectedLayer: LayerOptions;
  setSelectedLayer: React.Dispatch<React.SetStateAction<LayerOptions>>;
  addLayer: (name: string, layer: LayerOptions) => void;
  updateLayer: (name: string, layerUpdate: Partial<LayerOptions>) => void;
  deleteLayer: (name: string) => void;
  updateLayerName: (oldName: string, newName: string) => void;
  setShowLayerManagerDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultLayers = {
  default: {
    color: 'black',
    dash: 'solid',
    size: 'm' as SizeOverride,
    opacity: 1,
    frozen: false,
  },
  Defpoints: {
    color: 'black',
    dash: 'solid',
    size: 'm' as SizeOverride,
    opacity: 1,
    frozen: false,
  },
};

const defaultValues: Layer = {
  layers: defaultLayers,
  setLayers: () => {},
  selectedLayerName: 'default',
  setSelectedLayerName: () => {},
  selectedLayer: defaultLayers.default,
  setSelectedLayer: () => {},
  addLayer: () => {},
  updateLayer: () => {},
  deleteLayer: () => {},
  updateLayerName: () => {},
  setShowLayerManagerDialog: () => {},
};

export const LayerContext = createContext<Layer>(defaultValues);

export const useLayer = () => useContext(LayerContext);

interface Props {
  children: ReactNode;
}
export const LayerProvider: FC<Props> = ({ children }) => {
  const classes = useLayerStyle();
  const [layers, setLayers] = useState<Layers>(defaultLayers);
  const [selectedLayerName, setSelectedLayerName] = useState('default');
  const [selectedLayer, setSelectedLayer] = useState(defaultLayers.default);
  const [initializedLocalLayer, setInitializedLocalLayer] = useState(false);
  const [showLayerManagerDialog, setShowLayerManagerDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Not the best way to get the params. useParams only works in Routes but this hook wraps the routes
  const drawingId = window.location.pathname.replace('/drawing/', '');

  useEffect(() => {
    const localLayers = localStorage.getItem(`sandbox-${drawingId}-layers`);
    if (localLayers) {
      setLayers(JSON.parse(localLayers));
    }
    const localSelectedLayerName = localStorage.getItem(
      `sandbox-${drawingId}-selected-layer-name`
    );
    if (localSelectedLayerName)
      setSelectedLayerName(JSON.parse(localSelectedLayerName));
    const localSelectedLayer = localStorage.getItem(
      `sandbox-${drawingId}-selected-layer`
    );
    if (localSelectedLayer) setSelectedLayer(JSON.parse(localSelectedLayer));
    // Make sure local global variables have been set before trying to store changes to local storage
    setInitializedLocalLayer(true);
  }, []);
  useEffect(() => {
    if (!initializedLocalLayer) return;
    localStorage.setItem(`sandbox-${drawingId}-layers`, JSON.stringify(layers));
  }, [layers, initializedLocalLayer]);
  useEffect(() => {
    if (!initializedLocalLayer) return;
    localStorage.setItem(
      `sandbox-${drawingId}-selected-layer-name`,
      JSON.stringify(selectedLayerName)
    );
    setSelectedLayer(layers[selectedLayerName]);
  }, [selectedLayerName, initializedLocalLayer]);
  useEffect(() => {
    if (!initializedLocalLayer) return;
    localStorage.setItem(
      `sandbox-${drawingId}-selected-layer`,
      JSON.stringify(selectedLayer)
    );
  }, [selectedLayer, initializedLocalLayer]);
  const updateLayerName = (oldName: string, newName: string) => {
    if (oldName === newName) return;
    setLayers((prevLayers) => {
      if (!Object.hasOwnProperty.call(prevLayers, oldName)) {
        console.warn(`Layer "${oldName}" does not exist and cannot be renamed`);
        return prevLayers;
      }
      const newLayers = { ...prevLayers };
      newLayers[newName] = newLayers[oldName];
      delete newLayers[oldName];

      return newLayers;
    });
  };
  const addLayer = (name: string, layer: LayerOptions) => {
    if (!name || name.trim() === '') return;
    setLayers((prevLayers) => {
      // Update layer if already exists
      if (prevLayers[name]) {
        return {
          ...prevLayers,
          [name]: { ...prevLayers[name], ...layer },
        };
      } else {
        return {
          ...prevLayers,
          [name]: layer,
        };
      }
    });
  };
  const updateLayer = (name: string, layerUpdate: Partial<LayerOptions>) => {
    if (!name || name.trim() === '') return;
    setLayers((prevLayers) => ({
      ...prevLayers,
      [name]: { ...prevLayers[name], ...layerUpdate },
    }));
  };
  const deleteLayer = (name: string) => {
    // Don't allow deletion of default or Defpoints layer
    if (name === 'default' || name === 'Defpoints') return;
    // If trying to delete the selected layer, set selected layer to default
    if (name === selectedLayerName) setSelectedLayerName('default');
    setLayers((prevLayers) => {
      if (Object.hasOwnProperty.call(prevLayers, name)) {
        const newLayers = { ...prevLayers };
        delete newLayers[name];
        return newLayers;
      } else {
        console.warn(`Layer "${name}" does not exist and cannot be deleted`);
        return prevLayers;
      }
    });
  };
  const csvHeader = [
    'Layer Name',
    'Color',
    'Dash',
    'Size',
    'Opacity',
    'Frozen',
  ];
  const exportToCsv = () => {
    const filename = `${drawingId}_layers_${Date.now().toString()}`;
    const rows = Object.entries(layers);
    const csvRows = rows.map(([layerName, layerOptions]) => {
      const layerValues = Object.values(layerOptions).join(',');
      return `${layerName},${layerValues}`;
    });

    const header = csvHeader.join(',');
    const csvString = [header, ...csvRows].join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + csvString;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);

    link.click();
  };
  const importFromFile = (e: any) => {
    if (!e?.target?.files) return;
    const file = e.target.files[0];

    Papa.parse(file, {
      error: (error) => {
        console.error('Error parsing CSV file:', error);
      },
      complete: (result: any) => {
        try {
          const headers = result.data[0] ? Object.keys(result.data[0]) : [];
          const isValidHeaders = csvHeader.every((header) =>
            headers.includes(header)
          );
          if (!isValidHeaders) {
            throw new Error('CSV headers do not match the expected format.');
          }
          const importedLayers = result.data.reduce((acc: Layers, row: any) => {
            const layerName = row['Layer Name'];
            if (!layerName) throw new Error('Missing layer name.');

            acc[layerName] = {
              color: row['Color'],
              dash: row['Dash'],
              size: row['Size'],
              opacity: parseFloat(row['Opacity']),
              frozen: row['Frozen'] === 1, // boolean
            };

            return acc;
          }, {});
          setLayers({
            ...layers,
            ...importedLayers,
          });
        } catch (e) {
          console.error('There was an error parsing the csv file', e);
        }
      },
      header: true,
    });
  };
  const layerNameValidation = (text: string): string => {
    if (!text || text.trim() === '') return 'Required';
    if (Object.hasOwnProperty.call(layers, text))
      return `Layer "${text}" already exists. Please use a different name`;
    return '';
  };
  const handleLayerNameChange = (key: string, value: string) => {
    if (!value || value.trim() === '') {
      return;
    }
    // Don't allow renaming to an existing layer
    if (Object.hasOwnProperty.call(layers, value)) {
      return;
    }
    const newObj = { ...layers };
    newObj[value] = layers[key];
    delete newObj[key];
    setLayers(newObj);
  };
  const handleColorChange = (color: string, key: string) => {
    if (!color) return;
    setLayers({
      ...layers,
      [key]: {
        ...layers[key],
        color: color,
      },
    });
  };
  const opacityValidation = (text: string): string => {
    if (!text || text.trim() === '') return 'Required';
    if (
      isNaN(parseFloat(text)) ||
      parseFloat(text) > 1 ||
      parseFloat(text) < 0.1
    )
      return 'Opacity must be a number between 0.1 and 1';
    return '';
  };
  const handleOpacityChange = (key: string, value: string) => {
    // If input has no value, is not within 0.1 - 1, or is not a number, don't set opacity
    if (
      !value ||
      isNaN(parseFloat(value)) ||
      parseFloat(value) > 1 ||
      parseFloat(value) < 0.1
    )
      return;
    setLayers({
      ...layers,
      [key]: {
        ...layers[key],
        opacity: parseFloat(value),
      },
    });
  };
  const getNewLayerName = (layer: Layers, i: number): string => {
    let layerName = `Layer ${i}`;
    if (Object.hasOwnProperty.call(layers, layerName)) {
      layerName = getNewLayerName(layer, i + 1);
    }
    return layerName;
  };
  const handleAddLayer = () => {
    const layerName = getNewLayerName(layers, 0);
    addLayer(layerName, defaultLayers.default);
  };
  const handleFrozenChange = (layer: [string, LayerOptions]) => {
    setLayers({
      ...layers,
      [layer[0]]: {
        ...layers[layer[0]],
        frozen: !layer[1].frozen,
      },
    });
  };
  const sizeValidation = (text: string): string => {
    if (!text || text.trim() === '') return 'Required';
    if (text === 's' || text === 'm' || text === 'l' || text === 'xl')
      return '';
    if (isNaN(parseInt(text)))
      return 'Size must either be [s,m,l,xl] or an integer in pixels';
    return '';
  };
  const handleSizeChange = (key: string, value: string) => {
    if (!value || value.trim() === '') return 'Required';
    if (
      value !== 's' &&
      value !== 'm' &&
      value !== 'l' &&
      value !== 'xl' &&
      isNaN(parseInt(value))
    )
      return;
    setLayers({
      ...layers,
      [key]: {
        ...layers[key],
        size: isNaN(parseInt(value))
          ? (value as SizeOverride)
          : (parseInt(value) as SizeOverride),
      },
    });
  };
  const renderGridRows = useMemo(() => {
    // Should be able to fit 10 blank rows given the height of this grid (24em)
    const blankRows = Math.max(0, Math.ceil(10 - Object.keys(layers).length));
    return (
      <>
        {Object.entries(layers).map((layer) => {
          // const isHovered = globalVar === hoveredGlobalVariable;
          return (
            <div
              key={layer[0]}
              className={classes.gridRow}
              // onMouseOver={(e) => handleRowHover(e, globalVar)}
              // onMouseLeave={() => setHoveredGlobalVariable('')}
            >
              <div
                className={clsx(classes.cellKey, classes.cell)}
                title={layer[0]}
              >
                {layer[0] === 'default' ? (
                  layer[0]
                ) : (
                  <InlineEdit
                    text={layer[0]}
                    onTextChange={(text: string) =>
                      handleLayerNameChange(layer[0], text)
                    }
                    validationRule={layerNameValidation}
                    // validationMessage={layerNameValidation}
                  />
                )}
              </div>
              {/* Color */}
              <div className={clsx(classes.cell, classes.cellValue)}>
                <ColorPicker
                  color={layer[1].color}
                  handleChange={(color) => handleColorChange(color, layer[0])}
                />
              </div>
              {/* Dash (Linetype) */}
              <div className={clsx(classes.cell, classes.cellValue)}>
                {layer[1].dash}
              </div>
              {/* Size */}
              <div className={clsx(classes.cell, classes.cellValue)}>
                <InlineEdit
                  text={layer[1].size.toString()}
                  onTextChange={(text: string) =>
                    handleSizeChange(layer[0], text)
                  }
                  validationRule={sizeValidation}
                />
              </div>
              {/* Opacity */}
              <div className={clsx(classes.cell, classes.cellValue)}>
                <InlineEdit
                  text={layer[1].opacity.toString()}
                  onTextChange={(text: string) =>
                    handleOpacityChange(layer[0], text)
                  }
                  validationRule={opacityValidation}
                />
              </div>
              {/* Frozen */}
              <div className={clsx(classes.cell, classes.cellValue)}>
                <Checkbox
                  checked={layer[1].frozen}
                  onChange={() => handleFrozenChange(layer)}
                />
              </div>
            </div>
          );
        })}
        {/* Create blank rows for each layer */}
        {Array.from({ length: blankRows }).map((_, index) => (
          <div key={`blank-row-${index}`} className={classes.gridRow}>
            <div className={clsx(classes.cellKey, classes.cell)}></div>
            {/* Create blank cells for each column */}
            {Array.from(Array(csvHeader.length - 1)).map((cell, index) => {
              return <div key={index} className={classes.cell}></div>;
            })}
          </div>
        ))}
      </>
    );
  }, [layers]);
  return (
    <LayerContext.Provider
      value={{
        layers,
        setLayers,
        selectedLayerName,
        setSelectedLayerName,
        selectedLayer,
        setSelectedLayer,
        addLayer,
        updateLayer,
        deleteLayer,
        updateLayerName,
        setShowLayerManagerDialog,
      }}
    >
      {children}
      <Dialog
        onClose={() => setShowLayerManagerDialog(false)}
        open={showLayerManagerDialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          <div>Layers</div>
          <div className={classes.dialogTitleActions}>
            <input
              type="file"
              accept=".csv"
              onChange={importFromFile}
              ref={fileInputRef}
              className={classes.fileInput}
            />
            <IconButton
              aria-label="Import"
              className={classes.iconButton}
              title="Import to csv"
              size="small"
              onClick={() => fileInputRef?.current?.click()}
            >
              <Upload className={classes.icon} />
            </IconButton>
            <IconButton
              aria-label="Export"
              className={classes.iconButton}
              title="Export to csv"
              size="small"
              onClick={exportToCsv}
            >
              <Download className={classes.icon} />
            </IconButton>
            <Button
              className={classes.editButtons}
              // onClick={() => setShowGlobalVariablesAddDialog(true)}
              onClick={handleAddLayer}
            >
              + New
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className={classes.dialogContent}>
            <div className={classes.gridSection}>
              {csvHeader.map((header, index) => {
                if (index === 0)
                  return (
                    <div
                      className={clsx(
                        classes.cellKey,
                        classes.headerCell,
                        classes.gridHeader
                      )}
                      key={header}
                      title={header}
                    >
                      {header}
                    </div>
                  );
                return (
                  <div
                    className={clsx(classes.headerCell, classes.gridHeader)}
                    key={header}
                    title={header}
                  >
                    {header}
                  </div>
                );
              })}
              {renderGridRows}
            </div>
            <div className={classes.grow}></div>
          </div>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={() => setShowLayerManagerDialog(false)}>Ok</Button>
          <Button onClick={() => setShowLayerManagerDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {/* <Dialog onClose={closeAddDialog} open={showGlobalVariablesAddDialog}>
        <DialogTitle className={classes.dialogTitle}>Add Global Variable</DialogTitle>
        <form onSubmit={handleGlobalVariableAdd} className={classes.dialog}>
          <TextField
            id="global-variable-key"
            label="Name"
            error={globalVariableHelperText !== ''}
            helperText={globalVariableHelperText}
            value={globalVariableKey}
            onChange={(e) => setGlobalVariableKey(e.target.value)}
            autoFocus
          />
          <TextField
            id="global-variable-value"
            label="Value"
            value={globalVariableValue}
            onChange={(e) => setGlobalVariableValue(e.target.value)}
          />
          <Button
            type="submit"
            disabled={
              globalVariableKey.trim() === '' ||
              globalVariableValue.trim() === ''
            }
          >
            {globalVariableHelperText ? 'Edit' : 'Add'} Global Variable
          </Button>
        </form>
      </Dialog> */}
    </LayerContext.Provider>
  );
};
