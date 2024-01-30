import { StateNode, TLCompleteEvent, TLEventHandlers, TLExitEventHandler, TLInterruptEvent } from '@tldraw/editor'
import { InsertPageIdle } from './InsertPageIdle'
import { InsertPagePointing } from './InsertPagePointing'
import { TLCancelEvent, TLPageId, atom, createShapeId } from '@tldraw/tldraw'
import { InsertPageDragging } from './InsertPageDragging'
import ReactDOM from 'react-dom'
import CanvasShapeComponent from '../shapes/Canvas/CanvasShapeComponent'
import { createRoot } from 'react-dom/client'
import { CanvasShape } from '../shapes/Canvas/CanvasShape'

/** @public */
export class InsertPageTool extends StateNode {
	static override id = 'insert-page'
	static override initial = 'idle'
	static override children = () => [InsertPageIdle, InsertPagePointing, InsertPageDragging]

    initialPage = atom('initialPage', 'page:page' as TLPageId)

    // constructor(editor: any) {
    //     super(editor)
    //     console.log(editor)
    //     console.log(this.parent)
    //         console.log(editor?.getCurrentPageId())
    //     this.initialPage.set(editor?.getCurrentPageId())
    // }

    override onEnter = () => {
        this.initialPage.set(this.editor?.getCurrentPageId())
        this.editor.setCurrentPage('page:page' as TLPageId)
        this.editor.setCursor({ type: 'cross', rotation: 0 })
    }
    override onComplete: TLEventHandlers['onComplete'] = () => {
        this.complete();
    }

    override onInterrupt: TLEventHandlers['onInterrupt'] = () => {
        this.complete()
    }

    override onCancel: TLEventHandlers['onCancel'] = () => {
        this.complete()
    }
    // override onPointerUp: TLEventHandlers['onPointerUp'] = info => {
    //     console.log('pointup', info, this.editor.inputs.currentPagePoint.x)
    //     // this.parent.transition('select', {x:Math.round(this.editor.inputs.currentPagePoint.x * 1000) / 1000, y: Math.round(this.editor.inputs.currentPagePoint.y * 1000) / 1000})
    //     this.editor.setCurrentTool('select', {x:Math.round(info.point.x * 1000) / 1000, y: Math.round(info.point.y * 1000) / 1000})
    // }
    private complete() {
        this.parent.transition('idle', {})
    }
}
