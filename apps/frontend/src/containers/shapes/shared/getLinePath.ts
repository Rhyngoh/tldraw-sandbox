import { CubicSpline2d, Polyline2d, TLLineShape, getSvgPathFromPoints } from '@tldraw/tldraw'
import { getStrokeOutlinePoints } from './freehand/getStrokeOutlinePoints'
import { getStrokePoints } from './freehand/getStrokePoints'
import { setStrokePointRadii } from './freehand/setStrokePointRadii'
import { getSvgPathFromStrokePoints } from './freehand/svg'
import { getSvgPathForLineGeometry } from './svg'
import { ExtendedLineShape } from '../Line/ExtendedLineShape'

export function getLineDrawFreehandOptions(strokeWidth: number) {
	return {
		size: strokeWidth,
		thinning: 0.4,
		streamline: 0,
		smoothing: 0.5,
		simulatePressure: true,
		last: true,
	}
}

export function getLineSolidFreehandOptions(strokeWidth: number) {
	return {
		size: strokeWidth,
		thinning: 0,
		streamline: 0,
		smoothing: 0.5,
		simulatePressure: false,
		last: true,
	}
}

export function getLineStrokePoints(
	shape: TLLineShape | ExtendedLineShape,
	spline: CubicSpline2d | Polyline2d,
	strokeWidth: number
) {
	// const points = getLinePoints(spline)
	const points = spline.vertices
	const options = getLineDrawFreehandOptions(strokeWidth)
	return getStrokePoints(points, options)
}

export function getLineDrawStrokeOutlinePoints(
	shape: TLLineShape | ExtendedLineShape,
	spline: CubicSpline2d | Polyline2d,
	strokeWidth: number
) {
	const options = getLineDrawFreehandOptions(strokeWidth)
	return getStrokeOutlinePoints(
		setStrokePointRadii(getLineStrokePoints(shape, spline, strokeWidth), options),
		options
	)
}

export function getLineSolidStrokeOutlinePoints(
	shape: TLLineShape | ExtendedLineShape,
	spline: CubicSpline2d | Polyline2d,
	strokeWidth: number
) {
	const options = getLineSolidFreehandOptions(strokeWidth)
	return getStrokeOutlinePoints(getLineStrokePoints(shape, spline, strokeWidth), options)
}

export function getLineDrawPath(
	shape: TLLineShape | ExtendedLineShape,
	spline: CubicSpline2d | Polyline2d,
	strokeWidth: number
) {
	const stroke = getLineDrawStrokeOutlinePoints(shape, spline, strokeWidth)
	return getSvgPathFromPoints(stroke)
}

export function getLineSolidPath(
	shape: TLLineShape | ExtendedLineShape,
	spline: CubicSpline2d | Polyline2d,
	strokeWidth: number
) {
	const outlinePoints = getLineSolidStrokeOutlinePoints(shape, spline, strokeWidth)
	return getSvgPathFromPoints(outlinePoints)
}

export function getLineIndicatorPath(
	shape: TLLineShape | ExtendedLineShape,
	spline: CubicSpline2d | Polyline2d,
	strokeWidth: number
) {
	if (shape.props.dash === 'draw') {
		const strokePoints = getLineStrokePoints(shape, spline, strokeWidth)
		return getSvgPathFromStrokePoints(strokePoints)
	}

	return getSvgPathForLineGeometry(spline)
}