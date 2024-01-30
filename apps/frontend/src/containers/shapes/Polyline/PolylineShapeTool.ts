import { DefaultColorStyle, StateNode, T } from "@tldraw/tldraw"

// Extending the base box shape tool gives us a lot of functionality for free.
export class PolylineShapeTool extends StateNode {
	static override id = 'polyline'
	static override initial = 'idle'
	static override children = () => []
	override shapeType = 'polyline'
}