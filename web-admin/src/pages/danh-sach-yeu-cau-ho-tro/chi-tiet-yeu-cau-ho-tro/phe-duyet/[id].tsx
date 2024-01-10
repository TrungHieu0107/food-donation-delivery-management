import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { CommonRepsonseModel, TransferItemListObject } from 'src/models/common/CommonResponseModel'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography
} from '@mui/material'
import { KEY } from 'src/common/Keys'
import { toast } from 'react-toastify'
import TransferSelectedDonatedItem  from 'src/layouts/components/transfer-list/TransferSelectedDonatedItem'
import { AidItemResponseModel, AidRequestDetailModel } from 'src/models/AidRequest'
import { AidRequestAPI } from 'src/api-client/AidRequest'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import DisplayScheduledTime from 'src/@core/layouts/scheduled-time/DisplayScheduledTime'
import UserLayout from 'src/layouts/UserLayout'
import { customColor } from 'src/@core/theme/color'
import DialogInputReason from 'src/layouts/components/dialog/DialogInputReason'

const DevideHeader = (props: { title: string }) => {
  return (
    <Grid container flexWrap={'nowrap'} alignItems={'center'} spacing={2}>
      <Grid item>
        <Typography
          whiteSpace={'nowrap'}
          fontSize={17}
          fontWeight={600}
          variant='h6'
          sx={{
            color: theme => theme.palette.secondary[theme.palette.mode]
          }}
        >
          {props.title}
        </Typography>
      </Grid>
      <Grid item lg md sm xs>
        <Divider
          sx={{
            width: '100%',
            borderColor: 'rgb(58 53 65 / 10%) !important'
          }}
        />
      </Grid>
    </Grid>
  )
}

