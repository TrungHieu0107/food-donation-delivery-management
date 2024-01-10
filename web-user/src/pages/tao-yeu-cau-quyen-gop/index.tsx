'use client'

// External Libraries
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import { LatLngExpression } from 'leaflet'
import moment from 'moment'
import { toast } from 'react-toastify'
import vi from 'date-fns/locale/vi' // the locale you want
import { registerLocale } from 'react-datepicker'

// Material-UI Components
import {
	Button,
	CircularProgress,
	FormHelperText,
	TextField,
	Typography,
	Paper,
	Box,
	Container
} from '@mui/material'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle'
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid'
import ScheduleIcon from '@mui/icons-material/Schedule'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'

// Styles
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// Models
import {
	CommonRepsonseModel,
	UserModel,
	ActivityResponseModel,
} from 'src/models'

// API Clients
import { UserAPI, DonatedRequestAPI, ActivityAPI } from 'src/api-client'

// Components
import SelectedItemsView from 'src/layouts/components/views/aid-request/create/SelectItemView'
import DonatedRequestInformationView from 'src/layouts/components/views/donated-request/create/DonatedRequestInformationView'
import SelectImageView from 'src/layouts/components/image/SelectImage'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import SelectScheduledTime from './SelectScheduledTime'

registerLocale('vi', vi)

const arrayRange = (start: number, stop: number, step: number) =>
	Array.from({ length: (stop - start) / step + 1 }, (value, index) => start + index * step)

const calculateDiffs = (from: string, to: string): number[] => {
	const a = moment(to)
	const b = moment(from)

	return arrayRange(0, a.diff(b, 'days'), 1)
}

const vaidationSchema = Yup.object().shape({
	sameTime: Yup.string().required(),
	receivingTimeStart: Yup.string().when('sameTime', (_, schema) => {
		return schema.test({
			test: (_, context) => {
				const value = context.from?.at(0)?.value
				if (value.sameTime && value.sameTime === '0') {
					if (value.receivingTimeStart) return value.receivingTimeStart?.length > 0

					return false
				}

				return true
			},
			message: 'Thời gian bắt đầu là bắt buộc.'
		})
	}),
	receivingTimeEnd: Yup.string().when('sameTime', (_, schema) => {
		return schema.test({
			test: (receivingTimeEnd, context) => {
				const value = context.from?.at(0)?.value
				if (value.sameTime && value.sameTime === '0') {
					if (value?.receivingTimeStart && value?.receivingTimeEnd)
						if (moment(value?.receivingTimeStart).isBefore(value?.receivingTimeEnd)) {
							const to = moment(value?.receivingTimeEnd)
							const from = moment(value?.receivingTimeStart)

							return to.diff(from, 'hours') >= 1
						}

					if (value.receivingTimeEnd) return value.receivingTimeEnd?.length > 0

					return false
				}

				return true
			},
			message: 'Thời gian kết thúc là bắt buộc và sau thời gian bắt đầu 1 giờ.'
		})
	}),
	receivingDateStart: Yup.string().required('Hãy chọn ngày bắt đầu có thể cho quyên góp.'),
	receivingDateEnd: Yup.string().when('receivingDateStart', (_, schema) => {
		return schema.test({
			test: (receivingDateStart, context) => {
				const value = context.from?.at(0)?.value
				if (value?.receivingDateStart && value?.receivingDateEnd) {
					const to = moment(value?.receivingDateEnd)
					const from = moment(value?.receivingDateStart)

					return to.diff(from, 'day') >= 0
				}

				if (value.receivingTimeEnd) return value.receivingTimeEnd?.length > 0

				return false
			},
			message: 'Thời gian kết thúc là bắt buộc và sau thời gian bắt đầu 1 ngày.'
		})
	}),
	scheduledTimes: Yup.array().of(
		Yup.object({
			day: Yup.string().when('sameTime', (_, schema) => {
				return schema.test({
					test: (_, context) => {
						const sameTime = context.from?.at(1)?.value?.sameTime
						const value = context.from?.at(0)?.value

						if (sameTime && sameTime === '1') {
							if (value?.day) return value?.day?.length > 0

							return false
						}

						return true
					},
					message: 'Thời gian bắt đầu là bắt buộc.'
				})
			}),
			startTime: Yup.string().when('sameTime', (_, schema) => {
				return schema.test({
					test: (_, context) => {
						const sameTime = context.from?.at(1)?.value?.sameTime
						const value = context.from?.at(0)?.value

						if (sameTime && sameTime === '1') {
							if (value?.startTime) return value?.startTime?.length > 0

							return false
						}

						return true
					},
					message: 'Thời gian bắt đầu là bắt buộc.'
				})
			}),
			endTime: Yup.string().when('sameTime', (_, schema) => {
				return schema.test({
					test: (receivingTimeEnd, context) => {
						const sameTime = context.from?.at(1)?.value?.sameTime
						const value = context.from?.at(0)?.value

						if (sameTime && sameTime === '1') {
							if (value?.endTime) {
								if (value?.startTime?.length === 0) return true

								if (moment(value?.startTime).isBefore(value?.endTime)) {
									const to = moment(value?.endTime)
									const from = moment(value?.startTime)

									return to.diff(from, 'hours') >= 1
								}

								return false
							}

							return false
						}

						return true
					},
					message: 'Thời gian kết thúc là bắt buộc và sau thời gian bắt đầu 1 giờ.'
				})
			})
		})
	),
	note: Yup.string().max(500,'Ghi chú không được vượt quá 500 kí tự.'),
	donatedItemRequests: Yup.array()
		.of(Yup.object())
		.min(1, 'Phải chọn ít nhất 1 vật phẩm cần hỗ trợ')
		.required('Phải chọn ít nhất 1 vật phẩm cần hỗ trợ'),
	mainImage: Yup.array()
		.of(Yup.mixed())
		.min(1, 'Phải chọn ít nhất 1 ảnh')
		.required('Phải chọn ít nhất 1 hình ảnh')
})

