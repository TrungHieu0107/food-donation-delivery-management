import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import { RoleModel } from 'src/models/Role'
import { PermissionAPI } from 'src/api-client/Permission'
import { CommonRepsonseModel, PaginationModel } from 'src/models/common/CommonResponseModel'
import { PermissionModel } from 'src/models/Permission'
import { HeadCell, Order } from 'src/models/common/CommonModel'
import { Skeleton, Typography } from '@mui/material'

interface Data {
  calories: number
  carbs: number
  fat: number
  name: string
  protein: number
}

function createData(name: string, calories: number, fat: number, carbs: number, protein: number): Data {
  return {
    name,
    calories,
    fat,
    carbs,
    protein
  }
}

const rows = [
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Donut', 452, 25.0, 51, 4.9),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Honeycomb', 408, 3.2, 87, 6.5),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Jelly Bean', 375, 0.0, 94, 0.0),
  createData('KitKat', 518, 26.0, 65, 7.0),
  createData('Lollipop', 392, 0.2, 98, 0.0),
  createData('Marshmallow', 318, 0, 81, 2.0),
  createData('Nougat', 360, 19.0, 9, 37.0),
  createData('Oreo', 437, 18.0, 63, 4.0)
]

interface EnhancedTableProps {
  numSelected?: number
  onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void
  order?: Order
  orderBy?: string
  rowCount?: number
  headCells: HeadCell<PermissionModel>[]
  handleSort: () => void
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, headCells, handleSort } = props

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts'
            }}
          />
        </TableCell> */}
        <TableCell>STT</TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={order}
            sx={{
              minWidth: headCell.minWidth,
              maxWidth: headCell.maxWidth ?? 'auto'
            }}
          >
            <TableSortLabel
              active={headCell.id === 'name'}
              direction={!order ? undefined : order}
              onClick={() => {
                handleSort()
              }}
            >
              {headCell.label}
              <Box component='span' sx={visuallyHidden}>
                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
              </Box>
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

// interface EnhancedTableToolbarProps {
//   numSelected: number
//   tableName: string
// }

// function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
//   const { numSelected, tableName } = props

//   return (
//     <Toolbar
//       sx={{
//         pl: { sm: 2 },
//         pr: { xs: 1, sm: 1 },
//         ...(numSelected > 0 && {
//           bgcolor: theme => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
//         })
//       }}
//     >
//       {numSelected > 0 ? (
//         <Typography sx={{ flex: '1 1 100%' }} color='inherit' variant='subtitle1' component='div'>
//           {numSelected} đã chọn
//         </Typography>
//       ) : (
//         <Grid container justifyContent={'space-between'} direction={'row'}>
//           <Grid item>
//             <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
//               {tableName}
//             </Typography>
//           </Grid>
//           <Grid item>
//             <Grid container justifyContent={'space-between'} direction={'row'} spacing={1}>
//               <Grid item>
//                 <TextField id='name-permission' label='Tên' variant='outlined' size='small' fullWidth />
//               </Grid>
//               <Grid item>
//                 <Button
//                   size='small'
//                   variant='outlined'
//                   sx={{
//                     height: '100% !important'
//                   }}
//                 >
//                   {KEY.SEARCH_LABEL}
//                 </Button>
//               </Grid>
//             </Grid>
//           </Grid>
//         </Grid>
//       )}
//       {numSelected > 0 ? (
//         <Tooltip title='Delete'>
//           <IconButton>
//             <Delete />
//           </IconButton>
//         </Tooltip>
//       ) : (
//         <Tooltip title='Filter list'>
//           <IconButton>{/* <FilterListIcon /> */}</IconButton>
//         </Tooltip>
//       )}
//     </Toolbar>
//   )
// }

interface PermissionTableProps {
  tableName: string
  currentRole?: RoleModel
}

