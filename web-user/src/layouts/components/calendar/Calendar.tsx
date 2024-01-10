import React, { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { InputAdornment, Box, TextField } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import vi from 'date-fns/locale/vi'
import moment from 'moment'
import { KEY } from 'src/common/Keys'

registerLocale('vi', vi)

export default function Calendar(props: { label: string; filterObject:any; setFilterObject: any }) {
  const [selectDate, setSelectDate] = useState<Date | null>()
  function onChangeDateHandler(date: Date | null) {
    setSelectDate(date)
    if (date == null && props.label === 'Ngày bắt đầu') {
			props.setFilterObject({
				...props.filterObject,
				startDate: ''
			})

			return
		}
    if (date == null && props.label === 'Ngày kết thúc') {
			props.setFilterObject({
				...props.filterObject,
				endDate: ''
			})

			return
		}

    const time = moment(date).format(KEY['YYYY-MM-DDTHH:mm:ss'])
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
		<Box sx={{ flex: 1 }}>
			<DatePickerWrapper>
				<DatePicker
					locale={'vi'}
					customInput={
						<TextField
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
		</Box>
	)
}
