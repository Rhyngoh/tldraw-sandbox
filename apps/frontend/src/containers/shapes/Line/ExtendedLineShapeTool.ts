import { StateNode } from '@tldraw/editor'
import { Idle } from './toolStates/Idle'
import { Pointing } from './toolStates/Pointing'

/** @public */
export class ExtendedLineShapeTool extends StateNode {
	static override id = 'extended-line'
	static override initial = 'idle'
	static override children = () => [Idle, Pointing]

	override shapeType = 'extended-line'
}