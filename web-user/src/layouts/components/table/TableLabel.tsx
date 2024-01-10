import { Tooltip, Typography } from '@mui/material'
import * as React from 'react'

export interface ITableLabelProps {
  title: string
}

export default function TableLabel(props: ITableLabelProps) {
  const { title } = props

  return (
    <Tooltip title={title}>
      <Typography
      component={'span'}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          textTransform: 'none'
        }}
      >
        {title}
      </Typography>
    </Tooltip>
  )
}
