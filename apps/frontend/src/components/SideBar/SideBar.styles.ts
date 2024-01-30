import { createStyles, makeStyles } from '@mui/styles';

export const useSideBarStyles = makeStyles(() =>
  createStyles({
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
    sidebar: {
      position: 'absolute',
      left: '0px',
      maxWidth: '48px',
      maxHeight: '100%',
      flexDirection: 'column', // Stack items vertically on small screens
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '12px',
      gap: '12px',
      backgroundColor: '#363D44',
      borderRadius: '0px 13px 13px 0px',
      background: '#363D44',
      boxShadow:
        '0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33), 0px 0px 0px 1px #49555F inset',
    },
    sidebarContainer: {
      position: 'absolute',
      marginTop: '56px',
      left: '0px',
      height: '100vh',
      flexDirection: 'column', // Stack items vertically on small screens
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    sidebarDivider: {
      width: 24,
      borderBottomWidth: 2,
      backgroundColor: '#49555F',
    },
    propertiesbar: {
      pointerEvents: 'all',
      color: '#FFF',
      position: 'absolute',
      right: 0,
      top: 56,
      width: '272px',
      bottom: 48,
      padding: '15px',
      paddingBottom: '50px',
      borderRadius: '13px 0px 0px 13px',
      background: '#363D44',
      boxShadow:
        '0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33), 0px 0px 0px 1px #49555F inset',
      overflow: 'hidden',
    },
    propertiesbarHeader: {
      color: '#FFF',
      fontFamily: 'Roboto',
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: '500',
      paddingBottom: '8px',
    },
    propertiesbarSubHeader: {
      color: '#FFF',
      fontFamily: 'Roboto',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '500',
      paddingTop: '10px',
      paddingBottom: '8px',
    },
    propertiesDivider: {
      width: 225,
      borderBottomWidth: 3,
      backgroundColor: '#49555F',
      marginBottom: 10,
    },
    propertiesContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '64px',
      height: 'calc(100% - 15px)',
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        display: 'None',
      },
    },
    propertiesSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    propertyRow: {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      width: '100%',
    },
    propertyKey: {
      width: '30%',
      fontSize: '14px',
      fontWeight: '500',
    },
    propertyValue: {
      width: '70%',
      fontSize: '14px',
    },
    ellipsis: {
      textOverflow: 'ellipsis',
    },
    dropdown: {
      minWidth: '120px',
      marginLeft: '12px',
    },
  })
);
