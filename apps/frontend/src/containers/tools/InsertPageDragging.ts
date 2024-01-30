import {
  Box,
  StateNode,
  TLRecord,
  TLShape,
  TLShapeId,
  atom,
  copyAs,
  createShapeId,
  exportAs,
} from '@tldraw/tldraw';
import { PageShape } from '../shapes/Page/PageShape';
import { InsertPageTool } from './InsertPageTool';
import { ViewportShape } from '../shapes/Viewport/ViewportShape';
import { CanvasShape } from '../shapes/Canvas/CanvasShape';

// There's a guide at the bottom of this file!

export class InsertPageDragging extends StateNode {
  static override id = 'dragging';

  // [1]
  coord = atom('insert-page', new Box());

  // [2]
  override onEnter = () => {
    this.update();
  };

  override onPointerMove = () => {
    this.update();
  };

  override onKeyDown = () => {
    this.update();
  };

  override onKeyUp = () => {
    this.update();
  };

  private update() {
    const {
      inputs: { shiftKey, altKey, originPagePoint, currentPagePoint },
    } = this.editor;

    const box = Box.FromPoints([originPagePoint, currentPagePoint]);

    if (shiftKey) {
      if (box.w > box.h * (16 / 9)) {
        box.h = box.w * (9 / 16);
      } else {
        box.w = box.h * (16 / 9);
      }

      if (currentPagePoint.x < originPagePoint.x) {
        box.x = originPagePoint.x - box.w;
      }

      if (currentPagePoint.y < originPagePoint.y) {
        box.y = originPagePoint.y - box.h;
      }
    }

    if (altKey) {
      box.w *= 2;
      box.h *= 2;
      box.x = originPagePoint.x - box.w / 2;
      box.y = originPagePoint.y - box.h / 2;
    }

    this.coord.set(box);
  }

