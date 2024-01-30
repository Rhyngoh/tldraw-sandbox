import {
  Dialog,
  DialogTitle,
  TextField,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Grid,
} from '@mui/material';
import { DeleteOutline, Download, Upload } from '@mui/icons-material';
// import PlusIcon from '@mui/icons-material/Add'
import React, {
  useState,
  createContext,
  useContext,
  FC,
  ReactNode,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useGlobalVariablesStyle } from './GlobalVariablesContext.styles';
import clsx from 'clsx';
import InlineEdit from '../../components/InlineEdit/InlineEdit';
import { usePrevious } from '../../hooks/usePrevious';
import Papa from 'papaparse';

interface GlobalVariables {
  showGlobalVariablesDialog: boolean;
  setShowGlobalVariablesDialog: React.Dispatch<React.SetStateAction<boolean>>;
  globalVariables: GlobalVariable;
  setGlobalVariables: React.Dispatch<React.SetStateAction<GlobalVariable>>;
}

const defaultValues: GlobalVariables = {
  showGlobalVariablesDialog: false,
  setShowGlobalVariablesDialog: () => {},
  globalVariables: {},
  setGlobalVariables: () => {},
};
export const GlobalVariablesContext =
  createContext<GlobalVariables>(defaultValues);

export const useGlobalVariables = () => useContext(GlobalVariablesContext);

