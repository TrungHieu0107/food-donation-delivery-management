import { Box, Grid, IconButton, Stack, Typography } from '@mui/material'
import React from 'react'
import {
  DeliveryRequestDetailModel,
  DeliveryRequestModelForList,
  FilterDeliveryRequestList
} from 'src/models/DeliveryRequest'
import { PaginationModel } from 'src/models/common/CommonResponseModel'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight'
import DeliveryTag from 'src/layouts/components/delivery/DeliveryTag'
import dynamic from 'next/dynamic'
import DeliveryItemTagLoading from 'src/layouts/components/delivery/DeliveryTagLoading'

const DeliveryRequestDetail = dynamic(() => import('./DeliveryRequestDetail'), { ssr: false })

export interface IListDeliveryRequestTagProps {
  isFetching: boolean
  toggleFetching: (value: boolean) => void
  data: DeliveryRequestModelForList[]
  pagination: PaginationModel
  filterObject: FilterDeliveryRequestList
  handleChangeFilterObject: (value: FilterDeliveryRequestList) => void
  currentSelected: DeliveryRequestModelForList | undefined
  setCurrentSelected: (value: DeliveryRequestModelForList) => void
  currentSelectedDetail: DeliveryRequestDetailModel | undefined
  fetchDetail: () => void
  fetchData: () => void
}

export default function ListDeliveryRequestTag(props: IListDeliveryRequestTagProps) {
  const handlePageChange = (newPage: number) => {
    props.handleChangeFilterObject({
      ...props.filterObject,
      page: newPage
    })
  }

  const currentPage = props.pagination?.currentPage || 0
  const total = props.pagination?.total || 0
  const pageSize = props.pagination?.pageSize || 0

  return (
    <Grid container>
      <Grid item xl={4} lg={4} md={12} sm={12} xs={12} sx={{ position: 'relative', pr: '25px' }}>
        <Box display='flex' gap={3} justifyContent='center' alignItems='center'>
          <IconButton
            disabled={currentPage === 1 || total === 0}
            color='secondary'
            size='small'
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ArrowCircleLeftIcon fontSize='large' />
          </IconButton>

          <Typography variant='body1' mb='10px' sx={{ verticalAlign: 'middle', alignItems: 'center', display: 'flex' }}>
            {total === 0
              ? 'Không tìm thấy'
              : `Kết quả tìm kiếm: ${(currentPage - 1) * pageSize + 1}-${Math.min(
                  currentPage * pageSize,
                  total
                )}/${total}`}
          </Typography>

          <IconButton
            disabled={currentPage * pageSize >= total}
            color='secondary'
            size='small'
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ArrowCircleRightIcon fontSize='large' />
          </IconButton>
        </Box>

        <Stack alignItems='center' gap={2} flexDirection='row'>
          <Grid container spacing={3} flexDirection='column' pr='10px'>
            {props.isFetching
              ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => (
                  <Grid key={item} item width='100%'>
                    <DeliveryItemTagLoading />
                  </Grid>
                ))
              : props.data?.map(item => (
                  <Grid item key={item.id}>
                    <DeliveryTag
                      data={item}
                      isActive={item.id === props.currentSelected?.id}
                      handleSelected={props.setCurrentSelected}
                    />
                  </Grid>
                ))}
          </Grid>
        </Stack>
      </Grid>

      <Grid item xl lg md={12} sm={12} xs={12} pt='37px'>
        <DeliveryRequestDetail
          data={props.currentSelectedDetail}
          isFetchingDetail={props.isFetching}
          fetchDetail={props.fetchDetail}
          fetchData={props.fetchData}
        />
      </Grid>
    </Grid>
  )
}
