import { ChangeEvent, useState, MouseEvent, SyntheticEvent, useEffect } from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { visuallyHidden } from '@mui/utils'
import Delete from 'mdi-material-ui/Delete'
import { Item } from 'src/models/Item'
import { HeadCell, Order, SearchItemParamsModel } from 'src/models/common/CommonModel'
import { DotsVertical, InformationOutline, PencilBoxOutline } from 'mdi-material-ui'
import { Grid, ListItemIcon, ListItemText, Menu, MenuItem, Skeleton } from '@mui/material'
import { CommonRepsonseModel, PaginationModel } from 'src/models/common/CommonResponseModel'
import { useRouter } from 'next/router'
import { ItemAPI } from 'src/api-client/Item'
import { formateDateDDMMYYYY } from 'src/@core/layouts/utils'

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (event: MouseEvent<unknown>, property: keyof Item) => void
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
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
              <TableSortLabel
                direction={order}
                active={true}
                onClick={createSortHandler(headCell.id)}
                sx={{
                  '&.Mui-active .MuiTableSortLabel-icon': {
                    color: theme => theme.palette.primary.contrastText
                  }
                }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <TableSortLabel
                onClick={createSortHandler(headCell.id)}
                sx={{
                  '& .MuiTableSortLabel-root': {
                    color: '#FFFF'
                  }
                }}
              >
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
        {numSelected} đã chọn
      </Typography>

      <Tooltip title='Delete'>
        <IconButton>
          <Delete />
        </IconButton>
      </Tooltip>
    </Toolbar>
  )
}

interface ItemListTableProps {
  tableName: string
  dataSearch: SearchItemParamsModel
}

const headCells: HeadCell<Item>[] = [
  {
    id: 'name',
    minWidth: 150,
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
      return (
        <Grid container gap={2}>
          <Grid item>
            <Box
              sx={{
                height: '50px',
                width: '50px',
                backgroundImage: `url(${val.image})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}
            ></Box>
          </Grid>
          <Grid item>
            <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
              <Typography variant='body1'>{val.name}</Typography>
              <Typography variant='body2'> {val.attributes?.length} biến thể </Typography>
            </Box>
          </Grid>
        </Grid>
      )
    }
  },
  {
    id: 'itemCategoryResponse',
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
    format: val => val.itemCategoryResponse?.name
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
      return val.unit?.name
    }
  },
  {
    id: 'createdDate',
    minWidth: 70,
    numeric: true,
    disablePadding: false,
    label: (
      <Tooltip title='Thời gian tạo'>
        <Typography
          sx={{
            width: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'none'
          }}
        >
          Thời gian tạo
        </Typography>
      </Tooltip>
    ),
    format(val) {
      return formateDateDDMMYYYY(val.createdDate || '')
    }
  },
  {
    id: 'note',
    minWidth: 70,
    numeric: true,
    disablePadding: false,
    label: (
      <Tooltip title='Ghi chú'>
        <Typography
          sx={{
            width: 100,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textTransform: 'none'
          }}
        >
          Ghi chú
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
          {val.note || '_'}
        </Typography>
      )
    }
  }
]

export default function ItemListTable(props: ItemListTableProps) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Item>('name')
  const [selected, setSelected] = useState<readonly string[]>([])
  const [pagination, setPagination] = useState<PaginationModel>({
    currentPage: 0,
    pageSize: 10,
    total: 0
  })
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [visibleRows, setVisibleRows] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSelected, setCurrentSellected] = useState<string>()
  const router = useRouter()

  const fetchData = async (currentPage: number, pageSize: number) => {
    setLoading(true)
    console.log('fetchData', order, orderBy)

    const searchParams = new SearchItemParamsModel({
      ...props.dataSearch,
      page: currentPage + 1,
      pageSize: pageSize
    })

    ItemAPI.getAll(searchParams)
      .then(data => {
        const commonData = new CommonRepsonseModel<Item[]>(data)
        setPagination({
          ...commonData.pagination,
          currentPage: commonData.pagination?.currentPage ? commonData.pagination?.currentPage - 1 : 0
        })
        setVisibleRows(commonData.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetchData(pagination.currentPage, pagination.pageSize)
  }, [order, orderBy, props])

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
      const newSelected = visibleRows.map(n => n.id || '')
      console.log('data selected: ', visibleRows)
      setSelected(newSelected)

      return
    }
    setSelected([])
  }

  const handleClick = (event: MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    console.log(newSelected)
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    fetchData(newPage, pagination.pageSize)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    fetchData(0, parseInt(event.target.value, 10))
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  const handleDropdownOpen = (event: SyntheticEvent, id: string) => {
    setAnchorEl(event.currentTarget)
    setCurrentSellected(id)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
    setCurrentSellected('')
  }

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {selected.length > 0 && <EnhancedTableToolbar numSelected={selected.length} />}
        <TableContainer
          sx={{
            height: 500
          }}
        >
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            aria-label='sticky table'
            size={'medium'}
          >
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
                  const isItemSelected = isSelected(row.id || '')
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
                          onClick={event => handleClick(event, row.id || '')}
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
                      <TableCell align={'right'}>
                        <IconButton onClick={e => handleDropdownOpen(e, row.id || '')}>
                          <DotsVertical />
                        </IconButton>
                      </TableCell>
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

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClick={handleDropdownClose}>
        <MenuItem
          onClick={() => {
            currentSelected && router.push('/vat-pham/chi-tiet/' + currentSelected)
          }}
        >
          <ListItemIcon>
            <InformationOutline />
          </ListItemIcon>
          <ListItemText>Chi tiết</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            currentSelected && router.push('/vat-pham/chinh-sua/' + currentSelected)
          }}
        >
          <ListItemIcon>
            <PencilBoxOutline />
          </ListItemIcon>
          <ListItemText>Chỉnh sửa</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}
