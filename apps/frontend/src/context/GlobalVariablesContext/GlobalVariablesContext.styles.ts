import { createStyles, makeStyles } from '@mui/styles';
import { Colors } from '../../theme';

export const useGlobalVariablesStyle = makeStyles(() => {

  return createStyles({
    iconButton: {
      borderRadius: '50%',
      backgroundColor: 'transparent',
      // paddingLeft: '0.5rem',
      // paddingRight: '0.5rem',
      fontSize: 'initial',
      padding: '4px',
    },
    icon: {
      // height: '0.8em',
      // width: '0.8em',
    },
    dialogTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '1.5rem',
    },
    dialogTitleActions: {
      display: 'flex',
      gap: '0.5rem',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dialogContent: {
      display: 'flex',
      // gap: '1rem'
    },
    dialog: {
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
      gap: '1rem',
    },
    dialogActions: {
      padding: '1rem 1.5rem',
    },
    gridSection: {
      flexGrow: 3,
      display: 'grid',
      gridTemplateColumns: '2fr 3fr',
      // border: '1px solid darkgray',
      // borderBottom: 'none',
      // minWidth: 400,
      width: 500,
      height: '24em',
      overflow: 'auto',
      rowGap: '5px',
      backgroundColor: Colors['EEF3F4'],
      borderRadius: '5px',
      padding: '0 5px 5px 5px',
    },
    gridHeader: {
      position: 'sticky',
      top: 0,
      zIndex: 1,
      backgroundColor: Colors['EEF3F4'],
      // backgroundColor: 'white',
      // borderBottom: '1px solid darkgray',
    },
    cellKey: {
      // borderRight: '1px solid darkgray',
    },
    gridRow: {
      display: 'contents',
    },
    headerCell: {
      padding: '2px',
    },
    cell: {
      // borderBottom: '1px solid darkgray',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%',
      overflow: 'hidden',
      padding: '4px',
      height: '20px',
      backgroundColor: 'white',
    },
    cellValue: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    cellActions: {
      display: 'flex',
      fontSize: '0.8em',
    },
    selectedCell: {
      backgroundColor: Colors['ACC3C7'],
      // color: 'white',
    },
    grow: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
    },
    editButtons: {
      display: 'block',
      // border: '1px solid black'
    },
    divider: {
      width: '100%',
    },
    fileInput: {
      display: 'none',
    },
  })}
);
