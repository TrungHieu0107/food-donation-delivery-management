import { TableCell, TableSortLabel } from '@mui/material'
import * as React from 'react'
import { HeadCell, Order } from 'src/models/common/CommonModel'
import { KEY } from 'src/common/Keys'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

export interface ITableHeaderProps {
  headCell: HeadCell<any>
  onRequestSort?: (property: string) => void
  order?: Order
  orderBy?: string
}

export default function TableHeader(props: ITableHeaderProps) {
  const { headCell, order, orderBy, onRequestSort } = props

  const createSortHandler = (property: string) => {
    onRequestSort && onRequestSort(property)
  }

  return (
    <TableCell
      align={'left'}
      padding={headCell.disablePadding ? 'none' : 'normal'}
      sortDirection={orderBy === headCell.id ? order : false}
      sx={{
        color: theme => `${theme.palette.primary.contrastText} !important`,
        minWidth: headCell.minWidth ?? 'none',
        maxWidth: headCell.maxWidth ?? 'none',
        width: headCell.width ?? 'auto',
        whiteSpace: 'nowrap'
      }}
    >
      {headCell.sortable ? (
        <TableSortLabel
          {...(orderBy === headCell.keySort && order
            ? {
                direction: order,
                active: true
              }
            : null)}
          onClick={() => createSortHandler(headCell.keySort || KEY.DEFAULT_VALUE)}
          sx={{
            color: theme => `${theme.palette.primary.contrastText} !important`,
            '& .MuiTableSortLabel-icon': {
              color: theme => `${theme.palette.primary.contrastText} !important`
            },
            '& .MuiTableSortLabel-root': {
              color: theme => `${theme.palette.primary.contrastText} !important`
            },
            '&:hover, :hover > .MuiTableSortLabel-icon': {
              color: theme => `${hexToRGBA(theme.palette.primary.contrastText, 0.6)} !important`
            },
            whiteSpace: 'nowrap'
          }}
        >
          {headCell.label}
        </TableSortLabel>
      ) : (
        headCell.label
      )}
    </TableCell>
  )
}