  // [3]
  override onPointerUp = () => {
    const { editor } = this;
    const box = this.coord.get();
    console.log(
      'box',
      box,
      editor.getCurrentPageShapes(),
      this.parent,
      (this.parent as InsertPageTool).initialPage.get()
    );
    const initialPage = (this.parent as InsertPageTool).initialPage.get();
	editor.setCurrentPage(initialPage)

    const shapeId = createShapeId();
    this.editor.createShapes<CanvasShape>([
      {
        id: shapeId,
        type: 'canvas',
        x: 0,
        y: 0,
        props: {
          w: box.w,
          h: box.h,
		      url: `http://localhost:4200/drawing/123?viewport=${box.x},${box.y},${box.w},${box.h}&isCanvas=true`,
        },
      },
    ]);


    // 	const { originPagePoint } = this.editor.inputs;
    //     console.log('onComplete', originPagePoint)
    //     // create the shape
    //     const shapeId = createShapeId()
    //     this.editor.createShapes<CanvasShape>([
    //         {
    //             id: shapeId,
    //             type: 'canvas',
    //             x: originPagePoint.x,
    //             y: originPagePoint.y,
    //             props: {
    //                 w: 1,
    //                 h: 1,
    //             }
    //         }
    //     ])
    //     const shape = this.editor.getShape(shapeId)!
    //     console.log('newly created shape', shape)
    //     if (!shape) return
    //     const bounds = new Box(0,0,200,200)
    //     const delta = bounds.center;
    //     const parentTransform = this.editor.getShapeParentTransform(shape)
    //     if (parentTransform) delta.rot(-parentTransform.rotation())
    //     this.editor.select(shapeId)
    // this.editor.updateShapes([
    //     {
    //         id: shape.id,
    //         type: 'canvas',
    //         x: shape.x - delta.x,
    //         y: shape.y - delta.y,
    //         props: {
    //             w: bounds.width,
    //             h: bounds.h,
    //         }
    //     }
    // ])
    //     this.editor.setCursor({ type: 'default', rotation: 0 })
    // const compact = (arr: any[]) => {
    //   return arr.filter((i) => i !== undefined && i !== null);
    // };
    // const shapes = allShapes.map((el) => {
    //   console.log(el);
    //   // editor.createShape(el as any)
    //   const shape = editor.getShape(el.id as TLShapeId);

    //   console.log(shape);
    //   if (shape?.type === 'page') {
    //     const id = `${createShapeId()}:ref:${shape.id}` as TLShapeId;
    //     console.log('createdId', id);
    //     // resize shape to a smaller window
    //     editor.createShape<PageShape>({
    //       ...shape,
    //       id: id,
    //       type: 'page',
    //       x: 0,
    //       y: 0,
    //       isLocked: false, // unlock to allow user to move group with the page background
    //       parentId: editor.getCurrentPageId(),
    //     });
    //     return editor.getShape<PageShape>(id);
    //   } else {
    //     const shapeId = `${createShapeId()}:ref:${shape!.id}`;
    //     console.log('createdId2', shapeId);

    //     editor.createShape({
    //       ...(shape as TLShape),
    //       id: shapeId,
    //       parentId: editor.getCurrentPageId(),
    //     } as PageShape);
    //     return editor.getShape(shapeId as TLShapeId);
    //   }
    // });
    // console.log('new shapes', shapes);
    // const groupId = createShapeId();
    // console.log('groupId', groupId);
    // const groupy = editor.groupShapes(
    //   shapes as TLShape[] | PageShape[],
    //   groupId
    // );
    // const groupedShape = editor.getShape(groupId)!;
    // // const groupedShape= editor.getShape(groupId)! as GroupShape;
    // console.log('groupedShape', groupedShape, groupy);
    // // resize group so all elements get resized at the same time
    // const pageBounds = editor.select(groupId).getSelectionPageBounds();
    // console.log('pageBounds', pageBounds);
    // const selected = editor.getSortedChildIdsForParent(groupId);
    // console.log('selected', selected);
    // const selectedShapes = editor.select(groupId).getSelectedShapes();
    // console.log('selectedShapes', selectedShapes);
    // const xCoord = this.coord.get().x;
    // const yCoord = this.coord.get().y;
    // // const xCoord = insertPageX === '' ? 0 : parseFloat(insertPageX)
    // // const yCoord = insertPageY === '' ? 0 : parseFloat(insertPageY)
    // // if (groupedShape) {
    // if (groupedShape) {
    //   // move to a location
    //   editor.updateShape({ id: groupId, type: 'group', x: xCoord, y: yCoord });
    //   const scaleOriginPage = Box.Common(
    //     compact(selected.map((id) => editor.getShapePageBounds(id)))
    //   ).center;
    //   console.log(scaleOriginPage);
    //   // editor.batch(() => {
    //   for (const shapeId of selected) {
    //     const bounds = editor.getShapeGeometry(shapeId).bounds;
    //     const initialPageTransform = editor.getShapePageTransform(shapeId);
    //     console.log(shapeId, bounds, initialPageTransform);
    //     if (!initialPageTransform) continue;
    //     const shape = editor.getShape(shapeId);
    //     editor.resizeShape(
    //       shapeId,
    //       { x: 2, y: 2 },
    //       {
    //         initialBounds: bounds,
    //         initialPageTransform,
    //         initialShape: shape,
    //         mode: 'scale_shape',
    //         scaleOrigin: { x: xCoord, y: yCoord },
    //         scaleAxisRotation: 0,
    //       }
    //     );
    //   }
    //   // })
    //   editor.bringToFront(selectedShapes);
    // }

    this.editor.setCurrentTool('select');
	this.parent.transition('idle', {})
  };

  // [4]
  override onCancel = () => {
    this.editor.setCurrentTool('select');
  };
}

/*
[1] 
This state has a reactive property (an Atom) called "screenshotBox". This is the box
that the user is drawing on the screen as they drag their pointer. We use an Atom here
so that our UI can subscribe to this property using `useValue` (see the ScreenshotBox
component in ScreenshotToolExample).

[2]
When the user enters this state, or when they move their pointer, we update the 
screenshotBox property to be drawn between the place where the user started pointing
and the place where their pointer is now. If the user is holding Shift, then we modify
the dimensions of this box so that it is in a 16:9 aspect ratio.

[3]
When the user makes a pointer up and stops dragging, we export the shapes contained by
the screenshot box as a png. If the user is holding the ctrl key, we copy the shapes
to the clipboard instead.

[4]
When the user cancels (esc key) or makes a pointer up event, we transition back to the
select tool.
*/
