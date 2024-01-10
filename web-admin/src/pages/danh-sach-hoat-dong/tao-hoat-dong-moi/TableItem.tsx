import { Chip, Skeleton } from '@mui/material'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { visuallyHidden } from '@mui/utils'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'
import axiosClient from 'src/api-client/ApiClient'
import { HeadCell, Order } from 'src/models/common/CommonModel'
import { PaginationModel } from 'src/models/common/CommonResponseModel'

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Item) => void
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

interface Item {
  id: string
  name: string | undefined | null
  category: string | undefined | null
  quantity: number | undefined | null
  unit: string | undefined | null
  urgentLevel: string | undefined | null
  charityUnit: string | undefined | null
  aidPeriod: [string, string]
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props

  const createSortHandler = (property: keyof Item) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox' align={'left'}>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell>
        <TableCell align={'left'}>STT</TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              minWidth: headCell.minWidth
            }}
          >
            {orderBy === headCell.id && order ? (
              <TableSortLabel direction={order} active={true} onClick={createSortHandler(headCell.id)}>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <TableSortLabel onClick={createSortHandler(headCell.id)}>
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
        })
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
        Đã chọn {numSelected} vật phẩm
      </Typography>
    </Toolbar>
  )
}

const headCells: HeadCell<Item>[] = [
  {
    id: 'name',
    minWidth: 100,
    numeric: true,
    disablePadding: false,
    label: (
      <Tooltip title='Vật phẩm'>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'none'
          }}
        >
          Vật phẩm
        </Typography>
      </Tooltip>
    ),
    format: val => {
      return <Typography variant='body1'>{val.name}</Typography>
    }
  },
  {
    id: 'category',
    minWidth: 70,
    numeric: true,
    disablePadding: false,
    label: (
      <Tooltip title='Loại'>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'none'
          }}
        >
          Loại
        </Typography>
      </Tooltip>
    ),
    format: val => val.category
  },
  {
    id: 'quantity',
    minWidth: 50,
    numeric: true,
    disablePadding: false,
    label: (
      <Tooltip title='Số lượng'>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'none'
          }}
        >
          Số lượng
        </Typography>
      </Tooltip>
    ),
    format(val) {
      return val.quantity
    }
  },
  {
    id: 'unit',
    minWidth: 50,
    numeric: true,
    disablePadding: false,
    label: (
      <Tooltip title='Đơn vị'>
        <Typography
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'none'
          }}
        >
          Đơn vị
        </Typography>
      </Tooltip>
    ),
    format(val) {
      return val.unit
    }
  },
  {
    id: 'urgentLevel',
    minWidth: 70,
    numeric: true,
    disablePadding: false,
    label: (
      <Tooltip title='Mức độ khẩn cấp'>
        <Typography
          sx={{
            width: 150,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'none'
          }}
        >
          Mức độ khẩn cấp
        </Typography>
      </Tooltip>
    ),
    format(val) {
      if(val.urgentLevel === "NOT_URGENT") return <Chip color='info' label="Không khẩn cấp"/>
      if(val.urgentLevel === "URGENT") return <Chip color='warning' label="Khẩn cấp"/>
      if(val.urgentLevel === "VERY_URGENT") return <Chip color='error' label="Rất khẩn cấp"/>
    }
  },
  {
    id: 'charityUnit',
    minWidth: 70,
    numeric: true,
    disablePadding: false,
    label: (
      <Tooltip title='Nơi yêu cầu'>
        <Typography
          sx={{
            width: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'none'
          }}
        >
          Tổ chức yêu cầu
        </Typography>
      </Tooltip>
    ),
    format(val) {
      return (
        <Typography
          component={'span'}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {val.charityUnit}
        </Typography>
      )
    }
  },

  // {
  //   id: `aidPeriod`,
  //   minWidth: 70,
  //   numeric: true,
  //   disablePadding: false,
  //   label: (
  //     <Tooltip title='Thời gian tạo'>
  //       <Typography
  //         sx={{
  //           width: 100,
  //           overflow: 'hidden',
  //           textOverflow: 'ellipsis',
  //           whiteSpace: 'nowrap',
  //           textTransform: 'none'
  //         }}
  //       >
  //         Ngày tạo
  //       </Typography>
  //     </Tooltip>
  //   ),
  //   format(val) {

  //     return moment(val?.aidPeriod[0]).format(KEY.KEY_FORMAT_DATE)
  //   }
  // },

  {
    id: 'aidPeriod',
    minWidth: 70,
    numeric: true,
    disablePadding: false,
    label: (
      <Tooltip title='Thời gian nhận'>
        <Typography
          sx={{
            width: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'none'
          }}
        >
          Ngày nhận
        </Typography>
      </Tooltip>
    ),
    format(val) {
        return formateDateDDMMYYYY(val?.aidPeriod[1] || '')
    }
  }
]

