'use client'

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
    Box,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import { useSession } from 'next-auth/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axiosClient from 'src/api-client/ApiClient'
import { UserAPI } from 'src/api-client/User'
import { KEY } from 'src/common/Keys'
import { UserModel } from 'src/models/User'
import { CommonRepsonseModel } from 'src/models/common/CommonResponseModel'
import * as Yup from 'yup'
import PostDetail from './PostDetail'
import BackDrop from 'src/layouts/components/loading/BackDrop'

const validationSchema = Yup.object({
	content: Yup.string()
		.required('Nội dung bắt buộc có')
		.min(10, 'Bài viết nhất ít nhất cần có 10 kí tự')
		.max(500, 'Bài viết nhiều nhất 500 kí tự'),
	mainImage: Yup.mixed().required('Hình ảnh cho hoạt động cần phải có')
})
interface filter {
  page: number
  pageSize: number
  status: string
}

function PrivatePost() {
  const [filterObject, setFilterObject] = useState<filter>({
    page: 1,
    pageSize: 10,
    status: 'ACTIVE'
  })
  const [imgSrc, setImgSrc] = useState<string[]>([])
  const [data, setData] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadMore, setIsLoadMore] = useState<boolean>(false)
  const [statusSelect, setStatusSelect] = useState<any>('ACTIVE')
  const [isChangeStatus, setIsChangeStatus] = useState<boolean>(false)
  const { data: session, status } = useSession()
  const [userLogin, setUserLogin] = useState<UserModel>()
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleClickOpen = () => {
    setOpen(true);
    setImgSrc([])
  };

  const handleClose = () => {
    setOpen(false);
    setImgSrc([])
  };
  const handleChange = (event: SelectChangeEvent) => {
    setStatusSelect(event.target.value as string)
    setIsChangeStatus(true)
    setFilterObject({
      ...filterObject,
      page: 1,
      status: event.target.value as string
    })
  }
  const fetchDataUserLogin = async () => {
    try {
      const data = await UserAPI.getProfileLogin()
      const commonDataResponse = new CommonRepsonseModel<UserModel>(data)
      setUserLogin(commonDataResponse.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (status === 'authenticated') {
      fetchDataUserLogin()
    }
  }, [status])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: any = await axiosClient.get(`/posts/status`, {
          params: filterObject,
          paramsSerializer: {
            indexes: null
          }
        })
        console.log(response)
        if (data.length === 0 || filterObject.page === 1) {
          setData(response.data || [])
        } else {
          if (isChangeStatus) {
            setData(response.data || [])
            
          } else {
            setData((prevData: any) => [...prevData, ...(response.data || [])])        
          }
        }
        if (response?.data?.length === 0 || response?.data === null) {
          setIsLoadMore(false)
        } else {
          setIsLoadMore(true)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
        setIsChangeStatus(false)
      }
    }
    fetchData()
  }, [filterObject])


  const handleLoadMore = () => {
    setFilterObject({
      ...filterObject,
      page: filterObject.page + 1
    })
  }

  return (
		<Box sx={{ p: 5, width: '70vw', m: 'auto' }}>
			<Box
				sx={{
					height: '40px',
					mb: 5,
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Typography variant='h5' fontWeight={600}>
					Tổng hợp các bài viết
				</Typography>
			</Box>
			<Grid container sx={{ width: '90%', m: 'auto', mb: 5, mt: 10 }}>
				<Grid item xs={12} md={6}>
					<Stack direction={'row'} alignItems={'center'} spacing={3}>
						<FilterListIcon />
						<FormControl fullWidth>
							<InputLabel id='filter-status'>Trạng thái</InputLabel>
							<Select
								labelId='filter-status'
								id='demo-simple-select'
								value={statusSelect}
								size='small'
								label='Trạng thái'
								onChange={handleChange}
							>
								<MenuItem value={'UNVERIFIED'}>Chưa xác thực</MenuItem>
								<MenuItem value={'ACTIVE'}>Đã được phê duyệt</MenuItem>
								<MenuItem value={'INACTIVE'}>Ngưng hoạt động</MenuItem>
								<MenuItem value={'REJECT'}>Đã bị từ chối</MenuItem>
							</Select>
						</FormControl>
					</Stack>
				</Grid>
				{session?.user.role === 'CHARITY' && (
					<Grid xs={12} md={6}>
						<Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
							<Button
								startIcon={<AddBoxOutlinedIcon />}
								variant='contained'
								size='small'
								color='info'
								sx={{
									borderRadius: '20px',
									mb: 5,
									mt: { xs: 5, md: 0 }
								}}
								onClick={handleClickOpen}
							>
								Tạo bài viết
							</Button>
						</Box>
					</Grid>
				)}
			</Grid>

			{isLoading === false &&
				data.length > 0 &&
				data.map((p: any, index: any) => (
					<PostDetail
						type='PRIVATE'
						userLogin={userLogin}
						setData={setData}
						setFilterObject={setFilterObject}
						filterObject={filterObject}
						key={index}
						data={p}
					/>
				))}
			{isLoading === true && (
				<Stack
					sx={{ height: '50vh', width: '100%' }}
					direction={'column'}
					justifyContent={'center'}
					alignItems={'center'}
				>
					<CircularProgress color='info' />
					<Typography>Đang tải dữ liệu...</Typography>
				</Stack>
			)}
			<Box sx={{ width: '90%', m: 'auto', mt: 10, mb: 10 }}>
				{isLoadMore && (
					<Button variant='contained' fullWidth color='info' onClick={handleLoadMore}>
						Tải thêm
					</Button>
				)}
				{isLoadMore === false && isLoading === false && (
					<Typography sx={{ fontWeight: 700, textAlign: 'center' }}>
						Hiện không có bài viết để tải lên
					</Typography>
				)}
			</Box>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title' sx={{ textAlign: 'center' }}>
					{'Tạo bài viết mới'}
				</DialogTitle>
				<DialogContent>
					<Formik
						initialValues={{
							content: '',
							mainImage: null
						}}
						validationSchema={validationSchema}
						onSubmit={async (values) => {
							try {
                setIsSubmitting(true)
								const formData = new FormData()
								formData.append('Content', values.content)
                if (values.mainImage)
									for (let i = 0; i < (values.mainImage as FileList).length; i++) {
										formData.append(`Images`, values.mainImage[i])
									}
								const res: any = await axiosClient.post(`/posts`, formData, {
									headers: {
										'Content-Type': 'multipart/form-data'
									}
								})
								console.log(res)
								setOpen(false)
								toast.success(
									'Bài viết của bạn đã được chúng tôi ghi nhận. Vui lòng chờ hệ thống duyệt.'
								)
								setFilterObject({ ...filterObject, page: 1 })
							} catch (error) {
								console.log(error)
								toast.error('Tạo bài viết không thành công')
							} finally {
                setIsSubmitting(false)
              }
						}}
					>
						{({}) => (
							<Form>
								<Field name='content'>
									{({ field, meta }: any) => (
										<TextField
											{...field}
											label='Nội dung'
											multiline
											rows={3}
											error={meta.touched && !!meta.error}
											helperText={meta.touched && meta.error ? meta.error : ''}
											fullWidth
											placeholder='Nhập nội dung bài viết...'
											sx={{ mt: 5 }}
										/>
									)}
								</Field>
								<Box sx={{ mt: 3 }}>
									<Field name='mainImage'>
										{({ field, form, meta }: any) => (
											<>
												<Button
													component='label'
													color='info'
													variant='outlined'
													htmlFor='mainImage'
												>
													Chọn hình
													<input
														hidden
														multiple
														type='file'
														id='mainImage'
														accept='image/png, image/jpeg'
														onChange={(
															event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
														) => {
															const files = (event.target as HTMLInputElement).files || [];
															const updatedImgSrcArray: string[] = []
															const readNextFile = (index: any) => {
																if (index < files.length) {
																	const reader = new FileReader()
																	reader.onload = () => {
																		updatedImgSrcArray.push(reader.result as string)
																		if (updatedImgSrcArray.length === files.length) {
																			// After all images are loaded, update the state
																			setImgSrc(updatedImgSrcArray)
																		} else {
																			// Read the next file
																			readNextFile(index + 1)
																		}
																	}
																	reader.readAsDataURL(files[index])
																}
															}

															// Start reading the first file
															readNextFile(0)
															form.setFieldValue(field.name, files)
														}}
													/>
												</Button>
												{meta.touched && meta.error && (
													<div style={{ color: 'red', fontSize: '13px' }}>{meta.error}</div>
												)}
											</>
										)}
									</Field>
									<Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 4 }}>
										<Box sx={{ width: '100vw' }}>
											<Grid container spacing={3}>
												{imgSrc.map((src, index) => (
													<Grid item lg={2.4} md={3} xs={12} key={index}>
														<Card>
															<CardMedia
																component='img'
																height='194'
																image={src}
																alt='Paella dish'
															/>
														</Card>
													</Grid>
												))}
											</Grid>
										</Box>
									</Box>
								</Box>
								<Button
									type='submit'
									variant='contained'
									color='info'
									fullWidth
									sx={{ mt: 5, mb: 5 }}
								>
									Nộp
								</Button>
							</Form>
						)}
					</Formik>
				</DialogContent>
			</Dialog>
      {isSubmitting && <BackDrop open={true}/>}
		</Box>
	)
}

export default PrivatePost

PrivatePost.auth = {
  role: [KEY.ROLE.CHARITY, KEY.ROLE.CONTRIBUTOR]
}
