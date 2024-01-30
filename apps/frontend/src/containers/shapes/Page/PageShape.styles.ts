import { createStyles, makeStyles } from '@mui/styles';

export const usePageStyles = makeStyles(() =>
	createStyles({
		root: {
			border: `0px solid`,
			pointerEvents: 'all',
			boxShadow: "0px 1px 3px 0px rgba(0, 0, 0, 0.47), 0px 2px 6px 0px rgba(0, 0, 0, 0.33)",
		},
	})
);
