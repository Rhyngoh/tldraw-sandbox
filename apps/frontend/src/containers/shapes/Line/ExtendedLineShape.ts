import {
  EnumStyleProp,
  StyleProp,
  T,
  TLBaseShape,
  TLHandle,
  defineMigrations,
} from '@tldraw/tldraw';
import {
  ColorOverride,
  DashOverride,
  LayerOrBlockOptions,
  ShapePropsType,
  SizeOverride,
} from '../shared/types';
// import { TLLineShapeProps } from '../shared/types';
import { TL_HANDLE_TYPES } from '@tldraw/tlschema';

// Extend LineShapeProps color to allow any hex string
export type ExtendedLineColorOptions = ColorOverride | 'ByLayer' | 'ByBlock';
// Extend dash prop to allow for custom linetype; Reference different linetypes based off key
export type ExtendedLineDashOptions = DashOverride | 'ByLayer' | 'ByBlock';
// Extended size prop to allow for arbitrary number inputs in px
export type ExtendedLineSizeOptions = SizeOverride | 'ByLayer' | 'ByBlock';
export type Handle = {
  [key: string]: TLHandle;
};

export const handleValidator: T.Validator<TLHandle> = T.object({
	id: T.string,
	type: T.setEnum(TL_HANDLE_TYPES),
	canBind: T.boolean.optional(),
	canSnap: T.boolean.optional(),
	index: T.string,
	x: T.number,
	y: T.number,
	w: T.optional(T.number),
	h: T.optional(T.number),
})

declare const extendedLineColorOptions: T.Validator<ExtendedLineColorOptions>;
declare const extendedLineDashOptions: T.Validator<ExtendedLineDashOptions>;
declare const extendedLineSizeOptions: T.Validator<ExtendedLineSizeOptions>;
declare const extendedLineHandlesOptions: T.Validator<TLHandle>;
declare const extendedLineOptsOptions: T.Validator<LayerOrBlockOptions | undefined>
export const extendedLineHandles = {} as typeof extendedLineHandlesOptions;
export const extendedLineOpts = {} as typeof extendedLineOptsOptions;
export const extendedLineShapeProps = {
    color: StyleProp.define('extendedLineColor', {
        defaultValue: 'black',
        type: extendedLineColorOptions
        // type: T.string
    }),
    dash: StyleProp.define('extendedLineDash', {
        defaultValue: 'solid',
        type: extendedLineDashOptions
        // type: T.string
    }),
    size: StyleProp.define('extendedLineSize', {
        defaultValue: 'm' as ExtendedLineSizeOptions,
        type: extendedLineSizeOptions
        // type: T.unknown
    }),
    spline: StyleProp.defineEnum('extendedLineSpline', {
        defaultValue: 'line',
        values: ['cubic', 'line'],
    }),
    handles: {} as T.DictValidator<string, TLHandle>,
    // handles: T.dict(T.string, handleValidator),
    opts: StyleProp.define('extendedLineOpts', {
      defaultValue: undefined,
      type: extendedLineOpts
    }),
  };

// export declare const extendedLineShapeProps: {
//   color: EnumStyleProp<ExtendedLineColorOptions>;
//   dash: EnumStyleProp<ExtendedLineDashOptions>;
//   size: EnumStyleProp<ExtendedLineSizeOptions>;
//   spline: EnumStyleProp<'cubic' | 'line'>;
//   handles: T.DictValidator<string, TLHandle>;
//   opts: EnumStyleProp<LayerOrBlockOptions | undefined>;
// };

export type ExtendedLineShapeProps = ShapePropsType<
  typeof extendedLineShapeProps
>;
export const extendedLineShapeMigrations = defineMigrations({});

export declare type ExtendedLineShape = TLBaseShape<
  'extended-line',
  ExtendedLineShapeProps
>;
