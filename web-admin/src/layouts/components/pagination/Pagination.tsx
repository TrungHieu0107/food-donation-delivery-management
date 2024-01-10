import { TablePagination } from '@mui/material'
import { ChangeEvent } from 'react'

export default function Pagin({ data, filterObject, setFilterObject }: any) {
  
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
      pageSize: parseInt(event.target.value, 10)
    })
  }

  return (
    <TablePagination
      labelRowsPerPage='Hàng trên trang'
      labelDisplayedRows={({ from, to, count }) => {
        return `${from}–${to} / ${count !== -1 ? count : `nhiều hơn ${to}`}`
      }}
      rowsPerPageOptions={[10, 20, 30]}
      component='div'
      count={data.total ?? 0}
      rowsPerPage={data.pageSize}
      page={data.currentPage - 1}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  )
}
