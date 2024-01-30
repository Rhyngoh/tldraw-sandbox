import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useDrawingStyles } from './Drawing.styles';
import { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import {
  TLStoreWithStatus,
  Tldraw,
  createTLStore,
  defaultShapeUtils,
  track,
  TLUiOverrides,
  menuItem,
  findMenuItem,
  Canvas,
  TLPageId,
  Editor,
  createShapeId,
  throttle,
  TLRecord,
  TLEventMapHandler,
  TLUiEventHandler,
  TLShapeId,
  TLStore,
  TLEventInfo,
  TLOnMountHandler,
  TLAnyShapeUtilConstructor,
} from '@tldraw/tldraw';
import { CardShapeTool, CardShapeUtil } from '../shapes/Card/CardShape';
import { DEFAULT_STORE } from '../../constants/store';
import CustomUI from '../custom-ui/CustomUI';
import { PageShapeTool, PageShapeUtil } from '../shapes/Page/PageShape';
import { InsertPageTool } from '../tools/InsertPageTool';
import useLocalStorageForRoute from '../../hooks/useLocalStorageForRoute';
import InsertPageBox from '../tools/InsertPageBox';
import { CanvasShapeUtil } from '../shapes/Canvas/CanvasShapeUtil';
import useDrawStore from '../../context/useStoreContext';
import { ViewportShapeUtil } from '../shapes/Viewport/ViewportShapeUtil';
import { isEqual } from 'lodash';
import CustomUi from '../../components/TlDrawComponent';
import { UrlStateSync } from '../../components/UrlStateSync';
import { useScale } from '../../context/ScaleContext';
import { ExtendedLineShapeUtil } from '../shapes/Line/ExtendedLineShapeUtil';
import { ExtendedLineShapeTool } from '../shapes/Line/ExtendedLineShapeTool';

export type DrawingParams = {
  drawingId: string;
};
const customShapeUtils = [
  CardShapeUtil,
  PageShapeUtil,
  CanvasShapeUtil,
  ViewportShapeUtil,
  ExtendedLineShapeUtil,
];
const customTools = [
  CardShapeTool,
  PageShapeTool,
  InsertPageTool,
  ExtendedLineShapeTool,
];

const Drawing = () => {
  const { scaleFactor, setCursorLoc } = useScale();
  const { drawingId } = useParams<DrawingParams>();
  const location = useLocation();
  const urlQueryViewport = new URLSearchParams(location.search).get('viewport');
  const urlQueryIsCanvas = new URLSearchParams(location.search).get('isCanvas');
  const urlQueryPage = new URLSearchParams(location.search).get('page');
  const classes = useDrawingStyles();
  
  const [store] = useState(() => {
    const mergedShapeUtils: TLAnyShapeUtilConstructor[] = defaultShapeUtils.concat(customShapeUtils as TLAnyShapeUtilConstructor[])
    return createTLStore({
      shapeUtils: mergedShapeUtils,
    });
  });
  const [loadingState, setLoadingState] = useState<
    | { status: 'loading' }
    | { status: 'ready' }
    | { status: 'error'; error: string }
  >({ status: 'loading' });
  const [persistenceKey, setPersistenceKey] = useState<string>('sandbox-persistence');
  // useEffect(() => {
  //   console.log('new viewport', store)
  // }, [urlQueryViewport])
  useEffect(() => {
    setPersistenceKey(`sandbox-persistence-${drawingId}`);
  }, [drawingId]);

  useEffect(() => {
    // setLoadingState({ status: 'loading' });

    const persistedSnapshot = localStorage.getItem(persistenceKey);
    if (persistedSnapshot) {
      try {
        const snapshot = JSON.parse(persistedSnapshot);
        // console.log(
        //   'load snapshot from store',
        //   snapshot,
        //   store.getSnapshot(),
        //   isEqual(snapshot, store.getSnapshot())
        // );
        // store.loadSnapshot(snapshot);
        // setLoadingState({ status: 'ready' });
      } catch (error: any) {
        // setLoadingState({ status: 'error', error: error.message });
      }
    } else {
      //   setLoadingState({ status: 'ready' });
    }

    // Listen to canvas store changes
    const cleanupFn = store.listen(
      throttle(() => {
        const snapshot = store.getSnapshot();
        // console.log('save snapshot on store change', store.getSnapshot());
        localStorage.setItem(persistenceKey, JSON.stringify(snapshot));
      }, 500)
    );

    return () => {
      cleanupFn();
    };
  }, [store, persistenceKey]);

  useEffect(() => {
    const persistedSnapshot = localStorage.getItem(persistenceKey);
    if (persistedSnapshot) {
      const snapshot = JSON.parse(persistedSnapshot);
      // Load snapshot from localstorage on load. Additional loadSnapshots should be through the storage event handler
      store.loadSnapshot(snapshot);
    }
  }, [persistenceKey]);

  // Listen to localStorage changes to synchronize any iframes, throttle by same time that the store is listening to to prevent screen flicker
  useEffect(() => {
    const handleStorageChange =
      // throttle(
      (e: StorageEvent) => {
        if (e.key === persistenceKey) {
          if (e.newValue) {
            const snapshot = JSON.parse(e.newValue);
            // don't update store if not on model page, else it redirects back to model page
            if (urlQueryPage === null || urlQueryPage === 'page:page') {
              // store.loadSnapshot(snapshot);
            }
          }
        }
      };
    // , 500);

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [persistenceKey, urlQueryPage]);
  const handleMount = (editor: Editor) => {
    const handlePointerMove = (editor: Editor) => {
      const x = editor.inputs.currentPagePoint.x / scaleFactor;
      const y = editor.inputs.currentPagePoint.y / scaleFactor;
      setCursorLoc({ x: Number(x.toFixed(4)), y: Number(y.toFixed(4)) });
    };
    editor.on('event', () => handlePointerMove(editor));
  };
  const uiOverrides: TLUiOverrides = {
    actions(editor, actions) {
      editor.updatePage({ id: 'page:page' as TLPageId, name: 'Model Space' });
      // Create a new action or replace an existing one
      // actions['toggle-grid'].onSelect = (source) => {
      // 	editor.updateInstanceState({ isGridMode: !editor.instanceState.isGridMode })
      // 	if (!('env-preferences' in localStorage)) {
      // 		localStorage.setItem('env-preferences', JSON.stringify({ 'grid-mode': editor.instanceState.isGridMode }))
      // 	} else {
      // 		const stringified = localStorage.getItem('env-preferences')
      // 		const snapshot = stringified ? JSON.parse(stringified) : {}
      // 		snapshot['grid-mode'] = editor.getInstanceState().isGridMode
      // 		localStorage.setItem('env-preferences', JSON.stringify(snapshot))
      // 	}
      // }
      // actions['save'] = {
      // 	id: 'save',
      // 	label: 'Save' as any,
      // 	readonlyOk: true,
      // 	kbd: '$s',
      // 	onSelect(source: any) {
      // 		const snapshot = editor.store.getSnapshot()
      // 		console.log(snapshot)
      // 		const stringified = JSON.stringify(snapshot)
      // 		localStorage.setItem('my-editor-snapshot', stringified)
      // 		alert("Saved")
      // 	},
      // }
      return actions;
    },
    menu(editor, menu, { actions }) {
      // console.log(editor, menu, { actions })
      // using the findMenuItem helper
      // const fileMenu = findMenuItem(menu, ['menu', 'file'])
      // if (fileMenu.type === 'submenu') {
      // 	// add the new item to the file menu's children
      // 	const saveMenuItem = menuItem(actions['save'])
      // 	fileMenu.children.unshift(saveMenuItem)
      // }
      return menu;
    },
    tools(editor, tools) {
      // tools.card = {
      // 	id: 'card',
      // 	icon: 'color',
      // 	label: 'Card' as any,
      // 	kbd: 'c',
      // 	readonlyOk: false,
      // 	onSelect: () => {
      // 		editor.setCurrentTool('card')
      // 	},
      // }
      return tools;
    },
  };
  const customComponents = {
    InFrontOfTheCanvas: () => {
      return <InsertPageBox />;
    },
  };
  return (
    <div className={classes.root}>
      <Tldraw
        shapeUtils={customShapeUtils}
        tools={customTools}
        overrides={uiOverrides}
        store={store}
        components={customComponents}
        hideUi
        // onMount={handleMount}
        // autoFocus={true}
      >
        <UrlStateSync />
        <CustomUI />
      </Tldraw>
    </div>
  );
};

export default Drawing;
