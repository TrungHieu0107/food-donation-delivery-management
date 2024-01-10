'use client'

import {
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Table,
  TableRow,
  TableCell,
  TableHead,
  Box,
  Chip
} from '@mui/material'
import { useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import { Item } from 'src/models/Item'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { KEY } from 'src/common/Keys'
import { ItemAPI } from 'src/api-client/Item'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'

const ItemDetailPage = () => {
  const [data, setData] = useState<Item>()
  const [loading, setIsLoading] = useState(true)
  const router = useRouter()
  const query = router.query

  useEffect(() => {
    const fetchData = async () => {
      if (query.id && typeof query.id === 'string') {
        await ItemAPI.getItemDetail(query.id as string)
          .then(itemResponse => {
            const dataResponse = new CommonRepsonseModel<Item>(itemResponse)

            setData(dataResponse.data)
            setIsLoading(false)
          })
          .catch(err => {
            setIsLoading(false)
            console.log(err)
          })
      } else {
        router.push('/404')
      }
    }

    fetchData()
  }, [query, router])

  return (
    <Container fixed>
      <Card>
        <CardHeader
          title={
            <Typography variant='h5' sx={{ mb: 10, textAlign: 'center' }}>
              ꧁༺CHI TIẾT VẬT PHẨM༻꧂
            </Typography>
          }
        ></CardHeader>
        <CardContent>
          <Grid container spacing={2} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Grid
              item
              sx={{
                width: '300px',
                height: '300px',
                backgroundImage: `url(${data?.image})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}
            ></Grid>
            <Grid item container width={'100% '} ml={5} gap={2}>
              <Grid item md={3}>
                <Typography variant='body1' fontWeight={600}>
                  Tên vật phẩm
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant='body1' fontWeight={600} ml={2}>
                  {data?.name}
                </Typography>
              </Grid>
              <Grid item container>
                <Grid item md={3}>
                  <Typography variant='body1' fontWeight={600}>
                    Loại vật phẩm
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body1' ml={2}>
                    {data?.itemCategoryResponse?.name}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container>
                <Grid item md={3}>
                  <Typography variant='body1' fontWeight={600}>
                    Đơn vị
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body1' ml={2}>
                    {data?.unit?.name}({data?.unit?.symbol})
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container>
                <Grid item md={3}>
                  <Typography variant='body1' fontWeight={600}>
                    Ngày tạo
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body1' ml={2}>
                    {formateDateDDMMYYYYHHMM(data?.createdDate || '')}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container>
                <Grid item md={3}>
                  <Typography variant='body1' fontWeight={600}>
                    Trạng thái
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body1' ml={2}>
                    {data?.status === 'ACTIVE' ? 'Sử dụng' : 'Không sử dụng'}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container>
                <Grid item md={3}>
                  <Typography variant='body1' fontWeight={600}>
                    Ghi chú
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant='body1' ml={2}>
                    {data?.note}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container>
                <Grid item md={3}>
                  <Typography variant='body1' fontWeight={600}>
                    Các thuộc tính
                  </Typography>
                </Grid>
                <Grid item display={'flex'} flexDirection={'column'} gap={2} ml={2}>
                  {data?.attributes?.map((item, index) => {
                    const name = item.name
                    const value = item.attributeValues?.map(v => v.value).join(', ')

                    return (
                      <Typography key={index} variant='body1'>
                        {`${name}: (${value})`}
                      </Typography>
                    )
                  })}
                </Grid>
              </Grid>
              <Grid item container>
                <Grid item md={3}>
                  <Typography variant='body1' fontWeight={600}>
                    Các mẫu có sẵn
                  </Typography>
                </Grid>
                <Grid item ml={2}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STT</TableCell>
                        <TableCell>Hình ảnh</TableCell>
                        {data?.attributes?.map((item, index) => (
                          <TableCell key={index}>{item.name}</TableCell>
                        ))}
                        <TableCell>Trạng thái</TableCell>
                        <TableCell>Ngày bảo quãn (dự doán)</TableCell>
                        <TableCell>Số lượng vận chuyển tối đa</TableCell>
                        <TableCell>Ghi chú</TableCell>
                      </TableRow>
                    </TableHead>
                    {data?.itemTemplateResponses?.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell
                          sx={{
                            width: '200px'
                          }}
                        >
                          <Box
                            sx={{
                              backgroundImage: `url(${item.image})`,
                              minHeight: '100px',
                              maxHeight: '150px',
                              width: '100%',
                              backgroundSize: 'contain',
                              backgroundRepeat: 'no-repeat'
                            }}
                          ></Box>
                        </TableCell>
                        {data.attributes?.map((attribute, i) => {
                          const value = item.attributes
                            ?.filter(attributeValue => attributeValue.itemTemplateAttributeId === attribute.id)
                            .at(0)

                          return <TableCell key={i}>{value?.attributeValue?.value ?? '_'}</TableCell>
                        })}
                        <TableCell>
                          {item.status === 'ACTIVE' ? (
                            <Chip label={'Sử dụng'} color='success'></Chip>
                          ) : (
                            <Chip label={'Không sử dụng'} color='info'></Chip>
                          )}
                        </TableCell>
                        <TableCell>{item.estimatedExpirationDays ?? '_'}</TableCell>
                        <TableCell>{item.maximumTransportVolume ?? '_'}</TableCell>
                        <TableCell>{item.note ?? '_'}</TableCell>
                      </TableRow>
                    ))}
                  </Table>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3'
          }}
        >
          <Button
            onClick={() => {
              router.back()
            }}
          >
            Quay lại
          </Button>
          <Button
            variant='contained'
            color='info'
            onClick={() => {
              router.push(`/vat-pham/chinh-sua/${query.id as string}`)
            }}
          >
            Chỉnh sửa
          </Button>
        </CardActions>
      </Card>
      <BackDrop open={loading} />
    </Container>
  )
}
ItemDetailPage.auth = [KEY.ROLE.SYSTEM_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
export default ItemDetailPage
