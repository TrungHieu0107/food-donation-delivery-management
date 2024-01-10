import { Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import UserLayout from 'src/layouts/UserLayout'
import FilterScheduleRoute from './FilterScheduleRoute'
import { ObjectFilterScheduledRoute, ScheduleRoute } from 'src/models/DeliveryRequest'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import TableDataScheduledRoute from './TableDataScheduleRoute'
import { CommonRepsonseModel, PaginationModel } from '../../../models/common/CommonResponseModel'
import { DeliveryRequestAPI } from 'src/api-client/DeliveryRequest'

export default function ScheduleRoutePage() {
  const [filterObject, setFilterObject] = useState<ObjectFilterScheduledRoute>(
    new ObjectFilterScheduledRoute({
      stockUpdatedHistoryType: 0
    })
  )
  const [data, setData] = useState<ScheduleRoute[]>([])
  const [pagination, setPaginationModel] = useState<PaginationModel>(new PaginationModel())
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true)
  const handleChangeFilter = (value: ObjectFilterScheduledRoute | undefined) => {
    setFilterObject(
      value ||
        new ObjectFilterScheduledRoute({
          stockUpdatedHistoryType: 0
        })
    )
  }

  useEffect(() => {
    fetchData()
  }, [filterObject])

  const fetchData = async () => {
    try {
      setIsFetchingData(true)
      const response = await DeliveryRequestAPI.getScheduledRoute(filterObject)
      const commonResponse = new CommonRepsonseModel<ScheduleRoute[]>(response)
      setPaginationModel(commonResponse.pagination)
      setData(commonResponse.data || [])
    } catch (error) {
      console.log(error)
    } finally {
      setIsFetchingData(false)
    }
  }

  return (
    <Grid
      container
      sx={{
        padding: '10px'
      }}
    >
      <Grid item xl={3} lg={3} md={12} sm={12} xs={12}>
        <Stack
          flexDirection={'column'}
          spacing={2}
          divider={<Divider />}
          sx={{
            padding: '10px'
          }}
        >
          <Typography
            component={'div'}
            sx={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FilterAltOutlinedIcon />
            <Typography component={'span'} variant='h6' fontWeight={600}>
              Bộ lọc
            </Typography>
          </Typography>
          <FilterScheduleRoute filterObject={filterObject} handleChangeFilter={handleChangeFilter} />
        </Stack>
      </Grid>
      <Grid item xl={9} lg={9} md={12} sm={12} xs={12}>
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: '10px'
          }}
        >
          <Stack divider={<Divider />}>
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center'
              }}
              component={'div'}
            >
              <FilterAltOutlinedIcon />
              <Typography component={'span'} variant='h6' fontWeight={600}>
                {`Kết quả (${pagination.total})`}
              </Typography>
            </Typography>
            <TableDataScheduledRoute
              isLoading={isFetchingData}
              data={data}
              filterObject={filterObject}
              handleChangeFilter={handleChangeFilter}
              pagination={pagination}
            />
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  )
}

ScheduleRoutePage.getLayout = (page: ReactNode) => <UserLayout pageTile='Danh sách lộ trình 🚑'>{page}</UserLayout>