export default function DonatedReuqestDetialPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [data, setData] = useState<AidRequestDetailModel>()
  const [donatedItemLeft, setAidItemLeft] = React.useState<TransferItemListObject[]>([])
  const [aidItemRight, setAidItemRight] = React.useState<TransferItemListObject[]>([])

  const [inputReason, setInputReason] = useState<boolean>(false)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchData = () => {
      AidRequestAPI.getById(id as string)
        .then(data => {
          const dataResponse = new CommonRepsonseModel<AidRequestDetailModel>(data)
          setData(dataResponse.data)
          setAidItemLeft(dataResponse.data?.aidItemResponses?.map(item => newTransferItemListObject(item)) ?? [])
        })
        .catch(error => {
          const x: any = (error as AxiosError).response?.data
          const dataResponse = new CommonRepsonseModel<any>(x)
          if (dataResponse.status === 403) {
            router.push('/401')
          }
          console.log(error)
        })
    }

    setIsLoading(true)
    try {
      if (!id) return

      fetchData()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [id, router])

  const newTransferItemListObject = (value: AidItemResponseModel) => {
    return new TransferItemListObject({
      id: value.id,
      attributes: value.itemResponse?.attributeValues,
      image: value.itemResponse?.image,
      name: value.itemResponse?.name,
      quantity: value.quantity,
      unit: value.itemResponse?.unit
    })
  }

  const handleChangeItemSelected = (value: TransferItemListObject[], isAdding: boolean) => {
    if (isAdding) {
      const newItemSelected: TransferItemListObject[] = aidItemRight ?? []
      const newItemUnSelected: TransferItemListObject[] = []
      donatedItemLeft.map(item => {
        const itemSelected = value.filter(i => item.id === i.id).at(0)
        if (itemSelected) {
          newItemSelected.push(item)
        } else {
          newItemUnSelected.push(item)
        }
      })

      setAidItemRight([...newItemSelected])
      setAidItemLeft([...newItemUnSelected])
    } else {
      const newItemSelected: TransferItemListObject[] = []
      const newItemUnSelected: TransferItemListObject[] = donatedItemLeft

      aidItemRight.map(item => {
        const itemSelected = value.filter(i => item.id === i.id).at(0)
        if (itemSelected) {
          newItemUnSelected.push(item)
        } else {
          newItemSelected.push(item)
        }
      })
      setAidItemRight([...newItemSelected])
      setAidItemLeft([...newItemUnSelected])
    }
  }

  const handleSubmit = async (reason?: string) => {
    try {
      setIsSubmitting(true)
      const payload = {
        id: data?.id ?? '',
        aidItemIds: aidItemRight.map(item => item.id ?? '') ?? []
      }
      if (payload.aidItemIds.length === 0) {
        toast.warning('Phải chọn ít nhất 1 vật phẩm')

        return
      }

      if (aidItemRight.length !== data?.aidItemResponses?.length && !reason) {
        setInputReason(true)

        return
      }

      const response = await AidRequestAPI.acceptAidRequest(
        !!reason ? { ...payload, rejectingReason: reason } : payload
      )

      const commonRepsonse = new CommonRepsonseModel<any>(response)
      toast.success(commonRepsonse.message)
      router.push('/danh-sach-yeu-cau-ho-tro/chi-tiet-yeu-cau-ho-tro/' + data?.id ?? '')

      return
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={3}>
      {!isLoading && data ? (
        <Stack direction={'column'} spacing={2}>
          <Card>
            <CardHeader title={<DevideHeader title='Thông tin tổ chức cần hỗ trợ' />} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item sm={'auto'}>
                  <Avatar
                    src={data?.charityUnitResponse?.charityLogo ?? ''}
                    variant='circular'
                    sx={{
                      height: '160px',
                      width: '160px',
                      border: '1px solid #d1d1d1'
                    }}
                  ></Avatar>
                </Grid>
                <Grid item sm md xs justifyContent={'center'} flexDirection={'column'} container spacing={1}>
                  <Grid item>
                    <Typography variant='h6' textAlign={'left'} fontWeight={600}>
                      {`${data?.charityUnitResponse?.charityName} - ${data?.charityUnitResponse?.name}`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography textAlign={'left'} pl={5}></Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      textAlign={'left'}
                      pl={5}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Typography
                        fontWeight={600}
                        sx={{
                          color: customColor.secondary,
                          paddingRight: '10px'
                        }}
                      >
                        SĐT:
                      </Typography>
                      {`${data?.charityUnitResponse?.phone || ''}`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      textAlign={'left'}
                      pl={5}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Typography
                        fontWeight={600}
                        sx={{
                          color: customColor.secondary,
                          paddingRight: '10px'
                        }}
                      >
                        Email:{' '}
                      </Typography>
                      {`${data?.charityUnitResponse?.email || ''}`}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      textAlign={'left'}
                      pl={5}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Typography
                        fontWeight={600}
                        sx={{
                          color: customColor.secondary,
                          paddingRight: '10px'
                        }}
                      >
                        Địa chỉ:
                      </Typography>
                      {`${data?.charityUnitResponse?.address}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title={<DevideHeader title='Thời gian có thể nhận' />} />
            <CardContent>
              {data.scheduledTimes && data.scheduledTimes.length > 0 && (
                <DisplayScheduledTime data={data.scheduledTimes} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={<DevideHeader title='Vật phẩm cần hỗ trợ' />} />
            <CardContent>
              <TransferSelectedDonatedItem
                donatedItemLeft={donatedItemLeft}
                donatedItemRight={aidItemRight}
                handleChangeItemSelected={handleChangeItemSelected}
                donatedItems={data?.aidItemResponses?.map(item => newTransferItemListObject(item)) ?? []}
              />
            </CardContent>
          </Card>

          {/* Button */}
          <Grid container justifyContent={'center'} spacing={3}>
            <Grid item>
              <Button
                color='info'
                onClick={() => {
                  router.push('/danh-sach-yeu-cau-ho-tro')
                }}
              >
                Quay lại
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant='contained'
                color='info'
                onClick={() => {
                  handleSubmit()
                }}
              >
                Xác nhận
              </Button>
            </Grid>
          </Grid>
        </Stack>
      ) : (
        <Box display={'flex'} height={450} justifyContent={'center'} alignItems={'center'}>
          <CircularProgress color='info' />
        </Box>
      )}

      <DialogInputReason
        open={inputReason}
        handleClose={() => {
          setInputReason(false)
        }}
        donatedItems={donatedItemLeft}
        handleSubmit={handleSubmit}
      />
      {isSubmitting || (isLoading && <BackDrop open={true} />)}
    </Box>
  )
}

DonatedReuqestDetialPage.auth = [KEY.ROLE.BRANCH_ADMIN]
DonatedReuqestDetialPage.getLayout = (children: React.ReactNode) => {
  return (
    <UserLayout
      pageTile='
  Duyệt yêu cầu hỗ trợ'
    >
      {children}
    </UserLayout>
  )
}
