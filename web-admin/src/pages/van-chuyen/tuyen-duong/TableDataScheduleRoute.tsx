import {
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Typography,
  Table,
  Skeleton,
  Chip,
  Box,
  Avatar,
  IconButton,
  Theme
} from '@mui/material'
import * as React from 'react'
import { Fragment } from 'react'
import { customColor } from 'src/@core/theme/color'
import TableHeader from 'src/layouts/components/table/TableHeader'
import TableLabel from 'src/layouts/components/table/TableLabel'
import { ObjectFilterScheduledRoute, ScheduleRoute } from 'src/models/DeliveryRequest'
import { HeadCell } from 'src/models/common/CommonModel'
import { PaginationModel } from 'src/models/common/CommonResponseModel'
import MenuActionTableScheduleRoute from './MenuActionTableScheduleRoute'
import { DotsVertical } from 'mdi-material-ui'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { formateDateDDMMYYYY, roundToOneDecimalPlace, secondsToHoursMinutes } from 'src/@core/layouts/utils'
import TableCellValue from 'src/layouts/components/table/TableCellValue'
import { MyTablePagination } from 'src/layouts/components/table/TablePagination'

export const BulkyChip: {
  [key: string]: React.ReactNode
} = {
  NOT_BULKY: (
    <Chip
      key={'NOT_BULKY'}
      icon={<FiberManualRecordIcon />}
      label={'Bình thường'}
      color='success'
      variant='outlined'
      sx={{
        marginRight: 1,
        marginBottom: 1,
        background: theme => hexToRGBA(theme.palette.success[theme.palette.mode], 0.1),
        backdropFilter: 'blur(10px)',
        '& .MuiChip-icon': { fontSize: 'small' }
      }}
    />
  ),
  BULKY: (
    <Chip
      key={'BULKY'}
      icon={<FiberManualRecordIcon />}
      label={'Cồng kềnh'}
      color={'info'}
      variant='outlined'
      sx={{
        marginRight: 1,
        marginBottom: 1,
        background: theme => hexToRGBA(theme.palette.info[theme.palette.mode], 0.1),
        backdropFilter: 'blur(10px)',
        '& .MuiChip-icon': { fontSize: 'small' }
      }}
    />
  ),
  VERY_BULKY: (
    <Chip
      key={'VERY_BULKY'}
      icon={<FiberManualRecordIcon />}
      label={'Rất cồng kềnh'}
      color={'warning'}
      variant='outlined'
      sx={{
        marginRight: 1,
        marginBottom: 1,
        background: theme => hexToRGBA(theme.palette.warning[theme.palette.mode], 0.1),
        backdropFilter: 'blur(10px)',
        '& .MuiChip-icon': { fontSize: 'small' }
      }}
    />
  )
}

export const ScheduledRouteStatus: { [key: string]: React.ReactNode } = {
  PENDING: (
    <Typography
      component={'p'}
      fontWeight={500}
      sx={(theme: Theme) => ({
        textShadow: `3px 3px 6px ${theme.palette.warning.light}`,
        color: theme.palette.warning.light,
        whiteSpace: 'nowrap'
      })}
    >
      Đang chờ
    </Typography>
  ),
  ACCEPTED: (
    <Typography
      component={'p'}
      fontWeight={500}
      sx={(theme: Theme) => ({
        textShadow: `3px 3px 6px ${theme.palette.success.main}`,
        color: theme.palette.success.main,
        whiteSpace: 'nowrap'
      })}
    >
      Đã chấp nhận
    </Typography>
  ),
  PROCESSING: (
    <Typography
      component={'p'}
      fontWeight={500}
      sx={(theme: Theme) => ({
        textShadow: `3px 3px 6px ${theme.palette.info.main}`,
        color: theme.palette.info.main,
        whiteSpace: 'nowrap'
      })}
    >
      Đang xử lý
    </Typography>
  ),
  FINISHED: (
    <Typography
      component={'p'}
      fontWeight={500}
      sx={(theme: Theme) => ({
        textShadow: `3px 3px 6px ${theme.palette.success.main}`,
        color: theme.palette.success.main,
        whiteSpace: 'nowrap'
      })}
    >
      Hoàn thành
    </Typography>
  ),
  CANCELED: (
    <Typography
      component={'p'}
      fontWeight={500}
      sx={(theme: Theme) => ({
        textShadow: `3px 3px 6px ${theme.palette.error.main}`,
        color: theme.palette.error.main,
        whiteSpace: 'nowrap'
      })}
    >
      Đã bị hủy
    </Typography>
  ),
  LATE: (
    <Typography
      component={'p'}
      fontWeight={500}
      sx={(theme: Theme) => ({
        textShadow: `3px 3px 6px ${theme.palette.error.main}`,
        color: theme.palette.error.main,
        whiteSpace: 'nowrap'
      })}
    >
      Đã trễ
    </Typography>
  )
}

