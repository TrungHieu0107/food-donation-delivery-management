import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import 'react-datepicker/dist/react-datepicker.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import {
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import moment from 'moment'

registerLocale('vi', vi)
const WeeklyOverview = ({ setFilterActivity, filterActivity, dataActivityStatistic }: any) => {
  // ** Hook
  const theme = useTheme()
  const [selectDate, setSelectDate] = useState<any>()
  const [timeFrame, SetTimeFrame] = useState<any>(0)
  const [yearSelected, setYearSelected] = useState<any>('2023')
  const handleChange = (event: SelectChangeEvent) => {
    SetTimeFrame(event.target.value)
    setSelectDate(null)
    const timeFrameSelected = event.target.value
    const formatValueMonth = moment(new Date()).format('MM')
    const formatValueYear = moment(new Date()).format('YYYY')
    const numberOfMonth = parseInt(formatValueMonth)
    setYearSelected(formatValueYear)
    if (typeof timeFrameSelected === 'number') {
      if (timeFrameSelected === 0) {
        const formatValue = moment(new Date()).format('YYYY')
        setYearSelected(formatValue)
        setFilterActivity({
          ...filterActivity,
          startDate: formatValue + '-1-1',
          endDate: formatValue + '-12-31'
        })

        return
      }
      setFilterActivity({
        ...filterActivity,
        startDate: formatValueYear + '-' + `${numberOfMonth - timeFrameSelected + 1}` + '-1',
        endDate: formatValueYear + '-' + `${numberOfMonth}` + '-28'
      })
    }
  }
  const dataActivityStatisticByMonth = []

  for (let i = 0; i < dataActivityStatistic?.activityByTimeRangeResponse?.length; i++) {
    dataActivityStatisticByMonth.push(dataActivityStatistic?.activityByTimeRangeResponse?.[i]?.quantity)
  }
  const categories = []
  if (timeFrame !== 0) {
    const formatValue = moment(new Date()).format('MM')
    const numberOfMonth = parseInt(formatValue)
    for (let i = numberOfMonth - timeFrame + 1; i <= numberOfMonth; i++) {
      categories.push('Tháng' + ` ${i}`)
    }
  } else if (timeFrame === 0) {
    for (let i = 1; i <= 12; i++) {
      categories.push('Tháng' + ` ${i}`)
    }
  }

  function onChangeDateHandler(value: any) {
    console.log('value: ', value)
    SetTimeFrame(0)
    setSelectDate(value)
    const formatValue = moment(value).format('YYYY')
    setYearSelected(formatValue)
    setFilterActivity({
      ...filterActivity,
      startDate: formatValue + '-1-1',
      endDate: formatValue + '-12-31'
    })
  }
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.info.main

      // theme.palette.background.default,
      // theme.palette.background.default,
      // theme.palette.primary.main,
      // theme.palette.background.default,
      // theme.palette.background.default
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: categories,
      tickPlacement: 'on',
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 3,
      labels: {
        offsetX: -17,
        formatter: value => `${value}`
      }
    }
  }

  return (
    <Card sx={{ height: 430 }}>
      <CardHeader
        title='Hoạt động thiện nguyện'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <DatePickerWrapper>
              <DatePicker
                locale={'vi'}
                showYearPicker
                customInput={
                  <TextField
                    inputProps={{
                      autoComplete: 'off'
                    }}
                    fullWidth
                    label={'Năm'}
                    size='small'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <CalendarMonthIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                }
                selectsRange={false}
                selected={selectDate}
                onChange={onChangeDateHandler}
                placeholderText={'Chọn năm'}
                dateFormat='yyyy'
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id='select-range-of-time'>Chọn mốc thời gian</InputLabel>
              <Select
                labelId='select-range-of-time'
                id='demo-simple-select'
                value={timeFrame}
                label='Chọn mốc thời gian'
                size='small'
                onChange={handleChange}
              >
                <MenuItem value={0}>Không</MenuItem>
                <MenuItem value={9}>9 tháng trước</MenuItem>
                <MenuItem value={6}>6 tháng trước</MenuItem>
                <MenuItem value={3}>3 tháng trước</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <ReactApexcharts
          type='bar'
          height={205}
          options={options}
          series={[{ name: 'Tổng số hoạt động', data: dataActivityStatisticByMonth }]}
        />
        <Box sx={{ mt: 9, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {timeFrame === 0 &&   <Typography variant='h5' sx={{ mr: 4 }}>
            {dataActivityStatistic?.total ?? 0}
          </Typography>}
          {timeFrame !== 0 ? (
             <Typography align='center' variant='body2'>
             Thống kê số lượng hoạt động thiện nguyện diễn ra trong {timeFrame} tháng vừa qua
           </Typography>
          ) : (         
            <Typography align='center' variant='body2'>
            Hoạt động thiện nguyện diễn ra trong năm {yearSelected}
          </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
