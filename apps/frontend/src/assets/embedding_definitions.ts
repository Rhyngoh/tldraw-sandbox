const safeParseUrl = (url: string) => {
	try {
		return new URL(url)
	} catch (err) {
		return
	}
}

export const googleEmbedDef = {
	type: 'google_maps',
	title: 'Google Maps',
	hostnames: ['google.*'],
	width: 720,
	height: 500,
	doesResize: true,
	canUnmount: false,
	toEmbedUrl: (url: string) => {
		if (url.includes('/maps/')) {
			const match = url.match(/@(.*),(.*),(.*)z/)
			let result: string
			if (match) {
				const [, lat, lng, z] = match
				const host = new URL(url).host.replace('www.', '')
				result = `https://${host}/maps/embed/v1/view?key=${process.env.NX_GC_API_KEY}&center=${lat},${lng}&zoom=${z}`
			} else {
				result = ''
			}

			return result
		}
		return
	},
	fromEmbedUrl: (url: string) => {
		const urlObj = safeParseUrl(url)
		if (!urlObj) return

		const matches = urlObj.pathname.match(/^\/maps\/embed\/v1\/view\/?$/)
		if (matches && urlObj.searchParams.has('center') && urlObj.searchParams.get('zoom')) {
			const zoom = urlObj.searchParams.get('zoom')
			const [lat, lon] = urlObj.searchParams.get('center')!.split(',')
			return `https://www.google.com/maps/@${lat},${lon},${zoom}z`
		}
		return
	},
}