const headerCells: HeadCell<ScheduleRoute>[] = [
  {
    id: 'branch',
    label: <TableLabel title='Thực hiện' />,
    width: 250,
    format(val) {
      return (
        <Box display={'flex'} gap={2} alignItems={'center'}>
          <Avatar src={val.branch?.image} alt={val.branch?.name} />
          <Typography
            variant='body2'
            fontWeight={500}
            sx={{
              display: '-webkit-box',
              '-webkit-line-clamp': 2,
              '-webkit-box-orient': 'vertical',
              overflow: 'hidden',
              maxHeight: '3em', // Adjust this value as needed
              textOverflow: 'ellipsis', // Added this line according to the instructions
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' // Add this property for compatibility with some browsers
            }}
          >
            {val.branch?.name}
          </Typography>
        </Box>
      )
    }
  },
  {
    id: 'scheduledTime',
    label: <TableLabel title='Ngày thực hiện' />,
    width: 130,
    format(val) {
      return <Typography variant='body2'>{formateDateDDMMYYYY(val.scheduledTime?.day || '')}</Typography>
    }
  },
  {
    id: 'scheduledTime',
    label: <TableLabel title='Bắt đầu' />,
    format(val) {
      return <Typography variant='body2'>{val.scheduledTime?.startTime}</Typography>
    }
  },
  {
    id: 'scheduledTime',
    label: <TableLabel title='Kết thúc' />,
    format(val) {
      return <Typography variant='body2'>{val.scheduledTime?.endTime}</Typography>
    }
  },
  {
    id: 'bulkyLevel',
    label: <TableLabel title='Độ cồng kềnh' />,
    format(val) {
      return <Typography variant='body2'>{BulkyChip[val.bulkyLevel || '_']}</Typography>
    }
  },

  {
    id: 'status',
    label: <TableLabel title='Trạng thái' />,
    format(val) {
      return <Typography variant='body2'>{ScheduledRouteStatus[val.status || '_']}</Typography>
    }
  },

  {
    id: 'numberOfDeliveryRequests',
    label: <TableLabel title='Số đơn' />,
    format(val) {
      return <Typography variant='body2'>{val.numberOfDeliveryRequests}</Typography>
    }
  },
  {
    id: 'totalDistanceAsMeters',
    label: <TableLabel title='Quãng đường' />,
    format(val) {
      const value = val.totalDistanceAsMeters || 0

      return (
        <Typography
          variant='body2'
          sx={{
            whiteSpace: 'nowrap'
          }}
        >
          {`~${roundToOneDecimalPlace(value / 1000)} Km `}
          <Typography component={'span'} variant='caption'>
            ({roundToOneDecimalPlace(value)} m)
          </Typography>
        </Typography>
      )
    }
  },
  {
    id: 'totalTimeAsSeconds',
    label: <TableLabel title='Thời gian ước tính' />,
    format(val) {
      return <Typography variant='body2'>{`${secondsToHoursMinutes(val.totalTimeAsSeconds || 0)}`}</Typography>
    }
  }
]

