import { Verified } from '@mui/icons-material'
import { Box, ListItemText, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { AccountDetails, Moped } from 'mdi-material-ui'
import { useRouter } from 'next/router'
import * as React from 'react'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { AidRequestListModel } from 'src/models/AidRequest'
import RejectAidRequestDialog from './RejectDialog'
import useSession from 'src/@core/hooks/useSession'
import { KEY } from 'src/common/Keys'

interface MenuActionProps {
  currentAidRequestSelected: AidRequestListModel | undefined
  handleDropdownClose: () => void
  anchorEl: Element | null
}

export default function MenuAction(props: MenuActionProps) {
  const { currentAidRequestSelected, anchorEl, handleDropdownClose } = props
  const [openPopup, setOpenPopup] = React.useState(false)
  const [dialogRejectOpen, setDialogRejectOpen] = React.useState(false)

  const {session}: any = useSession()

  const router = useRouter()

  const handleAccept = async () => {
    try {
      router.push('/danh-sach-yeu-cau-ho-tro/chi-tiet-yeu-cau-ho-tro/phe-duyet/' + currentAidRequestSelected?.id ?? '')

      // const res: any = await AidRequestAPI.acceptAidRequest(currentAidRequestSelected?.id ?? '')
      // toast.success(res.message)
      // reFetchData()
    } catch (error: any) {
      console.log('error delete: ', error)
    }
  }

  const isBranchAdmin = () => {
    return session?.user.role === KEY.ROLE.BRANCH_ADMIN
  }

  return (
    <>
      <Menu open={!!anchorEl && !!currentAidRequestSelected} anchorEl={anchorEl} onClose={handleDropdownClose}>
        <MenuItem
          sx={{
            display: 'flex',
            gap: 2
          }}
          onClick={() => {
            router.push('/danh-sach-yeu-cau-ho-tro/chi-tiet-yeu-cau-ho-tro/' + currentAidRequestSelected?.id)
          }}
        >
          <AccountDetails color='primary' />

          <Typography>Chi tiết</Typography>
        </MenuItem>
        {currentAidRequestSelected?.status === 'PENDING' &&
          isBranchAdmin() && [
            <MenuItem
              key={1}
              sx={{
                display: 'flex',
                gap: 2
              }}
              onClick={() => {
                handleDropdownClose()
                setOpenPopup(true)
              }}
            >
              <Verified color='success' />
              <Typography>Chấp nhận</Typography>
            </MenuItem>,
            <MenuItem
              key={12}
              sx={{
                display: 'flex',
                gap: 2
              }}
              onClick={() => {
                setDialogRejectOpen(true)
              }}
            >
              <Verified color='error' />
              <Typography>Từ chối</Typography>
            </MenuItem>
          ]}
        {(currentAidRequestSelected?.status === 'ACCEPTED' || currentAidRequestSelected?.status === 'PROCESSING') &&
          isBranchAdmin() &&
          !currentAidRequestSelected.isSelfShipping && (
            <MenuItem
              sx={{
                display: 'flex',
                gap: 2
              }}
              onClick={() => {
                router.push('/van-chuyen/tao-moi/ho-tro/' + currentAidRequestSelected.id)
              }}
            >
              <Moped color='primary' />
              <ListItemText>Tạo yêu cầu vận chuyển</ListItemText>
            </MenuItem>
          )}
        {currentAidRequestSelected?.isSelfShipping && (
          <MenuItem
            onClick={() => {
              router.push('/danh-sach-yeu-cau-ho-tro/chi-tiet-yeu-cau-ho-tro/xuat-kho/' + currentAidRequestSelected.id)
            }}
          >
            <Moped color='primary' />
            <ListItemText>Xuất kho</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <DialogCustom
        content={
          <Box>
            <Typography>Bạn có chắc chắn muốn chấp nhận yêu cầu hỗ trợ này không?</Typography>
          </Box>
        }
        handleClose={() => {
          setOpenPopup(false)
          handleDropdownClose()
        }}
        open={openPopup}
        title={'Xác nhận'}
        actionDialog={
          <>
            <Button
              onClick={() => {
                setOpenPopup(false)
                handleDropdownClose()
              }}
              color='warning'
              size='small'
            >
              Hủy
            </Button>
            <Button variant='contained' color='info' size='small' onClick={handleAccept}>
              Xác nhận
            </Button>
          </>
        }
        sx={{
          zIndex: 1301
        }}
      />
      <RejectAidRequestDialog open={dialogRejectOpen} aidRequestId={currentAidRequestSelected?.id || ''} />
    </>
  )
}
