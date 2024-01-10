import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Chip,
	Divider,
	Grid,
	Skeleton,
	Stack,
	SxProps,
	Typography,
	TypographyProps,
	styled
} from '@mui/material'
import type { LatLngExpression } from 'leaflet'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import React, { Fragment, useEffect, useState } from 'react'
import { UserAPI } from 'src/api-client/User'
import { KEY, Role } from 'src/common/Keys'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import DisplayFile from 'src/layouts/components/file/DisplayFile'
import { EmailOutline, MapMarkerOutline, PhoneOutline } from 'mdi-material-ui'
import { CharityUnitModel } from 'src/models/Charity'
import { CharityAPI } from 'src/api-client/Charity'
import CharityUnitCard from './CharityUnitCard'
import { arrayRange } from 'src/@core/layouts/utils'
import { UserModel } from 'src/models/User'
import UpdateProfileLocation from './UpdateProfileLocation'
import UpdateAvatarDialog from './UpdateAvatarDialog'
import { toast } from 'react-toastify'
import { Session } from 'next-auth'
import UpdateNameDialog from './UpdateNameDialog'
import UpdateAllProfileDialog from './UpdateAllProfileDialog'
import UpdateCharityUnit from './UpdateCharityUnit'
import BackDrop from 'src/layouts/components/loading/BackDrop'
import UpdateLegalDocument from './UpdateLegalDocument'

const Content = styled(Typography)<TypographyProps>(({ theme }) => ({
	...theme.typography,
	textAlign: 'left',
	[theme.breakpoints.down('md')]: {
		flex: 2
	} as SxProps,
	[theme.breakpoints.up('md')]: {
		flex: 4
	} as SxProps,
	[theme.breakpoints.up('lg')]: {
		flex: 5
	} as SxProps
}))

const DetailLocation = dynamic(() => import('src/layouts/components/map/DetailCurrentLocation'), {
	ssr: false
})

