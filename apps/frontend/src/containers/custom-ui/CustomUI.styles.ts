import { createStyles, makeStyles } from '@mui/styles';

export const useCustomUIStyles = makeStyles(() =>
	createStyles({
		root: {
			position: "absolute",
			inset: 0,
			zIndex: "300",
			pointerEvents: "none"
		},
		topbarContainer: {
			position: "absolute",
			width: "100%",
			top: "0px",
			left: "0px",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			flexDirection: "row",
			gap: "12px",
		},
		topbar: {
			height: "48px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "12px",
			gap: "12px",
			backgroundColor: "#2C3136",
			background: "#2C3136",
			boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33), 0px 0px 0px 1px #49555F inset"
		},
		topbarLeft: {
			borderRadius: "0px 0px 13px 0px",
		},
		topbarDivider: {
			borderRightWidth: 2,
			backgroundColor: "#49555F"
		},
		minibar: {
			maxWidth: "100%",
			height: "48px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "12px",
			gap: "12px",
			backgroundColor: "#2C3136",
			borderRadius: "0px 0px 13px 13px",
			background: "#2C3136",
			boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33), 0px 0px 0px 1px #49555F inset"
		},
		minibarText: {
			color: "#FFF",
			marginLeft: "12px",
			fontFamily: "Roboto",
			fontSize: "13px",
			fontStyle: "normal",
			fontWeight: "400",
			lineHeight: "normal",
			display: "flex",
			height: "16px",
			flexDirection: "column",
			justifyContent: "flex-end",
			flexShrink: "0",
		},
		sidebar: {
			position: "absolute",
			left: "0px",
			maxWidth: "48px",
			maxHeight: "100%",
			flexDirection: "column", // Stack items vertically on small screens
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			padding: "12px",
			gap: "12px",
			backgroundColor: "#363D44",
			borderRadius: "0px 13px 13px 0px",
			background: "#363D44",
			boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33), 0px 0px 0px 1px #49555F inset"
		},
		sidebarContainer: {
			position: "absolute",
			marginTop: "56px",
			left: "0px",
			height: "100vh",
			flexDirection: "column", // Stack items vertically on small screens
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
		},
		sidebarDivider: {
			width: 24,
			borderBottomWidth: 2,
			backgroundColor: "#49555F"
		},
		iconButton: {
			pointerEvents: "all",
			background: "transparent",
			border: "0px",
			height: "24px",
			width: "24px",
			borderRadius: "4px",
			padding: "0px",
			color: "#D9D9D9",
			'&[data-isactive="true"]': {
				backgroundColor: 'black',
			},
			'&:active': {
				backgroundColor: 'black',
			},
		},
		icon: {
			verticalAlign: "middle",
			padding: "0px",
			fontSize: 18,
		},
		bottombar: {
			position: "absolute",
			width: "100%",
			height: "32px",
			backgroundColor: "#363D44",
			bottom: "0",
			background: "rgba(54, 61, 68, 0.50)",
			boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33), 0px 0px 0px 1px #49555F inset",
			alignItems: "center",
			justifyContent: "space-between",
			display: "flex",
		},
		bottombarText: {
			color: "#FFF",
			marginLeft: "12px",
			fontFamily: "Roboto",
			fontSize: "12px",
			fontStyle: "normal",
			fontWeight: "400",
			lineHeight: "normal",
			display: "flex",
			height: "15px",
			flexDirection: "column",
			justifyContent: "flex-end",
			flexShrink: "0",
		},
		bottombarMenu: {
			marginRight: "12px",
		},
		propertiesbar: {
			pointerEvents: "all",
			color: "#FFF",
			position: "absolute",
			right: 0,
			top: 56,
			width: "272px",
			bottom: 48,
			padding: "15px",
			paddingBottom: "50px",
			borderRadius: "13px 0px 0px 13px",
			background: "#363D44",
			boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33), 0px 0px 0px 1px #49555F inset",
			overflow: "hidden",
		},
		propertiesbarHeader: {
			color: "#FFF",
			fontFamily: "Roboto",
			fontSize: "24px",
			fontStyle: "normal",
			fontWeight: "500",
			paddingBottom: "8px",
		},
		propertiesbarSubHeader: {
			color: "#FFF",
			fontFamily: "Roboto",
			fontSize: "16px",
			fontStyle: "normal",
			fontWeight: "500",
			paddingTop: "10px",
			paddingBottom: "8px",
		},
		propertiesDivider: {
			width: 225,
			borderBottomWidth: 3,
			backgroundColor: "#49555F",
			marginBottom: 10
		},
		propertiesContainer: {
			display: "flex",
			flexDirection: "column",
			gap: "64px",
			height: "calc(100% - 15px)",
			overflowY: "scroll",
			"&::-webkit-scrollbar": {
				display: "None"
			},
		},
		propertiesSection: {
			display: "flex",
			flexDirection: "column",
			gap: "8px",
		},
		propertyRow: {
			fontFamily: "Roboto",
			fontStyle: "normal",
			display: "flex",
			flexDirection: "row",
			alignItems: "center",
			flexWrap: "wrap",
			width: "100%",
		},
		propertyKey: {
			width: "30%",
			fontSize: "14px",
			fontWeight: "500",
		},
		propertyValue: {
			width: "70%",
			fontSize: "14px",
		},
		ellipsis: {
			textOverflow: 'ellipsis',
			WebkitTextFillColor: 'rgba(255,255,255,0.38) !important'
		},
		dropdown: {
			minWidth: "120px",
			marginLeft: "12px",
		}
	})
);
