import { Avatar, Box, Button, Divider, Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import DialogCustom from 'src/@core/layouts/components/shared-components/Dialog'
import { CharityAPI } from 'src/api-client/Charity'
import UserLayout from 'src/layouts/UserLayout'
import BackDrop, { GiftLoading } from 'src/layouts/components/loading/BackDrop'
import { CharityUnitModel } from 'src/models/Charity'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'

export default function ConfirmUpdateCharity() {
  const [originData, setOriginData] = useState<CharityUnitModel>()
  const [updateData, setUpdateData] = useState<CharityUnitModel>()
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [dialogConfirmOpen, setDialogConfirmOpen] = useState<boolean>(false)
  const [isAccept, setIsAccept] = useState<boolean>()
  const [reason, setReason] = useState<string>('')
  const [isCheck, setIsCheck] = useState<boolean>(false)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    setIsLoadingData(true)
    if (id) {
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    try {
      await getOriginData()
      await getUpdateData()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const getOriginData = async () => {
    try {
      const response = await CharityAPI.getCharityUnitProfileWithStatus((id as string) || '', 2)
      const charityUnitData = new CommonRepsonseModel<CharityUnitModel>(response)
      console.log({ id, charityUnitData })
      if (charityUnitData.data?.location) {
        const location = charityUnitData.data?.location.toString().split(', ')
        charityUnitData.data.location = [Number.parseFloat(location[0]), Number.parseFloat(location[1])]
      }

      console.log(charityUnitData)

      setOriginData(charityUnitData.data)
    } catch (error) {
      throw error
    }
  }

  const getUpdateData = async () => {
    try {
      const response = await CharityAPI.getCharityUnitProfileWithStatus((id as string) || '', 1)
      const charityUnitData = new CommonRepsonseModel<CharityUnitModel>(response)
      console.log({ id, charityUnitData })
      if (charityUnitData.data?.location) {
        const location = charityUnitData.data?.location.toString().split(', ')
        charityUnitData.data.location = [Number.parseFloat(location[0]), Number.parseFloat(location[1])]
      }

      console.log(charityUnitData)

      setUpdateData(charityUnitData.data)
    } catch (error) {
      throw error
    }
  }

  const handleConfirmUpdate = async () => {
    try {
      setIsSubmitting(true)
      if (isAccept !== undefined) {
        const response = await CharityAPI.confirmUpdateCharityUnits(updateData?.id || '', isAccept, reason)
        toast.success(new CommonRepsonseModel<any>(response).message)
        handleBack()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClickConfirmButton = (value: boolean) => {
    setDialogConfirmOpen(true)
    setIsAccept(value)
  }

  const handleCloseConfirmDialog = () => {
    setIsAccept(undefined)
    setDialogConfirmOpen(false)
    setIsCheck(false)
  }

  const handleBack = () => {
    router.push('/to-chuc-tu-thien')
  }

  return (
    <Fragment>
      <Paper
        sx={{
          padding: 5,
          minHeight: 500
        }}
      >
        <Stack
          direction={'column'}
          divider={
            <Divider
              sx={{
                marginX: '10px'
              }}
            />
          }
        >
          {/* <Typography variant='h5' fontWeight={600} textAlign={'center'}>
            Xác nhận cập nhật
          </Typography> */}
          {!isLoadingData ? (
            <Grid container direction={'column'} justifyContent={'center'} alignItems={'center'} spacing={3}>
              <Grid item display={'flex'} justifyContent={'center'} gap={3}>
                <Avatar
                  alt={originData?.name}
                  src={originData?.image || '/images/avatars/1.png'}
                  sx={{
                    width: 185,
                    height: 185,
                    border: theme => `0.25rem solid ${theme.palette.common.white}`
                  }}
                />
                {originData?.image !== updateData?.image && (
                  <Avatar
                    alt={updateData?.name}
                    src={updateData?.image || '/images/avatars/1.png'}
                    sx={{
                      width: 185,
                      height: 185,
                      border: theme => `0.25rem solid ${theme.palette.common.white}`
                    }}
                  />
                )}
              </Grid>
              <Grid item display={'flex'} justifyContent={'center'} gap={3}>
                <Typography
                  variant='h5'
                  fontWeight={600}
                  sx={{
                    ...(originData?.name !== updateData?.name
                      ? {
                          textDecorationLine: 'line-through'
                        }
                      : null)
                  }}
                >
                  {originData?.name || '_'}
                </Typography>
                {originData?.name !== updateData?.name && (
                  <Typography variant='h5' fontWeight={600}>
                    {updateData?.name || '_'}
                  </Typography>
                )}
              </Grid>
              <Grid item display={'flex'} justifyContent={'center'} gap={3}>
                <Typography
                  sx={{
                    ...(originData?.description !== updateData?.description
                      ? {
                          textDecorationLine: 'line-through'
                        }
                      : null),
                    textIndent: '20px'
                  }}
                >
                  {originData?.description || '_'}
                </Typography>
                {originData?.description !== updateData?.description && (
                  <Typography>{updateData?.description || '_'}</Typography>
                )}
              </Grid>
              <Grid item container direction={'column'}>
                <Grid item>
                  <Typography variant='h6' fontWeight={550}>
                    Email
                  </Typography>
                </Grid>
                <Grid item display={'flex'} gap={3}>
                  <Typography
                    sx={{
                      ...(originData?.email !== updateData?.email
                        ? {
                            textDecorationLine: 'line-through'
                          }
                        : null),
                      textIndent: '20px',
                      textAlign: 'left'
                    }}
                  >
                    {originData?.email || '_'}
                  </Typography>
                  {originData?.email !== updateData?.email && <Typography>{updateData?.email || '_'}</Typography>}
                </Grid>
              </Grid>
              <Grid item container direction={'column'}>
                <Grid item>
                  <Typography variant='h6' fontWeight={550}>
                    Số điện thoại
                  </Typography>
                </Grid>
                <Grid item display={'flex'} gap={3}>
                  <Typography
                    sx={{
                      ...(originData?.phone !== updateData?.phone
                        ? {
                            textDecorationLine: 'line-through'
                          }
                        : null),
                      textIndent: '20px',
                      textAlign: 'left'
                    }}
                  >
                    {originData?.phone || '_'}
                  </Typography>
                  {originData?.phone !== updateData?.phone && <Typography>{updateData?.phone || '_'}</Typography>}
                </Grid>
              </Grid>
              <Grid item container direction={'column'}>
                <Grid item>
                  <Typography variant='h6' fontWeight={550}>
                    Địa chỉ
                  </Typography>
                </Grid>
                <Grid item display={'flex'} gap={3}>
                  <Typography
                    sx={{
                      ...(originData?.address !== updateData?.address
                        ? {
                            textDecorationLine: 'line-through'
                          }
                        : null),
                      textIndent: '20px',
                      textAlign: 'left'
                    }}
                  >
                    {originData?.address || '_'}
                  </Typography>
                  {originData?.address !== updateData?.address && <Typography>{updateData?.address || '_'}</Typography>}
                </Grid>
              </Grid>
              <Grid item container justifyContent={'center'} gap={3}>
                <Grid item>
                  <Button onClick={handleBack}>Quay lại</Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    color='success'
                    onClick={() => {
                      handleClickConfirmButton(true)
                    }}
                  >
                    Xác nhận
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    color='warning'
                    onClick={() => {
                      handleClickConfirmButton(false)
                    }}
                  >
                    Từ chối{' '}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            <Box
              display={'flex'}
              flexDirection={'column'}
              height={'500px'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <GiftLoading />
            </Box>
          )}
        </Stack>
        {isSubmitting && <BackDrop open={true} />}
      </Paper>
      <DialogCustom
        content={
          isAccept ? (
            <Typography fontWeight={500}>
              Bạn có chắc chắn muốn chấp nhận yêu cầu thay đổi thông tin này không
            </Typography>
          ) : (
            <Grid container direction={'column'} gap={3}>
              <Grid item>
                <Typography fontWeight={500}>
                  Bạn có chắc chắn muốn từ chối yêu cầu thay đổi thông tin này không?Nếu đồng ý hãy nhập lý do.
                </Typography>
              </Grid>
              <Grid item>
                <TextField
                  value={reason}
                  fullWidth
                  multiline
                  minRows={3}
                  maxRows={10}
                  label='Lý do'
                  onChange={e => {
                    setReason(e.target.value)
                  }}
                  error={isCheck && reason?.length === 0}
                  helperText={isCheck && reason?.length === 0 ? 'Hãy nhập lý do từ chối' : ''}
                  onBlur={() => {
                    setIsCheck(true)
                  }}
                />
              </Grid>
            </Grid>
          )
        }
        handleClose={handleCloseConfirmDialog}
        open={dialogConfirmOpen}
        title={'Xác nhận yêu cầu'}
        actionDialog={
          <>
            <Button onClick={handleCloseConfirmDialog} color='secondary'>
              Không
            </Button>
            <Button onClick={handleConfirmUpdate} variant='contained' disabled={isCheck ? reason?.length === 0 : false}>
              Đồng ý
            </Button>
          </>
        }
      />
    </Fragment>
  )
}
ConfirmUpdateCharity.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Xác nhận cập nhật'>{page}</UserLayout>
)