import { Checkbox, TableCell } from '@mui/material'
import { ChangeEvent } from 'react'

export interface ITableHeaderCheckBoxProps {
  numSelected: number
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void
  rowCount: number
}

export default function TableHeaderCheckBox(props: ITableHeaderCheckBoxProps) {
  const { onSelectAllClick, numSelected, rowCount } = props

  return (
    <TableCell
      padding='checkbox'
      sx={{
        '&.MuiTableCell-root': {
          paddingLeft: '0px !important'
        }
      }}
    >
      <Checkbox
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={e => {
          onSelectAllClick(e)
        }}
        inputProps={{
          'aria-label': 'select all desserts'
        }}
      />
    </TableCell>
  )
}
