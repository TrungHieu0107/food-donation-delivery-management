// ** MUI Imports
import { Theme } from '@mui/material/styles'
import { hexToRGBA } from '../utils/hex-to-rgba'
import { customColor } from './color'

const GlobalStyles = (theme: Theme) => {
  return {
    '.ps__rail-y': {
      zIndex: 1,
      right: '0 !important',
      left: 'auto !important',
      '&:hover, &:focus, &.ps--clicking': {
        backgroundColor: theme.palette.mode === 'light' ? '#E4E5EB !important' : '#423D5D !important'
      },
      '& .ps__thumb-y': {
        right: '3px !important',
        left: 'auto !important',
        backgroundColor: theme.palette.mode === 'light' ? '#C2C4D1 !important' : '#504B6D !important'
      },
      '.layout-vertical-nav &': {
        '& .ps__thumb-y': {
          width: 4,
          backgroundColor: theme.palette.mode === 'light' ? '#C2C4D1 !important' : '#504B6D !important'
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
    '&.MuiTableHead-root .MuiTableCell-root, &.MuiTableHead-root .MuiTableCell-root p': {
      backgroundColor: theme.palette.primary[theme.palette.mode],
      color: theme.palette.primary.contrastText
    },
    '& .MuiTableCell-head > .MuiCheckbox-root, .MuiTableCell-head > .Mui-checked, .Mui-active': {
      color: theme.palette.primary.contrastText + ' !important'
    },
    '& .MuiTableContainer-root': {
      borderRadius: '6px',
      border: '1px solid rgba(58, 53, 65, 0.2)'
    },
    '.delete-button.MuiIconButton-root:hover': {
      backgroundColor: `${theme.palette.error[theme.palette.mode]} !important`,
      '& .MuiSvgIcon-root': {
        color: `${theme.palette.common.white} !important`
      }
    },
    '.delete-button.MuiIconButton-root': {
      '& .MuiSvgIcon-root': {
        color: `${theme.palette.error[theme.palette.mode]} !important`
      }
    },
    '.update-button.MuiIconButton-root:hover': {
      backgroundColor: `${theme.palette.primary[theme.palette.mode]} !important`,
      '& .MuiSvgIcon-root': {
        color: `${theme.palette.common.white} !important`
      }
    },
    '.update-button.MuiIconButton-root': {
      '& .MuiSvgIcon-root': {
        color: `${theme.palette.primary[theme.palette.mode]} !important`
      }
    },
    '&.MuiTableRow-hover:hover': {
      backgroundColor: `${hexToRGBA(customColor.primary, 0.1)}  !important`
    }
  }
}

export default GlobalStyles
