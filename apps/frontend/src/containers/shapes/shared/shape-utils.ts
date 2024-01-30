import {
  ExtendedLineColorOptions,
  ExtendedLineDashOptions,
  ExtendedLineSizeOptions,
} from '../Line/ExtendedLineShape';
import { STROKE_SIZES } from './default-shape-constants';
import { LayerOrBlockOptions } from './types';
import {
  DefaultColorThemePalette,
  EnumStyleProp,
  TLDefaultColorStyle,
  DefaultFillStyle,
} from '@tldraw/tldraw';
export function last<T>(arr: readonly T[]): T | undefined {
  return arr[arr.length - 1];
}
export function assert<T>(
  thing: T,
  errorMessage?: string
): asserts thing is NonNullable<T> {
  if (thing === null || thing === undefined) {
    throw new Error(errorMessage);
  }
}

export function getStrokeWidth(
  size: ExtendedLineSizeOptions,
  opts?: LayerOrBlockOptions
): number {
  if (typeof size === 'string') {
    if (size === 'ByLayer') {
      // Get size ByLayer
      if (opts?.layer) {
        return getStrokeWidth(opts.layer.size);
      } else {
        return STROKE_SIZES['m'];
      }
    } else if (size === 'ByBlock') {
      // Get size ByBlock
      if (opts?.block) {
        return getStrokeWidth(opts.block.size);
      } else {
        return STROKE_SIZES['m'];
      }
    } else if (size in STROKE_SIZES) {
      // Check if size is a predefined option
      return STROKE_SIZES[size];
    }
  }

  // If size is a number, use it directly
  if (typeof size === 'number') {
    return size;
  }

  // Fallback or throw an error if the size is not recognized
  return STROKE_SIZES['m'];
}

export function getColor(
  color: ExtendedLineColorOptions,
  isDarkMode?: boolean,
  opts?: LayerOrBlockOptions
): string {
  const defaultColor = DefaultColorThemePalette.darkMode.solid;
  const colorPalette = isDarkMode
    ? DefaultColorThemePalette.darkMode
    : DefaultColorThemePalette.lightMode;
  if (color === 'ByLayer') {
    if (opts?.layer) {
      return getColor(opts.layer.color, isDarkMode);
    } else {
      return defaultColor;
    }
  } else if (color === 'ByBlock') {
    if (opts?.block) {
      return getColor(opts.block.color, isDarkMode);
    } else {
      return defaultColor;
    }
  } else if ((color as TLDefaultColorStyle) in colorPalette) {
    return colorPalette[color as TLDefaultColorStyle].solid;
  } else {
    return color as string;
  }
}

export function getDash(
  dash: ExtendedLineDashOptions,
  opts?: LayerOrBlockOptions
): string {
  if (dash === 'ByLayer' && opts?.layer) {
    return getDash(opts.layer.dash);
  } else if (dash === 'ByBlock' && opts?.block) {
    return getDash(opts.block.dash);
  } else {
    return dash as string;
  }
}
