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
import { LineType } from '../../containers/shapes/shared/types';
import { Upload, Download } from '@mui/icons-material';
import {
  Dialog,
  DialogTitle,
  IconButton,
  Button,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import clsx from 'clsx';
import { useLineTypeStyle } from './LineTypeContext.styles';
import Papa from 'papaparse';
import InlineEdit from '../../components/InlineEdit/InlineEdit';
import ColorPicker from '../../components/ColorPicker/ColorPicker';
interface LineTypes {
  [key: string]: LineType;
}

interface LineTypeContext {
  lineTypes: LineTypes;
  setLineTypes: React.Dispatch<React.SetStateAction<LineTypes>>;
  selectedLineType: LineType;
  setSelectedLineType: React.Dispatch<React.SetStateAction<LineType>>;
  setShowLineTypeManagerDialog: React.Dispatch<React.SetStateAction<boolean>>;
}
const defaultLineTypes: LineTypes = {
  solid: {
    name: 'solid',
    appearance: '_____',
    description: 'Solid line ________',
  },
  dash: {
    name: 'dash',
    appearance: '- - - -',
    description: 'dash space _ _ _ _',
  },
};

const defaultValues: LineTypeContext = {
  lineTypes: defaultLineTypes,
  setLineTypes: () => {},
  selectedLineType: defaultLineTypes.solid,
  setSelectedLineType: () => {},
  setShowLineTypeManagerDialog: () => {},
};

export const LineTypeContext = createContext<LineTypeContext>(defaultValues);

export const useLineType = () => useContext(LineTypeContext);

interface Props {
  children: ReactNode;
}
export const LineTypeProvider: FC<Props> = ({ children }) => {
  const classes = useLineTypeStyle();
  const [lineTypes, setLineTypes] = useState<LineTypes>(defaultLineTypes);
  const [selectedLineType, setSelectedLineType] = useState(
    defaultLineTypes.default
  );
  const [initializedLocalLineType, setInitializedLocalLineType] =
    useState(false);
  const [showLineTypeManagerDialog, setShowLineTypeManagerDialog] =
    useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgInputRef = useRef<HTMLInputElement>(null);
  // Not the best way to get the params. useParams only works in Routes but this hook wraps the routes
  const drawingId = window.location.pathname.replace('/drawing/', '');

  useEffect(() => {
    const localLineTypes = localStorage.getItem(
      `sandbox-${drawingId}-linetypes`
    );
    if (localLineTypes) {
      console.log(localLineTypes);
      setLineTypes(JSON.parse(localLineTypes));
    }
    const localSelectedLineType = localStorage.getItem(
      `sandbox-${drawingId}-selected-linetype`
    );
    if (localSelectedLineType) {
      setSelectedLineType(JSON.parse(localSelectedLineType));
    }
    // Make sure local global variables have been set before trying to store changes to local storage
    setInitializedLocalLineType(true);
  }, []);
  useEffect(() => {
    if (!initializedLocalLineType) return;
    console.log(lineTypes);
    localStorage.setItem(
      `sandbox-${drawingId}-linetypes`,
      JSON.stringify(lineTypes)
    );
  }, [lineTypes, initializedLocalLineType]);
  useEffect(() => {
    if (!initializedLocalLineType) return;
    if (selectedLineType) {
      localStorage.setItem(
        `sandbox-${drawingId}-selected-linetype`,
        JSON.stringify(selectedLineType)
      );
    }
  }, [selectedLineType, initializedLocalLineType]);

  const updateLineTypeName = (oldName: string, newName: string) => {
    if (oldName === newName) return;
    // Don't allow renaming default line types
    if (Object.hasOwnProperty.call(defaultLineTypes, oldName)) return;
    setLineTypes((prevLineType) => {
      if (!Object.hasOwnProperty.call(prevLineType, oldName)) {
        console.warn(
          `LineType "${oldName}" does not exist and cannot be renamed`
        );
        return prevLineType;
      }
      const newLineTypes = { ...prevLineType };
      newLineTypes[newName] = { ...newLineTypes[oldName], name: newName };
      delete newLineTypes[oldName];

      return newLineTypes;
    });
  };
  const addLineType = (name: string, lineType: LineType) => {
    if (!name || name.trim() === '') return;
    setLineTypes((prevLineTypes) => {
      // Update line type if already exists
      if (prevLineTypes[name]) {
        return {
          ...prevLineTypes,
          [name]: { ...prevLineTypes[name], ...lineType },
        };
      } else {
        return {
          ...prevLineTypes,
          [name]: lineType,
        };
      }
    });
  };
  const updateLineType = (name: string, lineTypeUpdate: Partial<LineType>) => {
    if (!name || name.trim() === '') return;
    setLineTypes((prevLineTypes) => ({
      ...prevLineTypes,
      [name]: { ...prevLineTypes[name], ...lineTypeUpdate },
    }));
  };
  const deleteLineType = (name: string) => {
    // Don't delete any of the default line types
    if (Object.hasOwnProperty.call(defaultLineTypes, name)) return;
    // If trying to delete the selected line type, set selected line type to solid
    if (name === selectedLineType.name)
      setSelectedLineType(defaultLineTypes.solid);
    setLineTypes((prevLineTypes) => {
      if (Object.hasOwnProperty.call(prevLineTypes, name)) {
        const newLineTypes = { ...prevLineTypes };
        delete newLineTypes[name];
        return newLineTypes;
      } else {
        console.warn(
          `Line Type "${name}" does not exist and cannot be deleted`
        );
        return prevLineTypes;
      }
    });
  };
  const csvHeader = ['Line Type Name', 'Appearance', 'Description'];
  const exportToCsv = () => {
    const filename = `${drawingId}_linetypes_${Date.now().toString()}`;
    const csvRows = Object.values(lineTypes).join(',');

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
  const importAppearance = (e: any, key: string) => {
    console.log(e);
    if (!e?.target?.files) return;
    const file = e.target.files[0];
    console.log(file);
    if (file && file.type === 'image/svg+xml') {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const svgData = reader.result;
            console.log(svgData)
            setLineTypes({
                ...lineTypes,
                [key]: { ...lineTypes[key], appearance: svgData as string },
              });
        }
        reader.onerror = () => {
            console.error('Error reading SVG file')
        }
    }
  }
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
          const importedLineTypes = result.data.reduce(
            (acc: LineTypes, row: any) => {
              const lineTypeName = row['LineType Name'];
              if (!lineTypeName) throw new Error('Missing LineType Name');

              acc[lineTypeName] = {
                name: row['Line Type Name'],
                appearance: row['Appearance'],
                description: row['Description'],
              };

              return acc;
            },
            {}
          );
          setLineTypes({
            ...lineTypes,
            ...importedLineTypes,
          });
        } catch (e) {
          console.error('There was an error parsing the csv file', e);
        }
      },
      header: true,
    });
  };
  // Validation message for line type
  const lineTypeNameValidation = (text: string): string => {
    if (!text || text.trim() === '') return 'Required';
    if (Object.hasOwnProperty.call(lineTypes, text))
      return `Line Type "${text}" already exists. Please use a different name`;
    if (Object.hasOwnProperty.call(defaultLineTypes, text))
      return `Cannot modify default linetypes`;

    return '';
  };
  const handleLineTypeNameChange = (key: string, value: string) => {
    if (!value || value.trim() === '') {
      return;
    }
    // Don't allow renaming to an existing lineType
    if (Object.hasOwnProperty.call(lineTypes, value)) {
      return;
    }
    if (Object.hasOwnProperty.call(defaultLineTypes, value)) return;

    const newObj = { ...lineTypes };
    newObj[value] = { ...lineTypes[key], name: value};
    delete newObj[key];
    setLineTypes(newObj);
  };

  const getNewLineTypeName = (lineType: LineTypes, i: number): string => {
    let lineTypeName = `Line Type ${i}`;
    if (Object.hasOwnProperty.call(lineTypes, lineTypeName)) {
      lineTypeName = getNewLineTypeName(lineType, i + 1);
    }
    return lineTypeName;
  };
  const handleAddLineType = () => {
    const lineTypeName = getNewLineTypeName(lineTypes, 0);
    addLineType(lineTypeName, {
      ...defaultLineTypes.solid,
      name: lineTypeName,
    });
  };
  const handleLineTypeDescriptionChange = (key: string, value: string) => {
    // if (Object.hasOwnProperty.call(defaultLineTypes, value)) return;

    setLineTypes({
      ...lineTypes,
      [key]: { ...lineTypes[key], description: value },
    });
  };
  const renderGridRows = useMemo(() => {
    // Should be able to fit 10 blank rows given the height of this grid (24em)
    const blankRows = Math.max(
      0,
      Math.ceil(10 - Object.keys(lineTypes).length)
    );
    return (
      <>
        {Object.values(lineTypes).map((lineType) => {
          // const isHovered = globalVar === hoveredGlobalVariable;
          return (
            <div
              key={lineType.name}
              className={classes.gridRow}
              // onMouseOver={(e) => handleRowHover(e, globalVar)}
              // onMouseLeave={() => setHoveredGlobalVariable('')}
            >
              <div
                className={clsx(classes.cellKey, classes.cell)}
                title={lineType.name}
              >
                <InlineEdit
                  text={lineType.name}
                  onTextChange={(text: string) =>
                    handleLineTypeNameChange(lineType.name, text)
                  }
                  validationRule={lineTypeNameValidation}
                />
              </div>
              {/* Appearance */}
              <div className={clsx(classes.cell, classes.cellValue)}>
              <input
              type="file"
              accept=".svg"
              onChange={(e:any) => importAppearance(e, lineType.name)}
              ref={svgInputRef}
              className={classes.fileInput}
            />
                {/* <InlineEdit
                  text={lineType.appearance}
                  onTextChange={(text: string) =>
                    handleLineTypeAppearanceChange(lineType.name, text)
                  }
                /> */}
                <div className={classes.lineType} onClick={() => svgInputRef?.current?.click()}>{lineType.appearance.includes('svg') ? <img src={lineType.appearance} alt={lineType.name} className={classes.lineTypeImage} /> : lineType.appearance}</div>
              </div>
              {/* Description */}
              <div className={clsx(classes.cell, classes.cellValue)}>
                <InlineEdit
                  text={lineType.description}
                  onTextChange={(text: string) =>
                    handleLineTypeDescriptionChange(lineType.name, text)
                  }
                />
              </div>
            </div>
          );
        })}
        {/* Create blank rows for each lineType */}
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
  }, [lineTypes]);
  return (
    <LineTypeContext.Provider
      value={{
        lineTypes,
        setLineTypes,
        selectedLineType,
        setSelectedLineType,
        setShowLineTypeManagerDialog,
      }}
    >
      {children}
      <Dialog
        onClose={() => setShowLineTypeManagerDialog(false)}
        open={showLineTypeManagerDialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          <div>Line Types</div>
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
              onClick={handleAddLineType}
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
          <Button onClick={() => setShowLineTypeManagerDialog(false)}>
            Ok
          </Button>
          <Button onClick={() => setShowLineTypeManagerDialog(false)}>
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
    </LineTypeContext.Provider>
  );
};