interface Props {
  children: ReactNode;
}
interface GlobalVariable {
  [key: string]: string;
}
export const GlobalVariablesProvider: FC<Props> = ({ children }) => {
  const classes = useGlobalVariablesStyle();
  const [showGlobalVariablesDialog, setShowGlobalVariablesDialog] =
    useState(false);
  const [showGlobalVariablesAddDialog, setShowGlobalVariablesAddDialog] =
    useState(false);
  const [globalVariableKey, setGlobalVariableKey] = useState('');
  const [globalVariableValue, setGlobalVariableValue] = useState('');
  const [globalVariableHelperText, setGlobalVariableHelperText] = useState('');
  const [globalVariables, setGlobalVariables] = useState<GlobalVariable>({});
  const [initializedLocalGlobalVariables, setInitializedLocalGlobalVariables] =
    useState(false);
  const [hoveredGlobalVariable, setHoveredGlobalVariable] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Not the best way to get the params. useParams only works in Routes but this hook wraps the routes
  const drawingId = window.location.pathname.replace('/drawing/', '');

  useEffect(() => {
    if (globalVariableKey in globalVariables) {
      setGlobalVariableHelperText(
        `${globalVariableKey} is already in use. Adding will update the existing value.`
      );
    } else {
      setGlobalVariableHelperText('');
    }
  }, [globalVariableKey]);
  useEffect(() => {
    const localGlobalVariables = localStorage.getItem(
      `sandbox-global-variables-${drawingId}`
    );
    if (localGlobalVariables) {
      setGlobalVariables(JSON.parse(localGlobalVariables));
      // Make sure local global variables have been set before trying to store changes to local storage
      setInitializedLocalGlobalVariables(true);
    }
  }, []);
  useEffect(() => {
    if (!initializedLocalGlobalVariables) return;
    localStorage.setItem(
      `sandbox-global-variables-${drawingId}`,
      JSON.stringify(globalVariables)
    );
  }, [globalVariables, initializedLocalGlobalVariables]);

  const handleGlobalVariableAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!globalVariableKey) return;
    setGlobalVariables({
      ...globalVariables,
      [globalVariableKey]: globalVariableValue,
    });
    closeAddDialog();
  };
  const handleKeyEdit = (oldKey: string, newKey: string) => {
    if (oldKey === newKey || newKey?.trim() === '') return;
    const newObj = { ...globalVariables };
    newObj[newKey] = globalVariables[oldKey];
    delete newObj[oldKey];
    setGlobalVariables(newObj);
  };
  const handleValueEdit = (key: string, value: string) => {
    setGlobalVariables({
      ...globalVariables,
      [key]: value,
    });
  };
  const closeAddDialog = () => {
    setShowGlobalVariablesAddDialog(false);
    setGlobalVariableKey('');
    setGlobalVariableValue('');
  };
  const handleDelete = (selectedGlobalVariable: string) => {
    if (!selectedGlobalVariable) return;
    setGlobalVariables((prev) => {
      const { [selectedGlobalVariable]: _, ...rest } = prev;
      return rest;
    });
  };
  const closeGlobalVariablesDialog = () => {
    setShowGlobalVariablesDialog(false);
  };
  const handleRowHover = (e: React.MouseEvent, globalVar: string) => {
    e.stopPropagation();
    setHoveredGlobalVariable(globalVar);
  };
  const csvHeader = ['Key', 'Value'];
  const exportToCsv = () => {
    const filename = `${drawingId}_global_variables_${Date.now().toString()}`;
    const rows = Object.entries(globalVariables).map((e) => e.join(','));

    const header = csvHeader.join(',');
    const csvString = [header, ...rows].join('\n');

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
        console.error('Error parsing CSV files:', error);
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
          const importedGlobalVariables = Object.fromEntries(result.data);
          setGlobalVariables({
            ...globalVariables,
            ...importedGlobalVariables,
          });
        } catch (e) {
          console.error('There was an error parsing the csv file', e);
        }
      },
      header: true
    });
  };
  const renderGridRows = useMemo(() => {
    // Should be able to fit 10 blank rows given the height of this grid (24em)
    const blankRows = Math.max(
      0,
      Math.ceil(10 - Object.keys(globalVariables).length)
    );
    return (
      <>
        {Object.keys(globalVariables).map((globalVar) => {
          const isHovered = globalVar === hoveredGlobalVariable;
          return (
            <div
              key={globalVar}
              className={classes.gridRow}
              onMouseOver={(e) => handleRowHover(e, globalVar)}
              onMouseLeave={() => setHoveredGlobalVariable('')}
            >
              <div
                className={clsx(classes.cellKey, classes.cell)}
                title={globalVar}
              >
                <InlineEdit
                  text={globalVar}
                  onTextChange={(text: string) =>
                    handleKeyEdit(globalVar, text)
                  }
                />
              </div>
              <div
                className={clsx(classes.cell, classes.cellValue)}
                title={globalVariables[globalVar]}
              >
                <InlineEdit
                  text={globalVariables[globalVar]}
                  onTextChange={(text: string) =>
                    handleValueEdit(globalVar, text)
                  }
                />
                <div className={classes.cellActions}>
                  {isHovered && (
                    <IconButton
                      className={classes.iconButton}
                      onClick={() => handleDelete(globalVar)}
                    >
                      <DeleteOutline
                        fontSize={'small'}
                        className={classes.icon}
                      />
                    </IconButton>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {Array.from({ length: blankRows }).map((_, index) => (
          <div key={`blank-row-${index}`} className={classes.gridRow}>
            <div className={clsx(classes.cellKey, classes.cell)}></div>
            <div className={classes.cell}></div>
          </div>
        ))}
      </>
    );
  }, [globalVariables, hoveredGlobalVariable]);
  return (
    <GlobalVariablesContext.Provider
      value={{
        showGlobalVariablesDialog,
        setShowGlobalVariablesDialog,
        globalVariables,
        setGlobalVariables,
      }}
    >
      {children}
      <Dialog
        onClose={closeGlobalVariablesDialog}
        open={showGlobalVariablesDialog}
      >
        <DialogTitle className={classes.dialogTitle}>
          <div>Global Variables</div>
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
              onClick={() => setShowGlobalVariablesAddDialog(true)}
            >
              + New
            </Button>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className={classes.dialogContent}>
            <div className={classes.gridSection}>
              <div
                className={clsx(
                  classes.cellKey,
                  classes.headerCell,
                  classes.gridHeader
                )}
              >
                Key
              </div>
              <div className={clsx(classes.headerCell, classes.gridHeader)}>
                Value
              </div>
              {renderGridRows}
            </div>
            <div className={classes.grow}></div>
          </div>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button onClick={closeGlobalVariablesDialog}>Ok</Button>
          <Button onClick={closeGlobalVariablesDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog onClose={closeAddDialog} open={showGlobalVariablesAddDialog}>
        <DialogTitle className={classes.dialogTitle}>
          Add Global Variable
        </DialogTitle>
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
      </Dialog>
    </GlobalVariablesContext.Provider>
  );
};
