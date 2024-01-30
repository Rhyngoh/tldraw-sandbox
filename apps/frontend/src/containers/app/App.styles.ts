import { createStyles, makeStyles } from '@mui/styles';
import { Colors } from '../../theme';

export const useAppStyles = makeStyles(() =>
	createStyles({
		root: {
			backgroundColor: Colors['EEF3F4']
		},
		content: {}
	})
);