export default function PermissionTable(props: PermissionTableProps) {
  const { tableName, currentRole } = props
  const [order, setOrder] = React.useState<Order>('asc')
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [permissions, setPermissions] = React.useState<PermissionModel[]>()
  const [pagination, setPagination] = React.useState<PaginationModel>(new PaginationModel())

  // const [selected, setSelected] = React.useState<readonly string[]>([])

  React.useEffect(() => {
    setIsLoading(true)
    try {
      fetchData(
        new PaginationModel({
          currentPage: 0,
          pageSize: 10
        })
      )
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }, [props.currentRole, order])

  const fetchData = async (query: PaginationModel) => {
    try {
      if (!currentRole) return

      const response = await PermissionAPI.getPermissionByRoleId({
        roleId: currentRole?.id ?? '',
        page: query.currentPage + 1,
        pageSize: query.pageSize,
        sortType: order === 'asc' ? 1 : 0
      })
      const commonResponse = new CommonRepsonseModel<PermissionModel[]>(response)
      setPermissions(commonResponse.data)
      setPagination({
        ...commonResponse.pagination,
        currentPage: commonResponse.pagination.currentPage - 1
      })
    } catch (error) {
      console.log(error)
    }
  }
  const headCells: HeadCell<PermissionModel>[] = [
    {
      id: 'displayName',
      minWidth: 70,
      numeric: false,
      maxWidth: 150,
      disablePadding: true,
      label: 'Tên hành động'
    },
    {
      id: 'status',
      minWidth: 70,
      numeric: true,
      disablePadding: true,
      label: '',
      format: (val: PermissionModel) => {
        return <Checkbox checked={val.status === 'PERMITTED'} />
      }
    }
  ]

  const handleChangePage = (event: unknown, newPage: number) => {
    setIsLoading(true)
    try {
      setPagination({
        ...pagination,
        currentPage: newPage
      })
      fetchData({
        ...pagination,
        currentPage: newPage
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    try {
      setPagination({
        ...pagination,
        pageSize: parseInt(event.target.value, 10),
        currentPage: 0
      })
      fetchData({
        ...pagination,
        pageSize: parseInt(event.target.value, 10),
        currentPage: 0
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // const isSelected = (name: string) => selected.indexOf(name) !== -1

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} tableName={tableName} /> */}

        <Box p={3}>
          <Typography sx={{ flex: '1 1 100%' }} variant='h6' id='tableTitle' component='div'>
            {tableName}
          </Typography>
        </Box>
        <TableContainer
          sx={
            {
              //height: 500
            }
          }
        >
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            aria-label='sticky table'
            size={'medium'}
          >
            <EnhancedTableHead
              order={order}
              rowCount={rows.length}
              headCells={headCells}
              handleSort={() => {
                if (order === 'asc') {
                  setOrder('desc')
                } else {
                  setOrder('asc')
                }
              }}

              // numSelected={selected.length}
              // orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              // onRequestSort={handleRequestSort}
            />
            <TableBody>
              {!isLoading
                ? [...(permissions ?? [])].map((value, index) => {
                    const row: any = value

                    // const isItemSelected = isSelected(row.id ?? '')
                    // const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        role='checkbox'
                        tabIndex={-1}
                        key={row.name}
                        sx={{ cursor: 'pointer' }}

                        // aria-checked={isItemSelected}
                        // selected={isItemSelected}
                      >
                        {/* <TableCell padding='checkbox'>
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId
                            }}

                            // onClick={event => handleClick(event, row.name)}
                          />
                        </TableCell> */}
                        <TableCell>{index + 1 + pagination.currentPage * pagination.pageSize}</TableCell>
                        {headCells.map((cell, i) => {
                          return (
                            <TableCell align='left' key={i}>
                              {cell.format ? cell.format(value) : row[cell.id]}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    )
                  })
                : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
                    return (
                      <TableRow key={item}>
                        <TableCell>
                          <Skeleton variant='rectangular' height={35} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='rectangular' height={35} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='rectangular' height={35} />
                        </TableCell>
                      </TableRow>
                    )
                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          labelRowsPerPage='Hàng trên trang'
          labelDisplayedRows={({ from, to, count }) => {
            return `${from}–${to} / ${count !== -1 ? count : `nhiều hơn ${to}`}`
          }}
          rowsPerPageOptions={[10, 20, 30]}
          component='div'
          count={pagination.total ?? 0}
          rowsPerPage={pagination.pageSize}
          page={pagination.currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
