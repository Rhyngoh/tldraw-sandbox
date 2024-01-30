import { createTheme } from '@mui/material/styles';

export enum Colors {
	'0D1D3D' = '#0D1D3D', // secondary in v3
	'0D1D3D_Opacity004' = 'rgba(13, 29, 61, 0.04)',
	'0D1D3D_Opacity016' = 'rgba(13, 29, 61, 0.16)',
	'0D1D3D_Opacity1' = 'rgba(13, 29, 61, 0.1)',
	'0D1D3D_Opacity2' = 'rgba(13, 29, 61, 0.2)',
	'0D1D3D_Opacity5' = 'rgba(13, 29, 61, 0.5)',
    '044855' = '#044855',
    '044855_Opacity4' = 'rgba(4, 72, 85, 0.4)',
    '002026' = '#002026',
	'06982F' = '#06982F',
    '0B162B' = '#0B162B',
    '0D333A' = '#0D333A',
	'221F20' = '#221F20',
	'221F20_Opacity2' = 'rgba(34, 31, 32, 0.2)',
	'221F20_Opacity5' = 'rgba(34, 31, 32, 0.5)',
	'232E3A' = '#232E3A',
    '27AE60' = '#27AE60',
    '27AE60_Opacity5' = 'rgba(39, 174, 96, 0.5)',
    '22AFC9' = '#22AFC9',
    '235F69' = '#235F69',
    '284F58' = '#284F58',
    '32D860' = '#32D860',
	'44B263' = '#44B263',
	'6AA84F' = '#6AA84F',
    '323E4A' = '#323E4A',
	'3D4A64' = '#3D4A64',
    '12C864' = '#12C864',
    '56DA63' = '#56DA63',
    '6B6C6F' = '#6B6C6F',
    '15C1C5' = '#15C1C5',
    '26546A' = '#26546A',
    '26546A_Opacity2' = 'rgba(38, 84, 106, 0.2)',
    '26546A_Opacity5' = 'rgba(38, 84, 106, 0.5)',
	'31D860' = '#31D860',
    '32627A' = '#32627A',
    '4A87A5' = '#4A87A5',
    '1F4B60' = '#1F4B60',
    '758FB3' = '#758FB3',
	'75E3F8' = '#75E3F8',
    '7A80A5' = '#7A80A5',
    '58B1D4' = '#58B1D4',
    '5E6372' = '#5E6372',
    '5D6273' = '#5D6273',
    '02343E' = '#02343E',
    '133A4C' = '#133A4C',
    '1D4254' = '#1D4254',
    '63A6FF' = '#63A6FF',
	'A876B2' = '#A876B2', // primary in v3
	'A178AF' = '#A178AF',
	'A178AF_Opacity004' = 'rgba(161, 120, 175, 0.06)',
	'A178AF_Opacity008' = 'rgba(161, 120, 175, 0.08)',
	'A178AF_Opacity012' = 'rgba(161, 120, 175, 0.12)',
	'A178AF_Opacity1' = 'rgba(161, 120, 175, 0.1)',
	'A178AF_Opacity5' = 'rgba(161, 120, 175, 0.5)',
    'B8CEED' = '#B8CEED',
	'CBDADF_Opacity5' = 'rgba(203, 218, 223, 0.5)',
    '8BB3C6' = '#8BB3C6',
    '719DDA_Opacity5' = 'rgba(113, 157, 218, 0.5)',
    'A3BEE3' = '#A3BEE3',
    'A3BEE3_Opacity1' = 'rgba(163, 190, 227, 0.1)',
    'ACC3C7' = '#ACC3C7',
    'ACC3C7_Opacity4' = 'rgba(172, 195, 199, 0.4)',
    'B3B8BD' = '#B3B8BD',
    '091318' = '#091318',
    '3C7794' = '#3C7794',
    '7EA9B1' = '#7EA9B1',
    '8D97A5' = '#8D97A5',
    '9FB9BD' = '#9FB9BD',
    '9CCEE2' = '#9CCEE2',
    '989EA7' = '#989EA7',
	'899CA5' = '#899CA5',
	'81B8CC_Opacity5' = 'rgba(129, 184, 204, 0.5)',
    AAAAAA = '#AAAAAA',
    BCBDC1 = '#BCBDC1',
    BDBDBD = '#BDBDBD',
    B8CCD0 = '#B8CCD0',
    D8E6E8 = '#D8E6E8',
    DCE6EB = '#DCE6EB',
    DCEBEE = '#DCEBEE',
    D3DDE7 = '#D3DDE7',
	EFF3FD = '#EFF3FD',
	F1F1F2 = '#F1F1F2',
	F1F1F2_Opacity3 = 'rgba(241, 241, 242, 0.3)',
    F5F5F5 = '#F5F5F5',
    F6F6F6 = '#F6F6F6',
	F7F7F9 = '#F7F7F9',
    F4FAFC = '#F4FAFC',
	F8F2F4 = '#F8F2F4',
    E0EAF7 = '#E0EAF7',
    EEF3F4 = '#EEF3F4',
    FBFBFC = '#FBFBFC',
    FD7900 = '#FD7900',
    FDF300 = '#FDF300',
	FFD600 = '#FFD600',
    EAF1F3 = '#EAF1F3',
    E9F0F2 = '#E9F0F2',
    C5C5C5 = '#C5C5C5',
    B1C8CF = '#B1C8CF',
    D0D1D3 = '#D0D1D3',
    D6EAF1 = '#D6EAF1',
    D6E4E9 = '#D6E4E9',
    D8D8D8 = '#D8D8D8',
    C0404D = '#C0404D',
    E02020 = '#E02020',
    ECF5F8 = '#ECF5F8',
	E3EdF1 = '#E3EdF1',
    C0404D_Opacity2 = 'rgba(192, 64, 77, 0.2)',
    C0404D_Opacity4 = 'rgba(192, 64, 77, 0.4)',
    CCD6D8 = '#CCD6D8',
    White = '#FFFFFF',
	White_Opacity004 = 'rgba(255, 255, 255, 0.04)',
	White_Opacity1 = 'rgba(255, 255, 255, 0.1)',
	Gray = '#808080',
    Black = '#000000',
	Black_Opacity2 = 'rgba(0, 0, 0, 0.2)',
	Black_Opacity6 = 'rgba(0, 0, 0, 0.6)',
    Transparent = 'transparent',
    Error = '#C0404D',
}

