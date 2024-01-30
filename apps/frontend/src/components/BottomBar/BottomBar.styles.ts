import { createStyles, makeStyles } from '@mui/styles';

export const useBottomBarStyles = makeStyles(() =>
  createStyles({
    dropdown: {
			// marginLeft: "12px",
      // display: 'inline-block',
		},
    divider: {
			borderRightWidth: 2,
			backgroundColor: "#49555F"
		},
    iconButton: {
      pointerEvents: 'all',
      background: 'transparent',
      border: '0px',
      height: '24px',
      width: '24px',
      borderRadius: '4px',
      padding: '0px',
      color: '#D9D9D9',
      '&[data-isactive="true"]': {
        backgroundColor: 'black',
      },
      '&:active': {
        backgroundColor: 'black',
      },
    },
    icon: {
      verticalAlign: 'middle',
      padding: '0px',
      fontSize: 18,
    },
    bottombar: {
      position: 'absolute',
      width: '100%',
      height: '32px',
      backgroundColor: '#363D44',
      bottom: '0',
      background: 'rgba(54, 61, 68, 0.50)',
      boxShadow:
        '0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33), 0px 0px 0px 1px #49555F inset',
      alignItems: 'center',
      justifyContent: 'space-between',
      display: 'flex',
    },
    bottombarText: {
      color: '#FFF',
      marginLeft: '12px',
      fontFamily: 'Roboto',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 'normal',
      display: 'flex',
      height: '15px',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      flexShrink: '0',
    },
    bottombarMenu: {
      marginRight: '12px',
    },
  })
);
