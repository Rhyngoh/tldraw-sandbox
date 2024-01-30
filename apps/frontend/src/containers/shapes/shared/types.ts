import { TLDefaultColorStyle, EnumStyleProp, TLDefaultDashStyle, TLDefaultSizeStyle, lineShapeProps, TLHandle } from '@tldraw/tldraw'
import { TL_HANDLE_TYPES } from '@tldraw/tlschema';
import { Expand } from '@tldraw/utils';
import { T } from '@tldraw/validate';

export declare type ShapePropsType<Config extends Record<string, T.Validatable<any>>> = Expand<{
    [K in keyof Config]: T.TypeOf<Config[K]>;
}>;
// export declare type TLLineShapeProps = ShapePropsType<typeof lineShapeProps>;

export interface LayerOrBlockOptions {
	layer?: LayerOptions;
	block?: BlockOptions;
}

export type ColorOverride = TLDefaultColorStyle | 'primary' | 'secondary' | string;
export type DashOverride = TLDefaultDashStyle | string;
export type SizeOverride = TLDefaultSizeStyle | number;

export interface LayerOptions {
	color: ColorOverride
	dash: DashOverride
	size: SizeOverride;
	opacity: number;
	frozen: boolean;
}

export interface BlockOptions {
	color: ColorOverride
	dash: DashOverride
	size: SizeOverride;
	opacity: number;
	frozen: boolean;
}

export interface LineType {
	name: string;
	appearance: string; // or SVG?
	description: string;
}