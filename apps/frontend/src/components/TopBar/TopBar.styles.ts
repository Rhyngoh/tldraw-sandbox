import { createStyles, makeStyles } from '@mui/styles';

export const useTopBarStyles = makeStyles(() =>
	createStyles({
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
		dropdown: {
			minWidth: "120px",
			marginLeft: "12px",
		},
		dialog: {
			display: 'flex',
			flexDirection: 'column',
			padding: '1rem',
			gap: '1rem'
		},
		lineType: {
			display: 'flex',
		},
		lineTypeText: {
			display: 'flex',
			alignItems: 'center',
			whiteSpace: 'nowrap',
			textOverflow: 'ellipsis',
			paddingRight: '2px',
		},
		lineTypeImage: {
			maxHeight: '20px',
			maxWidth: '40px',
		}
	})
);
