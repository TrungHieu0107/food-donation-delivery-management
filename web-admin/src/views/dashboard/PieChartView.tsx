import { Box, Typography } from '@mui/material'
import { ApexOptions } from 'apexcharts'
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import 'react-datepicker/dist/react-datepicker.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { Grid, InputAdornment, TextField } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'
import moment from 'moment'
import { useState, useEffect } from 'react'

registerLocale('vi', vi)
export default function PieChartView({ setFilterDelivery, filterDelivery, dataDeliveryStatistic }: any) {
  const [selectStartDate, setSelectStartDate] = useState<any>()
  const [selectEndDate, setSelectEndDate] = useState<any>()
  const [dataInit, setDataInit] = useState<any>([1, 1, 1, 1, 1, 1, 1, 1, 1])
  const [display, setDisplay] = useState<any>(false)
  function onChangeStartDateHandler(value: any) {
    if (value) {
      setSelectStartDate(value)
      setFilterDelivery({
        ...filterDelivery,
        startDate: moment(value).format('YYYY-MM-DD')
      })
    } else {
      setSelectStartDate(null)
      setFilterDelivery({
        ...filterDelivery,
        startDate: `${moment(new Date()).format('YYYY')}-1-1`
      })
    }
  }
  function onChangeEndDateHandler(value: any) {
    if (value) {
      setSelectEndDate(value)
      setFilterDelivery({
        ...filterDelivery,
        endDate: moment(value).format('YYYY-MM-DD')
      })
    } else {
      setSelectEndDate(null)
      setFilterDelivery({
        ...filterDelivery,
        endDate: `${moment(new Date()).format('YYYY')}-12-31`
      })
    }
  }

  const options: ApexOptions = {
    chart: {
      width: 400,
      type: 'pie'
    },
    labels: [
      'Đã chấp nhận',
      'Đã lấy vật phẩm',
      'Đã tới điểm giao',
      'Đã tới điểm nhận',
      'Đã vận chuyển',
      'Đã hết hạn',
      'Đã kết thúc',
      'Đã báo cáo',
      'Đang chờ'
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  }
  useEffect(() => {
    const updateDataChart = () => {
      setDisplay(true)
    }
    setDisplay(false)
    setDataInit([
      dataDeliveryStatistic?.numberOfAccepted || 0,
      dataDeliveryStatistic?.numberOfCollected || 0,
      dataDeliveryStatistic?.numberOfArrivedDelivery || 0,
      dataDeliveryStatistic?.numberOfArrivedPickUp || 0,
      dataDeliveryStatistic?.numberOfDelivered || 0,
      dataDeliveryStatistic?.numberOfExpried || 0,
      dataDeliveryStatistic?.numberOfFinished || 0,
      dataDeliveryStatistic?.numberOfReported || 0,
      dataDeliveryStatistic?.numberOfPending || 0
    ])

    const interval = setInterval(updateDataChart, 1200)

    return () => clearInterval(interval)
  }, [dataDeliveryStatistic])

  return (
    <Box>
      <Grid container spacing={5}>
        <Grid item xs={6}>
          <DatePickerWrapper>
            <DatePicker
              locale={'vi'}
              customInput={
                <TextField
                  inputProps={{
                    autoComplete: 'off'
                  }}
                  fullWidth
                  label={'Ngày bắt đầu'}
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
              selected={selectStartDate}
              onChange={onChangeStartDateHandler}
              placeholderText={'Ngày bắt đầu'}
              dateFormat='dd/MM/yyyy'
            />
          </DatePickerWrapper>
        </Grid>
        <Grid item xs={6}>
          <DatePickerWrapper>
            <DatePicker
              locale={'vi'}
              customInput={
                <TextField
                  inputProps={{
                    autoComplete: 'off'
                  }}
                  fullWidth
                  label={'Ngày kết thúc'}
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
              selected={selectEndDate}
              onChange={onChangeEndDateHandler}
              placeholderText={'Ngày kết thúc'}
              dateFormat='dd/MM/yyyy'
            />
          </DatePickerWrapper>
        </Grid>
      </Grid>
      <Box id='chart' sx={{ display: 'flex', justifyContent: 'center' }}>
        {display ? (
          <ReactApexcharts options={options} series={dataInit} type='pie' width={450} />
        ) : (
          <Box height={240}>
            <Typography align='center' pt={3}>
              Đang tải dữ liệu...
            </Typography>
          </Box>
        )}
      </Box>
      {!selectStartDate && !selectEndDate && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {/* <Typography variant='h5' sx={{ mr: 4 }}>
          {dataDeliveryStatistic?.total || 0}
        </Typography> */}
          <Typography align='center' variant='body2'>
            Số lượng các lần vận chuyển diễn ra trong năm {moment(new Date()).format('YYYY')}
          </Typography>
        </Box>
      )}
      {(selectStartDate || selectEndDate) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography align='center' variant='body2'>
            Thống kê số lượng các lần vận chuyển diễn ra theo thời gian
          </Typography>
        </Box>
      )}
    </Box>
  )
}
