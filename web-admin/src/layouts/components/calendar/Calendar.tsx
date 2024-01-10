import React, { useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { InputAdornment, TextField } from '@mui/material'
import { DateTime } from 'luxon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker, { registerLocale } from 'react-datepicker'
import vi from 'date-fns/locale/vi'

registerLocale('vi', vi)

export default function Calendar(props: { label: string; filterObject: any; setFilterObject: any }) {
  const [selectDate, setSelectDate] = useState<any>()
  function onChangeDateHandler(value: any) {
    setSelectDate(value)
    if (value == null && props.label === 'Ngày bắt đầu') {
      props.setFilterObject({
        ...props.filterObject,
        startDate: ''
      })

      return
    }
    if (value == null && props.label === 'Ngày kết thúc') {
      props.setFilterObject({
        ...props.filterObject,
        endDate: ''
      })

      return
    }
    const time = DateTime.fromJSDate(new Date(value), { zone: 'Asia/Ho_Chi_Minh' }).toISODate()
    props.label === 'Ngày bắt đầu'
      ? props.setFilterObject({
          ...props.filterObject,
          startDate: time
        })
      : props.setFilterObject({
          ...props.filterObject,
          endDate: time
        })
  }

  return (
    <DatePickerWrapper>
      <DatePicker
        locale={'vi'}
        customInput={
          <TextField
            inputProps={{
              autoComplete: 'off'
            }}
            fullWidth
            label={props.label}
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
        placeholderText={props.label}
        dateFormat='dd/MM/yyyy'
      />
    </DatePickerWrapper>
  )
}