export default function ProfileLogin() {
	const [loading, setLoading] = useState<boolean>(true)
	const [userLogin, setUserLogin] = useState<UserModel>()
	const [charityUnits, setCharityUnits] = useState<CharityUnitModel[]>()
	const [location, setLocation] = useState<LatLngExpression>()
	const { data: session, status, update } = useSession()
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

	useEffect(() => {
		if (status === 'authenticated') {
			fetchDataUserLogin()
		}
		setLoading(false)
	}, [status])

	useEffect(() => {
		if (session?.user.role === KEY.ROLE.CHARITY) {
			fetchCharityUnits()
		}
	}, [userLogin])

	const fetchCharityUnits = async () => {
		if (!userLogin) return

		const response = await CharityAPI.getCharityUnitsOfCharity(
			userLogin?.charity?.id ?? KEY.DEFAULT_VALUE
		)
		setCharityUnits(new CommonRepsonseModel<CharityUnitModel[]>(response).data)
	}

	const fetchDataUserLogin = async () => {
		const data = await UserAPI.getProfileLogin()
		const commonDataResponse = new CommonRepsonseModel<UserModel>(data)

		if (commonDataResponse.data?.location) {
			const lat: number = Number.parseFloat(
				commonDataResponse.data?.location?.toString().split(',')[0] || '0'
			)
			const lng: number = Number.parseFloat(
				commonDataResponse.data?.location?.toString().split(',')[1] || '0'
			)
			lat === 0 && lng === 0 ? setLocation(undefined) : setLocation([lat, lng] as LatLngExpression)
		}

		const user = commonDataResponse.data
		if (isCharityLogin() && user?.charityUnitId) {
			const charityUnitResponse = await CharityAPI.getCharityUnitsById(user?.charityUnitId)
			const charityUnit = new CommonRepsonseModel<CharityUnitModel>(charityUnitResponse).data
			user.description = charityUnit?.description
			user.phone = charityUnit?.phone
			user.address = charityUnit?.address
			user.avatar = charityUnit?.image as string
		}

		setUserLogin(user)
	}

	const isCharityLogin = () => session?.user.role === KEY.ROLE.CHARITY

	const handleChangeAvatar = async (imageSrc: string, imageData: File): Promise<boolean> => {
		try {
			setIsSubmitting(true)
			const reponse = await UserAPI.updateProfile({
				avatar: imageData
			})

			toast.success(new CommonRepsonseModel<any>(reponse).message)
			setUserLogin({
				...userLogin,
				avatar: imageSrc
			})
			const newSession = {
				...session,
				user: {
					...session?.user,
					image: imageSrc
				}
			} as Session

			update(newSession)

			return true
		} catch (error) {
			console.log(error)

			return false
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleUpdateName = async (value: string): Promise<boolean> => {
		try {
			const response = await UserAPI.updateProfile({
				name: value
			})
			toast.success(new CommonRepsonseModel<any>(response).message)
			setUserLogin({
				...userLogin,
				name: value
			})

			return true
		} catch (error) {
			console.log(error)

			return false
		}
	}

	const handleChangeLocation = async (address: string, newLocation: LatLngExpression) => {
		try {
			if (isCharityLogin()) {
				const response = await CharityAPI.updateCharityUnit({
					address: address,
					location: newLocation
				})
				toast.success(new CommonRepsonseModel<any>(response).message)
			} else {
				const response = await UserAPI.updateProfile({
					address: address,
					location: newLocation
				})
				toast.success(new CommonRepsonseModel<any>(response).message)
			}

			fetchDataUserLogin()
		} catch (error) {
			console.error(error)
		}
	}

	const handleUpdateLegalDocument = async (value: File) => {
		try {
			const reponse = await CharityAPI.updateCharityUnit({
				legalDocument: value
			} as CharityUnitModel)
			toast.success(new CommonRepsonseModel<any>(reponse).message)

			return true
		} catch (error) {
			console.log(error)

			return false
		}
	}

	return (
		<Fragment>
			<Grid container spacing={3}>
				<Grid item xl={12} lg={12} md={12} xs={12}>
					<Card sx={{ position: 'relative' }}>
						<CardMedia sx={{ height: 300 }} image={'/images/cards/background-user.png'} />
						{!loading && userLogin ? (
							<Avatar
								alt={userLogin?.name}
								src={userLogin?.avatar || '/images/avatars/1.png'}
								sx={{
									width: 185,
									height: 185,
									left: 60,
									top: 230,
									position: 'absolute',
									border: (theme) => `0.25rem solid ${theme.palette.common.white}`
								}}
							/>
						) : (
							<Skeleton variant='circular' height={185} width={185} />
						)}

						{!loading && userLogin && !isCharityLogin() && (
							<UpdateAvatarDialog
								avatar={userLogin.avatar || ''}
								key={'update-avatar'}
								handleChangeAvatar={handleChangeAvatar}
							/>
						)}
						<Grid
							container
							sx={{
								width: 'auto',
								marginLeft: 60,
								marginTop: 2,
								marginRight: 2,
								paddingBottom: 10
							}}
							direction={'row'}
						>
							<Grid
								item
								xl
								lg
								md
								sm
								xs
								container
								alignItems={'center'}
								sx={{
									paddingLeft: 5
								}}
							>
								<Grid item container>
									{!loading && userLogin ? (
										<Grid item xl={12} lg={12} md={12} xs={12} sm={12}>
											<Content
												variant='h4'
												fontWeight={800}
												sx={{
													position: 'relative',
													'&.MuiTypography-root': {
														width: 'fit-content'
													}
												}}
											>
												{userLogin?.name}
												{!isCharityLogin() && (
													<UpdateNameDialog
														name={userLogin.name || ''}
														updateName={handleUpdateName}
													/>
												)}
											</Content>
										</Grid>
									) : (
										<Skeleton variant='rectangular' height={150} />
									)}
									<Grid item>
										{!loading && userLogin ? (
											<Chip
												label={
													<Typography
														fontWeight={600}
														sx={{
															color: (theme) => theme.palette.primary.contrastText
														}}
														paddingX={5}
													>
														{Role[session?.user.role ?? '']}
													</Typography>
												}
												color='secondary'
											></Chip>
										) : (
											<Skeleton variant='rectangular' height={150} />
										)}
									</Grid>
								</Grid>
							</Grid>
							<Grid item container justifyContent={'flex-end'} width={'auto'}>
								<Grid item>
									{userLogin &&
										(isCharityLogin() ? (
											<UpdateCharityUnit
												userId={userLogin.id || KEY.DEFAULT_VALUE}
												id={userLogin.charityUnitId || KEY.DEFAULT_VALUE}
											/>
										) : (
											<UpdateAllProfileDialog
												updateUserLogin={setUserLogin}
												userLogin={userLogin}
												isCollaborator={false}
												location={location || [0, 0]}
											/>
										))}
								</Grid>
							</Grid>
						</Grid>
						{isCharityLogin() && (
							<Stack divider={<Divider />}>
								<Box key='intro' display={'flex'} justifyContent={'center'}>
									<Typography textAlign={'center'} paddingX={20}>
										{userLogin?.description}
									</Typography>
								</Box>
								<Grid key={2} container paddingX={10} rowSpacing={2} direction={'column'}>
									<Grid item display={'flex'} justifyContent={'space-between'}>
										<Typography variant='h6' fontWeight={550}>
											Tổ chức trực thuộc
										</Typography>
										{userLogin?.isHeadquarter && (
											<Button
												sx={{
													textTransform: 'none'
												}}
											>
												Chỉnh sửa thông tin
											</Button>
										)}
									</Grid>
									<Grid item container spacing={3}>
										<Grid
											item
											xl={2}
											lg={2}
											md={2}
											sm={12}
											xs={12}
											container
											direction={'column'}
											alignItems={'center'}
										>
											<Grid item>
												<Avatar
													src={userLogin?.charity?.logo}
													sx={{
														height: 100,
														width: 100
													}}
												/>
											</Grid>
										</Grid>
										<Grid
											item
											xl
											lg
											md
											sm
											xs
											display={'flex'}
											flexDirection={'column'}
											justifyContent={'center'}
										>
											<Typography fontWeight={600} textAlign={'center'}>
												{userLogin?.charity?.name}
											</Typography>
											<Typography
												sx={{
													textIndent: 10
												}}
											>
												{userLogin?.charity?.description}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
								<Grid key={4} container paddingX={10} rowSpacing={2} flexDirection={'column'}>
									<Grid item>
										<Typography variant='h6' fontWeight={600}>
											Các đơn vị khác
										</Typography>
									</Grid>
									<Grid
										item
										container
										spacing={3}
										flexWrap={'nowrap'}
										sx={{
											overflowX: 'auto',
											marginBottom: 2
										}}
									>
										{!loading
											? charityUnits?.map((charityUnit) => (
													<Grid
														item
														key={charityUnit.id}
														sx={{
															paddingBottom: '1px'
														}}
													>
														<CharityUnitCard
															key={charityUnit.id}
															charityUnit={{
																...charityUnit,
																isHeadquarter: charityUnit.id === userLogin?.charityUnitId
															}}
														/>
													</Grid>
											  ))
											: arrayRange(0, 3, 1).map((item) => (
													<Grid item container key={item} spacing={3}>
														<Skeleton width={200} height={220} />
														<Skeleton width={200} height={20} />
													</Grid>
											  ))}
									</Grid>
								</Grid>
							</Stack>
						)}
					</Card>
				</Grid>
				<Grid item container spacing={3} justifyContent={'center'}>
					<Grid
						item
						xl={isCharityLogin() ? 4 : 12}
						lg={isCharityLogin() ? 5 : 12}
						md={12}
						sm={12}
						xs={12}
					>
						<Card>
							<CardHeader
								title={
									<Typography variant='h5' fontWeight={550}>
										Thông tin cơ bản
									</Typography>
								}
							/>
							<CardContent>
								<Grid container spacing={2} direction={'column'}>
									<Grid item display={'flex'} gap={2}>
										<EmailOutline color='secondary' />
										<Typography>{`Email: ${userLogin?.email || KEY.DEFAULT_VALUE}`}</Typography>
									</Grid>
									<Grid item display={'flex'} gap={2}>
										<PhoneOutline color='secondary' />
										<Typography>{`Số điện thoại: ${
											userLogin?.phone || KEY.DEFAULT_VALUE
										}`}</Typography>
									</Grid>
									<Grid item display={'flex'} gap={2} alignItems={'start'}>
										<MapMarkerOutline color='secondary' />
										{!loading && !!userLogin ? (
											<UpdateProfileLocation
												address={userLogin.address || ''}
												updateLocation={handleChangeLocation}
												location={location}
											/>
										) : (
											<Skeleton width={'100%'} height={200} />
										)}
									</Grid>
									<Grid item>
										{!loading && userLogin ? (
											<DetailLocation selectedPosition={location} />
										) : (
											<Skeleton variant='rectangular' height={150} />
										)}
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>

					{session?.user.role === KEY.ROLE.CHARITY && (
						<Grid item xl={8} lg={7} md={12} sm={12} xs={12}>
							<Card>
								<CardHeader
									title={
										<Grid container justifyContent={'space-between'}>
											<Grid item>
												<Typography variant='h5' fontWeight={550}>
													Tài liệu đăng ký
												</Typography>
											</Grid>
											<Grid item>
												<UpdateLegalDocument
													legalDocumentUrl={userLogin?.legalDocuments || ''}
													updateLegalDocument={handleUpdateLegalDocument}
												/>
											</Grid>
										</Grid>
									}
								/>
								<CardContent>
								 {userLogin?.legalDocuments && (
										<DisplayFile fileLink={userLogin?.legalDocuments} />
									)} 		
									{/* <img src={"https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2021/5/25/913055/Hoai-Linh.jpeg"} style={{height:'700px'}} alt="legal_document"/> */}
								</CardContent>
							</Card>
						</Grid>
					)}
				</Grid>
			</Grid>
			<BackDrop open={isSubmitting} />
		</Fragment>
	)
}

ProfileLogin.auth = [KEY.ROLE.CONTRIBUTOR, KEY.ROLE.CHARITY]
