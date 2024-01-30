import { StateNode, TLEventHandlers } from '@tldraw/tldraw'

export class InsertPagePointing extends StateNode {
	static override id = 'pointing'
    
    override onPointerMove: TLEventHandlers['onPointerUp'] = () => {
        if (this.editor.inputs.isDragging) {
            this.parent.transition('dragging')
        }
    }
    override onPointerUp: TLEventHandlers['onPointerUp'] = (info) => {
        console.log('pointerUp', info);
        // this.parent.transition('select', {x:Math.round(this.editor.inputs.currentPagePoint.x * 1000) / 1000, y: Math.round(this.editor.inputs.currentPagePoint.y * 1000) / 1000})
        this.complete()
        }

	override onCancel: TLEventHandlers['onCancel'] = () => {
        this.complete()
	}

	private complete() {
		this.parent.transition('idle')
	}
}