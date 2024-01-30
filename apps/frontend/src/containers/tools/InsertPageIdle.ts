import { StateNode, TLEventHandlers } from '@tldraw/tldraw'

export class InsertPageIdle extends StateNode {
    static override id = 'idle'

    override onPointerDown: TLEventHandlers['onPointerUp'] = () => {
        this.parent.transition('pointing')
    }
}