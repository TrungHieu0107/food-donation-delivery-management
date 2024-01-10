import { TablePagination } from '@mui/material'
import React, { ChangeEvent } from 'react'
import { PaginationModel } from 'src/models/common/CommonResponseModel'

export interface ITablePaginationProps {
  data: PaginationModel
  filterObject: any
  setFilterObject: (values: any) => void
  defualtPageSize?: number
  rowOptions?: number[]
}

export const MyTablePagination: React.FC<ITablePaginationProps> = props => {
  const { data = new PaginationModel(), filterObject = {}, setFilterObject } = props
  const defualtPageSize = props.defualtPageSize ?? 10
  const rowOptions = props.rowOptions ?? [10, 20, 30]

  const handleChangePage = (event: unknown, newPage: number) => {
    setFilterObject({
      ...filterObject,
      page: newPage + 1
    })
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterObject({
      ...filterObject,
      page: 1,
      pageSize: parseInt(event.target.value, defualtPageSize)
    })
  }

  return (
    <TablePagination
      labelRowsPerPage='Hàng trên trang'
      labelDisplayedRows={({ from, to, count }) => {
        return `${from}–${to} / ${count !== -1 ? count : `nhiều hơn ${to}`}`
      }}
      rowsPerPageOptions={rowOptions}
      component='div'
      count={data.total ?? 0}
      rowsPerPage={data.pageSize}
      page={data.currentPage - 1}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  )
}
