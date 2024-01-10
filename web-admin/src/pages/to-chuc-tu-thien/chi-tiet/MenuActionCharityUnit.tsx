import { VerifiedOutlined, ExpandLess, ExpandMore } from '@mui/icons-material'
import { MenuItem, Typography, Menu, Collapse, TextField, Button } from '@mui/material'
import { AccountDetails, Check, Close, 
  
 // CloseCircle 
} from 'mdi-material-ui'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify'
import useSession from 'src/@core/hooks/useSession'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { CharityAPI } from 'src/api-client/Charity'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { CharityUnitModel } from 'src/models/Charity'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export interface IMenuActionCharityUnitProps {
  currentCharityUnitSelected: CharityUnitModel | undefined
  anchorEl: Element | null
  handleDropdownClose: () => void
  handleShowDetailDialog: () => void
  fetchCharityUnits: () => void
}

export default function MenuActionCharityUnit(props: IMenuActionCharityUnitProps) {
  const [open, setOpen] = useState<boolean>(true)
  const [reason, setReason] = useState<string>('')
  const [dialogConfirmReject, setDialogConfirmReject] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()
  const {session}: any = useSession()
  const handleConfirmUpdateCharity = async () => {
    try {
      setIsSubmitting(true)
      const response = await CharityAPI.confirmCreateNewCharityUnits(
        props.currentCharityUnitSelected?.id || '',
        true,
        ''
      )
      toast.success(new CommonRepsonseModel<any>(response).message)
      await props.fetchCharityUnits()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRejectUpdateCharity = async () => {
    handleCloseDialogReject()
  }

  const handleCloseDialogReject = () => {
    setDialogConfirmReject(false)
    setReason('')
  }

  const handleOpenDialogReject = () => {
    setDialogConfirmReject(true)
  }

  return (
    <Fragment>
      <Menu
        open={!!props.anchorEl && !!props.currentCharityUnitSelected}
        anchorEl={props.anchorEl}
        onClose={props.handleDropdownClose}
      >
        <MenuItem
          sx={{
            display: 'flex',
            gap: 2
          }}
          onClick={() => {
            props.handleShowDetailDialog()
          }}
        >
          <AccountDetails color='primary' />
          <Typography>Chi tiết</Typography>
        </MenuItem>
        {/* <MenuItem
          sx={{
            display: 'flex',
            gap: 2
          }}
        >
          <CloseCircle color='error' />
          <Typography>{props.currentCharityUnitSelected?.status === 'ACTIVE' ? 'Chặn' : 'Bỏ chặn'}</Typography>
        </MenuItem> */}
        {(props.currentCharityUnitSelected?.isWatingToConfirmUpdate && session?.user.role === "SYSTEM_ADMIN") && (
          <MenuItem
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2
            }}
            onClick={() => {
              router.push('/to-chuc-tu-thien/xac-nhan-chinh-sua/' + props.currentCharityUnitSelected?.userId || '')
            }}
          >
            <VerifiedOutlined color='success' />
            <Typography>Xem cập nhật</Typography>
          </MenuItem>
        )}
        {(props.currentCharityUnitSelected?.status === 'UNVERIFIED' && session?.user.role === "SYSTEM_ADMIN") && [
          <MenuItem
            key={1}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2
            }}
            onClick={() => {
              setOpen(!open)
            }}
          >
            <VerifiedOutlined color='success' />
            <Typography>Xác nhận</Typography>
            {open ? <ExpandLess /> : <ExpandMore />}
          </MenuItem>,
          <Collapse key={2} in={open} unmountOnExit>
            <MenuItem
              sx={{
                display: 'flex',
                gap: 2,
                paddingLeft: 8
              }}
              onClick={handleOpenDialogReject}
            >
              <Close color='error' />
              <Typography>Từ chối</Typography>
            </MenuItem>
            <MenuItem
              sx={{
                display: 'flex',
                gap: 2,
                paddingLeft: 8
              }}
              onClick={handleConfirmUpdateCharity}
            >
              <Check color='success' />
              <Typography>Xác nhận</Typography>
            </MenuItem>
          </Collapse>
        ]}
      </Menu>
      <DialogCustom
        content={
          <TextField
            value={reason}
            multiline
            minRows={3}
            maxRows={8}
            onChange={e => {
              setReason(e.target.value)
            }}
            fullWidth
          />
        }
        handleClose={handleCloseDialogReject}
        open={dialogConfirmReject}
        title={'Xác nhận từ chối'}
        actionDialog={
          <>
            <Button size='small' color='secondary' onClick={handleCloseDialogReject}>
              Đóng
            </Button>
            <Button variant='contained' size='small' onClick={handleRejectUpdateCharity}>
              Xác nhận
            </Button>
          </>
        }
        width={400}
      />
      {isSubmitting && <BackDrop open={true} />}
    </Fragment>
  )
}