const GenerateBody = (props: {
  data: ScheduleRoute[]
  isLoading: boolean
  pagination: PaginationModel
  handleClickAction: (selected: ScheduleRoute, element: Element) => void
}) => {
  const currentPage = props.pagination?.currentPage || 0
  const pageSize = props.pagination?.pageSize || 10
  const length = props.data?.length || 0

  if (props.isLoading) {
    return (
      <TableBody
        sx={{
          ...(length === 0 && { height: '400px' })
        }}
      >
        {[0, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9].map(item => {
          return (
            <TableRow key={item}>
              <TableCell></TableCell>
              {headerCells.map((headerCell, index) => (
                <TableCell key={index}>
                  <Skeleton variant='rectangular' />
                </TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    )
  } else {
    if (length === 0) {
      return (
        <TableBody
          sx={{
            ...(length === 0 && { height: '400px' })
          }}
        >
          <TableRow>
            <TableCell colSpan={headerCells.length + 2}>
              <Typography
                textAlign={'center'}
                fontWeight={550}
                variant='h6'
                sx={{
                  color: customColor.secondary
                }}
              >
                Không có dữ liệu! 👋🏻
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      )
    } else {
      return (
        <TableBody
          sx={{
            ...(length === 0 && { height: '400px' })
          }}
        >
          {props.data.map((item: any, index: number) => (
            <TableRow
              key={index}
              hover
              sx={{
                ':hover': {
                  cursor: 'pointer'
                }
              }}
            >
              <TableCell>{(currentPage - 1) * pageSize + index + 1}</TableCell>
              {headerCells.map((cell, i) => (
                <TableCell
                  key={i}
                  sx={{
                    maxWidth: cell.width,
                    minWidth: cell.width,
                    width: cell.width
                  }}
                  onClick={e => {
                    props.handleClickAction(item, e.currentTarget)
                  }}
                >
                  {cell.format ? cell.format(item) : <TableCellValue value={item[cell.id]} />}
                </TableCell>
              ))}
              <TableCell>
                <IconButton
                  onClick={e => {
                    props.handleClickAction(item, e.currentTarget)
                  }}
                >
                  <DotsVertical />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      )
    }
  }
}

export interface ITableDataScheduledRouteProps {
  data: ScheduleRoute[]
  isLoading: boolean
  pagination: PaginationModel
  filterObject: ObjectFilterScheduledRoute | undefined
  handleChangeFilter: (value: ObjectFilterScheduledRoute | undefined) => void
}

export default function TableDataScheduledRoute(props: ITableDataScheduledRouteProps) {
  const [currentSelected, setCurrentSelected] = React.useState<ScheduleRoute>()
  const [ancholEl, setAnchoEl] = React.useState<Element>()

  const handleClickAction = (selected: ScheduleRoute, element: Element) => {
    setCurrentSelected(selected)
    setAnchoEl(element)
  }

  const handleClonseActionMenu = () => {
    setCurrentSelected(undefined)
    setAnchoEl(undefined)
  }

  return (
    <Fragment>
      <TableContainer sx={{ minHeight: 450 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {headerCells.map((headerCell, index) => {
                return <TableHeader key={index} headCell={headerCell} />
              })}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <GenerateBody
            data={props.data}
            isLoading={props.isLoading}
            pagination={props.pagination}
            handleClickAction={handleClickAction}
          />
        </Table>
      </TableContainer>
      <MyTablePagination
        data={props.pagination}
        filterObject={props.filterObject}
        setFilterObject={props.handleChangeFilter}
      />
      <MenuActionTableScheduleRoute
        currentSelected={currentSelected}
        ancholEl={ancholEl}
        handleClonseActionMenu={handleClonseActionMenu}
      />
    </Fragment>
  )
}
