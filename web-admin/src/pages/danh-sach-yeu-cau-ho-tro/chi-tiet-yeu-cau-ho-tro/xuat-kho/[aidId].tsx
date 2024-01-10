'use client'

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { KEY } from 'src/common/Keys'
import UserLayout from 'src/layouts/UserLayout'
import { customColor } from 'src/@core/theme/color'
import { AidRequestDetailModel } from 'src/models/AidRequest'
import { AidRequestAPI } from 'src/api-client/AidRequest'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import ChooseItemToExport, { ItemExportForAidRequestSelfShipping } from './ChooseItemToExport'
import moment from 'moment'
import { ItemAPI } from 'src/api-client/Item'
import { ScheduledTime } from 'src/models/DonatedRequest'
import { ItemAvaliableInStockModel } from 'src/models/Item'
import { MapItemAvaiableStock } from 'src/pages/van-chuyen/tao-moi/ChooseItemDelivery'
import InputQuantityExportedItems from './InputQuantityExportedItems'
import { toast } from 'react-toastify'

// const validationSchema = Yup.object({
//   note: Yup.string().max(500, 'Ghi chú tối đa 500 kí tự!'),
//   listItemSelected: Yup.array().of(
//     Yup.object().shape({
//       quantity: Yup.number().min(1, 'Số lượng ít nhất là 1').required('Số lượng bắt buộc phải có'),
//       note: Yup.string().max(500, 'Ghi chú tối đa 500 kí tự!')
//     })
//   )
// })

