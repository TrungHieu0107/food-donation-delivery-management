import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import {
	Typography,
	TextField,
	FormControl,
	InputLabel,
	MenuItem,
	Autocomplete,
	FormControlLabel,
	Checkbox,
	Button,
	Grid,
	Select,
	Card,
	Stack
} from '@mui/material'
import { Magnify } from 'mdi-material-ui'
import moment from 'moment'
import * as React from 'react'
import { KEY } from 'src/common/Keys'
import { ActivityType, QueryActivityListModel } from 'src/models/Activity'
import { AddressModel, DistrictModel, ProvinceModel, WardModel } from 'src/models/common/Address'
import { useSession } from 'next-auth/react'
import { BranchModel } from 'src/models/Branch'
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'

export interface ActivitySearchDrawerProps {
	queryActivityListModel: QueryActivityListModel
	setQueryActivityListModel: (value: QueryActivityListModel) => void
	handleChangeQuery: (value: QueryActivityListModel) => void
	activityTypes: ActivityType[]
	provinces: ProvinceModel[]
	districts: DistrictModel[]
	wards: WardModel[]
	addressSearching: AddressModel
	setAddressSearching: (value: AddressModel) => void
	getDistrictOfProvince: (value: ProvinceModel) => void
	getWardsOfDistrict: (value: DistrictModel) => void
	branches: BranchModel[]
}

