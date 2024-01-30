import { useCustomUIStyles } from './CustomUI.styles';
import {
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  track,
  useEditor,
  useNativeClipboardEvents,
  TLShape,
  createShapeId,
} from '@tldraw/tldraw';

import { Divider, TextField } from '@mui/material';
import { toCapitalCase } from '../../utils/util-functions';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import SideBar from '../../components/SideBar/SideBar';
import BottomBar from '../../components/BottomBar/BottomBar';
import { useScale, scaleOptions } from '../../context/ScaleContext';

const CustomUI = track(() => {
  const { scaleFactor, setCursorLoc, prevScaleUnit, scaleUnit } = useScale();
  const editor = useEditor();
  const classes = useCustomUIStyles();
  const location = useLocation();
  const urlQueryIsCanvas = new URLSearchParams(location.search).get('isCanvas');
  useNativeClipboardEvents();
  const handlePointerMove = useCallback(() => {
    let x = editor.inputs.currentPagePoint.x;
    let y = editor.inputs.currentPagePoint.y;
    if (editor.getCurrentPageId() !== 'page:page') {
      x /= 100;
      y /= 100;
    }
    setCursorLoc({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) });
  }, [editor, scaleFactor]);
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      // Don't change tool and go out of text input if typing
      if (!target) return;
      if (target.name === 'text') return;
      switch (e.key) {
        case 'z': {
          if (e.ctrlKey) {
            if (e.shiftKey) {
              // TODO: Fix redo
              editor.redo();
            } else {
              editor.undo();
            }
          }
          break;
        }
        case 'Delete':
        case 'Backspace': {
          editor.deleteShapes(editor.getSelectedShapeIds());
          break;
        }
        case 's':
        case 'v': {
          editor.setCurrentTool('select');
          break;
        }
        case 'e': {
          editor.setCurrentTool('eraser');
          break;
        }
        case 'x':
        case 'p':
        case 'b':
        case 'd': {
          editor.setCurrentTool('draw');
          break;
        }
        case 'h': {
          editor.setCurrentTool('hand');
          break;
        }
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handlePointerMove);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handlePointerMove);
    };
  });
  useEffect(() => {
    if (prevScaleUnit === scaleUnit) return;
    editor.batch(() => {
      const groupId = createShapeId();
      const groupedShape = editor.groupShapes(
        editor.getCurrentPageShapes(),
        groupId
      );
      const selected = editor.getSortedChildIdsForParent(groupId);
      // Calculate scale difference between scale units
      const scale = prevScaleUnit
        ? scaleOptions[prevScaleUnit] / scaleOptions[scaleUnit]
        : 1;
      if (groupedShape) {
        for (const shapeId of selected) {
          const bounds = editor.getShapeGeometry(shapeId).bounds;
          const initialPageTransform = editor.getShapePageTransform(shapeId);
          // console.log(shapeId, bounds, initialPageTransform);
          if (!initialPageTransform) continue;
          const shape = editor.getShape(shapeId);
          editor.resizeShape(
            shapeId,
            { x: scale, y: scale },
            {
              initialBounds: bounds,
              initialPageTransform,
              initialShape: shape,
              mode: 'scale_shape',
              scaleOrigin: { x: 0, y: 0 },
              scaleAxisRotation: 0,
            }
          );
        }
        editor.ungroupShapes([groupId]);
        editor.selectNone();
        // editor.zoomToFit();
      }
    });
  }, [prevScaleUnit, scaleUnit]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const copyToClipboard = async (e: any): Promise<void> => {
    console.log(e?.target?.dataset?.clipboardText);
    if (e?.target?.dataset?.clipboardText) {
      try {
        await navigator.clipboard.writeText(e?.target?.dataset?.clipboardText);
      } catch (error) {
        console.error('Unable to copy to clipboard:', error);
      }
    }
  };
  const selectedShapesData = () => {
    const shape = editor.getOnlySelectedShape();
    if (shape) {
      // console.log(shape);
      const keys = ['id', 'index', 'opacity', 'x', 'y', 'rotation', 'isLocked'];
      let shapeList = keys.map((key) => {
        return (
          <div key={key} className={classes.propertyRow}>
            <div
              data-clipboard-text={
                shape[key as keyof TLShape]
                  ? shape[key as keyof TLShape].toString()
                  : ''
              }
              onClick={copyToClipboard}
              className={classes.propertyKey}
            >
              {toCapitalCase(key)}
            </div>
            <TextField
              InputProps={{ classes: { input: classes.ellipsis } }}
              disabled
              className={classes.propertyValue}
              value={
                shape[key as keyof TLShape]
                  ? shape[key as keyof TLShape].toString()
                  : ''
              }
            />
          </div>
        );
      });
      let propsList = Object.keys(shape.props).map((key) => {
        return (
          <div key={key} className={classes.propertyRow}>
            <div
              data-clipboard-text={
                shape.props[key as keyof TLShape['props']]
                  ? shape.props[key as keyof TLShape['props']]
                  : ''
              }
              onClick={copyToClipboard}
              className={classes.propertyKey}
            >
              {toCapitalCase(key)}
            </div>
            <TextField
              InputProps={{ classes: { input: classes.ellipsis } }}
              disabled
              className={classes.propertyValue}
              value={
                shape.props[key as keyof TLShape['props']]
                  ? shape.props[key as keyof TLShape['props']]
                  : ''
              }
              title={
                shape.props[key as keyof TLShape['props']]
                  ? shape.props[key as keyof TLShape['props']]
                  : ''
              }
            />
          </div>
        );
      });
      let resp = (
        <div className={classes.propertiesContainer}>
          <div className={classes.propertiesSection}>
            <div className={classes.propertiesbarSubHeader}>
              General Properties
            </div>
            {shapeList}
          </div>
          <div className={classes.propertiesSection}>
            <div className={classes.propertiesbarSubHeader}>
              Object Properties
            </div>
            {propsList}
          </div>
        </div>
      );
      return resp;
    } else {
      return [];
    }
  };
  return !urlQueryIsCanvas ? (
    <div className={classes.root}>
      <TopBar />
      <SideBar />
      <BottomBar />
      {editor.getOnlySelectedShape() &&
        editor.getOnlySelectedShape()!.type !== 'canvas' && (
          <div className={classes.propertiesbar}>
            <div className={classes.propertiesbarHeader}>
              {toCapitalCase(editor.getOnlySelectedShape()!.type)}
            </div>
            <Divider className={classes.propertiesDivider} />
            {selectedShapesData()}
          </div>
        )}
      {/* <Dialog onClose={() => setShowDialog(false)} open={showDialog}>
        <DialogTitle>Insert Model Space</DialogTitle>
        <form
          onSubmit={insertComponent}
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            gap: '1rem',
          }}
        >
          <TextField
            id="insert-page-x"
            label="X"
            error={insertPageXError}
            helperText={insertPageXHelperText}
            value={insertPageX}
            onChange={(e) => setInsertPageX(e.target.value)}
          />
          <TextField
            id="insert-page-y"
            label="Y"
            error={insertPageYError}
            helperText={insertPageYHelperText}
            value={insertPageY}
            onChange={(e) => setInsertPageY(e.target.value)}
          />
          <Button type="submit">Insert</Button>
        </form>
      </Dialog>
      <Dialog onClose={() => setShowDialog2(false)} open={showDialog2}>
        <DialogTitle>Insert Model Space</DialogTitle>
        <form
          onSubmit={insertViewport}
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
            gap: '1rem',
          }}
        >
          <InputLabel id="viewport-label">Viewport</InputLabel>
          <Select
            labelId="viewport-label"
            value={selectedViewportId}
            label="Viewport"
            onChange={(e) => setSelectedViewportId(e.target.value)}
          >
            {getViewports().map((el) => {
              return <MenuItem value={el?.id}>{el?.id}</MenuItem>;
            })}
          </Select>
          <Button type="submit">Insert</Button>
        </form>
      </Dialog> */}
    </div>
  ) : (
    <div></div>
  );
});

export default CustomUI;