const DirectDonateAtStock = () => {
  const router = useRouter()
  const { aidId } = router.query
  const [aidRequestDetail, setAidRequestDetail] = useState<AidRequestDetailModel>()
  const [loading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmiting] = useState(false)
  const [itemSelected, setItemSelected] = useState<ItemExportForAidRequestSelfShipping>({})
  const [stockAvailable, setStockAvaiable] = useState<MapItemAvaiableStock>(new Map())
  const [isFindingStock, setIsFindingStock] = useState<boolean>(false)
  const [note, setNote] = useState<string>('')

  useEffect(() => {
    const fetchDataAidRequest = async () => {
      if (!aidId) return

      try {
        const response = await AidRequestAPI.getById(aidId as string)
        const dataDetail = new CommonRepsonseModel<AidRequestDetailModel>(response).data
        setAidRequestDetail(dataDetail)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchData = async () => {
      try {
        setIsLoading(true)
        await fetchDataAidRequest()
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    if (aidId) {
      fetchData()
    }
  }, [aidId])

  useEffect(() => {
    const fetchData = (listItemId: string[]) => {
      fetchDataStock(listItemId)
    }

    const listItem = aidRequestDetail?.aidItemResponses?.map(item => item.itemResponse?.id || '')

    if (listItem) fetchData(listItem)
  }, [aidRequestDetail])

  const handleSubmit = async () => {
    try {
      setIsSubmiting(true)
      if (Object.entries(itemSelected).length === 0) {
        toast.error('Hãy chọn ít nhất 1 vật phẩm.')
      }

      let isError = false

      const value = Object.entries(itemSelected).map(([, value]) => {
        if (value.quantity > (value.itemInfo.quantity || 0)) {
          isError = true
        }

        return {
          itemId: value.itemId,
          quantity: value.quantity,
          note: value.note
        }
      })

      if (isError) {
        toast.error('Số lượng chọn phải ít hơn số lượng khả dụng trong kho.')

        return
      }

      const response = await AidRequestAPI.exportStockForSelfShipping(value, aidId as string, note)

      toast.success(new CommonRepsonseModel<any>(response).message)

      router.push('/danh-sach-yeu-cau-ho-tro/chi-tiet-yeu-cau-ho-tro/' + aidId)
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmiting(false)
    }
  }

  const fetchDataStock = async (listItemId: string[]) => {
    try {
      setIsFindingStock(true)

      const response = await ItemAPI.getListStockAvaiableByListItemId(listItemId, [
        new ScheduledTime({
          day: moment().format('YYYY-MM-DD'),
          startTime: '00:01',
          endTime: '23:59'
        })
      ])

      const commonResponseModel = new CommonRepsonseModel<ItemAvaliableInStockModel[]>(response)

      const mapFromList: MapItemAvaiableStock = new Map(stockAvailable)

      for (const obj of commonResponseModel.data || []) {
        mapFromList.set(obj.item?.id || '', obj)
      }

      console.log({ mapFromList })

      setStockAvaiable(mapFromList)
    } catch (error) {
      console.log(error)
    } finally {
      setIsFindingStock(false)
    }
  }

  return (
    <Box sx={{ p: 5 }}>
      <Card
        sx={{
          marginBottom: 5
        }}
      >
        <CardHeader
          title={
            <Typography
              variant='h6'
              fontWeight={700}
              sx={{
                color: () => customColor.secondary
              }}
            >
              Thông tin tổ chức
            </Typography>
          }
        />
        <CardContent>
          <Box display={'flex'} gap={3}>
            <Avatar
              src={aidRequestDetail?.charityUnitResponse?.image}
              sx={{
                height: '200px',
                width: '200px',
                border: '1px solid',
                borderColor: customColor.primary
              }}
            />
            <Box display={'flex'} flexDirection={'column'} mt={3}>
              <Typography fontWeight={600} variant='h6'>
                {aidRequestDetail?.charityUnitResponse?.name}
                <Typography component={'span'} variant='body2'>
                  {` - Thuộc ${aidRequestDetail?.charityUnitResponse?.charityName}`}
                </Typography>
              </Typography>
              <Box display={'flex'} gap={2}>
                <Typography fontWeight={600}>Số điện thoại: </Typography>
                <Typography>{aidRequestDetail?.charityUnitResponse?.phone || '_'}</Typography>
              </Box>
              <Box display={'flex'} gap={2}>
                <Typography fontWeight={600}>Email: </Typography>
                <Typography>{aidRequestDetail?.charityUnitResponse?.email || '_'}</Typography>
              </Box>
              <Box display={'flex'} gap={2}>
                <Typography fontWeight={600}>Địa chỉ: </Typography>
                <Typography>{aidRequestDetail?.charityUnitResponse?.address || '_'}</Typography>
              </Box>
              <Box display={'flex'} gap={2} width={'100%'}>
                <Typography fontWeight={600}>Hình ảnh: </Typography>
                <CardMedia
                  component={'image'}
                  image={aidRequestDetail?.charityUnitResponse?.image}
                  sx={{
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: customColor.primary,
                    height: '80px',
                    width: 'auto',
                    minWidth: '150px'
                  }}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <ChooseItemToExport
        items={aidRequestDetail?.aidItemResponses || []}
        isLoading={false}
        itemSelected={itemSelected}
        setItemSelected={setItemSelected}
        isFindingStock={isFindingStock}
        stockAvailable={stockAvailable}
      />
      <InputQuantityExportedItems
        items={itemSelected}
        setItemSelected={setItemSelected}
      />
      <Card
        sx={{
          mt: 5
        }}
      >
        <CardHeader
          title={
            <Typography
              variant='h6'
              fontWeight={700}
              sx={{
                color: () => customColor.secondary
              }}
            >
              Ghi chú
            </Typography>
          }
        />
        <CardContent>
          <TextField
            label='Ghi chú'
            multiline
            minRows={3}
            maxRows={6}
            fullWidth
            value={note}
            onChange={e => {
              if (e.target.value.length >= 500) return
              setNote(e.target.value)
            }}
          />
        </CardContent>
      </Card>

      <Stack direction={'row'} justifyContent={'space-between'} spacing={5} sx={{ mb: 10, mt: 15 }}>
        <Button
          fullWidth
          type='submit'
          color='info'
          variant='contained'
          disabled={loading || isSubmitting}
          onClick={handleSubmit}
        >
          Nộp biểu mẫu
        </Button>
      </Stack>
      <Link
        style={{
          textDecoration: 'none'
        }}
        href='/quan-ly-kho/chi-nhanh'
      >
        Trở về danh sách vật phẩm trong kho
      </Link>
    </Box>
  )
}

export default DirectDonateAtStock

DirectDonateAtStock.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN]
}

DirectDonateAtStock.getLayout = (children: ReactNode) => {
  return <UserLayout pageTile='Xuất kho cho tổ chức từ thiện'>{children}</UserLayout>
}
