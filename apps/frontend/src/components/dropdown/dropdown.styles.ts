import { createStyles, makeStyles } from '@mui/styles';

export const useDropdownStyles = makeStyles(() =>
  createStyles({
    root: {
      pointerEvents: 'all',
      position: 'relative',
      maxWidth: '100%',
      // height: "48px",
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
    },
    text: {
      color: '#FFF',
      marginLeft: '12px',
      fontFamily: 'Roboto',
      fontSize: '13px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 'normal',
      display: 'inline-flex',
      height: '16px',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      flexShrink: '0',
    },
    iconButton: {
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
    dropdownPanel: {
      maxHeight: '350px',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '56px',
      left: '0',
      minWidth: '100%',
      width: '120px',
      maxWidth: '250px',
      fontFamily: 'Roboto',
      backgroundColor: '#363D44',
      borderRadius: '13px',
      boxShadow:
        '0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33), 0px 0px 0px 1px #49555F inset',
      color: '#FFF',
      '& > :first-child': {
        borderRadius: '13px 13px 0px 0px',
      },
      '& > :last-child': {
        borderRadius: '0px 0px 13px 13px',
      },
      '& > :only-child': {
        borderRadius: '13px',
      },
    },
	dropdownPanelBottom: {
		top: 'inherit',
		bottom: '56px',
	},
    dropdownPanelItem: {
      padding: '14px 16px',
      pointerEvents: 'all',
      '&:hover': {
        backgroundColor: '#2C3136',
      },
    },
    dropdownPanelItemSelected: {
      backgroundColor: '#2C3136',
    },
  })
);
