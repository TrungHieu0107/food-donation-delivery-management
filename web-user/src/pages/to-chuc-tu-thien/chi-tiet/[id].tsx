import { Avatar, Button, Chip, Divider, Grid, Paper, Skeleton, Stack, Typography, styled } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'
import ListViewCharityUnit from './ListViewCharityUnit'

export const CharityStatus: {
  [key: string]: ReactNode
} = {
  ACTIVE: (
    <Chip
      label={
        <Typography
          fontWeight={550}
          sx={{
            color: theme => theme.palette.primary.contrastText
          }}
        >
          Đang hoạt động
        </Typography>
      }
      color='primary'
    />
  ),
  INACTIVE: (
    <Chip
      label={
        <Typography
          fontWeight={550}
          sx={{
            color: theme => theme.palette.error.contrastText
          }}
        >
          Ngừng hoạt động
        </Typography>
      }
      color='error'
    />
  ),
  UNVERIFIED: (
    <Chip
      label={
        <Typography
          fontWeight={550}
          sx={{
            color: theme => theme.palette.error.contrastText
          }}
        >
          Chưa xác thực
        </Typography>
      }
      color='warning'
    />
  ),
  UNVERIFIED_UPDATE: (
    <Chip
      label={
        <Typography
          fontWeight={550}
          sx={{
            color: theme => theme.palette.error.contrastText
          }}
        >
          Chờ xác thực đổi mới
        </Typography>
      }
      color='warning'
    />
  ),
  '': <Typography color={'error'}>Không có dữ liệu</Typography>
}
export const Page = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: 20,
  minHeight: '500px'
}))
export const DataLoading = (props: any) => {
  const { isLoading, children, variant, height, width } = props

  return isLoading ? (
    <>{children}</>
  ) : (
    <Skeleton
      variant={variant ?? 'rectangular'}
      sx={{
        height: height ?? 'auto',
        width: width ?? '100%'
      }}
    />
  )
}

export default function CharityDetialPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [charity, setCharity] = useState<any>([])

  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    setIsLoading(true)
    if (id) {
      fetchDataCharity()
    }
  }, [id])

  useEffect(() => {
    console.log(charity);
    
  }, [charity])

  const fetchDataCharity = async () => {
    try {
      if (id) {
        const response = await axiosClient.get(`/charities/${id}`)
       
        setCharity(response.data || [])
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Page>
      <Typography variant='h5' fontWeight={800}>
        Thông tin chi tiết tổ chức liên kết
      </Typography>
      <Grid
        container
        direction={'column'}
        sx={{
          marginTop: '20px'
        }}
      >
        <Grid item container direction={'row'} spacing={5}>
          <Grid
            item
            sx={{
              padding: 0
            }}
          >
            <DataLoading isLoading={!isLoading && !!charity} variant='circular' height={200} width={200}>
              <Avatar
                src={charity?.logo}
                sx={{
                  height: 200,
                  width: 200
                }}
              />
            </DataLoading>
          </Grid>
          <Grid item xl lg md sm xs display={'flex'} gap={2} flexDirection={'column'} justifyContent={'space-between'}>
            <DataLoading isLoading={!isLoading && !!charity} variant='circular'>
              <Grid container spacing={3} sx={{mt: 3}}>
                <Grid item>
                  <Typography variant='h6' fontWeight={550} textAlign={'left'} ml={5}>
                    {charity?.name || '_'}
                  </Typography>
                </Grid>
                <Grid item>{CharityStatus[charity?.status ?? '']}</Grid>
              </Grid>
            </DataLoading>
            <DataLoading isLoading={!isLoading && !!charity} variant='circular'>
              <Grid container>
                <Typography fontWeight={550} textAlign={'left'} ml={5}>
                  {`Email : `}
                </Typography>
                <Typography textAlign={'left'}>
                  {charity?.email ?? '_'}
                </Typography>
              </Grid>
            </DataLoading>
            <Stack direction='row' divider={<Divider orientation='vertical' flexItem />} spacing={2}>
              <Grid container direction={'column'}>
                <Typography fontWeight={550}>Số bài viết</Typography>
                <Typography fontWeight={550}>{charity?.numberOfPost}</Typography>
              </Grid>
              <Grid container direction={'column'}>
                <Typography fontWeight={550}>Số đơn vị</Typography>
                <Typography fontWeight={550}>{charity?.numberOfCharityUnit}</Typography>
              </Grid>
            </Stack>
          </Grid>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <Typography textAlign={'left'} sx={{
              textIndent: 20
            }}> {charity?.description ?? '_'}</Typography>
          </Grid>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <Typography variant='h6' fontWeight={550} textAlign={'center'} sx={{mb: 3}}>
              Danh sách các chi nhánh
            </Typography>
            {charity?.id && <ListViewCharityUnit id={charity.id}/> }
          </Grid>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12} container justifyContent={'center'} spacing={3}>
            <Grid item lg={2} md={2} sm={3}>
              <Button
                variant='outlined'
                onClick={() => {
                  router.back()
                }}
                color='secondary'
                fullWidth
              >
                Quay lại
              </Button>
            </Grid>                 
          </Grid>
        </Grid>
      </Grid>
    </Page>
  )
}
