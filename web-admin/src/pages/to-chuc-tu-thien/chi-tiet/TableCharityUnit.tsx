import {
  Avatar,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { CharityAPI } from 'src/api-client/Charity'
import TableHeader from 'src/layouts/components/table/TableHeader'
import TableLabel from 'src/layouts/components/table/TableLabel'
import { CharityUnitModel } from 'src/models/Charity'
import { HeadCell } from 'src/models/common/CommonModel'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { DotsVertical } from 'mdi-material-ui'
import CharityUnitDetailDialog from './CharityUnitDetailDialog'
import { CharityStatus } from '../TableListCharities'
import MenuActionCharityUnit from './MenuActionCharityUnit'
import { KEY } from 'src/common/Keys'

export interface ITableCharityUnitProps {
  id: string
}

const headerCells: HeadCell<CharityUnitModel>[] = [
  new HeadCell({
    id: 'name',
    label: <TableLabel title='Tên đơn vị' />,
    maxWidth: 200,
    clickAble: true,
    format(val) {
      return (
        <Tooltip
          title={val.name}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              fontWeight: 'bold',
              cursor: 'pointer',
              textDecoration: 'underline'
            }
          }}
        >
          <Typography>
            {val.name || KEY.DEFAULT_VALUE}
            {val.isHeadQuater && (
              <Typography
                component={'span'}
                variant='caption'
                sx={{
                  color: theme => theme.palette.error[theme.palette.mode]
                }}
              >
                Chi nhánh chính
              </Typography>
            )}
            {val.isWatingToConfirmUpdate && (
              <Typography
                component={'span'}
                variant='caption'
                sx={{
                  color: theme => theme.palette.warning[theme.palette.mode]
                }}
              >
                Chờ xác nhận thay đổi
              </Typography>
            )}
          </Typography>
        </Tooltip>
      )
    }
  }),
  new HeadCell({
    id: 'image',
    label: <TableLabel title='Ảnh đại diện' />,
    format(val) {
      return <Avatar src={val.image} alt={val.name} />
    },
    maxWidth: 150
  }),
  new HeadCell({
    id: 'email',
    label: <TableLabel title='Email' />,
    maxWidth: 200
  }),
  new HeadCell({
    id: 'phone',
    label: <TableLabel title='Số điện thoại' />,
    maxWidth: 150
  }),
  new HeadCell({
    id: 'address',
    label: <TableLabel title='Địa chỉ' />,
    maxWidth: 200
  }),
  new HeadCell({
    id: 'status',
    label: <TableLabel title='Trạng thái' />,
    format(val) {
      return CharityStatus[val.status ?? '']
    }
  })
]

export default function TableCharityUnit(props: ITableCharityUnitProps) {
  const { id } = props
  const [charityUnits, setCharityUnits] = useState<CharityUnitModel[]>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [currentCharityUnitSelected, setCurrentCharityUnitSelected] = useState<CharityUnitModel>()
  const [dialogDetialOpen, setDialogDetialOpen] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    if (id) {
      fetchCharityUnits()
    }
  }, [id])

  const handleDropdownClose = () => {
    setAnchorEl(null)
    setCurrentCharityUnitSelected(undefined)
  }

  const fetchCharityUnits = async () => {
    try {
      if (id) {
        const data = await CharityAPI.getCharityUnits(id as string)
        const commonResponse = new CommonRepsonseModel<CharityUnitModel[]>(data)
        console.log(commonResponse)

        setCharityUnits(commonResponse.data)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShowDetailDialog = () => {
    setDialogDetialOpen(true)
    setAnchorEl(null)
  }

  return (
    <>
      <TableContainer
        sx={{
          width: '100%',
          overflow: 'auto'
        }}
      >
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              {headerCells.map(head => {
                return <TableHeader key={head.id} headCell={head} />
              })}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              !!charityUnits ? (
                charityUnits.length > 0 ? (
                  charityUnits.map((charity: any, index: number) => {
                    return (
                      <TableRow hover key={index}>
                        <TableCell>{index + 1}</TableCell>
                        {headerCells.map(item => {
                          return (
                            <TableCell
                              key={item.id}
                              sx={{
                                minWidth: item.minWidth,
                                maxWidth: item.maxWidth ?? 'none',
                                width: item.width ?? 'auto'
                              }}
                              {...(item.clickAble
                                ? {
                                    onClick: () => {
                                      setCurrentCharityUnitSelected(charity)
                                      handleShowDetailDialog()
                                    }
                                  }
                                : null)}
                            >
                              {item.format ? (
                                item.format(charity)
                              ) : (
                                <Tooltip title={charity[item.id]}>
                                  <Typography
                                    sx={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      textTransform: 'none',
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
                                    variant='body1'
                                  >
                                    {charity[item.id]}
                                  </Typography>
                                </Tooltip>
                              )}
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
                              setCurrentCharityUnitSelected(charity)
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
                      colSpan={2 + headerCells.length}
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
                    colSpan={2 + headerCells.length}
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
              [0, 1, 2, 3, 4].map((_, index) => {
                return (
                  <TableRow hover key={index}>
                    <TableCell>{index + 1}</TableCell>
                    {headerCells.map(item => {
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
      <MenuActionCharityUnit
        currentCharityUnitSelected={currentCharityUnitSelected}
        anchorEl={anchorEl}
        handleDropdownClose={handleDropdownClose}
        handleShowDetailDialog={handleShowDetailDialog}
        fetchCharityUnits={fetchCharityUnits}
      />

      <CharityUnitDetailDialog
        charityUnit={currentCharityUnitSelected || new CharityUnitModel({})}
        open={dialogDetialOpen && !!currentCharityUnitSelected}
        handleClose={function (): void {
          setDialogDetialOpen(false)
          setCurrentCharityUnitSelected(undefined)
        }}
      />
    </>
  )
}
