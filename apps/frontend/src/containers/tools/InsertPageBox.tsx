import React from 'react';
import { useEditor, useValue, Box, Vec, Tldraw } from '@tldraw/tldraw';
import { InsertPageDragging } from './InsertPageDragging'
const InsertPageBox = () => {
    const editor = useEditor()

    const insertPageValue = useValue(
		'insert-page',
		() => {
			// Check whether the screenshot tool (and its dragging state) is active
			if (editor.getPath() !== 'insert-page.dragging') return null

			// Get screenshot.dragging state node
			const draggingState = editor.getStateDescendant<InsertPageDragging>('insert-page.dragging')!

			// Get the box from the screenshot.dragging state node
			const box = draggingState.coord.get()

			// The box is in "page space", i.e. panned and zoomed with the canvas, but we
			// want to show it in front of the canvas, so we'll need to convert it to
			// "page space", i.e. uneffected by scale, and relative to the tldraw
			// page's top left corner.
			const zoomLevel = editor.getZoomLevel()
			const { x, y } = Vec.Sub(
				editor.pageToScreen({ x: box.x, y: box.y }),
				editor.getViewportScreenBounds()
			)
			return new Box(x, y, box.w * zoomLevel, box.h * zoomLevel)
		},
		[editor]
	)

	if (!insertPageValue) return null

	return (
		<div
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				transform: `translate(${insertPageValue.x}px, ${insertPageValue.y}px)`,
				width: insertPageValue.w,
				height: insertPageValue.h,
				border: '1px solid var(--color-text-0)',
				zIndex: 999,
			}}
		>   
        </div>
	)
}
export default InsertPageBox;