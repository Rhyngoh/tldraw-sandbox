import {
	BaseBoxShapeUtil,
	DefaultColorStyle,
	HTMLContainer,
	ShapeUtil,
	StyleProp,
	T,
	TLBaseShape,
	TLDefaultColorStyle,
	getDefaultColorTheme,
} from '@tldraw/tldraw'
import { usePolylineStyles } from './Polyline.styles'

export type PolylineShape = TLBaseShape<
	'polyline',
	{
		w: number
		h: number
		color: string
	}
>

export class PolylineShapeUtil extends BaseBoxShapeUtil<PolylineShape> {
	static override type = 'polyline' as const
	static override props = {}

	override isAspectRatioLocked = (_shape: PolylineShape) => false
	override canResize = (_shape: PolylineShape) => true
	override canBind = (_shape: PolylineShape) => true

	override getDefaultProps(): PolylineShape['props'] {
		return {
			w: 300,
			h: 300,
			color: 'white',
		}
	}

	component(shape: PolylineShape) {
		const bounds = this.editor.getShapeGeometry(shape).bounds
		const classes = usePolylineStyles();

		return (
			<HTMLContainer
				id={shape.id}
				className={classes.root}
				style={{
					backgroundColor: shape.props.color,
				}}
			>
			</HTMLContainer>
		)
	}

	// Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
	indicator(shape: PolylineShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}