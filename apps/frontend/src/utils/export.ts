import {
	Editor,
	PngHelpers,
	TLShapeId,
	TLSvgOptions,
} from '@tldraw/editor'
import { clampToBrowserMaxCanvasSize } from './getBrowserCanvasMaxSize'

export function exhaustiveSwitchError(value: never, property?: string): never {
	const debugValue =
		property && value && typeof value === 'object' && property in value ? value[property] : value
	throw new Error(`Unknown switch case ${debugValue}`)
}

/** @public */
export async function getSvgAsImage(
	svg: SVGElement,
	isSafari: boolean,
	options: {
		type: 'png' | 'jpeg' | 'webp'
		quality: number
		scale: number
	},
    width: number,
    height: number,
) {
	const { type, quality, scale, } = options

	const svgWidth = +svg.getAttribute('width')!
	const svgHeight = +svg.getAttribute('height')!
	let [clampedWidth, clampedHeight] = await clampToBrowserMaxCanvasSize(
		svgWidth * scale,
		svgHeight * scale
	)
	clampedWidth = Math.floor(clampedWidth)
	clampedHeight = Math.floor(clampedHeight)
	const effectiveScale = clampedWidth / svgWidth

	const svgString = await getSvgAsString(svg)
	const svgUrl = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml' }))

	const canvas = await new Promise<HTMLCanvasElement | null>((resolve) => {
		const image = new Image()
		image.crossOrigin = 'anonymous'

		image.onload = async () => {
			// safari will fire `onLoad` before the fonts in the SVG are
			// actually loaded. just waiting around a while is brittle, but
			// there doesn't seem to be any better solution for now :( see
			// https://bugs.webkit.org/show_bug.cgi?id=219770
			if (isSafari) {
				await new Promise((resolve) => setTimeout(resolve, 250))
			}

			const canvas = document.createElement('canvas') as HTMLCanvasElement
			const ctx = canvas.getContext('2d')!

			// canvas.width = clampedWidth
			// canvas.height = clampedHeight
            canvas.width = width
			canvas.height = height

			ctx.imageSmoothingEnabled = true
			ctx.imageSmoothingQuality = 'high'
			// ctx.drawImage(image, 0, 0, clampedWidth, clampedHeight)
			ctx.drawImage(image, 0, 0, width, height)

			URL.revokeObjectURL(svgUrl)

			resolve(canvas)
		}

		image.onerror = () => {
			resolve(null)
		}

		image.src = svgUrl
	})

	if (!canvas) return null

	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					resolve(null)
				}
				resolve(blob)
			},
			'image/' + type,
			quality
		)
	)

	if (!blob) return null

	const view = new DataView(await blob.arrayBuffer())
	return PngHelpers.setPhysChunk(view, effectiveScale, {
		type: 'image/' + type,
	})
}

async function getSvgAsString(svg: SVGElement) {
	const clone = svg.cloneNode(true) as SVGGraphicsElement

	svg.setAttribute('width', +svg.getAttribute('width')! + '')
	svg.setAttribute('height', +svg.getAttribute('height')! + '')

	const fileReader = new FileReader()
	const imgs = Array.from(clone.querySelectorAll('image')) as SVGImageElement[]

	for (const img of imgs) {
		const src = img.getAttribute('xlink:href')
		if (src) {
			if (!src.startsWith('data:')) {
				const blob = await (await fetch(src)).blob()
				const base64 = await new Promise<string>((resolve, reject) => {
					fileReader.onload = () => resolve(fileReader.result as string)
					fileReader.onerror = () => reject(fileReader.error)
					fileReader.readAsDataURL(blob)
				})
				img.setAttribute('xlink:href', base64)
			}
		}
	}

	const out = new XMLSerializer()
		.serializeToString(clone)
		.replace(/&#10;{6}/g, '')
		.replace(/((\s|")[0-9]*\.[0-9]{2})([0-9]*)(\b|"|\))/g, '$1')

	return out
}

async function getSvg(editor: Editor, ids: TLShapeId[], opts: Partial<TLSvgOptions>) {
	const svg = await editor.getSvg(ids?.length ? ids : [...editor.getCurrentPageShapeIds()], {
		scale: 1,
		background: false,
		// background: editor.getInstanceState().exportBackground,
		...opts,
	})
	if (!svg) {
		throw new Error('Could not construct SVG.')
	}
	return svg
}

export async function exportToString(
	editor: Editor,
	ids: TLShapeId[],
	format: 'svg' | 'json',
	opts = {} as Partial<TLSvgOptions>
) {
	switch (format) {
		case 'svg': {
			return getSvgAsString(await getSvg(editor, ids, opts))
		}
		case 'json': {
			const data = editor.getContentFromCurrentPage(ids)
			return JSON.stringify(data)
		}
		default: {
			exhaustiveSwitchError(format)
		}
	}
}

export async function exportToBlob(
	editor: Editor,
	ids: TLShapeId[],
	format: 'svg' | 'png' | 'jpeg' | 'webp' | 'json',
	opts = {} as Partial<TLSvgOptions>,
    width: number,
    height: number,
): Promise<Blob> {
	switch (format) {
		case 'svg':
			return new Blob([await exportToString(editor, ids, 'svg', opts)], { type: 'text/plain' })
		case 'json':
			return new Blob([await exportToString(editor, ids, 'json', opts)], { type: 'text/plain' })
		case 'jpeg':
		case 'png':
		case 'webp': {
			const image = await getSvgAsImage(
				await getSvg(editor, ids, opts),
				editor.environment.isSafari,
				{
					type: format,
					quality: 1,
					// scale: 2
					scale: 1
				},
                width,
                height
			)
			if (!image) {
				throw new Error('Could not construct image.')
			}
			return image
		}
		default: {
			exhaustiveSwitchError(format)
		}
	}
}

const mimeTypeByFormat = {
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
	json: 'text/plain',
	svg: 'text/plain',
}

export function exportToBlobPromise(
	editor: Editor,
	ids: TLShapeId[],
	format: 'svg' | 'png' | 'jpeg' | 'webp' | 'json',
	opts = {} as Partial<TLSvgOptions>,
    width: number,
    height: number,
): { blobPromise: Promise<Blob>; mimeType: string } {
	return {
		blobPromise: exportToBlob(editor, ids, format, opts, width, height),
		mimeType: mimeTypeByFormat[format],
	}
}