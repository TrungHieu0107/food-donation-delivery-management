import { Tooltip, Typography } from '@mui/material'
import * as React from 'react'
import { KEY } from 'src/common/Keys'

export interface ITableCellValueProps {
  value: string | undefined
  onClick?: () => void
}

export default function TableCellValue(props: ITableCellValueProps) {
  return (
    <Tooltip title={props.value || ''} placement='bottom-start'>
      <Typography
        variant='body2'
        component='span'
        sx={{
          display: '-webkit-box',
          '-webkit-line-clamp': 2,
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
          maxHeight: '3em', // Adjust this value as needed
          textOverflow: 'ellipsis', // Added this line according to the instructions
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical' // Add this property for compatibility with some browsers
        }}
      
      >
        {props.value || KEY.DEFAULT_VALUE}
      </Typography>
    </Tooltip>
  )
}