export default function ListItemCreateActivity(props: any) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Item>('name')
  const [selected, setSelected] = useState<any>([])
  const [pagination, setPagination] = useState<PaginationModel>({
    currentPage: 0,
    pageSize: 10,
    total: 0
  })
  const [visibleRows, setVisibleRows] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res: any = await axiosClient.get('/aid-items',
        {
          params: {
            ...props.filterObject
          }
        }
        )
        console.log(res)
        setVisibleRows(res.data || [])
        setPagination({
          ...res.pagination,
          currentPage: res.pagination?.currentPage ? res.pagination?.currentPage - 1 : 0
        })
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    fetchData()
  }, [props.filterObject])

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof Item) => {
    if (property === orderBy) {
      if (order === 'asc') {
        setOrder('desc')
      } else if (order === 'desc') {
        setOrder(false)
        setOrderBy('id')
      } else {
        setOrder('asc')
        setOrderBy(property)
      }
    } else {
      setOrder('asc')
      setOrderBy(property)
    }
  }

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map(n => n)
      setSelected(newSelected)
      props.setDataSelect(newSelected)

      return
    }
    setSelected([])
  }

  const handleClick = (event: MouseEvent<unknown>, name: any) => {
    const check = selected.some((obj: any) => obj.id === name.id)
    if (check) {
      const newArray = selected.filter((item: any) => item.id !== name.id)
      console.log('check', newArray)
      setSelected(newArray)
      props.setDataSelect(newArray)
    } else {
      setSelected([...selected, name])
      props.setDataSelect([...selected, name])
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {  
    props.setFilterObject({
      ...props.filterObject,
      page: newPage + 1
    })
    
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(parseInt(event.target.value, 10))
    props.setFilterObject({
      ...props.filterObject,
      pageSize: parseInt(event.target.value, 10)
    })
  }

  const isSelected = (name: any) => selected.some((obj: any) => obj.id === name.id)

  return (
    <Paper sx={{ minWidth: '800px !important', maxWidth: '1000px !important' }}>
      {selected.length > 0 && <EnhancedTableToolbar numSelected={selected.length} />}
      <TableContainer>
        <Table aria-labelledby='tableTitle' size={'medium'}>
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={visibleRows.length}
          />
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => (
                <TableRow key={item}>
                  <TableCell>
                    <Skeleton variant='rectangular' />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='rectangular' />
                  </TableCell>
                  {headCells.map((cell, i) => {
                    return (
                      <TableCell align='center' key={i}>
                        <Skeleton variant='rectangular' />
                      </TableCell>
                    )
                  })}
                  <TableCell>
                    <Skeleton variant='rectangular' />
                  </TableCell>
                </TableRow>
              ))
            ) : visibleRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={headCells.length + 3}
                  sx={{
                    borderBottom: '0px !important'
                  }}
                >
                  <Typography variant='body1' textAlign={'center'}>
                    Không có dữ liệu
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleRows?.map((row, index) => {
                const isItemSelected = isSelected(row)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    <TableCell padding='checkbox' align={'left'}>
                      <Checkbox
                        color='primary'
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                        onClick={event => handleClick(event, row)}
                      />
                    </TableCell>
                    <TableCell align={'left'}>{index + 1 + pagination.pageSize * pagination.currentPage}</TableCell>
                    {headCells.map((cell, i) => {
                      return (
                        <TableCell align={'left'} key={i}>
                          {cell.format ? cell.format(row) : row[cell.id]}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && (
        <TablePagination
          labelRowsPerPage='Hàng trên trang'
          labelDisplayedRows={({ from, to, count }) => {
            return `${from}–${to} / ${count !== -1 ? count : `nhiều hơn ${to}`}`
          }}
          rowsPerPageOptions={pagination.total > 10 ? [10, 20, 30] : [pagination.total]}
          component='div'
          count={pagination.total}
          rowsPerPage={pagination.pageSize}
          page={pagination.currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  )
}
