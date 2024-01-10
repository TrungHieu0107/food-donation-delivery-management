import {
  Avatar,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material'
import { DotsVertical, InformationOutline, Moped } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import * as React from 'react'
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import { DonatedRequestAPI } from 'src/api-client/DonatedRequest'
import TableHeader from 'src/layouts/components/table/TableHeader'
import { DonatedRequestModel, QuueryDonatedRequestModel } from 'src/models/DonatedRequest'
import { HeadCell, Order } from 'src/models/common/CommonModel'
import { CommonRepsonseModel, PaginationModel } from 'src/models/common/CommonResponseModel'

export interface ITableDataDonatedRequestProps {
  dataSearch: QuueryDonatedRequestModel
}

export const DonatedRequestStatusChip: {
  [key: string]: React.ReactNode
} = {
  PENDING: (
    <Chip
      color='info'
      label={
        <Typography
          variant='body2'
          fontWeight={550}
          sx={{
            color: theme => theme.palette.common.white
          }}
        >
          Chờ xử lí
        </Typography>
      }
    ></Chip>
  ),
  ACCEPTED: (
    <Chip
      color='secondary'
      label={
        <Typography
          variant='body2'
          fontWeight={550}
          sx={{
            color: theme => theme.palette.common.white
          }}
        >
          Đã chấp nhận
        </Typography>
      }
    ></Chip>
  ),
  REJECTED: (
    <Chip
      color='error'
      label={
        <Typography
          variant='body2'
          fontWeight={550}
          sx={{
            color: theme => theme.palette.common.white
          }}
        >
          Từ chối
        </Typography>
      }
    ></Chip>
  ),
  CANCELED: (
    <Chip
      color='error'
      label={
        <Typography
          variant='body2'
          fontWeight={550}
          sx={{
            color: theme => theme.palette.common.white
          }}
        >
          Đã hủy
        </Typography>
      }
    ></Chip>
  ),
  EXPIRED: (
    <Chip
      color='error'
      label={
        <Typography
          variant='body2'
          fontWeight={550}
          sx={{
            color: theme => theme.palette.common.white
          }}
        >
          Hết hạn
        </Typography>
      }
    ></Chip>
  ),
  PROCESSING: (
    <Chip
      color='info'
      label={
        <Typography
          variant='body2'
          fontWeight={550}
          sx={{
            color: theme => theme.palette.common.white
          }}
        >
          Đang xử lí
        </Typography>
      }
    ></Chip>
  ),
  SELF_SHIPPING: (
    <Chip
      color='secondary'
      label={
        <Typography
          variant='body2'
          fontWeight={550}
          sx={{
            color: theme => theme.palette.common.white
          }}
        >
          Tự vận chuyển
        </Typography>
      }
    ></Chip>
  ),
  REPORTED: (
    <Chip
      color='warning'
      label={
        <Typography
          variant='body2'
          fontWeight={550}
          sx={{
            color: theme => theme.palette.common.white
          }}
        >
          Đã báo cáo
        </Typography>
      }
    ></Chip>
  ),
  FINISHED: (
    <Chip
      color='success'
      label={
        <Typography
          variant='body2'
          fontWeight={550}
          sx={{
            color: theme => theme.palette.common.white
          }}
        >
          Hoàn thành
        </Typography>
      }
    ></Chip>
  )
}

const headerCell: HeadCell<DonatedRequestModel>[] = [
  {
    id: 'simpleUserResponse',
    label: 'Người quyên góp',
    minWidth: 200,
    format(val) {
      return (
        <div
          style={{
            display: 'flex',
            gap: 3,
            alignItems: 'center'
          }}
        >
          <Avatar
            sx={{
              border: '1px solid #d1d1d1'
            }}
            src={val.simpleUserResponse?.avatar}
          ></Avatar>
          <Typography
            sx={{
              maxWidth: '200px !important',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            variant={'body2'}
          >
            {val.simpleUserResponse?.fullName}
          </Typography>
        </div>
      )
    }
  },
  {
    id: 'createdDate',
    label: 'Ngày tạo',
    minWidth: 170,
    sortable: true,
    keySort: 'createdDate',
    format(val) {
      return formateDateDDMMYYYYHHMM(val.createdDate || '')
    }
  },
  {
    id: 'status',
    label: 'Trạng thái',
    minWidth: 150,
    sortable: true,
    keySort: 'status',
    format(val) {
      return DonatedRequestStatusChip[val.status ?? '']
    }
  },
  {
    id: 'acceptedDate',
    label: 'Ngày chấp nhận',
    minWidth: 170,
    sortable: true,
    keySort: 'ConfirmedDate',
    format(val) {
      return formateDateDDMMYYYYHHMM(val.acceptedDate || '')
    }
  },
  {
    id: 'simpleBranchResponse',
    label: 'Nơi nhận',
    minWidth: 200,
    format(val) {
      if (!val.simpleBranchResponse) return '-'

      const lable = val.simpleBranchResponse ? val.simpleBranchResponse.name : '-'

      return (
        <div
          style={{
            display: 'flex',
            gap: 3,
            alignItems: 'center'
          }}
        >
          <Avatar
            src={val.simpleBranchResponse?.image}
            sx={{
              border: '1px solid #d1d1d1'
            }}
          ></Avatar>
          <Typography
            sx={{
              maxWidth: '200px !important',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            variant={'body2'}
          >
            {lable}
          </Typography>
        </div>
      )
    }
  },
  {
    id: 'simpleActivityResponse',
    label: 'Hoạt động',
    minWidth: 200,
    format(val) {
      if (!val.simpleActivityResponse) return '-'

      const lable = val.simpleActivityResponse ? val.simpleActivityResponse.name : '-'

      return (
        <Typography
          sx={{
            maxWidth: '200px !important',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
          variant={'body2'}
        >
          {lable}
        </Typography>
      )
    }
  }
]

export default function TableDataDonatedRequest(props: ITableDataDonatedRequestProps) {
  const { dataSearch } = props
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<DonatedRequestModel[]>([])
  const [pagination, setPagination] = useState<PaginationModel>(new PaginationModel({
    currentPage: 1
  }))
  const [anchorEl, setAnchorEl] = useState<(EventTarget & Element) | null>(null)
  const [currentSelected, setCurrentSellected] = useState<DonatedRequestModel>()
  const [orderBy, setOrderBy] = useState<string>('')
  const [order, setOrder] = useState<Order>()
  const router = useRouter()

  useEffect(() => {
    setIsLoading(true)
    try {
      fetchData(
        !!order
          ? new QuueryDonatedRequestModel({
              ...dataSearch,
              orderBy: orderBy[0].toUpperCase() + orderBy.slice(1),
              sortType: order === 'asc' ? 0 : 1
            })
          : dataSearch
      )
    } catch (error) {
      console.log(error)
    }
  }, [dataSearch, orderBy, order])

  const fetchData = async (valueSearch?: QuueryDonatedRequestModel, currentPagination?: PaginationModel) => {
    try {
      const payload = valueSearch ? valueSearch : dataSearch

      if (currentPagination) {
        payload.page = currentPagination.currentPage
        payload.pageSize = currentPagination.pageSize
      }

      router.push(
        {
          pathname: '/quyen-gop'
        },
        {
          pathname: '/quyen-gop',
          query: { ...payload }
        },
        { shallow: true }
      )
      const res = await DonatedRequestAPI.get(payload)
      const commonReponse = new CommonRepsonseModel<DonatedRequestModel[]>(res)
      setPagination(commonReponse.pagination)
      setData(commonReponse.data ?? [])
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPagination(
      new PaginationModel({
        ...pagination,
        currentPage: newPage + 1
      })
    )
    fetchData(
      undefined,
      new PaginationModel({
        ...pagination,
        currentPage: newPage + 1
      })
    )
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setPagination(
      new PaginationModel({
        ...pagination,
        pageSize: parseInt(event.target.value, 10),
        currentPage: 1
      })
    )
    fetchData(
      undefined,
      new PaginationModel({
        ...pagination,
        pageSize: parseInt(event.target.value, 10),
        currentPage: 1
      })
    )
  }

  const handleDropdownOpen = (event: SyntheticEvent, val: DonatedRequestModel) => {
    setAnchorEl(event.currentTarget)
    setCurrentSellected(val)
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
    setCurrentSellected(undefined)
  }

  const handleSort = (key: string) => {
    if (key !== orderBy) {
      setOrderBy(key)
      setOrder('asc')

      return
    }
    if (order === 'asc') {
      setOrder('desc')
    } else if (order === 'desc') {
      setOrderBy('')
      setOrder(undefined)
    } else {
      setOrder('asc')
    }
  }

  return (
    <>
      <TableContainer
        sx={{
          minHeight: 350,
          border: '1px solid'

          //maxHeight: 450
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              {headerCell.map((item, index) => {
                return <TableHeader headCell={item} key={index} onRequestSort={handleSort} />
              })}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              data.length > 0 ? (
                data.map((item, index) => {
                  return (
                    <TableRow key={item.id ?? ''}>
                      <TableCell>{index + 1 + ((pagination?.currentPage ?? 1) - 1) * (pagination?.pageSize ?? 10)}</TableCell>
                      {headerCell.map((key, index) => {
                        return <TableCell key={index}>{key.format ? key.format(item) : item[key.id]}</TableCell>
                      })}
                      <TableCell align={'right'}>
                        <IconButton onClick={e => handleDropdownOpen(e, item)}>
                          <DotsVertical />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headerCell.length + 2}
                    sx={{
                      borderBottom: '0px !important'
                    }}
                  >
                    <Typography variant='body1' textAlign={'center'}>
                      Không có dữ liệu
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            ) : (
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
                <TableRow key={item}>
                  <TableCell>
                    <Skeleton variant='rectangular' />
                  </TableCell>
                  {headerCell.map((cell, i) => {
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
            )}
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
        count={pagination?.total ?? 0}
        rowsPerPage={pagination?.pageSize ?? 10}
        page={(pagination?.currentPage ?? 1) - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClick={handleDropdownClose}>
        <MenuItem
          onClick={() => {
            currentSelected && router.push('/quyen-gop/chi-tiet/' + currentSelected.id)
          }}
        >
          <ListItemIcon>
            <InformationOutline color='info' />
          </ListItemIcon>
          <ListItemText>Chi tiết</ListItemText>
        </MenuItem>
        {currentSelected?.status === 'ACCEPTED' && (
          <MenuItem
            onClick={() => {
              router.push('/van-chuyen/tao-moi/quyen-gop/' + currentSelected.id)
            }}
          >
            <ListItemIcon>
              <Moped color='primary' />
            </ListItemIcon>
            <ListItemText>Tạo yêu cầu vận chuyển</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  )
}
