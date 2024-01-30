import { useTopBarStyles } from './TopBar.styles';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

import {
  track,
  useEditor,
  useActions,
  TLPageId,
  createShapeId,
  Box,
} from '@tldraw/tldraw';
// Top Bar
import MenuIcon from '@mui/icons-material/Menu';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SaveIcon from '@mui/icons-material/SaveOutlined';
import PrintIcon from '@mui/icons-material/PrintOutlined';
import VariablesIcon from '@mui/icons-material/DataObject';
import SettingsIcon from '@mui/icons-material/Settings';

import Dropdown from '../dropdown/dropdown';
import { Button, Dialog, DialogTitle, Divider, TextField } from '@mui/material';
import clsx from 'clsx';
import { useGlobalVariables } from '../../context/GlobalVariablesContext/GlobalVariablesContext';
import { useScale, scaleOptions } from '../../context/ScaleContext';
import { exportToBlob } from '../../utils/export';
import { useLayer } from '../../context/LayerContext/LayerContext';
import { useLineType } from '../../context/LineTypeContext/LineTypeContext';

export interface Page {
  width: number;
  height: number;
}
const TopBar = track(() => {
  const { scaleFactor, scaleUnit, setScaleFactor } = useScale();
  const { setShowGlobalVariablesDialog } = useGlobalVariables();
  const { layers, selectedLayerName, selectedLayer, setSelectedLayerName, setShowLayerManagerDialog } = useLayer();
  const { lineTypes, selectedLineType, setSelectedLineType, setShowLineTypeManagerDialog } = useLineType();
  const editor = useEditor();
  const actions = useActions();
  const classes = useTopBarStyles();
  // const [pages, setPages] = useState({});

  // Add Page Size Dialog
  const [showAddPageSizeDialog, setShowAddPageSizeDialog] = useState(false);
  const [addPageSizeInput, setAddPageSizeInput] = useState({
    w: '11',
    h: '8.5',
  });
  const [addPageSizeWHelperText, setAddPageSizeWHelperText] = useState('');
  const [addPageSizeHHelperText, setAddPageSizeHHelperText] = useState('');

  // useEffect(() => {
  //   setPages(
  //     editor.getPages().reduce((result: { [key: string]: string }, page) => {
  //       result[page.id] = page.name;
  //       return result;
  //     }, {})
  //   );
  // }, []);
  useEffect(() => {
    const numRegex = new RegExp(/^-?[0-9]\d*(\.\d+)?$/);
    if (addPageSizeInput.w.match(numRegex)) {
      setAddPageSizeWHelperText('');
    } else {
      setAddPageSizeWHelperText('Must be a valid number');
    }
    if (addPageSizeInput.h.match(numRegex)) {
      setAddPageSizeHHelperText('');
    } else {
      setAddPageSizeHHelperText('Must be a valid number');
    }
  }, [addPageSizeInput]);
  const onPageAdd = () => {
    // reset inputs
    setAddPageSizeInput({ w: '11', h: '8.5' });
    setShowAddPageSizeDialog(true);
  };

  const handlePageAdd = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (addPageSizeHHelperText !== '' || addPageSizeWHelperText !== '') return;
    const width: number = parseFloat(addPageSizeInput.w) * 100;
    const height: number = parseFloat(addPageSizeInput.h) * 100;
    const newUuid = ('page:' + uuid()) as TLPageId;
    editor.createPage({ id: newUuid, meta: { page: { width, height } } });
    editor.setCurrentPage(newUuid);
    editor.createShape({
      id: createShapeId(),
      type: 'page',
      x: 0,
      y: 0,
      isLocked: true,
      props: {
        w: width,
        h: height,
        color: 'white',
      },
    });
    actions['zoom-to-fit'].onSelect('kbd');
    setShowAddPageSizeDialog(false);
  };
  const handlePageChange = (sheetId: string) => {
    editor.setCurrentPage(sheetId as TLPageId);
    if (sheetId !== 'page:page') {
      setScaleFactor(100);
    } else {
      setScaleFactor(scaleOptions[scaleUnit]);
    }
  };
  const handlePrint = async () => {
    if (editor.getCurrentPageId() === 'page:page') return;
    const pageWidth = (editor.getCurrentPage().meta?.page as unknown as Page)
      ?.width;
    const pageHeight = (editor.getCurrentPage().meta?.page as unknown as Page)
      ?.height;

    const box = new Box(0, 0, pageWidth, pageHeight);
    // // console.log('shapeIds', shapeIds)
    // // console.log(editor.getCurrentPageShapeIds())
    const allShapes = editor.getCurrentPageShapes().filter((s) => {
      // ignore itself
      const pageBounds = editor.getShapeMaskedPageBounds(s);
      // if (s.type === 'page') return false
      if (!pageBounds) return false;
      return box.includes(pageBounds);
    });
    const shapeIds = allShapes.map((shape) => shape.id);
    // console.log(allShapes, shapeIds);
    if (shapeIds.length > 0) {
      console.log(editor.getInstanceState().exportBackground);
      const blob = await exportToBlob(
        editor,
        shapeIds,
        'png',
        {},
        pageWidth,
        pageHeight
      );
      // console.log('blob', blob);
      const printWindow = window.open('', '_blank');
      const url = URL.createObjectURL(blob);
      const content = `
      <html>
      <head>
      <title>${editor.getCurrentPageId()}</title>
      <style>
      @media print {
        @page { size: landscape; }
        body {
          width: ${pageWidth}px;
          height: ${pageHeight}px;
          background-color: white;
        }
        img {
          width: 100%;
          height: auto;
          background-color: white;
        }
      }
      </style>
      </head>
      <body>
      <div style="width: ${pageWidth}px; height: ${pageHeight}px;">
        <img src="${url}" onload="window.print(); window.close();" />
      </div>
      </body>
      </html>
      `;
      printWindow?.document.write(content);
      printWindow?.document.close();
    }
  };
  const layersDropdown = useMemo(() => {
    return Object.keys(layers).reduce((prev: { [key: string]: string }, current, index) => {
      prev[current] = current.charAt(0).toUpperCase() + current.slice(1);
      return prev;
    }, {})
  }, [layers])
  const handleLayerChange = (layer: string) => {
    setSelectedLayerName(layer)
  };
  const lineTypesDropdown = useMemo(() => {
    return Object.keys(lineTypes).reduce((prev: { [key: string]: React.ReactNode }, current, index) => {
      console.log(lineTypes[current].appearance)
      const appearance = lineTypes[current].appearance;
      const isSvg = appearance.includes('svg')
      // if (isSvg) {
        // const cleanedSvgString = appearance.replace(/[\n\r\t]/g, '')
        // appearance = `data:image/svg+xml;base64;${btoa(cleanedSvgString)}`;
      // }
      console.log(appearance)
      prev[current] = <div className={classes.lineType}><span className={classes.lineTypeText}>{current.charAt(0).toUpperCase() + current.slice(1)}</span> {isSvg ? <img src={appearance} alt={current} className={classes.lineTypeImage} /> : appearance}</div>;
      return prev;
    }, {})
  }, [lineTypes])
  const handleLineTypeChange = (lineType: string) => {
    setSelectedLineType(lineTypes[lineType])
  }
  return (
    <div className={classes.topbarContainer}>
      <div className={clsx(classes.topbar, classes.topbarLeft)}>
        <button className={classes.iconButton} title={'Menu'}>
          <MenuIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Undo'}
          onClick={() => editor.undo()}
        >
          <UndoIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Redo'}
          onClick={() => editor.redo()}
        >
          <RedoIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Save'}
          onClick={() => alert('Saving!')}
        >
          <SaveIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Print'}
          onClick={handlePrint}
        >
          <PrintIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Global Variables'}
          onClick={() => setShowGlobalVariablesDialog(true)}
        >
          <VariablesIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Settings'}
          onClick={() => alert('Settings!')}
        >
          <SettingsIcon className={classes.icon} />
        </button>
        <Divider orientation="vertical" className={classes.topbarDivider} />
        <Dropdown
          placeholder={'Pages'}
          values={editor
            .getPages()
            .reduce((result: { [key: string]: string }, page) => {
              result[page.id] = page.name;
              return result;
            }, {})}
          selected={editor.getCurrentPageId()}
          onSelected={handlePageChange}
          onAdd={onPageAdd}
          className={classes.dropdown}
        />
        <Divider orientation="vertical" className={classes.topbarDivider} />
        <Dropdown
          placeholder={'Layers'}
          values={layersDropdown}
          onAdd={() => setShowLayerManagerDialog(true)}
          selected={selectedLayerName}
          onSelected={handleLayerChange}
          addText={'Manage Layers'}
          className={classes.dropdown}
        />
        <Divider orientation="vertical" className={classes.topbarDivider} />
        <Dropdown
          placeholder={'Linetypes'}
          values={lineTypesDropdown}
          onAdd={() => setShowLineTypeManagerDialog(true)}
          selected={selectedLineType?.name || 'solid'}
          onSelected={handleLineTypeChange}
          addText={'Manage LineTypes'}
          className={classes.dropdown}
        />
        <Divider orientation="vertical" className={classes.topbarDivider} />
        <Dropdown
          placeholder={'Styles'}
          values={{}}
          onAdd={() => alert('Adding Styles')}
          className={classes.dropdown}
        />
        <Divider orientation="vertical" className={classes.topbarDivider} />
        <Dropdown
          placeholder={'Dimstyles'}
          values={{}}
          onAdd={() => alert('Adding Dimstyles')}
          className={classes.dropdown}
        />
      </div>
      <Dialog
        onClose={() => setShowAddPageSizeDialog(false)}
        open={showAddPageSizeDialog}
      >
        <DialogTitle>Add Paper Space</DialogTitle>
        <form onSubmit={handlePageAdd} className={classes.dialog}>
          <TextField
            id="add-page-w"
            label="W"
            error={addPageSizeWHelperText !== ''}
            helperText={addPageSizeWHelperText}
            value={addPageSizeInput.w}
            onChange={(e) =>
              setAddPageSizeInput({ ...addPageSizeInput, w: e.target.value })
            }
          />
          <TextField
            id="add-page-h"
            label="H"
            error={addPageSizeHHelperText !== ''}
            helperText={addPageSizeHHelperText}
            value={addPageSizeInput.h}
            onChange={(e) =>
              setAddPageSizeInput({ ...addPageSizeInput, h: e.target.value })
            }
          />
          <Button
            type="submit"
            disabled={
              addPageSizeHHelperText !== '' || addPageSizeWHelperText !== ''
            }
          >
            Add Page
          </Button>
        </form>
      </Dialog>
    </div>
  );
});
export default TopBar;
