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
import { usePrevious } from '../hooks/usePrevious';

interface CursorLocation {
  x: number;
  y: number;
}
interface Scale {
  cursorLoc: CursorLocation;
  setCursorLoc: React.Dispatch<React.SetStateAction<CursorLocation>>;
  scaleFactor: number;
  setScaleFactor: React.Dispatch<React.SetStateAction<number>>;
  scaleUnit: ScaleOptions;
  setScaleUnit: React.Dispatch<React.SetStateAction<ScaleOptions>>;
  prevScaleUnit?: ScaleOptions;
}

// 1 coordinate distance = 1 inch
export const scaleOptions = {
  inch: 1,
  feet: 12,
  yards: 36,
  meters: 39.3701,
};
export enum ScaleOptions {
  INCH = 'inch',
  FEET = 'feet',
  YARDS = 'yards',
  METERS = 'meters',
}
const defaultValues: Scale = {
  cursorLoc: { x: 0, y: 0 },
  setCursorLoc: () => {},
  scaleFactor: scaleOptions[ScaleOptions.FEET],
  setScaleFactor: () => {},
  scaleUnit: ScaleOptions.FEET,
  setScaleUnit: () => {},
  prevScaleUnit: ScaleOptions.FEET,
};
export const ScaleContext = createContext<Scale>(defaultValues);

export const useScale = () => useContext(ScaleContext);

interface Props {
  children: ReactNode;
}
export const ScaleProvider: FC<Props> = ({ children }) => {
  const [cursorLoc, setCursorLoc] = useState({ x: 0, y: 0 });
  const [scaleUnit, setScaleUnit] = useState(ScaleOptions.FEET);
  const prevScaleUnit = usePrevious(scaleUnit);
  const [scaleFactor, setScaleFactor] = useState(
    scaleOptions[ScaleOptions.FEET]
  );
  const [initializedLocalScale, setInitializedLocalScale] = useState(false);
  // Not the best way to get the params. useParams only works in Routes but this hook wraps the routes
  const drawingId = window.location.pathname.replace('/drawing/', '');

  useEffect(() => {
    setScaleFactor(scaleOptions[scaleUnit]);
  }, [scaleUnit]);
  useEffect(() => {
    const localScale = localStorage.getItem(`sandbox-${drawingId}-scale-unit`);
    if (localScale) {
      setScaleUnit(JSON.parse(localScale));
      // Make sure local global variables have been set before trying to store changes to local storage
    }
    setInitializedLocalScale(true);
  }, []);
  useEffect(() => {
    if (!initializedLocalScale) return;
    localStorage.setItem(
      `sandbox-${drawingId}-scale-unit`,
      JSON.stringify(scaleUnit)
    );
  }, [scaleUnit, initializedLocalScale]);
  return (
    <ScaleContext.Provider
      value={{
        cursorLoc,
        setCursorLoc,
        scaleFactor,
        setScaleFactor,
        scaleUnit,
        setScaleUnit,
        prevScaleUnit,
      }}
    >
      {children}
    </ScaleContext.Provider>
  );
};
