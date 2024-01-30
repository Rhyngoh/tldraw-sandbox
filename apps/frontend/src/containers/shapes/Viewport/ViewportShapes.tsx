import {
  Box,
  TLPage,
  TLPageId,
  TLShape,
  TLShapeId,
  TLUnknownShape,
  createShapeId,
  track,
  useEditor,
  useValue,
} from '@tldraw/tldraw';
import React, { useState, useEffect, useRef } from 'react';
import { isEqual } from 'lodash';
import useDeepCompareEffect from 'apps/frontend/src/hooks/useDeepCompareEffect';
import { ViewportShape } from './ViewportShape';
import { PageShape } from '../Page/PageShape';

interface Props {
  shapesToRender: (TLShape | undefined)[];
  shape: ViewportShape;
  x: number;
  y: number;
}
const ViewportShapes = (props: Props) => {
  const { shapesToRender, shape, x, y } = props;
  const groupRef = useRef<TLShapeId>();
  const editor = useEditor();
//   const [shapesToRender, setShapesToRender] = useState([] as (TLShape | undefined)[])
//   const shapesToRender2 = useValue(
//     'dimensions',
//     () => {
//       console.log('viewport', shape);
//     //   const parentBox = new Box()
//     if (!shape.id.includes(':viewportRef:')) return [];
//     const parentId = shape.id.substring(shape.id.indexOf(':viewportRef:') + 13)
//     console.log('parentId:', parentId)
//     const parentShape = editor.getShape(parentId as TLShapeId) as ViewportShape
//     console.log('parentShape', parentShape)
//       const box = new Box(parentShape.x, parentShape.y, parentShape.props.w, parentShape.props.h);
//       // get all shapes contained by or intersecting the box
//       const modelPage = editor.getPage('page:page' as TLPageId)!;
//       // console.log(modelPage)
//       const shapeIds = editor.getPageShapeIds(modelPage as TLPage);
//       // console.log('shapeIds', shapeIds)
//       const modelShapes = Array.from(shapeIds).map((el: TLShapeId) =>
//         editor.getShape(el)
//       );
//       console.log('modelShapes', modelShapes);
//       // console.log(editor.getCurrentPageShapeIds())
//       const allShapes = modelShapes.filter((s) => {
//         if (!s) return false
//         // ignore itself
//         if (s.id === parentShape.id) return false;
//         const pageBounds = editor.getShapeMaskedPageBounds(s);
//         if (!pageBounds) return false;
//         return box.includes(pageBounds);
//       });
//       console.log('all contained shapes', allShapes)
//       // return allShapes
//       //   innerShapes.set(allShapes);
//       setShapesToRender(allShapes)
//       return allShapes;
//     },
//     []
//   );
  const compact = (arr: any[]) => {
    return arr.filter((i) => i !== undefined && i !== null);
  };
  const renderShapes = (allShapes: (TLShape | undefined)[]) => {
      // don't render shapes if on page:page
    // if (editor.getCurrentPageId() === 'page:page') return;
    // const shapes = allShapes.map((el) => {
    //   console.log(el);
    //   // editor.createShape(el as any)
    //   const shape = editor.getShape(el?.id as TLShapeId);

    //   console.log(shape);
    //   const shapeId = `${createShapeId()}:ref:${shape!.id}`;
    //   console.log('createdId2', shapeId);

    //   editor.createShape({
    //     ...(shape as TLShape),
    //     id: shapeId,
    //     parentId: editor.getCurrentPageId(),
    //   } as PageShape);
    //   return editor.getShape(shapeId as TLShapeId);
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
    // const xCoord = x;
    // const yCoord = y;
    // groupRef.current = groupId;
    // if (groupedShape) {
    // if (groupedShape) {
    //   // move to a location
    //   editor.updateShape({
    //     id: groupId,
    //     type: 'group',
    //     x: xCoord,
    //     y: yCoord,
    //   });
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
    //       { x: 0.5, y: 0.5 },
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
    //   // groupRef.current = groupedShape;
    //   // })
    //   editor.bringToFront(selectedShapes);
    // }
  };
  useDeepCompareEffect(
    () => {
    //   console.log('render shapes', shapesToRender, groupRef.current);
    //   // render the shapes
    //   if (groupRef.current) {
    //     editor.deleteShape(groupRef.current)
    //     renderShapes(shapesToRender);
    //   }
    //   return () => {
    //     if (groupRef.current) {
    //         editor.deleteShape(groupRef.current)
    //       } 
    //   }
    },
    [shapesToRender],
    1000
  );
  return <></>;
};
export default ViewportShapes;
