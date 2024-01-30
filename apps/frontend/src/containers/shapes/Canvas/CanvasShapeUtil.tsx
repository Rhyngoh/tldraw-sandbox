/* eslint-disable react-hooks/rules-of-hooks */

import {
  BaseBoxShapeUtil,
  HTMLContainer,
  TLOnBeforeUpdateHandler,
  TLOnEditEndHandler,
  // CanvasShape,
  // CanvasShapePermissions,
  TLOnResizeHandler,
  TLOnRotateHandler,
  TLOnTranslateHandler,
  TLShapeUtilFlag,
  // embedShapeMigrations,
  // embedShapePermissionDefaults,
  // embedShapeProps,
  toDomPrecision,
  useIsEditing,
  useValue,
} from '@tldraw/editor';
import { createTLStore, defaultShapeUtils, useTLStore } from '@tldraw/tldraw';
import { useMemo } from 'react';
// import { getEmbedInfo, getEmbedInfoUnsafely } from '../../utils/embeds/embeds'
import { resizeBox } from '../shared/resizeBox';
import { getRotatedBoxShadow } from '../shared/rotated-box-shadow';
import { T, Tldraw } from '@tldraw/tldraw';
import {
  canvasShapeProps,
  canvasDefinition,
  CanvasShape,
  canvasShapeMigrations,
} from './CanvasShape';
import { CardShapeTool, CardShapeUtil } from '../Card/CardShape';
import { InsertPageTool } from '../../tools/InsertPageTool';
import { PageShapeTool, PageShapeUtil } from '../Page/PageShape';
import InsertPageBox from '../../tools/InsertPageBox';
import React from 'react';
import CanvasShapeComponent from './CanvasShapeComponent';
import useDrawStore from 'apps/frontend/src/context/useStoreContext';

/** @public */
export class CanvasShapeUtil extends BaseBoxShapeUtil<CanvasShape> {
  static override type = 'canvas' as const;
  static override props = canvasShapeProps;
  static override migrations = canvasShapeMigrations;

  override hideSelectionBoundsFg: TLShapeUtilFlag<CanvasShape> = (shape) =>
    !this.canResize(shape);
  override canEdit: TLShapeUtilFlag<CanvasShape> = () => true;
  override canUnmount: TLShapeUtilFlag<CanvasShape> = (shape: CanvasShape) => {
    return !!canvasDefinition.canUnmount;
  };
  override canResize = (shape: CanvasShape) => {
    return !!canvasDefinition.doesResize;
  };
  override canEditInReadOnly = () => true;

  override getDefaultProps(): CanvasShape['props'] {
    return {
      w: 10,
      h: 10,
      url: '',
    };
  }

  override isAspectRatioLocked: TLShapeUtilFlag<CanvasShape> = (shape) => {
    return canvasDefinition.isAspectRatioLocked ?? false;
  };
  override onResize: TLOnResizeHandler<CanvasShape> = (shape, info) => {
    console.log(shape, info);
    const isAspectRatioLocked = this.isAspectRatioLocked(shape);
    // const embedInfo = getEmbedInfo(shape.props.url)
    let minWidth = canvasDefinition.minWidth ?? 10;
    let minHeight = canvasDefinition.minHeight ?? 10;
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

    return resizeBox(shape, info, { minWidth, minHeight });
  };

  override component(shape: CanvasShape) {
    const { w, h, url } = shape.props;
    const isEditing = useIsEditing(shape.id);
    const isHoveringWhileEditingSameShape = useValue(
      'is hovering',
      () => {
        const { editingShapeId, hoveredShapeId } =
          this.editor.getCurrentPageState();

        if (editingShapeId && hoveredShapeId !== editingShapeId) {
          const editingShape = this.editor.getShape(editingShapeId);
          if (
            editingShape &&
            this.editor.isShapeOfType<CanvasShape>(editingShape, 'canvas')
          ) {
            return true;
          }
        }

        return false;
      },
      []
    );
    // const store = this.editor.store;
    // console.log('store', shape, this.editor, store, this.editor.shapeUtils, store.allRecords(), canvasDefinition);

    const pageRotation = this.editor.getShapePageTransform(shape)!.rotation();

    const isInteractive = isEditing || isHoveringWhileEditingSameShape;

    return (
      <HTMLContainer className="tl-embed-container">
        <div
          style={{
            width: toDomPrecision(w) || 100,
            height: toDomPrecision(h) || 100,
            // border: 0,
            pointerEvents: isInteractive ? 'auto' : 'none',
            zIndex: isInteractive ? '' : '-1',
            boxShadow: getRotatedBoxShadow(pageRotation),
            borderRadius: canvasDefinition.overrideOutlineRadius ?? 8,
            background: canvasDefinition.backgroundColor,
            borderColor: 'lightgray',
            borderWidth: 2,
            borderStyle: 'dashed',
          }}
        >
          <iframe
            className="tl-embed"
            // sandbox={sandbox}
            title="canvas"
            src={url}
            width={toDomPrecision(w)}
            height={toDomPrecision(h)}
            draggable={false}
            frameBorder="0"
            referrerPolicy="no-referrer-when-downgrade"
            id={shape.id}
            style={{
              border: 0,
              pointerEvents: isInteractive ? 'auto' : 'none',
              // Fix for safari <https://stackoverflow.com/a/49150908>
              zIndex: isInteractive ? '' : '-1',
              boxShadow: getRotatedBoxShadow(pageRotation),
              borderRadius: canvasDefinition.overrideOutlineRadius ?? 8,
              background: canvasDefinition.backgroundColor,
            }}
          />
          <p style={{ color: 'red' }}>{url}</p>
        </div>
      </HTMLContainer>
    );
  }

  override indicator(shape: CanvasShape) {
    // const embedInfo = useMemo(() => getEmbedInfo(shape.props.url), [shape.props.url])
    return (
      <rect
        width={toDomPrecision(shape.props.w)}
        height={toDomPrecision(shape.props.h)}
        rx={canvasDefinition.overrideOutlineRadius ?? 8}
        ry={canvasDefinition.overrideOutlineRadius ?? 8}
      />
    );
  }
}
