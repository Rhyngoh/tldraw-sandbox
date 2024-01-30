import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  track,
  useEditor,
  useActions,
  TLPageId,
  TLShape,
  TLShapeId,
  useTools,
  GeoShapeGeoStyle,
  createShapeId,
  Box,
  useValue,
  Vec,
  TLPage,
} from '@tldraw/tldraw';

// Side Bar
import PointerIcon from '@mui/icons-material/NearMeOutlined';
import PanIcon from '@mui/icons-material/PanToolOutlined';
import EraseIcon from '@mui/icons-material/Delete';
import LineIcon from '@mui/icons-material/LinearScale';
import EditIcon from '@mui/icons-material/EditOutlined';
import ImageIcon from '@mui/icons-material/Image';
import SquareIcon from '@mui/icons-material/SquareOutlined';
import PolygonIcon from '@mui/icons-material/HexagonOutlined';
import TitleIcon from '@mui/icons-material/TitleSharp';
import MapIcon from '@mui/icons-material/MapOutlined';
import BlockIcon from '@mui/icons-material/ViewComfyOutlined';

import { googleEmbedDef } from '../../assets/embedding_definitions';
import {
  Divider,
} from '@mui/material';
import { compact } from '../../utils/util-functions';
import { PageShape } from '../../containers/shapes/Page/PageShape';
import { InsertPageDragging } from '../../containers/tools/InsertPageDragging';
import { ViewportShape } from '../../containers/shapes/Viewport/ViewportShape';
import { useSideBarStyles } from './SideBar.styles';

const SideBar = track(() => {
  const editor = useEditor();
  const actions = useActions();
  const tools = useTools();
  const classes = useSideBarStyles();
  
  return (
    <div className={classes.sidebarContainer}>
      <div className={classes.sidebar}>
        <button
          className={classes.iconButton}
          title={'Pointer'}
          data-isactive={editor.getCurrentToolId() === 'select'}
          onClick={() => editor.setCurrentTool('select')}
        >
          <PointerIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Grab'}
          data-isactive={editor.getCurrentToolId() === 'hand'}
          onClick={() => editor.setCurrentTool('hand')}
        >
          <PanIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Eraser'}
          data-isactive={editor.getCurrentToolId() === 'eraser'}
          onClick={() => editor.setCurrentTool('eraser')}
        >
          <EraseIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Line'}
          data-isactive={editor.getCurrentToolId() === 'extended-line'}
          onClick={() => editor.setCurrentTool('extended-line')}
        >
          <LineIcon
            className={classes.icon}
            sx={{ transform: 'rotate(-45deg)' }}
          />
        </button>
        <button
          className={classes.iconButton}
          title={'Draw'}
          data-isactive={editor.getCurrentToolId() === 'draw'}
          onClick={() => editor.setCurrentTool('draw')}
        >
          <EditIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Rectangle'}
          data-isactive={
            editor.getCurrentToolId() === 'geo' &&
            editor.getInstanceState().stylesForNextShape['tldraw:geo'] ===
              'rectangle'
          }
          onClick={() => tools['rectangle'].onSelect('kbd')}
        >
          <SquareIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Polygon'}
          data-isactive={
            editor.getCurrentToolId() === 'geo' &&
            editor.getInstanceState().stylesForNextShape['tldraw:geo'] ===
              'hexagon'
          }
          onClick={() => {
            editor.batch(() => {
              editor.updateInstanceState(
                {
                  stylesForNextShape: {
                    ...editor.getInstanceState().stylesForNextShape,
                    [GeoShapeGeoStyle.id]: 'hexagon',
                  },
                },
                { ephemeral: true }
              );
              editor.setCurrentTool('geo');
            });
          }}
        >
          <PolygonIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Text'}
          data-isactive={editor.getCurrentToolId() === 'text'}
          onClick={() => editor.setCurrentTool('text')}
        >
          <TitleIcon className={classes.icon} />
        </button>
        <Divider className={classes.sidebarDivider} />
        <button
          className={classes.iconButton}
          title={'Insert Image'}
          onClick={() => {
            actions['insert-media'].onSelect('kbd');
          }}
        >
          <ImageIcon className={classes.icon} />
        </button>
      </div>
    </div>
  );
});
export default SideBar;
