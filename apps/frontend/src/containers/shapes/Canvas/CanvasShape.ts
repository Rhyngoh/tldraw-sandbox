// import { defineMigrations } from '@tldraw/store'
import { Expand, defineMigrations } from '@tldraw/tldraw';
import { T } from '@tldraw/validate'
import { TLBaseShape } from '@tldraw/tldraw';

declare type ShapePropsType<Config extends Record<string, T.Validatable<any>>> = Expand<{
    [K in keyof Config]: T.TypeOf<Config[K]>;
}>;

export const canvasDefinition: CanvasDefinition = {
    type: 'canvas',
        title: 'canvas',
        minWidth: 10,
        minHeight: 10,
        width: 720,
        height: 500,
        doesResize: true,
        canUnmount: true,
}
// /** @public */
// export const CANVAS_DEFINITIONS = [
//     {
//         type: 'canvas',
//         title: 'canvas',
//         minWidth: 300,
//         minHeight: 300,
//         width: 720,
//         height: 500,
//         doesResize: true,
//         canUnmount: true,
// 	},
// ] as const satisfies readonly CanvasDefinition[]

/**
 * Permissions with note inline from
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
 *
 * @public
 */
export const canvasShapePermissionDefaults = {
	// ========================================================================================
	// Disabled permissions
	// ========================================================================================
	// [MDN] Experimental: Allows for downloads to occur without a gesture from the user.
	// [REASON] Disabled because otherwise the <iframe/> trick the user on behalf of us to performing an action
	'allow-downloads-without-user-activation': false,
	// [MDN] Allows for downloads to occur with a gesture from the user.
	// [REASON] Disabled because otherwise the <iframe/> trick the user on behalf of us to performing an action
	'allow-downloads': false,
	// [MDN] Lets the resource open modal windows.
	// [REASON] The <iframe/> could 'window.prompt("Enter your tldraw password")'
	'allow-modals': false,
	// [MDN] Lets the resource lock the screen orientation.
	// [REASON] Would interfer with tldraw interface
	'allow-orientation-lock': false,
	// [MDN] Lets the resource use the Pointer Lock API.
	// [REASON] Maybe we should allow this for games embeds (scratch/codepen/codesandbox)
	'allow-pointer-lock': false,
	// [MDN] Allows popups (such as window.open(), target="_blank", or showModalDialog()). If this keyword is not used, the popup will silently fail to open.
	// [REASON] We shouldn't allow popups as a embed could pretend to be us by opening a mocked version of tldraw. This is very unobvious when it is performed as an action within out app
	'allow-popups': true,
	// [MDN] Lets the sandboxed document open new windows without those windows inheriting the sandboxing. For example, this can safely sandbox an advertisement without forcing the same restrictions upon the page the ad links to.
	// [REASON] We're alread disabling popups.
	'allow-popups-to-escape-sandbox': false,
	// [MDN] Lets the resource start a presentation session.
	// [REASON] Prevents embed from navigating away from tldraw and pretending to be us
	'allow-presentation': false,
	// [MDN] Experimental: Lets the resource request access to the parent's storage capabilities with the Storage Access API.
	// [REASON] We don't want anyone else to access our storage
	'allow-storage-access-by-user-activation': false,
	// [MDN] Lets the resource navigate the top-level browsing context (the one named _top).
	// [REASON] Prevents embed from navigating away from tldraw and pretending to be us
	'allow-top-navigation': false,
	// [MDN] Lets the resource navigate the top-level browsing context, but only if initiated by a user gesture.
	// [REASON] Prevents embed from navigating away from tldraw and pretending to be us
	'allow-top-navigation-by-user-activation': false,
	// ========================================================================================
	// Enabled permissions
	// ========================================================================================
	// [MDN] Lets the resource run scripts (but not create popup windows).
	'allow-scripts': true,
	// [MDN] If this token is not used, the resource is treated as being from a special origin that always fails the same-origin policy (potentially preventing access to data storage/cookies and some JavaScript APIs).
	'allow-same-origin': true,
	// [MDN] Allows the resource to submit forms. If this keyword is not used, form submission is blocked.
	'allow-forms': true,
} as const

/** @public */
export type CanvasShapePermissions = { [K in keyof typeof canvasShapePermissionDefaults]?: boolean }

/** @public */
export const canvasShapeProps = {
	w: T.nonZeroNumber,
	h: T.nonZeroNumber,
	url: T.string,
}

/** @public */
export type CanvasShapeProps = ShapePropsType<typeof canvasShapeProps>

/** @public */
export type CanvasShape = TLBaseShape<'canvas', CanvasShapeProps>

/** @public */
export type CanvasDefinition = {
	readonly type: string
	readonly title: string
	readonly minWidth?: number
	readonly minHeight?: number
	readonly width: number
	readonly height: number
	readonly doesResize: boolean
	readonly canUnmount: boolean
	readonly isAspectRatioLocked?: boolean
	readonly overridePermissions?: CanvasShapePermissions
	readonly instructionLink?: string
	readonly backgroundColor?: string
	// TODO: FIXME this is ugly be required because some embeds have their own border radius for example spotify embeds
	readonly overrideOutlineRadius?: number
}

/** internal **/
export const canvasShapeMigrations = defineMigrations({})