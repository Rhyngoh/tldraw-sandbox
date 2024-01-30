// import { defineMigrations } from '@tldraw/store'
import { Expand, defineMigrations } from '@tldraw/tldraw';
import { T } from '@tldraw/validate'
import { TLBaseShape } from '@tldraw/tldraw';
import { ShapePropsType } from '../shared/types';

export const viewportDefinition: ViewportDefinition = {
    type: 'viewport',
        title: 'viewport',
        minWidth: 10,
        minHeight: 10,
        width: 720,
        height: 500,
        doesResize: true,
        canUnmount: true,
}

/** @public */
export const viewportShapeProps = {
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
}

/** @public */
export type ViewportShapeProps = ShapePropsType<typeof viewportShapeProps>

/** @public */
export type ViewportShape = TLBaseShape<'viewport', ViewportShapeProps>

/** @public */
export type ViewportDefinition = {
	readonly type: string
	readonly title: string
	readonly minWidth?: number
	readonly minHeight?: number
	readonly width: number
	readonly height: number
	readonly doesResize: boolean
	readonly canUnmount: boolean
	readonly isAspectRatioLocked?: boolean
	readonly instructionLink?: string
	readonly backgroundColor?: string
	// TODO: FIXME this is ugly be required because some embeds have their own border radius for example spotify embeds
	readonly overrideOutlineRadius?: number
}

/** internal **/
export const viewportShapeMigrations = defineMigrations({})