// ** MUI Imports
import { Theme } from '@mui/material/styles'

const GlobalStyles = (theme: Theme) => {
	return {
		'.ps__rail-y': {
			zIndex: 1,
			right: '0 !important',
			left: 'auto !important',
			'&:hover, &:focus, &.ps--clicking': {
				backgroundColor:
					theme.palette.mode === 'light' ? '#E4E5EB !important' : '#423D5D !important'
			},
			'& .ps__thumb-y': {
				right: '3px !important',
				left: 'auto !important',
				backgroundColor:
					theme.palette.mode === 'light' ? '#C2C4D1 !important' : '#504B6D !important'
			},
			'.layout-vertical-nav &': {
				'& .ps__thumb-y': {
					width: 4,
					backgroundColor:
						theme.palette.mode === 'light' ? '#C2C4D1 !important' : '#504B6D !important'
				},
				'&:hover, &:focus, &.ps--clicking': {
					backgroundColor: 'transparent !important',
					'& .ps__thumb-y': {
						width: 6
					}
				}
			}
		},

		'#nprogress': {
			pointerEvents: 'none',
			'& .bar': {
				left: 0,
				top: 0,
				height: 3,
				width: '100%',
				zIndex: 2000,
				position: 'fixed',
				backgroundColor: theme.palette.primary.main
			}
		},
		'&.MuiTableHead-root': {
			backgroundColor: theme.palette.primary[theme.palette.mode]
		},
		'&.MuiTableHead-root .MuiTableCell-root, &.MuiTableHead-root .MuiTableCell-root p ': {
			backgroundColor: theme.palette.primary[theme.palette.mode],
			color: theme.palette.primary.contrastText,
			zIndex: 20
		},
		'&.MuiTableHead-root .MuiTableCell-root span': {
			color: theme.palette.primary.contrastText,
			zIndex: 20
		},

		// '& .MuiTableCell-root': {
		//   backgroundColor: '#fff0',
		//   color: theme.palette.primary.contrastText
		// },
		'& .MuiTableContainer-root': {
			borderRadius: '6px',
			border: '1px solid rgba(58, 53, 65, 0.2)'
		}
	}
}

export default GlobalStyles
