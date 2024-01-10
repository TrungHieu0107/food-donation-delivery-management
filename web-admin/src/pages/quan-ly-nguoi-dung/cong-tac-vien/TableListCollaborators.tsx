import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'
import Pagin from '../../../layouts/components/pagination/Pagination'
import { HeadCell } from 'src/models/common/CommonModel'
import { CollaboratorModel } from 'src/models/Collaborator'
import TableLabel from 'src/layouts/components/table/TableLabel'
import TableHeader from 'src/layouts/components/table/TableHeader'
import { AccountDetails, AccountKeyOutline, CloseCircle, DotsVertical } from 'mdi-material-ui'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import PopUpUpdateUser from './PopUpUpdateUser'

const collaboratorStatusChips: { [key: string]: ReactNode } = {
  ACTIVE: (
    <Chip
      color='info'
      sx={{
        color: '#FFFFFF',
        fontWeight: 'bold'
      }}
      label={'Đang hoạt động'}
    />
  ),
  INACTIVE: (
    <Chip
      color='error'
      sx={{
        color: '#FFFFFF',
        fontWeight: 'bold'
      }}
      label={'Ngưng hoạt động'}
    />
  ),
  UNVERIFIED: (
    <Chip
      color='warning'
      sx={{
        color: '#FFFFFF',
        fontWeight: 'bold'
      }}
      label={'Chưa xác thực'}
    />
  )
}

const headerCells: HeadCell<CollaboratorModel>[] = [
  {
    id: 'fullName',
    label: <TableLabel title='Họ và Tên' />,
    clickAble: true
  },
  {
    id: 'avatar',
    label: <TableLabel title='Ảnh đại diện' />,
    format(val) {
      return (
        <Avatar
          src={val.avatar}
          sx={{
            border: '1px solid #dcdcdc'
          }}
        />
      )
    }
  },
  {
    id: 'email',
    label: <TableLabel title='Email' />
  },
  {
    id: 'phone',
    label: <TableLabel title='Số điện thoại' />
  },
  {
    id: 'status',
    label: <TableLabel title='Trạng thái' />,
    format(val) {
      return collaboratorStatusChips[val.status]
    }
  }
]

const TableListCollaborators = ({ data, pagination, filterObject, setFilterObject, isLoading }: any) => {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [currentCollaboratorSelected, setCurrentCollaboratorSelected] = useState<CollaboratorModel>()
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [updatePermission, setUpdatePermission] = useState<boolean>(false)

  const handleDelete = async () => {
    try {
      if (!currentCollaboratorSelected) {
        handleDropdownClose()

        return
      }
      const res: any = await axiosClient.delete(`/collaborators/${currentCollaboratorSelected.id}`)
      toast.success(res.message)
      setFilterObject({
        ...filterObject
      })
    } catch (error: any) {
      console.log('error delete: ', error)
      toast.error('Xóa thất bại')
    }
  }

  const handleNavigate = (id?: string) => {
    if (id) {
      router.push(`cong-tac-vien/chi-tiet/${id}`)
    } else {
      currentCollaboratorSelected && router.push(`cong-tac-vien/chi-tiet/${currentCollaboratorSelected?.id}`)
    }
  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
    setCurrentCollaboratorSelected(undefined)
    setConfirmDelete(false)
  }

  return (
    <>
      <TableContainer
        sx={{
          minHeight: '400px'
        }}
      >
        <Table aria-label='simple table'>
          <TableHead
            sx={{
              borderRadius: '10px 10px 0px 0px'
            }}
          >
            <TableRow>
              <TableCell>STT</TableCell>
              {headerCells.map((item, index) => {
                return <TableHeader key={index} headCell={item} />
              })}
              <TableCell size='small' align='center' sx={{ color: '#ffffff', fontWeight: 'bold' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoading ? (
              !!data ? (
                data.length > 0 ? (
                  data.map((collaborator: any, index: number) => {
                    return (
                      <TableRow hover key={index}>
                        <TableCell>{index + 1 + (pagination?.currentPage - 1) * pagination?.pageSize}</TableCell>
                        {headerCells.map(item => {
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
                                      handleNavigate(collaborator.id)
                                    }
                                  }
                                : null)}
                            >
                              {item.format ? item.format(collaborator) : collaborator[item.id]}
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
                              setCurrentCollaboratorSelected(collaborator)
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
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((collaborator: any, index) => {
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
      {pagination && <Pagin data={pagination} filterObject={filterObject} setFilterObject={setFilterObject} />}
      <Menu open={!!anchorEl && !!currentCollaboratorSelected} anchorEl={anchorEl} onClose={handleDropdownClose}>
        <MenuItem
          sx={{
            display: 'flex',
            gap: 2
          }}
          onClick={() => {
            handleNavigate()
          }}
        >
          <AccountDetails color='primary' />
          <Typography>Chi tiết</Typography>
        </MenuItem>
        <MenuItem
          sx={{
            display: 'flex',
            gap: 2
          }}
          onClick={() => {
            setUpdatePermission(true)
            setAnchorEl(null)
          }}
        >
          <AccountKeyOutline color='info' />
          <Typography>Quyền truy cập</Typography>
        </MenuItem>
        {(currentCollaboratorSelected?.status === 'ACTIVE' || currentCollaboratorSelected?.status === 'INACTIVE') && (
          <MenuItem
            sx={{
              display: 'flex',
              gap: 2
            }}
            onClick={() => {
              setConfirmDelete(true)
              setAnchorEl(null)
            }}
          >
            <CloseCircle color='warning' />
            <Typography>Xóa</Typography>
          </MenuItem>
        )}
      </Menu>
      <DialogCustom
        content={
          <Box>
            <Typography>Bạn có chắc chắn muốn xóa cộng tác viên này không?</Typography>
          </Box>
        }
        handleClose={handleDropdownClose}
        open={confirmDelete && !!currentCollaboratorSelected}
        title={'Xác nhận'}
        actionDialog={
          <>
            <Button onClick={handleDropdownClose} color='info' size='small'>
              Hủy
            </Button>
            <Button onClick={handleDelete} variant='contained' size='small'>
              Xác nhận
            </Button>
          </>
        }
        sx={{
          zIndex: 1301
        }}
      />
      {currentCollaboratorSelected && (
        <PopUpUpdateUser
          id={currentCollaboratorSelected?.id ?? ''}
          open={updatePermission}
          handleClose={function (): void {
            setUpdatePermission(false)
          }}
        />
      )}
    </>
  )
}

export default TableListCollaborators
