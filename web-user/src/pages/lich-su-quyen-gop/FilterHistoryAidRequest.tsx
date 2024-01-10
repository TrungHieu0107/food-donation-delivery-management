import {
	Autocomplete,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from '@mui/material'
import moment from 'moment'
import * as React from 'react'
import { ListAidRequestStatus } from 'src/common/aid-request-status'
import { FilterAidRequestModel } from 'src/models/AidRequest'
import { ObjectLabel } from 'src/models/common/CommonModel'

export interface IFilterHistoryAidRequestProps {
	filterObject: FilterAidRequestModel | undefined
	handleChangeFilter: (value: FilterAidRequestModel | undefined) => void
}

export default function FilterHistoryAidRequest(props: IFilterHistoryAidRequestProps) {
	const [timeSelect, setTimeSelect] = React.useState<number>(1)

	return (
		<Grid container spacing={3}>
			<Grid item xl={3} lg={3} md={4} sm={6} xs={6}>
				<Autocomplete
					size='small'
					fullWidth
					renderInput={(params) => <TextField {...params} label='Trạng thái' />}
					options={ListAidRequestStatus}
					getOptionLabel={(option) => option.label}
					onChange={(event: React.SyntheticEvent<Element, Event>, value: ObjectLabel | null) => {
						props.handleChangeFilter({
							...props.filterObject,
							status: value?.value
						})
					}}
				/>
			</Grid>
			<Grid item xl={3} lg={3} md={4} sm={6} xs={6}>
				<FormControl fullWidth size='small'>
					<InputLabel id={'time-history'}>Thời gian</InputLabel>
					<Select
						id='time-history'
						value={timeSelect}
						label='Thời gian'
						onChange={(e) => {
							if (+e.target.value === -1) {
								props.handleChangeFilter({
									...props.filterObject,
									startDate: undefined
								})
							} else if (+e.target.value !== timeSelect) {
								setTimeSelect(+e.target.value)
								const day = moment()
									.subtract(+e.target.value, 'months')
									.startOf('month')
									.toISOString()

								props.handleChangeFilter({
									...props.filterObject,
									startDate: day
								})
							}
						}}
					>
						<MenuItem value={3}>3 tháng</MenuItem>
						<MenuItem value={6}>6 tháng</MenuItem>
						<MenuItem value={9}>9 tháng</MenuItem>
						<MenuItem value={12}>1 năm</MenuItem>
						<MenuItem value={-1}>Tất cả</MenuItem>
					</Select>
				</FormControl>
			</Grid>
		</Grid>
	)
}