export const theme = createTheme({
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Helvetica"',
            '"Segoe UI"',
            'Roboto',
            'Arial',
            'Avenir',
            'Poppins',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
    palette: {
        primary: {
            main: Colors['A876B2'],
        },
        secondary: {
            main: Colors['0D1D3D'],
            light: Colors.F6F6F6,
        },
        error: {
            main: Colors.Error,
        },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: Colors['0D1D3D'],
                    color: Colors.White,
                },
            },
        },
		MuiBreadcrumbs: {
			styleOverrides: {
				li: {
					'&, a, p': {
						fontSize: '13px',
						fontWeight: 400,
						fontFamily: 'Avenir',
						textDecoration: 'none',
						color: Colors['0D1D3D'],
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					height: '40px',
					// width: '170px',
					display: 'flex',
					alignItems: 'center',
					WebkitAlignItems: 'center',
					justifyContent: 'center',
					WebkitJustifyContent: 'center',
					backgroundColor: Colors['A876B2'],
					borderRadius: '8px',
					cursor: 'pointer',
					lineHeight: '120%',
					border: 0,
					outline: 0,

					'&:hover': {
						backgroundColor: Colors['A178AF'],
					},

					'&:disabled': {
						backgroundColor: Colors['EEF3F4']
					}
				},
				outlined: {
					color: Colors['0D1D3D'],
					border: `1px solid ${Colors['0D1D3D']}`,
					backgroundColor: Colors.White,

					'&:hover': {
						borderColor: Colors['0D1D3D'],
						backgroundColor: Colors.White,
					},
				},
				text: {
					fontSize: '14px',
					lineHeight: '120%',
					fontFamily: 'Avenir, sans-serif',
					textTransform: 'initial',
					fontWeight: 700,
					color: Colors.FBFBFC,

					'& > .MuiPickersToolbarText-toolbarTxt': {
						width: '100%',
						color: Colors.White,

						'&.MuiTypography-h4': {
							fontSize: '24px',
						},
					},
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					borderRadius: '5px',
					background: Colors.A178AF_Opacity008,
				},
			},
		},
        MuiTypography: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    alignItems: 'center',
                    color: Colors['0D1D3D'],
					fontFamily: 'Avenir',
                },
                h4: {
                    fontWeight: 700,
                },
                h6: {
                    fontSize: '13px',
                    fontWeight: 800,
                },
            },
        },
		MuiCircularProgress: {
			styleOverrides: {
				root: {
					color: Colors['0D1D3D'],
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					color: `${Colors['0D1D3D']} !important`,
				},
			},
		},
		MuiRadio: {
			styleOverrides: {
				root: {
					color: `${Colors['0D1D3D']} !important`,
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				select: {
					color: Colors['0D1D3D'],
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				indicator: {
					backgroundColor: Colors['0D1D3D'],
				},
			},
		},
		MuiDialogTitle: {
			styleOverrides: {
				root: {
					// fontSize: '1.5rem',
				}
			}
		}
    },
});





