import { Tooltip, Typography } from '@mui/material'
import * as React from 'react'

export interface ITableLabelProps {
  title: string
}

export default function TableLabel(props: ITableLabelProps) {
  const { title } = props

  return (
    <Tooltip title={title} placement='bottom-start'>
      <Typography
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textTransform: 'none',
          color: theme => theme.palette.primary.contrastText
        }}
        fontWeight='bold'
      >
        {title}
      </Typography>
    </Tooltip>
  )
}
