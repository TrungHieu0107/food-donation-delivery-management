import { Button, Grid, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { CharityAPI } from 'src/api-client/Charity'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { ConfirmCharityModel } from 'src/models/Charity'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export interface IConfirmCharityDialogProps {
  id: string
}

export default function ConfirmCharityDialog(props: IConfirmCharityDialogProps) {
  const { id } = props

  const [open, setOpen] = useState<boolean>(false)
  const [isCheck, setIsCheck] = useState<boolean>(false)
  const [accept, setAccept] = useState<boolean>(false)
  const [reason, setReason] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const router = useRouter()

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    if (isLoading) {
      return
    }
    setOpen(false)
    setAccept(false)
    setReason(undefined)
  }

  const handleSubmit = async () => {
    try {
      if (!reason && !accept) {
        setIsCheck(true)

        return
      }

      const data = await CharityAPI.confirmCharity(
        new ConfirmCharityModel({
          id: id,
          isAccept: accept,
          reason: reason
        })
      )

      toast.success(new CommonRepsonseModel<any>(data).message)
      router.push('/to-chuc-tu-thien')
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Grid item lg={2} md={2} sm={3}>
        <Button
          variant='contained'
          onClick={() => {
            setAccept(true)
            handleOpen()
          }}
          fullWidth
        >
          Xác nhận
        </Button>
      </Grid>
      <Grid item lg={2} md={2} sm={3}>
        <Button
          variant='contained'
          onClick={() => {
            setAccept(false)
            handleOpen()
          }}
          fullWidth
          color='error'
        >
          Từ chối
        </Button>
      </Grid>
      <DialogCustom
        content={
          <>
            {accept ? (
              <Typography>Bạn có chắc chắn muốn đồng ý yêu cầu này không?</Typography>
            ) : (
              <Grid container spacing={3} direction={'column'}>
                <Grid item>
                  <Typography>Bạn có chắc chắn muốn từ chối yêu cầu này không?</Typography>
                  <Typography>Nếu đồng ý. Hãy nhập lý do.</Typography>
                </Grid>
                <Grid item>
                  <TextField
                    label='Lí do từ chối'
                    value={reason}
                    onChange={e => {
                      setReason(e.target.value)
                      setIsCheck(true)
                    }}
                    error={isCheck && !reason}
                    helperText={isCheck && !reason ? 'Hãy nhập lý do từ chối' : ''}
                    multiline
                    fullWidth
                    minRows={2}
                    maxRows={4}
                    disabled={isLoading}
                  />
                </Grid>
              </Grid>
            )}
          </>
        }
        handleClose={handleClose}
        open={open}
        title={'Xác nhận'}
        actionDialog={
          <>
            <Button
              variant='text'
              onClick={() => {
                handleClose()
              }}
              fullWidth
              size='small'
              color='secondary'
              disabled={isLoading}
            >
              Đóng
            </Button>
            <Button
              variant='contained'
              onClick={() => {
                handleSubmit()
              }}
              fullWidth
              size='small'
              disabled={isLoading}
            >
              Xác nhận
            </Button>
          </>
        }
      />
      <BackDrop open={isLoading} />
    </>
  )
}
