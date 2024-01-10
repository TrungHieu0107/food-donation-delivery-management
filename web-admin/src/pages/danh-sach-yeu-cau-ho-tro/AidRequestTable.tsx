import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Skeleton,
  IconButton
} from '@mui/material'
import { useRouter } from 'next/router'
import Pagin from '../../layouts/components/pagination/Pagination'
import React, { useState } from 'react'
import { AidRequestListModel, FilterAidRequestModel } from 'src/models/AidRequest'
import { HeadCell, Order } from 'src/models/common/CommonModel'
import { KEY } from 'src/common/Keys'
import TableHeader from 'src/layouts/components/table/TableHeader'
import { DotsVertical } from 'mdi-material-ui'
import MenuAction from './MenuAction'
import { PaginationModel } from 'src/models/common/CommonResponseModel'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'

const AidRequestStatusChip: {
  [key: string]: React.ReactNode
} = {
  PENDING: (
    <Chip
      color='primary'
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
      color='success'
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
      color='info'
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

const headerCell: HeadCell<AidRequestListModel>[] = [
  {
    id: 'simpleCharityUnitResponse',
    label: 'Nơi cần hỗ trợ',
    clickAble: true,
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
            src={val.simpleCharityUnitResponse?.image}
          ></Avatar>
          <Typography
            sx={{
              maxWidth: '200px !important',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              '&:hover': {
                fontWeight: 'bold'
              }
            }}
            variant={'body2'}
          >
            {val.simpleCharityUnitResponse?.name}
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
    keySort: 'CreatedDate',
    format(val) {
      return formateDateDDMMYYYYHHMM(val.createdDate || '')
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
    id: 'simpleBranchResponses',
    label: 'Nơi nhận',
    minWidth: 200,
    format(val) {
      if (!val.simpleBranchResponses || val.simpleBranchResponses.length === 0) return KEY.DEFAULT_VALUE

      const lable = val.simpleBranchResponses ? val.simpleBranchResponses.at(0)?.name : KEY.DEFAULT_VALUE

      return (
        <div
          style={{
            display: 'flex',
            gap: 3,
            alignItems: 'center'
          }}
        >
          <Avatar
            src={val.simpleBranchResponses.at(0)?.image}
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
    id: 'status',
    label: 'Trạng thái',
    minWidth: 150,
    sortable: true,
    keySort: 'Status',
    format(val) {
      return AidRequestStatusChip[val.status ?? '']
    }
  }
]

interface AidRequestTable {
  data: AidRequestListModel[]
  pagination: PaginationModel
  isLoading: boolean
  filterObject: FilterAidRequestModel
  setFilterObject: (value: FilterAidRequestModel) => void
}

const AidRequestTable = ({ data, pagination, isLoading, filterObject, setFilterObject }: AidRequestTable) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [currentAidRequestSelected, setCurrentAidRequestSelected] = useState<AidRequestListModel>()
  const [orderBy, setOrderBy] = useState<string>('')
  const [order, setOrder] = useState<Order>()

  const router = useRouter()
  const handleNavigate = (id: string) => {
    console.log(id)
    router.push(`danh-sach-yeu-cau-ho-tro/chi-tiet-yeu-cau-ho-tro/${id}`)
  }

  const handleSort = (key: string) => {
    if (key !== orderBy) {
      setOrderBy(key)
      setOrder('asc')
      setFilterObject({
        ...filterObject,
        orderBy: key,
        sortType: order === 'asc' ? 1 : 0
      })

      return
    }
    if (order === 'asc') {
      setFilterObject({
        ...filterObject,
        orderBy: key,
        sortType: order === 'asc' ? 1 : 0
      })
      setOrder('desc')
    } else if (order === 'desc') {
      setOrderBy('')
      setOrder(undefined)
      setFilterObject({
        ...filterObject,
        orderBy: undefined,
        sortType: undefined,
      })
    }
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <TableContainer>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell size='small' sx={{ fontWeight: 'bold' }}>
                #
              </TableCell>
              {headerCell.map((item, index) => {
                return (
                  <TableHeader key={index} headCell={item} order={order} orderBy={orderBy} onRequestSort={handleSort} />
                )
              })}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              !!data ? (
                data.length > 0 ? (
                  data.map((aidRequest: any, index: number) => {
                    return (
                      <TableRow hover key={index}>
                        <TableCell>{index + 1 + (pagination?.currentPage - 1) * pagination?.pageSize}</TableCell>
                        {headerCell.map(item => {
                          return (
                            <TableCell
                              key={item.id}
                              sx={{
                                minWidth: item.minWidth,
                                maxWidth: item.maxWidth ?? 'none',
                                width: item.width ?? 'auto',
                                ...(item.clickAble
                                  ? {
                                      '&:hover': {
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        textDecoration: 'underline'
                                      }
                                    }
                                  : null)
                              }}
                              {...(item.clickAble
                                ? {
                                    onClick: () => {
                                      handleNavigate(aidRequest.id)
                                    }
                                  }
                                : null)}
                            >
                              {item.format ? item.format(aidRequest) : aidRequest[item.id]}
                            </TableCell>
                          )
                        })}
                        <TableCell
                          sx={{
                            width: 40
                          }}
                        >
                          <IconButton
                            onClick={e => {
                              setAnchorEl(e.currentTarget)
                              setCurrentAidRequestSelected(aidRequest)
                            }}
                          >
                            <DotsVertical />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow hover>
                    <TableCell
                      colSpan={2 + headerCell.length}
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
                <TableRow hover>
                  <TableCell
                    colSpan={2 + headerCell.length}
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
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((aidRequest: any, index) => {
                return (
                  <TableRow hover key={index}>
                    <TableCell>{index + 1}</TableCell>
                    {headerCell.map(item => {
                      return (
                        <TableCell
                          key={item.id}
                          sx={{
                            minWidth: item.minWidth,
                            maxWidth: item.maxWidth ?? 'none',
                            width: item.width ?? 'auto'
                          }}
                        >
                          <Skeleton variant='rectangular' />
                        </TableCell>
                      )
                    })}
                    <TableCell>
                      <DotsVertical />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && <Pagin data={pagination} filterObject={filterObject} setFilterObject={setFilterObject} />}
      <MenuAction
        currentAidRequestSelected={currentAidRequestSelected}
        handleDropdownClose={handleDropdownClose}
        anchorEl={anchorEl}
      />
    </Box>
  )
}

export default AidRequestTable
