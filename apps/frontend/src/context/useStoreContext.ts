import { createTLStore, defaultShapeUtils, throttle } from '@tldraw/tldraw';
import { useState, useEffect } from 'react';
import { CanvasShapeUtil } from '../containers/shapes/Canvas/CanvasShapeUtil';
import { CardShapeUtil, CardShapeTool } from '../containers/shapes/Card/CardShape';
import { PageShapeUtil, PageShapeTool } from '../containers/shapes/Page/PageShape';
import { InsertPageTool } from '../containers/tools/InsertPageTool';
import { useParams } from 'react-router-dom';
import { DEFAULT_STORE } from '../constants/store';
import { ViewportShapeUtil } from '../containers/shapes/Viewport/ViewportShapeUtil';

const customShapeUtils = [CardShapeUtil, PageShapeUtil, CanvasShapeUtil, ViewportShapeUtil]
// const customShapeUtils = [CanvasShapeUtil]
const customTools = [CardShapeTool, PageShapeTool, InsertPageTool]
type DrawingParams = {
	drawingId: string;
};
const useDrawStore = () => {
	const { drawingId } = useParams<DrawingParams>();
    const shapeUtils = defaultShapeUtils.concat(customShapeUtils);
    const [store, setStore] = useState(() => createTLStore({ shapeUtils: shapeUtils}))
    const [snapshot, setSnapshot] = useState('')
    useEffect(() => {
		async function loadRemoteSnapshot() {
			const stringified = localStorage.getItem('my-editor-snapshot')
			const snapshot = stringified ? JSON.parse(stringified) : DEFAULT_STORE
            setSnapshot(snapshot);
			const newStore = createTLStore({
				shapeUtils: defaultShapeUtils.concat(customShapeUtils),
			})

			if (snapshot) {
				newStore.loadSnapshot(snapshot)
			}

			setStore(newStore)
		}
		async function loadEnvPreferences() {
			const stringified = localStorage.getItem('env-preferences')
			const snapshot = stringified ? JSON.parse(stringified) : {}
		}

		loadRemoteSnapshot()
		const cleanupFn = store.listen(throttle(() => {
			const snapshot = store.getSnapshot()
			localStorage.setItem('my-editor-snapshot', JSON.stringify(snapshot))
		}, 500))
		return () => {
			cleanupFn()
		}
	}, [drawingId])
    const updateStore = (newData: any) => {
        setStore(prevStore => ({ ...prevStore, ...newData }))
    }
    const getStoreData = () => {
        return store;
    }
    useEffect(() => {
        // fetch local storage store
        // setStore(fetchedData)
    }, [])

    return { store, updateStore, getStoreData, shapeUtils, customTools, snapshot }
}

export default useDrawStore;