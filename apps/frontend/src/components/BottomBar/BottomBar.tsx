import {
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { track, useEditor, useActions } from '@tldraw/tldraw';

// Bottom Bar
import GridIcon from '@mui/icons-material/Grid4x4';
import ZoomBackIcon from '@mui/icons-material/ZoomInMap';
import SnapIcon from '@mui/icons-material/Flare';
import DarkIcon from '@mui/icons-material/Brightness4Outlined';

import { useGlobalVariables } from '../../context/GlobalVariablesContext/GlobalVariablesContext';
import { useBottomBarStyles } from './BottomBar.styles';
import { Divider } from '@mui/material';
import Dropdown, { DropdownPosition } from '../dropdown/dropdown';
import { useScale, ScaleOptions } from '../../context/ScaleContext';
const BottomBar = track(() => {
  const { cursorLoc, setScaleUnit, scaleUnit } = useScale();
  const editor = useEditor();
  const actions = useActions();
  const classes = useBottomBarStyles();
  const scale = {
    inch: 'Inch',
    feet: 'Feet',
    yards: 'Yards',
    meters: 'Meters',
  };
  const [selectedScale, setSelectedScale] = useState(scaleUnit);
  const handleSelected = (selected: string) => {
    setSelectedScale(selected as ScaleOptions);
    switch (selected) {
      case ScaleOptions.INCH: {
        setScaleUnit(ScaleOptions.INCH)
        break;
      }
      case ScaleOptions.FEET: {
        setScaleUnit(ScaleOptions.FEET)
        break;
      }
      case ScaleOptions.YARDS: {
        setScaleUnit(ScaleOptions.YARDS)
        break;
      }
      case ScaleOptions.METERS: {
        setScaleUnit(ScaleOptions.METERS)
        break;
      }
    }
  };
  return (
    <div className={classes.bottombar}>
      <div className={classes.bottombarText}>
        ({cursorLoc.x}, {cursorLoc.y})
      </div>
      <div className={classes.bottombarMenu}>
        {editor.getCurrentPageId() === 'page:page' && (
          <Dropdown
            placeholder={selectedScale}
            values={scale}
            // onAdd={() => alert('Adding Layers')}
            selected={selectedScale}
            onSelected={handleSelected}
            className={classes.dropdown}
            position={DropdownPosition.BOTTOM}
            canAdd={false}
          />
        )}
        <button
          className={classes.iconButton}
          data-isactive={editor.getInstanceState().isGridMode}
          title={'Toggle Grid'}
          onClick={() => actions['toggle-grid'].onSelect('kbd')}
        >
          <GridIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          data-isactive={editor.user.getIsDarkMode()}
          title={'Toggle Dark Mode'}
          onClick={() => actions['toggle-dark-mode'].onSelect('kbd')}
        >
          <DarkIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          title={'Zoom To Extents'}
          onClick={() => actions['zoom-to-fit'].onSelect('kbd')}
        >
          <ZoomBackIcon className={classes.icon} />
        </button>
        <button
          className={classes.iconButton}
          data-isactive={editor.user.getIsSnapMode()}
          title={'Snap'}
          onClick={() => actions['toggle-snap-mode'].onSelect('kbd')}
        >
          <SnapIcon className={classes.icon} />
        </button>
      </div>
    </div>
  );
});
export default BottomBar;
