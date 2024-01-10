'use client'

import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined'
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import moment from 'moment'
import useSession from 'src/@core/hooks/useSession'
import axiosClient from 'src/api-client/ApiClient'
import { KEY } from 'src/common/Keys'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import UserLayout from 'src/layouts/UserLayout'

interface filterActivity {
  startDate: string
  endDate: string
  status: number | null
  timeFrame: number | null
}
interface filterDelivery {
  startDate: string
  endDate: string
}
const Dashboard = () => {
  const { session }: any = useSession()
  console.log('session: ', session)
  const [dataAidRequestStatistic, setDataAidRequestStatistic] = useState<any>({})
  const [dataActivityStatistic, setDataActivityStatistic] = useState<any>({})
  const [dataDeliveryStatistic, setDataDeliveryStatistic] = useState<any>({})
  const [dataDonatedStatistic, setDataDonatedStatistic] = useState<any>({})
  const [filterActivity, setFilterActivity] = useState<filterActivity>({
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    status: null,
    timeFrame: 2
  })
  const [filterDelivery, setFilterDelivery] = useState<filterDelivery>({
    startDate:  `${moment(new Date()).format('YYYY')}-1-1`,
    endDate:  `${moment(new Date()).format('YYYY')}-12-31`
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allActivityStatisticResponse = await axiosClient.get(`/activities/statistics/all-status`, {
          params: {
            startDate: '2023-1-1',
            endDate: '2024-1-1'
          }
        })
        console.log(allActivityStatisticResponse.data)

        const activityStatisticResponse = await axiosClient.get(`/activities/statistics`, {
          params: filterActivity
        })
        console.log(activityStatisticResponse.data)

        const allAidRequestStatisticResponse = await axiosClient.get(`/aid-requests/statistics/all-status`, {
          params: filterActivity
        })
        console.log(allAidRequestStatisticResponse.data)
        setDataAidRequestStatistic(allAidRequestStatisticResponse.data)

        const donatedStatisticResponse = await axiosClient.get(
          `donated-requests/statistics/all-status?startDate=${moment(new Date()).format(
            'YYYY'
          )}-1-1&endDate=${moment(new Date()).format('YYYY')}-12-31`
        )
        setDataDonatedStatistic(
          donatedStatisticResponse.data || {
            numberOfPending: 0,
            numberOfAccepted: 0,
            numberOfCanceled: 1,
            numberOfProcessing: 0,
            numberOfRejected: 0,
            numberOfExpried: 0,
            total: 1
          }
        )
      } catch (error) {}
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityStatisticResponse = await axiosClient.get(`/activities/statistics`, {
          params: filterActivity
        })
        console.log('data nè: ', activityStatisticResponse.data)
        setDataActivityStatistic(activityStatisticResponse.data || {})
      } catch (error) {
        console.log('error: ', error)
      }
    }
    fetchData()
  }, [filterActivity])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deliveryStatisticResponse = await axiosClient.get(`/delivery-requests/statistics/all-status`, {
          params: filterDelivery
        })
        console.log('data nè: ', deliveryStatisticResponse.data)
        setDataDeliveryStatistic(deliveryStatisticResponse.data || {})
      } catch (error) {
        console.log('error: ', error)
      }
    }
    fetchData()
  }, [filterDelivery])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <StatisticsCard dataStatistic={dataAidRequestStatistic} />
        </Grid>
        <Grid item xs={12} md={6} lg={7}>
          <WeeklyOverview
            filterActivity={filterActivity}
            setFilterActivity={setFilterActivity}
            dataActivityStatistic={dataActivityStatistic}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <TotalEarning
            dataDeliveryStatistic={dataDeliveryStatistic}
            filterDelivery={filterDelivery}
            setFilterDelivery={setFilterDelivery}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Grid container spacing={6}>
            <Grid item xs={6} md={3}>
              <CardStatisticsVerticalComponent
                stats={dataDonatedStatistic?.total || 0}
                icon={<BallotOutlinedIcon />}
                color='info'
                trendNumber='100%'
                title='Tổng số quyên góp'
                subtitle={`Năm ${moment(new Date()).format('YYYY')}`}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <CardStatisticsVerticalComponent
                stats={dataDonatedStatistic?.numberOfAccepted || 0}
                title='Số quyên góp đã nhận'
                trend='negative'
                color='success'
                trendNumber={`${
                  dataDonatedStatistic?.numberOfAccepted
                    ? ((dataDonatedStatistic?.numberOfAccepted / dataDonatedStatistic?.total) * 100).toFixed(1)
                    : 0
                }%`}
                subtitle={`Năm ${moment(new Date()).format('YYYY')}`}
                icon={<CheckCircleOutlineIcon />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <CardStatisticsVerticalComponent
                stats={dataDonatedStatistic?.numberOfPending || 0}
                trend='negative'
                trendNumber={`${
                  dataDonatedStatistic?.numberOfPending
                    ? ((dataDonatedStatistic?.numberOfPending / dataDonatedStatistic?.total) * 100).toFixed(1)
                    : 0
                }%`}
                color='secondary'
                title='Số quyên góp đang chờ xử lí'
                subtitle={`Năm ${moment(new Date()).format('YYYY')}`}
                icon={<HourglassEmptyIcon />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <CardStatisticsVerticalComponent
                stats={dataDonatedStatistic?.numberOfProcessing || 0}
                color='info'
                trend='negative'
                trendNumber={`${
                  dataDonatedStatistic?.numberOfProcessing
                    ? ((dataDonatedStatistic?.numberOfProcessing / dataDonatedStatistic?.total) * 100).toFixed(1)
                    : 0
                }%`}
                subtitle={`Năm ${moment(new Date()).format('YYYY')}`}
                title='Số quyên góp đang xử lí'
                icon={<BlurOnOutlinedIcon />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <CardStatisticsVerticalComponent
                stats={dataDonatedStatistic?.numberOfCanceled || 0}
                color='error'
                trend='negative'
                trendNumber={`${
                  dataDonatedStatistic?.numberOfCanceled
                    ? ((dataDonatedStatistic?.numberOfCanceled / dataDonatedStatistic?.total) * 100).toFixed(1)
                    : 0
                }%`}
                subtitle={`Năm ${moment(new Date()).format('YYYY')}`}
                title='Số quyên góp đã bị hủy'
                icon={<CancelOutlinedIcon />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <CardStatisticsVerticalComponent
                stats={dataDonatedStatistic?.numberOfExpried || 0}
                color='warning'
                trend='negative'
                trendNumber={`${
                  dataDonatedStatistic?.numberOfExpried
                    ? ((dataDonatedStatistic?.numberOfExpried / dataDonatedStatistic?.total) * 100).toFixed(1)
                    : 0
                }%`}
                subtitle={`Năm ${moment(new Date()).format('YYYY')}`}
                title='Số quyên góp đã hết hạn'
                icon={<ErrorOutlineIcon />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <CardStatisticsVerticalComponent
                stats={dataDonatedStatistic?.numberOfRejected || 0}
                color='error'
                trend='negative'
                trendNumber={`${
                  dataDonatedStatistic?.numberOfRejected
                    ? ((dataDonatedStatistic?.numberOfRejected / dataDonatedStatistic?.total) * 100).toFixed(1)
                    : 0
                }%`}
                subtitle={`Năm ${moment(new Date()).format('YYYY')}`}
                title='Số quyên góp đã từ chối'
                icon={<PanToolOutlinedIcon />}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <CardStatisticsVerticalComponent
                stats={dataDonatedStatistic?.numberOfFinished || 0}
                title='Số quyên góp đã kết thúc'
                trend='negative'
                color='primary'
                trendNumber={`${
                  dataDonatedStatistic?.numberOfFinished
                    ? ((dataDonatedStatistic?.numberOfFinished / dataDonatedStatistic?.total) * 100).toFixed(1)
                    : 0
                }%`}
                subtitle={`Năm ${moment(new Date()).format('YYYY')}`}
                icon={<CheckCircleOutlineIcon />}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard

Dashboard.auth = {
  role: [KEY.ROLE.BRANCH_ADMIN, KEY.ROLE.SYSTEM_ADMIN]
}
Dashboard.getLayout = (page: React.ReactNode) => (
  <UserLayout pageTile='Bảng điều khiển'>{page}</UserLayout>
)