// import { createTheme } from '@mui/material/styles';

// export enum Colors {
// 	'0D1D3D' = '#d32d1f', // secondary in v3 // 	'0D1D3D' = '#0D1D3D', // secondary in v3
// 	'0D1D3D_Opacity004' = 'rgba(13, 29, 61, 0.04)',
// 	'0D1D3D_Opacity016' = 'rgba(13, 29, 61, 0.16)',
// 	'0D1D3D_Opacity1' = 'rgba(13, 29, 61, 0.1)',
// 	'0D1D3D_Opacity2' = 'rgba(13, 29, 61, 0.2)',
// 	'0D1D3D_Opacity5' = 'rgba(13, 29, 61, 0.5)',
//     '044855' = '#044855',
//     '044855_Opacity4' = 'rgba(4, 72, 85, 0.4)',
//     '002026' = '#002026',
// 	'06982F' = '#06982F',
//     '0B162B' = '#0B162B',
//     '0D333A' = '#0D333A',
// 	'221F20' = '#221F20',
// 	'221F20_Opacity2' = 'rgba(34, 31, 32, 0.2)',
// 	'221F20_Opacity5' = 'rgba(34, 31, 32, 0.5)',
// 	'232E3A' = '#232E3A',
//     '27AE60' = '#27AE60',
//     '27AE60_Opacity5' = 'rgba(39, 174, 96, 0.5)',
//     '22AFC9' = '#22AFC9',
//     '235F69' = '#235F69',
//     '284F58' = '#284F58',
//     '32D860' = '#32D860',
// 	'44B263' = '#44B263',
// 	'6AA84F' = '#6AA84F',
//     '323E4A' = '#323E4A',
// 	'3D4A64' = '#3D4A64',
//     '12C864' = '#12C864',
//     '56DA63' = '#56DA63',
//     '6B6C6F' = '#6B6C6F',
//     '15C1C5' = '#15C1C5',
//     '26546A' = '#26546A',
//     '26546A_Opacity2' = 'rgba(38, 84, 106, 0.2)',
//     '26546A_Opacity5' = 'rgba(38, 84, 106, 0.5)',
// 	'31D860' = '#31D860',
//     '32627A' = '#32627A',
//     '4A87A5' = '#4A87A5',
//     '1F4B60' = '#1F4B60',
//     '758FB3' = '#758FB3',
// 	'75E3F8' = '#75E3F8',
//     '7A80A5' = '#7A80A5',
//     '58B1D4' = '#58B1D4',
//     '5E6372' = '#5E6372',
//     '5D6273' = '#5D6273',
//     '02343E' = '#02343E',
//     '133A4C' = '#133A4C',
//     '1D4254' = '#1D4254',
//     '63A6FF' = '#63A6FF',
// 	'A876B2' = '#A876B2', // primary in v3
// 	'A178AF' = '#00132f', // 	'A178AF' = '#A178AF',
// 	'A178AF_Opacity004' = 'rgba(161, 120, 175, 0.06)',
// 	'A178AF_Opacity008' = 'rgba(161, 120, 175, 0.08)',
// 	'A178AF_Opacity012' = 'rgba(161, 120, 175, 0.12)',
// 	'A178AF_Opacity1' = 'rgba(161, 120, 175, 0.1)',
// 	'A178AF_Opacity5' = 'rgba(161, 120, 175, 0.5)',
//     'B8CEED' = '#B8CEED',
// 	'CBDADF_Opacity5' = 'rgba(203, 218, 223, 0.5)',
//     '8BB3C6' = '#8BB3C6',
//     '719DDA_Opacity5' = 'rgba(113, 157, 218, 0.5)',
//     'A3BEE3' = '#A3BEE3',
//     'A3BEE3_Opacity1' = 'rgba(163, 190, 227, 0.1)',
//     'ACC3C7' = '#ACC3C7',
//     'ACC3C7_Opacity4' = 'rgba(172, 195, 199, 0.4)',
//     'B3B8BD' = '#B3B8BD',
//     '091318' = '#091318',
//     '3C7794' = '#3C7794',
//     '7EA9B1' = '#7EA9B1',
//     '8D97A5' = '#8D97A5',
//     '9FB9BD' = '#9FB9BD',
//     '9CCEE2' = '#9CCEE2',
//     '989EA7' = '#989EA7',
// 	'899CA5' = '#899CA5',
// 	'81B8CC_Opacity5' = 'rgba(129, 184, 204, 0.5)',
//     AAAAAA = '#AAAAAA',
//     BCBDC1 = '#BCBDC1',
//     BDBDBD = '#BDBDBD',
//     B8CCD0 = '#B8CCD0',
//     D8E6E8 = '#D8E6E8',
//     DCE6EB = '#DCE6EB',
//     DCEBEE = '#DCEBEE',
//     D3DDE7 = '#D3DDE7',
// 	EFF3FD = '#EFF3FD',
// 	F1F1F2 = '#F1F1F2',
// 	F1F1F2_Opacity3 = 'rgba(241, 241, 242, 0.3)',
//     F5F5F5 = '#F5F5F5',
//     F6F6F6 = '#F6F6F6',
// 	F7F7F9 = '#F7F7F9',
//     F4FAFC = '#F4FAFC',
// 	F8F2F4 = '#F8F2F4',
//     E0EAF7 = '#E0EAF7',
//     EEF3F4 = '#EEF3F4',
//     FBFBFC = '#FBFBFC',
//     FD7900 = '#FD7900',
//     FDF300 = '#FDF300',
// 	FFD600 = '#FFD600',
//     EAF1F3 = '#EAF1F3',
//     E9F0F2 = '#E9F0F2',
//     C5C5C5 = '#C5C5C5',
//     B1C8CF = '#B1C8CF',
//     D0D1D3 = '#D0D1D3',
//     D6EAF1 = '#D6EAF1',
//     D6E4E9 = '#D6E4E9',
//     D8D8D8 = '#D8D8D8',
//     C0404D = '#C0404D',
//     E02020 = '#E02020',
//     ECF5F8 = '#ECF5F8',
// 	E3EdF1 = '#E3EdF1',
//     C0404D_Opacity2 = 'rgba(192, 64, 77, 0.2)',
//     C0404D_Opacity4 = 'rgba(192, 64, 77, 0.4)',
//     CCD6D8 = '#CCD6D8',
//     White = '#FFFFFF',
// 	White_Opacity004 = 'rgba(255, 255, 255, 0.04)',
// 	White_Opacity1 = 'rgba(255, 255, 255, 0.1)',
// 	Gray = '#808080',
//     Black = '#000000',
// 	Black_Opacity2 = 'rgba(0, 0, 0, 0.2)',
// 	Black_Opacity6 = 'rgba(0, 0, 0, 0.6)',
//     Transparent = 'transparent',
//     Error = '#C0404D',
// }

