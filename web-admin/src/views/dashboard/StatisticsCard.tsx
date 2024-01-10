// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined'
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}

// "numberOfPending": 0,
//     "numberOfAccepted": 1,
//     "numberOfCanceled": 0,
//     "numberOfProcessing": 2,
//     "numberOfRejected": 0,
//     "numberOfSelfShipping": 0,
//     "numberOfExpried": 0,
//     "total": 3



  const RenderStats = ({dataStatistic}: any) => {
    const renderData: DataType[] = [
      {
        stats: `${dataStatistic?.total ?? 0}`,
        title: 'Tổng số',
        color: 'info',
        icon: <BallotOutlinedIcon sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: `${dataStatistic?.numberOfAccepted ?? 0}`,
        title: 'Đã chấp nhận',
        color: 'success',
        icon: <CheckCircleOutlineIcon sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: `${dataStatistic?.numberOfPending ?? 0}`,
        title: 'Đang chờ',
        color: 'secondary',
        icon: <HourglassEmptyIcon sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: `${dataStatistic?.numberOfProcessing ?? 0}`,
        color: 'info',
        title: 'Đang xử lí',
        icon: <BlurOnOutlinedIcon sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: `${dataStatistic?.numberOfSelfShipping ?? 0}`,
        title: 'Tự vận chuyển',
        color: 'primary',
        icon: <LocalShippingOutlinedIcon sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: `${dataStatistic?.numberOfRejected ?? 0}`,
        title: 'Đã bị từ chối',
        color: 'error',
        icon: <PanToolOutlinedIcon sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: `${dataStatistic?.numberOfCanceled ?? 0}`,
        color: 'error',
        title: 'Đã bị hủy',
        icon: <CancelOutlinedIcon sx={{ fontSize: '1.75rem' }} />
      },
      {
        stats: `${dataStatistic?.numberOfExpried ?? 0}`,
        color: 'warning',
        title: 'Đã hết hạn',
        icon: <ErrorOutlineIcon sx={{ fontSize: '1.75rem' }} />
      }
    ]

    return (
      <>
      {renderData?.map((item: DataType, index: number) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${item.color}.main`
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ))}
    
    </>)
  }

const StatisticsCard = ({dataStatistic}: any) => {
  return (
    <Card>
      <CardHeader
        title='Tổ chức từ thiện kêu gọi giúp đỡ'      
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
            ❤ Thống kê về số lần các lời kêu gọi hỗ trợ từ toàn bộ tổ chức từ thiện tham gia vào hệ thống ❤
            </Box>{' '}
           
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 5]}>
          {/* {renderStats()} */}
          <RenderStats dataStatistic={dataStatistic}/>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