export default function ActivitySearchDrawer(props: ActivitySearchDrawerProps) {
	const {
		queryActivityListModel,
		setQueryActivityListModel,
		handleChangeQuery,
		addressSearching,
		districts,
		wards,
		provinces,
		setAddressSearching,
		getDistrictOfProvince,
		getWardsOfDistrict,
		branches
	} = props
	const { data: session,status } = useSession()

	return (
		<Card>
			<DatePickerWrapper>
				<Grid
					container
					spacing={3}
					flexDirection={'column'}
					sx={{
						p: '10px !important'
					}}
				>
					<Grid item>
						<Stack direction={'row'} alignItems={'center'} justifyContent={"center"} spacing={2}>
							<FilterListOutlinedIcon />
							<Typography textAlign={'center'} variant='h6'>
								Bộ lọc
							</Typography>
						</Stack>
					</Grid>
					<Grid item>
						<TextField
							label='Tên hoạt động'
							size='small'
							placeholder='Tên hoạt động'
							fullWidth
							value={queryActivityListModel.name}
							onChange={(e) => {
								const newQuery = new QueryActivityListModel({
									...queryActivityListModel,
									name: e.target.value
								})
								setQueryActivityListModel(newQuery)
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleChangeQuery(queryActivityListModel)
								}
							}}
						/>
					</Grid>
					<Grid item>
						<FormControl fullWidth size='small'>
							<InputLabel id='activity-status'>Trạng thái</InputLabel>
							<Select
								value={queryActivityListModel.status}
								labelId='activity-status'
								id='demo-simple-select'
								label='Trạng thái'
								onChange={(e) => {
									console.log(e.target.value)
									const value = e.target.value
									const newQuery = new QueryActivityListModel({
										...queryActivityListModel,
										status: value
									})
									setQueryActivityListModel(newQuery)
								}}
								placeholder='Tất cả'
							>
								{KEY.ACTIVITY.STATUS.map((value) => (
									<MenuItem key={value.id} value={value.id}>
										{value.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item>
						<FormControl fullWidth size='small'>
							<Autocomplete
								size='small'
								disablePortal
								fullWidth
								multiple
								renderInput={(params) => (
									<TextField
										{...params}
										name='unit'
										placeholder='Loại hoạt động'
										label='Loại hoạt động'
										fullWidth
									/>
								)}
								defaultValue={props.activityTypes.filter(
									(item) =>
										queryActivityListModel.activityTypeIds &&
										queryActivityListModel.activityTypeIds?.indexOf(item.id ?? '_') > -1
								)}
								getOptionLabel={(option) => option.name ?? '_'}
								options={props.activityTypes.filter(
									(item) =>
										!(
											queryActivityListModel.activityTypeIds &&
											queryActivityListModel.activityTypeIds?.indexOf(item.id ?? '_') > -1
										)
								)}
								onChange={(_: React.SyntheticEvent, newValue) => {
									const newQuery = new QueryActivityListModel(queryActivityListModel)
									newQuery.activityTypeIds = newValue.map((item) => item.id ?? '_')

									setQueryActivityListModel(newQuery)
								}}
							/>
							{/* <InputLabel id='activity-type'></InputLabel> */}
						</FormControl>
					</Grid>
					<Grid item>
						<FormControl fullWidth size='small'>
							<Autocomplete
								size='small'
								disablePortal
								fullWidth
								renderInput={(params) => (
									<TextField
										{...params}
										name='branch'
										placeholder='Tên chi nhánh'
										label='Chi nhánh hoạt động'
										fullWidth
									/>
								)}
								defaultValue={branches
									.filter((branch) => branch.id === queryActivityListModel.branchId)
									.at(0)}
								getOptionLabel={(option) => option.name ?? '_'}
								options={branches}
								onChange={(_: React.SyntheticEvent, newValue) => {
									const newQuery = new QueryActivityListModel({
										...queryActivityListModel,
										branchId: newValue?.id
									})
									setQueryActivityListModel(newQuery)
								}}
							/>
							{/* <InputLabel id='activity-type'></InputLabel> */}
						</FormControl>
					</Grid>
					<Grid item>
						<FormControl fullWidth size='small'>
							<Autocomplete
								size='small'
								disablePortal
								fullWidth
								renderInput={(params) => (
									<TextField
										{...params}
										name='province'
										placeholder='tỉnh/thành phố'
										label='Tỉnh/Thành phố hoạt động'
										fullWidth
									/>
								)}
								defaultValue={addressSearching?.province}
								getOptionLabel={(option) => option.name ?? '_'}
								options={provinces}
								onChange={(_: React.SyntheticEvent, newValue) => {
									const newAddress = new AddressModel({
										province: newValue
									})
									setAddressSearching(newAddress)
									const newQuery = new QueryActivityListModel({
										...queryActivityListModel,
										address: newAddress.getAddress()
									})
									newValue && getDistrictOfProvince(newValue)
									setQueryActivityListModel(newQuery)
								}}
							/>
							{/* <InputLabel id='activity-type'></InputLabel> */}
						</FormControl>
					</Grid>
					{addressSearching?.province && districts.length > 0 && (
						<Grid item>
							<FormControl fullWidth size='small'>
								<Autocomplete
									size='small'
									disablePortal
									fullWidth
									renderInput={(params) => (
										<TextField
											{...params}
											name='district'
											placeholder='quận/huyện'
											label='Quận/Huyện hoạt động'
											fullWidth
										/>
									)}
									getOptionLabel={(option) => option.name ?? '_'}
									options={districts}
									defaultValue={addressSearching.district}
									onChange={(_: React.SyntheticEvent, newValue) => {
										const newAddress = new AddressModel({
											province: addressSearching.province,
											district: newValue
										})
										setAddressSearching(newAddress)
										const newQuery = new QueryActivityListModel({
											...queryActivityListModel,
											address: newAddress.getAddress()
										})
										newValue && getWardsOfDistrict(newValue)
										setQueryActivityListModel(newQuery)
									}}
								/>
								{/* <InputLabel id='activity-type'></InputLabel> */}
							</FormControl>
						</Grid>
					)}
					{addressSearching?.province && addressSearching.district && wards.length > 0 && (
						<Grid item>
							<FormControl fullWidth size='small'>
								<Autocomplete
									size='small'
									disablePortal
									fullWidth
									renderInput={(params) => (
										<TextField
											{...params}
											name='district'
											placeholder='phường/xã'
											label='Phường/Xã hoạt động'
											fullWidth
										/>
									)}
									defaultValue={addressSearching.ward}
									getOptionLabel={(option) => option.name ?? '_'}
									options={wards}
									onChange={(_: React.SyntheticEvent, newValue) => {
										const newAddress = new AddressModel({
											...addressSearching,
											ward: newValue
										})
										const newQuery = new QueryActivityListModel({
											...queryActivityListModel,
											address: newAddress.getAddress()
										})

										setAddressSearching(newAddress)
										setQueryActivityListModel(newQuery)
									}}
								/>
								{/* <InputLabel id='activity-type'></InputLabel> */}
							</FormControl>
						</Grid>
					)}
					<Grid item>
						<Grid container spacing={1}>
							<Grid item md={6} sm={6} xs={6}>
								<DatePicker
									selected={
										queryActivityListModel.startDate
											? moment(queryActivityListModel.startDate).toDate()
											: null
									}
									showYearDropdown
									id='start-date'
									showMonthDropdown
									placeholderText='Ngày-Tháng-Năm'
									dateFormat={'dd/MM/yyyy'}
									customInput={<TextField label='Ngày bắt đầu' fullWidth size='small' />}
									onChange={(date: Date | null) => {
										const newQuery = new QueryActivityListModel({
											...queryActivityListModel,
											startDate: date?.toISOString() ?? ''
										})

										setQueryActivityListModel(newQuery)
									}}
								/>
							</Grid>
							<Grid item md={6} sm={6} xs={6}>
								<DatePicker
									selected={
										queryActivityListModel.endDate
											? moment(queryActivityListModel.endDate).toDate()
											: null
									}
									showYearDropdown
									showMonthDropdown
									id='end-date'
									placeholderText='Ngày-Tháng-Năm'
									customInput={<TextField label='Ngày kết thúc' fullWidth size='small' />}
									dateFormat={'dd/MM/yyyy'}
									onChange={(date: Date | null) => {
										const newQuery = new QueryActivityListModel({
											...queryActivityListModel,
											endDate: date?.toISOString() ?? ''
										})

										setQueryActivityListModel(newQuery)
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
					{status === 'authenticated' && session?.user.role === KEY.ROLE.CONTRIBUTOR && (
						<Grid item>
							<FormControlLabel
								control={
									<Checkbox
										onChange={(e) => {
											const newQuery = new QueryActivityListModel({
												...queryActivityListModel,
												isJoined: e.target.checked
											})

											setQueryActivityListModel(newQuery)
										}}
									/>
								}
								label='Đã tham gia'
							/>
						</Grid>
					)}

					<Grid item justifyContent={'center'} display={'flex'}>
						<Button
							variant='contained'
							onClick={() => {
								handleChangeQuery(queryActivityListModel)
							}}
							color='info'
							fullWidth
							size='small'
							startIcon={<Magnify />}
						>
							Tìm kiếm
						</Button>
					</Grid>
				</Grid>
			</DatePickerWrapper>
		</Card>
	)
}
