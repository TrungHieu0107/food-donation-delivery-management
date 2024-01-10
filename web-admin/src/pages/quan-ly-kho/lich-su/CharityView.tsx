import { Avatar, Box, Button, Chip, Collapse, Divider, Grid, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import axiosClient from 'src/api-client/ApiClient'

function SingleItemTab(props: any) {
  const [expanded, setExpanded] = useState(false)
  const [listCharityUnits, setListCharityUnits] = useState<any>([])

  const handleExpandClick = () => {
    if (expanded) {
      setExpanded(false)
      props?.setCurrentSelected(null)
      props?.setDataSearch({ ...props?.dataSearch, charityUnitId: '' })
    } else {
      setExpanded(true)
      props?.setCurrentSelected(props?.item?.id)
    }
  }
  useEffect(() => {
    const getListCharityUnits = async () => {
      try {
        const response = await axiosClient.get(`/charities/${props?.item?.id}/charity-units`)
        setListCharityUnits(response.data || [])
      } catch (error) {
        console.log('error get list charity unit: ', error)
      }
    }
    if (expanded) {
      getListCharityUnits()
    }
  }, [expanded, props?.item?.id])
  useEffect(() => {
    if (!props?.isActive) {
      setExpanded(false)
    }
  }, [props?.isActive])

  return (
    <Paper
      elevation={3}
      sx={{
        mb: 5,
        minWidth: 400
      }}
    >
      <Grid container sx={{}}>
        <Grid item xs={2}>
          <Box
            sx={{ width: '100px', height: '100px', ml: 2 }}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <Avatar src={props?.item?.logo} alt='img item' sx={{ width: 70, height: 70 }} />
          </Box>
        </Grid>
        <Grid item xs={5}>
          {props?.isActive ? (
            <Typography
              sx={{
                ...(props.isActive && { textDecoration: 'underline' }),
                ml: 3,
                mt: 5,
                mb: 3,
                fontWeight: 700,
                fontSize: '16px',
                color: '#2C74B3',
                cursor: 'pointer'
              }}
              align='left'
              onClick={handleExpandClick}
            >
              {props?.item?.name}
            </Typography>
          ) : (
            <Typography
              sx={{ ml: 3, mt: 5, mb: 3, fontWeight: 700, cursor: 'pointer' }}
              align='left'
              onClick={handleExpandClick}
            >
              {props?.item?.name}
            </Typography>
          )}

          {props?.isActive ? (
            <Typography align='left' sx={{ mb: 3, ml: 3 }}>
              <span style={{ fontWeight: 600 }}>Tổng số chi nhánh</span>: {props?.item?.numberOfCharityUnits}
            </Typography>
          ) : (
            <Typography align='left' sx={{ mb: 3, ml: 3 }}>
              <span style={{ fontWeight: 600 }}>Tổng số chi nhánh</span>: {props?.item?.numberOfCharityUnits}
            </Typography>
          )}
        </Grid>
        <Grid
          item
          xs={5}
          display={'flex'}
          flexDirection={'row'}
          flexWrap={'wrap'}
          alignItems={'center'}
          justifyContent={'flex-end'}
        >
          {props?.item?.status === 'ACTIVE' && (
            <Chip sx={{ mr: 3, mt: 3 }} label={'Đang hoạt động'} color='info' variant='filled' />
          )}
          {props?.item?.status === 'UNVERIFIED' && (
            <Chip sx={{ mr: 3, mt: 3 }} label={'Chưa xác thực'} color='primary' variant='filled' />
          )}
        </Grid>
        {/* <Grid item xs={12}>
          <Box display={'flex'} justifyContent={'center'} width={'100%'}>
            <IconButton aria-label='expand' onClick={handleExpandClick}>
              {expanded ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
            </IconButton>
          </Box>
        </Grid> */}
      </Grid>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        {/* <Typography sx={{ fontWeight: 600, mb: 2, textAlign: 'center', fontSize: '17px' }}>Các chi nhánh</Typography> */}
        <Divider/>
        {listCharityUnits.map((u: any) => (
          <Box key={u.id} sx={{ mb: 3 }}>
            <Grid container sx={{ p: 4 }}>
              <Grid item xs={2}>
                <Avatar src={u.image} alt='img item' sx={{ width: 80, height: 80 }} />
              </Grid>
              <Grid item xs={10}>
                <Typography sx={{ fontWeight: 600, mb: 2 }}>{u.name}</Typography>
                <Typography sx={{ mb: 2 }}>Email: {u.email}</Typography>
                <Typography sx={{ mb: 2 }}>Số điện thoại: {u.phone}</Typography>
                <Typography sx={{ mb: 2 }}>Địa chỉ: {u.address}</Typography>
                <Button
                  variant='outlined'
                  color='primary'
                  size='small'
                  onClick={() => {
                    props?.setDataSearch({
                      ...props?.dataSearch,
                      charityUnitId: u.id
                    })
                  }}
                >
                  Xem sao kê
                </Button>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Collapse>
    </Paper>
  )
}

export default SingleItemTab
