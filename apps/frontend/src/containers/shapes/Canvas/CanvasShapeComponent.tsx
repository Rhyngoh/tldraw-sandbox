import { HTMLContainer, Tldraw, toDomPrecision, useEditor, useIsEditing, useValue } from '@tldraw/tldraw';
import React, { ReactNode } from 'react';
import { CanvasShape, canvasDefinition } from './CanvasShape';
import InsertPageBox from '../../tools/InsertPageBox';
import { InsertPageTool } from '../../tools/InsertPageTool';
import { CardShapeUtil, CardShapeTool } from '../Card/CardShape';
import { PageShapeUtil, PageShapeTool } from '../Page/PageShape';
import { getRotatedBoxShadow } from '../shared/rotated-box-shadow';
import { CanvasShapeUtil } from './CanvasShapeUtil';

export interface Props {
    shape: CanvasShape,
}
const CanvasShapeComponent = (props: Props): ReactNode => {
    const { shape } = props;
    const { w, h } = shape.props;
    const editor = useEditor();
    const isEditing = useIsEditing(shape.id)
    // const embedInfo = useMemo(() => getEmbedInfoUnsafely(url), [url])
    React.useEffect(() => {
        console.log('isEditing', isEditing, editor)
    }, [isEditing])
    const isHoveringWhileEditingSameShape = useValue(
        'is hovering',
        () => {
            console.log('useValue')
            const { editingShapeId, hoveredShapeId } = editor.getCurrentPageState()

            if (editingShapeId && hoveredShapeId !== editingShapeId) {
                const editingShape = editor.getShape(editingShapeId)
                if (editingShape && editor.isShapeOfType<CanvasShape>(editingShape, 'canvas')) {
                    return true
                }
            }

            return false
        },
        []
    )
    React.useEffect(() => {
        console.log('isHovering', isHoveringWhileEditingSameShape)
    }, [isHoveringWhileEditingSameShape])
    const store = editor.store;
    console.log('store', shape, editor, store, editor.shapeUtils, store.allRecords(), canvasDefinition);
    const customShapeUtils = [CardShapeUtil, PageShapeUtil, CanvasShapeUtil]
    const customTools = [CardShapeTool, PageShapeTool, InsertPageTool]
    const pageRotation = editor.getShapePageTransform(shape)!.rotation()

    const isInteractive = isEditing || isHoveringWhileEditingSameShape

    const customComponents = {
        InFrontOfTheCanvas: () => {
            console.log('customComponent')
            return <InsertPageBox />
        }
    }
    return (
        <HTMLContainer className="tl-embed-container" id={shape.id}>
            <div style={{
                width: toDomPrecision(w) || 100,
                height: toDomPrecision(h) || 100,
                // border: 0,
                pointerEvents: isInteractive ? 'auto' : 'none',
                zIndex: isInteractive ? '' : '-1',
                boxShadow: getRotatedBoxShadow(pageRotation),
                borderRadius: canvasDefinition.overrideOutlineRadius ?? 8,
                background: canvasDefinition.backgroundColor,
                borderColor: 'red',
                borderWidth: 10,
            }}>
                <Tldraw 
                shapeUtils={customShapeUtils}
                tools={customTools}
                components={customComponents}
                // hideUi
                store={store} />
            </div>
        </HTMLContainer>
    )
}

export default CanvasShapeComponent;