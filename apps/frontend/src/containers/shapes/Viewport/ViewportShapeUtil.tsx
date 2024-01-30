/* eslint-disable react-hooks/rules-of-hooks */

import {
  BaseBoxShapeUtil,
  HTMLContainer,
  TLOnBeforeCreateHandler,
  TLOnBeforeUpdateHandler,
  TLOnDragHandler,
  TLOnEditEndHandler,
  TLOnResizeHandler,
  TLOnRotateHandler,
  TLOnTranslateHandler,
  TLOnTranslateStartHandler,
  TLShapeUtilFlag,
  // embedShapeMigrations,
  // embedShapePermissionDefaults,
  // embedShapeProps,
  toDomPrecision,
  useIsEditing,
  useValue,
} from '@tldraw/editor';
import {
  Box,
  TLDrawShape,
  TLPage,
  TLPageId,
  TLShape,
  TLShapeId,
  atom,
  createShapeId,
  createTLStore,
  defaultShapeUtils,
  useTLStore,
} from '@tldraw/tldraw';
import { useMemo } from 'react';
// import { getEmbedInfo, getEmbedInfoUnsafely } from '../../utils/embeds/embeds'
import { resizeBox } from '../shared/resizeBox';
import { getRotatedBoxShadow } from '../shared/rotated-box-shadow';
import { T, Tldraw } from '@tldraw/tldraw';
import {
  viewportShapeProps,
  viewportDefinition,
  ViewportShape,
  viewportShapeMigrations,
} from './ViewportShape';
import { CardShapeTool, CardShapeUtil } from '../Card/CardShape';
import { InsertPageTool } from '../../tools/InsertPageTool';
import { PageShape, PageShapeTool, PageShapeUtil } from '../Page/PageShape';
import InsertPageBox from '../../tools/InsertPageBox';
import React from 'react';
import ViewportShapes from './ViewportShapes';
import useDeepCompareEffect from 'apps/frontend/src/hooks/useDeepCompareEffect';

/** @public */
export class ViewportShapeUtil extends BaseBoxShapeUtil<ViewportShape> {
  static override type = 'viewport' as const;
  static override props = viewportShapeProps;
  static override migrations = viewportShapeMigrations;
  dimensions: any = atom('dimensions', {
    x: 0,
    y: 0,
    w: 10,
    h: 10,
    scaleX: 1,
    scaleY: 1,
  });
  isTranslating = atom('isTranslating', false)
  override hideSelectionBoundsFg: TLShapeUtilFlag<ViewportShape> = (shape) =>
    !this.canResize(shape);
  override canEdit: TLShapeUtilFlag<ViewportShape> = () => true;
  override canUnmount: TLShapeUtilFlag<ViewportShape> = (
    shape: ViewportShape
  ) => {
    return !!viewportDefinition.canUnmount;
  };
  override canResize = (shape: ViewportShape) => {
    return !!viewportDefinition.doesResize;
  };
  override canEditInReadOnly = () => true;

  override getDefaultProps(): ViewportShape['props'] {
    return {
      w: 10,
      h: 10,
    };
  }

  override isAspectRatioLocked: TLShapeUtilFlag<ViewportShape> = (shape) => {
    return viewportDefinition.isAspectRatioLocked ?? false;
  };
  override onTranslateStart: TLOnTranslateStartHandler<ViewportShape> = () => {
	this.isTranslating.set(true)
  };
  override onTranslateEnd: TLOnTranslateHandler<ViewportShape> = (
    initial,
    current
  ) => {
    console.log('current translate', current)
    this.dimensions.set({
      ...this.dimensions,
      x: current.x,
      y: current.y,
      w: current.props.w,
      h: current.props.h,
    });
	this.isTranslating.set(false);
  };
  override onResize: TLOnResizeHandler<ViewportShape> = (shape, info) => {
    console.log(shape, info);
    if (this.editor.getCurrentPageId() === 'page:page') {
      const isAspectRatioLocked = this.isAspectRatioLocked(shape);
      // const embedInfo = getEmbedInfo(shape.props.url)
      let minWidth = viewportDefinition.minWidth ?? 10;
      let minHeight = viewportDefinition.minHeight ?? 10;
      if (isAspectRatioLocked) {
        // Enforce aspect ratio
        // Neither the width or height can be less than 200
        const aspectRatio = shape.props.w / shape.props.h;
        if (aspectRatio > 1) {
          // Landscape
          minWidth *= aspectRatio;
        } else {
          // Portrait
          minHeight /= aspectRatio;
        }
      }
      this.dimensions.set({
        ...this.dimensions,
        scaleX: info.scaleX,
        scaleY: info.scaleY,
      });
      return resizeBox(shape, info, { minWidth, minHeight });
    }
  };