// export const theme = createTheme({
//     typography: {
//         fontFamily: [
//             '-apple-system',
//             'BlinkMacSystemFont',
//             '"Helvetica"',
//             '"Segoe UI"',
//             'Roboto',
//             'Arial',
//             'Avenir',
//             'Poppins',
//             'sans-serif',
//             '"Apple Color Emoji"',
//             '"Segoe UI Emoji"',
//             '"Segoe UI Symbol"',
//         ].join(','),
//     },
//     palette: {
//         primary: {
//             main: Colors['A876B2'],
//         },
//         secondary: {
//             main: Colors['0D1D3D'],
//             light: Colors.F6F6F6,
//         },
//         error: {
//             main: Colors.Error,
//         },
//     },
//     components: {
//         MuiAppBar: {
//             styleOverrides: {
//                 colorPrimary: {
//                     backgroundColor: Colors['0D1D3D'],
//                     color: Colors.White,
//                 },
//             },
//         },
// 		MuiBreadcrumbs: {
// 			styleOverrides: {
// 				li: {
// 					'&, a, p': {
// 						fontSize: '13px',
// 						fontWeight: 400,
// 						fontFamily: 'Avenir',
// 						textDecoration: 'none',
// 						color: Colors['0D1D3D'],
// 					},
// 				},
// 			},
// 		},
// 		MuiButton: {
// 			styleOverrides: {
// 				root: {
// 					height: '40px',
// 					width: '170px',
// 					display: 'flex',
// 					alignItems: 'center',
// 					WebkitAlignItems: 'center',
// 					justifyContent: 'center',
// 					WebkitJustifyContent: 'center',
// 					backgroundColor: Colors['A876B2'],
// 					borderRadius: '8px',
// 					cursor: 'pointer',
// 					lineHeight: '120%',
// 					border: 0,
// 					outline: 0,

