/**
 * Compute a radius based on the pressure.
 *
 * @internal
 */
export function getStrokeRadius(
	size: number,
	thinning: number,
	pressure: number,
	easing: (t: number) => number = (t) => t
) {
	return size * easing(0.5 - thinning * (0.5 - pressure))
}