  override component(shape: ViewportShape) {
    const { x, y } = shape;
    const { w, h } = shape.props;
    const [shapesToRender, setShapesToRender] = React.useState(
      [] as (TLShape | undefined)[]
    );
	console.log('component', x, y, w, h)
	console.log(this.dimensions.get().x, this.dimensions.get().y)
    // return !this.initialized && <ViewportShapeComponent shape={shape} />
    const isEditing = useIsEditing(shape.id);

    const parentId = shape.id.substring(shape.id.indexOf(':viewportRef:') + 13);
    console.log('parentId:', parentId);
    const parentShape = parentId
      ? (this.editor.getShape(parentId as TLShapeId) as ViewportShape)
      : shape;
    const shapeValue = useValue(
      'dimensions',
      () => {
        console.log('viewport', shape);
        //   const parentBox = new Box()
        if (!shape.id.includes(':viewportRef:')) return [];
        const parentId = shape.id.substring(
          shape.id.indexOf(':viewportRef:') + 13
        );
        console.log('parentId:', parentId);
        const parentShape = this.editor.getShape(
          parentId as TLShapeId
        ) as ViewportShape;
        console.log('parentShape', parentShape);
        const box = new Box(
          parentShape.x,
          parentShape.y,
          parentShape.props.w,
          parentShape.props.h
        );
        // get all shapes contained by or intersecting the box
        const modelPage = this.editor.getPage('page:page' as TLPageId)!;
        // console.log(modelPage)
        const shapeIds = this.editor.getPageShapeIds(modelPage as TLPage);
        // console.log('shapeIds', shapeIds)
        const modelShapes = Array.from(shapeIds).map((el: TLShapeId) =>
          this.editor.getShape(el)
        );
        console.log('modelShapes', modelShapes);
        // console.log(this.editor.getCurrentPageShapeIds())
        const allShapes = modelShapes.filter((s) => {
          if (!s) return false;
          // ignore itself
          if (s.id === parentShape.id) return false;
          const pageBounds = this.editor.getShapeMaskedPageBounds(s);
          if (!pageBounds) return false;
          return box.includes(pageBounds);
        });
        console.log('all contained shapes', allShapes);
        // return allShapes
        //   innerShapes.set(allShapes);
        setShapesToRender(allShapes);
        return allShapes;
      },
      []
    );
    const isHoveringWhileEditingSameShape = useValue(
      'is hovering',
      () => {
        const { editingShapeId, hoveredShapeId } =
          this.editor.getCurrentPageState();

        if (editingShapeId && hoveredShapeId !== editingShapeId) {
          const editingShape = this.editor.getShape(editingShapeId);
          if (
            editingShape &&
            this.editor.isShapeOfType<ViewportShape>(editingShape, 'viewport')
          ) {
            return true;
          }
        }

        return false;
      },
      []
    );
    // const store = this.editor.store;
    // console.log('store', shape, this.editor, store, this.editor.shapeUtils, store.allRecords(), viewportDefinition);

    const pageRotation = this.editor.getShapePageTransform(shape)!.rotation();
    //   const shapesToRender = [1,2];
    const isInteractive = isEditing || isHoveringWhileEditingSameShape;
    // console.log('viewportshapeutil', x, y, w, h, shape, this.dimensions.get())
    const dimensions = this.dimensions.get(); // shape x and y don't update when translated on screen for some reason
    console.log(shapeValue, shapesToRender, dimensions);

    const renderShapes = (allShapes: (TLShape | undefined)[]) => {
      // don't render shapes if on page:page
      console.log('rendering the shapes', allShapes);
      if (this.editor.getCurrentPageId() === 'page:page') return;
      const parentId = shape.id.substring(
        shape.id.indexOf(':viewportRef:') + 13
      );
      if (!parentId) return;
      const parentShape = this.editor.getShape(
        parentId as TLShapeId
      ) as ViewportShape;
	  console.log('parentBox', parentShape)
	  
      this.editor.batch(() => {
		// update the viewport shapes to match parent w,h
		this.editor.updateShape({ 
			...shape,
			x: dimensions.x,
			y: dimensions.y,
			props: {
				w: parentShape.props.w,
				h: parentShape.props.h,
			}
		})
        const shapes = allShapes.map((el) => {
          console.log(el);
          // this.editor.createShape(el as any)
          const originalShape = this.editor.getShape(el?.id as TLShapeId);
          if (originalShape) {
            console.log(
              'ORIGINAL SHAPE',
              originalShape,
              shape,
              parentShape,
              this.dimensions.get()
            );
            const shapeId = `${createShapeId()}:ref:${originalShape!.id}`;
            console.log('createdId2', shapeId);

            this.editor.createShape({
              ...(originalShape as TLShape),
              x:
                (this.dimensions.get().x || shape.x) -
                (parentShape.x - originalShape.x),
              y:
                (this.dimensions.get().y || shape.y) -
                (parentShape.y - originalShape.y),
              id: shapeId,
              parentId: this.editor.getCurrentPageId(),
            } as PageShape);
            return this.editor.getShape(shapeId as TLShapeId);
          }
        });
        console.log('new shapes', shapes);
        const groupId = `${createShapeId()}:viewportGroup:` as TLShapeId;
        console.log('groupId', groupId);
        this.editor.groupShapes(shapes as TLShape[] | PageShape[], groupId);
        this.editor.toggleLock([groupId]);
      });
    };
    useDeepCompareEffect(
      () => {
        console.log('render shapes', shapesToRender);
        const pageShapeIds = this.editor.getCurrentPageShapeIds();
        const pageShapeIdsArray = Array.from(pageShapeIds);
        const viewportRefShapeIds = pageShapeIdsArray.filter((shapeId) => {
          return shapeId.includes(':viewportGroup:');
        });
        this.editor.toggleLock(viewportRefShapeIds);
        this.editor.deleteShapes(viewportRefShapeIds);
        renderShapes(shapesToRender);
        return () => {
          const pageShapeIds = this.editor.getCurrentPageShapeIds();
          const pageShapeIdsArray = Array.from(pageShapeIds);
          const viewportRefShapeIds = pageShapeIdsArray.filter((shapeId) => {
            return shapeId.includes(':viewportGroup:');
          });
          this.editor.toggleLock(viewportRefShapeIds);
          this.editor.deleteShapes(viewportRefShapeIds);
        };
      },
      [shapesToRender, shape, dimensions.x, dimensions.y, x, y, this.isTranslating.get()],
      1000
    );
	const isParent = !shape.id.includes(':viewportRef:')
    return (
      <HTMLContainer className="tl-embed-container" id={shape.id}>
        <div
          style={{
            width: toDomPrecision(w) || 100,
            height: toDomPrecision(h) || 100,
            // border: 0,
            pointerEvents: isParent ? isInteractive ? 'auto' : 'none' : 'none',
            zIndex: isInteractive ? '' : '-1',
            boxShadow: getRotatedBoxShadow(pageRotation),
            borderRadius: viewportDefinition.overrideOutlineRadius ?? 8,
            backgroundColor: viewportDefinition.backgroundColor,
            borderColor: isParent ? 'red' : 'lightgray',
            borderWidth: 2,
            borderStyle: isParent ? 'dashed' : 'solid',
          }}
        >
          {/* <ViewportShapes
            shape={shape}
            x={dimensions.x}
            y={dimensions.y}
            shapesToRender={shapesToRender}
          /> */}
        </div>
      </HTMLContainer>
    );
  }

  override indicator(shape: ViewportShape) {
    return (
      <rect
        width={toDomPrecision(shape.props.w)}
        height={toDomPrecision(shape.props.h)}
        rx={viewportDefinition.overrideOutlineRadius ?? 8}
        ry={viewportDefinition.overrideOutlineRadius ?? 8}
      />
    );
  }
}
