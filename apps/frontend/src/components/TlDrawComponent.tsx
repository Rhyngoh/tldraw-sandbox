import { TLPageId, Tldraw, track, useEditor } from '@tldraw/tldraw'
// import '@tldraw/tldraw/tldraw.css'
import { useEffect, useState } from 'react'
import Dropdown from './dropdown/dropdown'
import React from 'react'
// import './custom-ui.css'

// There's a guide at the bottom of this file!

// [2]
const CustomUi = track(() => {
	const editor = useEditor()
    const [pages, setPages] = useState({})
	useEffect(() => {
		const handleKeyUp = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Delete':
				case 'Backspace': {
					editor.deleteShapes(editor.getSelectedShapeIds())
					break
				}
				case 'v': {
					editor.setCurrentTool('select')
					break
				}
				case 'e': {
					editor.setCurrentTool('eraser')
					break
				}
				case 'x':
				case 'p':
				case 'b':
				case 'd': {
					editor.setCurrentTool('draw')
					break
				}
			}
		}

		window.addEventListener('keyup', handleKeyUp)
		return () => {
			window.removeEventListener('keyup', handleKeyUp)
		}
	})
    useEffect(() => {
        setPages(
          editor.getPages().reduce((result: { [key: string]: string }, page) => {
            result[page.id] = page.name;
            return result;
          }, {})
        );
      }, []);
      const currentPage = React.useMemo(() => {
        return editor.getCurrentPage().id;
      }, []);
console.log(pages)
	return (
		<div className="custom-layout" style={{
            position: "absolute",
			width: "100%",
			top: "0px",
			left: "0px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			flexDirection: "row",
			gap: "12px",
            zIndex: 300,
            }}>
			<div className="custom-toolbar">
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'select'}
					onClick={() => editor.setCurrentTool('select')}
				>
					Select
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'draw'}
					onClick={() => editor.setCurrentTool('draw')}
				>
					Pencil
				</button>
				<button
					className="custom-button"
					data-isactive={editor.getCurrentToolId() === 'eraser'}
					onClick={() => editor.setCurrentPage('page:page' as TLPageId)}
				>
					Eraser
				</button>
                <Dropdown
            placeholder={'Pages'}
            values={pages}
            selected={currentPage}
            onSelected={(sheetId) => {
				console.log(sheetId)
				editor.setCurrentPage(sheetId as TLPageId)
			}}
            onAdd={()=>{}}
            // className={classes.dropdown}
          />
                {Object.keys(pages).map((el) => {
                    return (
                        <button key={el} onClick={() => editor.setCurrentPage(el as TLPageId)}>{el}</button>
                    )
                })}
			</div>
		</div>
	)
})


export default CustomUi