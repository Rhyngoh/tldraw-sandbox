import { createStyles, makeStyles } from '@mui/styles';

export const useColorPickerStyle = makeStyles(() => {
  return createStyles({
    colorValue: {
      height: '100%',
    },
    container: {
      border: '1px solid black',
      width: '100%',
    },
    popover: {
      position: 'fixed',
      zIndex: '2',
    },
    cover: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      zIndex: '1',
    },
  });
});
