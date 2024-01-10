import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined'
import { Box, Button, Chip, FormControl, Stack, TextField } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Collapse from '@mui/material/Collapse'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import Carousel from 'react-material-ui-carousel'
import { toast } from 'react-toastify'
import { formateDateDDMMYYYYHHMM } from 'src/@core/layouts/utils'
import axiosClient from 'src/api-client/ApiClient'
import MenuApply from './MenuAction'
import useSession from 'src/@core/hooks/useSession'
import { KEY } from 'src/common/Keys'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}
interface loadComment {
	page: number
	pageSize: number
}
const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand,...other } = props

  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

export default function PostDetail({ userLogin, data, setFilterObject, filterObject }: any) {
  const [expanded, setExpanded] = React.useState<any>(false)
  const [loadComment, setLoadComment] = React.useState<loadComment>({
		page: 1,
		pageSize: 10
	})
  const [comments, setComments] = React.useState<any>()
  const [isComment, setIsComment] = React.useState<any>(false)
  const [contentComment, setContentComment] = React.useState<any>()
  const [canLoadMore, setCanLoadMore] = React.useState<boolean>(true)
  const {session } : any = useSession()
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
	const handleComment = () => {
		setExpanded(true)
		setIsComment(!isComment)
	}
	const handlePushComment = async (id: any) => {
		try {
			const res: any = await axiosClient.post(`/post-comments`, {
				postId: id,
				content: contentComment
			})
			console.log(res)
			toast.success('Bình luận của bạn đã được ghi nhận')
      setContentComment("")
			setLoadComment({page: 1,
			pageSize: 10})

			// setFilterObject({
			// 	page: 1,
			// 	pageSize: 10
			// })
		} catch (error) {
			console.log(error)
			toast.error('Thao tác không thành công')
		}
	}
	const handleLoadMoreComments = () => {
		setLoadComment({
			page: loadComment.page + 1,
			pageSize: 10
		})
	}
  React.useEffect(() => {
		const fetchData = async (id: any) => {
			try {
        console.log("zo");
				const res: any = await axiosClient.get(`/post-comments?postId=${id}`, {
					params: loadComment
				})
				if (res.data?.length === 0) {
					setCanLoadMore(false)
				}
				if (loadComment.page === 1) {
					setCanLoadMore(true)
					setComments(res.data || [])
				} else if(comments.length === 0){
          setCanLoadMore(false)
					setComments(res.data || [])
        }
        else {
					setComments((prevData: any) => [...prevData, ...(res.data || [])])
				}
			} catch (error: any) {
				console.log(error?.response)
				setComments([])
			}
		}
		if (data && data?.id && data?.status === 'ACTIVE') {
			fetchData(data?.id)
		}
	}, [data, loadComment])

  return (
    <Card sx={{ width: { xs: '100%', sm:"80%" ,md: '70%' }, m: 'auto', mb: 15 }}>
      
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} src={data?.createBy?.avatar} alt='avatar'/>       
        }
        action={data?.status === 'UNVERIFIED' && session.user.role === KEY.ROLE.SYSTEM_ADMIN ? <MenuApply setFilterObject={setFilterObject} filterObject={filterObject} id={data?.id}/> : null}
        title={data?.createBy?.fullName}
        
        subheader={data?.createdDate ? formateDateDDMMYYYYHHMM(data?.createdDate) : 'Chưa cập nhật'}       
      />
      <Box sx={{mb: 5, ml: 20}}>
      {data?.status === "UNVERIFIED" && <Chip label="Chưa xác thực" color='warning'/>}
      {data?.status === "ACTIVE" && <Chip label="Đã được phê duyệt" color='info'/>}
      {data?.status === "INACTIVE" && <Chip label="Ngưng hoạt động" color='error'/>}
      {data?.status === "REJECT" && <Chip label="Đã bị từ chối" color='error'/>}
      </Box>

      <Carousel sx={{ margin: 'auto', border: 'none' }}
      indicatorContainerProps={{
        style: {
          zIndex: 1,
          marginTop: '-24px',
          position: 'relative'
        }
      }}>
          {data?.images &&
            data?.images?.map((i: any, index: any) => (
              <CardMedia key={index} component='img' height='450' image={i} alt='img' sx={{ objectFit: 'cover' }} />
            ))}
        </Carousel>
      <CardContent>
        <Typography>{data?.content}</Typography>
      </CardContent>
      {data?.status === "ACTIVE" &&  <CardActions disableSpacing>
      {data?.status === "ACTIVE" &&  <Button onClick={handleComment} startIcon={<MessageOutlinedIcon />}>
          Bình luận
        </Button> }

        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>}
      <Collapse in={expanded} timeout='auto' unmountOnExit>
       
        {comments &&
          comments.map((c: any) => (
            <Box sx={{ width: '90%', ml: 10, mb: 10 }} key={c.id}>
              <Stack direction={'row'} alignItems={'flex-start'} spacing={3}>
                <Avatar sx={{ mt: 2 }} src={data?.createBy?.avatar} />
                <Stack
                  direction='column'
                  justifyContent='center'
                  alignItems='flex-start'
                  spacing={2}
                  sx={{ borderRadius: '20px', bgcolor: '#f0f0f0', p: 5 }}
                >
                  <Typography sx={{ fontWeight: 700, color:"black" }}>{c?.name}</Typography>
                  <Typography paragraph  sx={{color:"black" }}>{c?.content}</Typography>{' '}
                </Stack>{' '}
              </Stack>
            </Box>
          ))}
          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
         
          		{canLoadMore && (
					<Typography
						sx={{ fontSize: '15px', ml: 10, mb: 5, fontWeight: 600, cursor: 'pointer' }}
						onClick={handleLoadMoreComments}
					>
						Tải thêm bình luận...
					</Typography>
				)}
				{canLoadMore === false && (
					<Typography sx={{ fontSize: '15px', ml: 10, mb: 5, fontWeight: 600 }}>
						Hiện không còn bình luận để tải thêm
					</Typography>
				)}
         <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>      
          <ExpandMoreIcon />     
        </ExpandMore>
          </Stack>
           {isComment && (
          <Box sx={{ ml: 10, mb: 10, mr: 10 }}>
            <Stack direction={'row'} alignItems={'flex-start'} spacing={3}>
              <Avatar sx={{ mt: 2 }} src={userLogin?.avatar} />
              <Stack
                direction='column'
                justifyContent='center'
                alignItems='flex-start'
                spacing={2}
                sx={{ borderRadius: '20px', bgcolor: '#f0f0f0', p: 5, width: '90%' }}
              >
                <Typography sx={{ fontWeight: 700, color:"black" }}>{userLogin?.name}</Typography>
                <Box sx={{width:"100%"}}>
                  <FormControl fullWidth>
                  <TextField
                  label="Bình luận"
                    fullWidth
                    multiline
                    rows={2}
                    value={contentComment}
                    onChange={e => setContentComment(e.target.value)}
                    placeholder='Nhập bình luận bạn ở đây ...'
                  />
                  </FormControl>
                <Button variant='contained' 
                color="info" 
                sx={{mt: 3}}
                disabled={contentComment?.length > 0 ? false : true}
                onClick={()=>handlePushComment(data.id)}
                >Đăng</Button>
                </Box>
              </Stack>{' '}
            </Stack>
         
          </Box>
        )}
      </Collapse>
    </Card>
  )
}