// 					'&:hover': {
// 						backgroundColor: Colors['A876B2'],
// 					},
// 				},
// 				outlined: {
// 					color: Colors['0D1D3D'],
// 					border: `1px solid ${Colors['0D1D3D']}`,
// 					backgroundColor: Colors.White,

// 					'&:hover': {
// 						borderColor: Colors['0D1D3D'],
// 						backgroundColor: Colors.White,
// 					},
// 				},
// 				text: {
// 					fontSize: '14px',
// 					lineHeight: '120%',
// 					fontFamily: 'Avenir, sans-serif',
// 					textTransform: 'initial',
// 					fontWeight: 700,
// 					color: Colors.FBFBFC,

// 					'& > .MuiPickersToolbarText-toolbarTxt': {
// 						width: '100%',
// 						color: Colors.White,

// 						'&.MuiTypography-h4': {
// 							fontSize: '24px',
// 						},
// 					},
// 				},
// 			},
// 		},
// 		MuiIconButton: {
// 			styleOverrides: {
// 				root: {
// 					borderRadius: '5px',
// 					background: Colors.A178AF_Opacity008,
// 				},
// 			},
// 		},
//         MuiTypography: {
//             styleOverrides: {
//                 root: {
//                     display: 'flex',
//                     alignItems: 'center',
//                     color: Colors['0D1D3D'],
// 					fontFamily: 'Avenir',
//                 },
//                 h4: {
//                     fontWeight: 700,
//                 },
//                 h6: {
//                     fontSize: '13px',
//                     fontWeight: 800,
//                 },
//             },
//         },
// 		MuiCircularProgress: {
// 			styleOverrides: {
// 				root: {
// 					color: Colors['0D1D3D'],
// 				},
// 			},
// 		},
// 		MuiCheckbox: {
// 			styleOverrides: {
// 				root: {
// 					color: `${Colors['0D1D3D']} !important`,
// 				},
// 			},
// 		},
// 		MuiRadio: {
// 			styleOverrides: {
// 				root: {
// 					color: `${Colors['0D1D3D']} !important`,
// 				},
// 			},
// 		},
// 		MuiSelect: {
// 			styleOverrides: {
// 				select: {
// 					color: Colors['0D1D3D'],
// 				},
// 			},
// 		},
// 		MuiTabs: {
// 			styleOverrides: {
// 				indicator: {
// 					backgroundColor: Colors['0D1D3D'],
// 				},
// 			},
// 		},
//     },
// });