export interface ScheduledTimes {
	day?: string
	label?: string
	startTime?: string
	endTime?: string
	status?: boolean
}

export class VolunteerDonateItem {
	itemTemplateId?: string
	quantity?: number
	item?: {
		id: string | undefined
		name: string | undefined
		attributeValues: string[] | undefined
		image: string | undefined
	}
	unit: string
	initialExpirationDate?: Date | string

	constructor(value?: Partial<VolunteerDonateItem> | any) {
		this.itemTemplateId = value?.itemTemplateId
		this.quantity = value?.quantity
		this.item = value?.item
		this.initialExpirationDate = value?.initialExpirationDate
		this.unit = value?.unit || 'kg'
	}
}

export default function CreateDonatedRequest() {
	const [isloadingScreen, setIsloadingScreen] = useState<boolean>(false)
	const [islLoading, setIsLoading] = useState<boolean>(false)
	const [scheduledTimes, setScheduledTimes] = useState<ScheduledTimes[]>()
	const formikRef = useRef<FormikProps<any>>(null)
	const [itemTemplatesSelected, setItemTemplatesSelected] = useState<VolunteerDonateItem[]>([])
	const [userLogin, setUserLogin] = useState<UserModel>()

	const [activityData, setActitivityData] = useState<ActivityResponseModel>()
	const router = useRouter()
	const { hoat_dong } = router.query

	useEffect(() => {
		try {
			fetchUserProfile()
			if (hoat_dong) {
				ActivityAPI.getActivityDetail(hoat_dong as string)
					.then((res) => {
						const commonResponse = new CommonRepsonseModel<ActivityResponseModel>(res)
						setActitivityData(commonResponse.data)
						console.log();
						
					})
					.catch((err) => {
						console.log(err)
					})
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsloadingScreen(false)
		}
	}, [hoat_dong])

	useEffect(() => {
		formikRef.current?.setValues({
			...formikRef.current?.values,
			scheduledTimes: scheduledTimes
		})
	}, [scheduledTimes])

	const fetchUserProfile = () => {
		UserAPI.getProfileLogin()
			.then((data) => {
				const dataResponse = new CommonRepsonseModel<UserModel>(data)
				if (dataResponse.data?.location) {
					const location = [
						data.data?.location.split(',')[0],
						data.data?.location.split(',')[1]
					] as LatLngExpression
					dataResponse.data.location = location
				}
				setUserLogin(dataResponse.data)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const handleSelectItemTemplate = (isSelect: boolean, value: VolunteerDonateItem, id?: string) => {
		let newValue: VolunteerDonateItem[] = []
		if (id) {
			newValue = [
				...itemTemplatesSelected.map((item) => {
					if (item.itemTemplateId === id) {
						return value
					}

					return item
				})
			]
		} else {
			newValue = isSelect
				? [...itemTemplatesSelected, value]
				: [...itemTemplatesSelected.filter((item) => item?.itemTemplateId !== value.item?.id)]
		}
		formikRef.current?.setFieldValue(
			'donatedItemRequests',
			newValue.map((item) => {
				return {
					itemTemplateId: item.itemTemplateId,
					quantity: item.quantity,
					initialExpirationDate: item.initialExpirationDate
				}
			})
		)

		toast.success(!!id ? 'Cập nhật thành công.' : isSelect ? 'Đã thêm thành công' : 'Xóa thành công.')

		setItemTemplatesSelected([...newValue])
	}

	const handleSubmit = async (values: any) => {
		setIsLoading(true)
		try {
			const payload: any = {
				note: values?.note,
				donatedItemRequests: values?.donatedItemRequests
			}
			console.log(payload, userLogin)

			if (!(userLogin?.location || userLogin?.address)) {
				toast.error('Hãy chọn địa chỉ mà bạn sẽ quyên góp.')

				return
			}

			const newSchedules: ScheduledTimes[] = []
			if (values?.sameTime === '0') {
				const startTime = moment(values?.receivingTimeStart).format('HH:mm')
				const endTime = moment(values?.receivingTimeEnd).format('HH:mm')

				calculateDiffs(
					formikRef.current?.values.receivingDateStart,
					formikRef.current?.values.receivingDateEnd
				)?.map((item) => {
					newSchedules.push({
						day: moment(formikRef.current?.values.receivingDateStart)
							.add(item, 'day')
							.format('yyyy-MM-DD'),
						startTime: startTime,
						endTime: endTime
					} as ScheduledTimes)
				})
			} else if (values?.sameTime === '1') {
				values?.scheduledTimes.map((item: any) => {
					const startTime = moment(item?.startTime).format('HH:mm')
					const endTime = moment(item?.endTime).format('HH:mm')

					newSchedules.push({
						day: item.day,
						startTime: startTime,
						endTime: endTime
					})
				})
			}

			payload.scheduledTimes = newSchedules
			const formData = new FormData()

			//append image
			const mainImage = formikRef.current?.values.mainImage
			for (let index = 0; index < mainImage?.length; index++) {
				const element = mainImage[index]
				formData.append('Images', element)
			}

			//append Address
			formData.append('Address', userLogin?.address ?? '')

			//append Location
			const location: any = userLogin?.location
			location && formData.append('Location', location[0])
			location && formData.append('Location', location[1])

			//append ScheduledTimes
			payload.scheduledTimes.map((item: any) => {
				formData.append(`ScheduledTimes`, JSON.stringify(item))
			})

			//append Note
			formData.append('Note', payload.note ?? '')

			//append DonatedItemRequests
			payload.donatedItemRequests.map((item: any) => {
				formData.append(`DonatedItemRequests`, JSON.stringify(item))
			})

			if (activityData) {
				formData.append(`ActivityId`, activityData.id ?? 'default')
			}

			for (const value of formData.values()) {
				console.log(value)
			}

			await DonatedRequestAPI.createNew(formData)
			toast.success('Tạo yêu cầu thành công', {
				onOpen: () => {
					router.push('/lich-su-quyen-gop')
				}
			})
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleChangeProfile = (profile: UserModel) => {
		setUserLogin({ ...profile })
	}

	return (
		<Container>
			<Paper
				sx={{
					padding: '20px'
				}}
			>
				<Box
					display={'flex'}
					gap={5}
					flexDirection={'row'}
					flexWrap={'nowrap'}
					sx={{
						'& .MuiSvgIcon-root, & .MuiTypography-root': {
							color: (theme) => theme.palette.primary.light
						}
					}}
				>
					<VolunteerActivismIcon />
					<Typography variant='h5' sx={{ textAlign: 'center' }} fontWeight={700}>
						Quyên góp vật phẩm
					</Typography>
				</Box>
			</Paper>

			<Paper
				sx={{
					padding: '20px',
					marginTop: '20px'
				}}
			>
				<Box
					display={'flex'}
					gap={2}
					flexDirection={'row'}
					flexWrap={'nowrap'}
					sx={{
						paddingBottom: '20px',
						'& .MuiSvgIcon-root, & .MuiTypography-root': {
							color: (theme) => theme.palette.secondary.light
						}
					}}
				>
					<PersonPinCircleIcon />
					<Typography variant='body1' sx={{ textAlign: 'center' }} fontWeight={600}>
						Thông tin địa chỉ quyên góp
					</Typography>
				</Box>
				{userLogin && (
					<DonatedRequestInformationView
						profile={userLogin}
						key={userLogin?.id ?? ''}
						handleChangeProfile={handleChangeProfile}
					/>
				)}
			</Paper>

			{!isloadingScreen ? (
				<Formik
					innerRef={formikRef}
					initialValues={{
						sameTime: '0',
						receivingTimeStart: '',
						receivingTimeEnd: '',
						receivingDateStart: '',
						receivingDateEnd: '',
						note: '',
						scheduledTimes: [],
						donatedItemRequests: [],
						mainImage: []
					}}
					validationSchema={vaidationSchema}
					onSubmit={(values) => {
						handleSubmit(values)
					}}
					validateOnBlur={true}
					validateOnChange={false}
				>
					{({}) => (
						<DatePickerWrapper>
							<Form>
								<Paper
									sx={{
										padding: '20px',
										marginTop: '20px'
									}}
								>
									<Box
										display={'flex'}
										gap={2}
										flexDirection={'row'}
										flexWrap={'nowrap'}
										sx={{
											paddingBottom: '20px',
											'& .MuiSvgIcon-root, & .MuiTypography-root': {
												color: (theme) => theme.palette.secondary.light
											}
										}}
									>
										<PersonPinCircleIcon />
										<Typography variant='body1' sx={{ textAlign: 'center' }} fontWeight={600}>
											Vật phẩm quyên góp
										</Typography>
									</Box>
									<FormHelperText error={true}>
										{formikRef.current?.values.donatedItemRequests &&
											formikRef.current?.values.donatedItemRequests.length === 0 &&
											formikRef.current?.getFieldMeta('donatedItemRequests').error}
									</FormHelperText>
									<SelectedItemsView
										itemTemplatesSelected={itemTemplatesSelected}
										handleSelectItemTemplate={handleSelectItemTemplate}
										isAidScreen={false}
										activityItem={activityData?.targetProcessResponses}
									/>
								</Paper>
								<Paper
									sx={{
										padding: '20px',
										marginTop: '20px'
									}}
								>
									<Box
										display={'flex'}
										gap={2}
										flexDirection={'row'}
										flexWrap={'nowrap'}
										sx={{
											paddingBottom: '20px',
											'& .MuiSvgIcon-root, & .MuiTypography-root': {
												color: (theme) => theme.palette.secondary.light
											}
										}}
									>
										<MedicationLiquidIcon />
										<Typography variant='body1' sx={{ textAlign: 'center' }} fontWeight={600}>
											Hình ảnh vật phẩm
										</Typography>
									</Box>
									<Field name='mainImage'>
										{({ field, form, meta }: FieldProps) => (
											<SelectImageView title='' formProp={{ field, form, meta }} />
										)}
									</Field>
								</Paper>

								<Paper
									sx={{
										paddingTop: '20px',
										paddingX: '20px',
										marginTop: '20px'
									}}
								>
									<Box
										display={'flex'}
										gap={2}
										flexDirection={'row'}
										flexWrap={'nowrap'}
										sx={{
											paddingBottom: '20px',
											'& .MuiSvgIcon-root, & .MuiTypography-root': {
												color: (theme) => theme.palette.secondary.light
											}
										}}
									>
										<ScheduleIcon />
										<Typography variant='body1' sx={{ textAlign: 'center' }} fontWeight={600}>
											Khung giờ quyên góp
										</Typography>
									</Box>
								</Paper>
								<SelectScheduledTime
								formikRef={formikRef}
								isAidScreen={false}
									scheduledTimes={scheduledTimes || []}
									setScheduledTimes={setScheduledTimes}
									changeDates={(value: [Date, Date]) => {
										const [start, end] = value
										formikRef.current?.setValues({
											...formikRef.current.values,
											receivingDateStart: start,
											receivingDateEnd: end
										})
									}}
									handleCheckTime={(value: boolean) => {
										formikRef.current?.setFieldValue('sameTime', value ? '0' : '1')
									}}
								/>

								<Paper
									sx={{
										padding: '20px',
										marginTop: '20px'
									}}
								>
									<Box
										display={'flex'}
										gap={2}
										flexDirection={'row'}
										flexWrap={'nowrap'}
										sx={{
											paddingBottom: '20px',
											'& .MuiSvgIcon-root, & .MuiTypography-root': {
												color: (theme) => theme.palette.secondary.light
											}
										}}
									>
										<SpeakerNotesIcon />
										<Typography variant='body1' sx={{ textAlign: 'center' }} fontWeight={600}>
											Ghi chú khi quyên góp
										</Typography>
									</Box>
									<Field name='note'>
										{({ field, meta }: FieldProps) => (
											<TextField
												{...field}
												multiline
												label='Ghi chú'
												maxRows={4}
												rows={2}
												error={meta.touched && !!meta.error}
												helperText={meta.touched && !!meta.error ? meta.error : ''}
												fullWidth
												sx={{
													mt: 3
												}}
											/>
										)}
									</Field>
								</Paper>

								<Box display={'flex'} justifyContent={'center'} mt={5}>
									<Button
										type='submit'
										variant='contained'
										color='secondary'
										sx={{
											width: '100px'
										}}
									>
										Gửi
									</Button>
								</Box>
							</Form>
						</DatePickerWrapper>
					)}
				</Formik>
			) : (
				<Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={400}>
					<CircularProgress color='secondary' size={50} />
					<Typography ml={3}>Đang tải dữ liệu...</Typography>
				</Box>
			)}
			<BackDrop open={islLoading} />
		</Container>
	)
}
