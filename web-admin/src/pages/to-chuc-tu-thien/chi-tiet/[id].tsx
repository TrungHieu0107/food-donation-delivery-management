'use client'

import { Avatar, Button, Divider, Grid, Skeleton, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { CharityAPI } from 'src/api-client/Charity'
import { CharityModel } from 'src/models/Charity'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import { Page } from 'src/pages/quyen-gop'
import TableCharityUnit from './TableCharityUnit'
import ConfirmCharityDialog from './ConfirmCharityDialog'
import { CharityStatus } from '../TableListCharities'
import UserLayout from 'src/layouts/UserLayout'
import useSession from 'src/@core/hooks/useSession'

interface DataLoadingProps {
  isLoading: boolean
  children: ReactNode
  variant?: 'rectangular' | 'circular'
  height?: number
  width?: number
}

export const DataLoading = (props: DataLoadingProps) => {
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
  const [charity, setCharity] = useState<CharityModel>()
  const {session}: any = useSession()
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
        const data = await CharityAPI.getDetail(id as string)
        const commonResponse = new CommonRepsonseModel<CharityModel>(data)
        setCharity(commonResponse.data)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Page>
      {/* <Typography variant='h5' fontWeight={800}>
        Thông tin chi tiết
      </Typography> */}
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
              <Grid container spacing={3}>
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
                <Typography fontWeight={550} textAlign={'left'} ml={15}>
                  {`Email : `}
                </Typography>
                <Typography textAlign={'left'} pl={2}>
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
            <Typography variant='h6' fontWeight={550} textAlign={'left'}>
              Danh sách các chi nhánh
            </Typography>
            {!!id && <TableCharityUnit id={id as string} />}
          </Grid>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12} container justifyContent={'center'} spacing={3}>
            <Grid item lg={2} md={2} sm={3}>
              <Button
                variant='text'
                onClick={() => {
                  router.push('/to-chuc-tu-thien')
                }}
                color='secondary'
                fullWidth
              >
                Quay lại
              </Button>
            </Grid>

            {(charity?.status === 'UNVERIFIED' && session?.user.role === "SYSTEM_ADMIN") && (
              <>
                <ConfirmCharityDialog id={id as string} />
              </>
            )}
            {/* {charity?.status === 'ACTIVE' && (
              <Grid item lg={2} md={2} sm={3}>
                <Button
                  variant='contained'
                  onClick={() => {
                    router.push('/to-chuc-tu-thien')
                  }}
                  color='warning'
                  fullWidth
                >
                  Chặn
                </Button>
              </Grid>
            )}
            {charity?.status === 'INACTIVE' && (
              <Grid item lg={2} md={2} sm={3}>
                <Button
                  variant='contained'
                  onClick={() => {
                    router.push('/to-chuc-tu-thien')
                  }}
                  color='warning'
                  fullWidth
                >
                  Bỏ chặn
                </Button>
              </Grid>
            )} */}
          </Grid>
        </Grid>
      </Grid>
    </Page>
  )
}
CharityDetialPage.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Thông tin chi tiết tổ chức từ thiện'>{page}</UserLayout>
)