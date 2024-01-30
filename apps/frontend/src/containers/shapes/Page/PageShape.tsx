import {
	BaseBoxShapeTool,
	BaseBoxShapeUtil,
	DefaultColorStyle,
	HTMLContainer,
	StyleProp,
	T,
	TLBaseShape,
	TLDefaultColorStyle,
	getDefaultColorTheme,
} from '@tldraw/tldraw'
import { usePageStyles } from './PageShape.styles'

// Define a style that can be used across multiple shapes.
// The ID (myApp:filter) must be globally unique, so we recommend prefixing it with a namespace.
export const MyFilterStyle = StyleProp.defineEnum('Page:filter', {
	defaultValue: 'none',
	values: ['none', 'invert', 'grayscale', 'blur'],
})

export type MyFilterStyle = T.TypeOf<typeof MyFilterStyle>

export type PageShape = TLBaseShape<
	'page',
	{
		w: number
		h: number
		color: string
		filter: MyFilterStyle
	}
>

export class PageShapeUtil extends BaseBoxShapeUtil<PageShape> {
	static override type = 'page' as const

	static override props = {
		w: T.number,
		h: T.number,
		// You can re-use tldraw built-in styles...
		color: T.string,
		// ...or your own custom styles.
		filter: MyFilterStyle,
	}

	override isAspectRatioLocked = (_shape: PageShape) => false
	override canResize = (_shape: PageShape) => true
	override canBind = (_shape: PageShape) => true

	override getDefaultProps(): PageShape['props'] {
		return {
			w: 0,
			h: 0,
			color: 'white',
			filter: 'none',
		}
	}

	component(shape: PageShape) {
		const bounds = this.editor.getShapeGeometry(shape).bounds
		const classes = usePageStyles();

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
	indicator(shape: PageShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}

	filterStyleToCss(filter: MyFilterStyle) {
		if (filter === 'invert') return 'invert(100%)'
		if (filter === 'grayscale') return 'grayscale(100%)'
		if (filter === 'blur') return 'blur(10px)'
		return 'none'
	}
}

// Extending the base box shape tool gives us a lot of functionality for free.
export class PageShapeTool extends BaseBoxShapeTool {
	static override id = 'page'
	static override initial = 'idle'
	override shapeType = 'page'
	props = {
		w: T.number,
		h: T.number,
		// You can re-use tldraw built-in styles...
		color: DefaultColorStyle,
		// ...or your own custom styles.
		filter: MyFilterStyle,
	}
}