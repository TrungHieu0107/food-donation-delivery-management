// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import { Paper } from '@mui/material'

// ** Styled Components
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13)
  }
}))

const TreeIllustration = styled('img')(({ theme }) => ({
  left: 0,
  bottom: '5rem',
  position: 'absolute',
  [theme.breakpoints.down('lg')]: {
    bottom: 0
  }
}))

const Error403 = () => {
  return (
    <Box className='content-center'>
      <Box 
      sx={{ p: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', bgcolor:"rgba(255,255,255, 0.75)" }} 
      component={Paper}>
        <BoxWrapper>
          {/* <Typography variant='h1'>404</Typography> */}
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            Trang không tồn tại ⚠️
          </Typography>
          <Typography variant='body2' align='center'>Trang mà bạn đang tìm kiếm hiện không tồn tại trong hệ thống, vui lòng kiểm tra lại.</Typography>
        </BoxWrapper>
        <Img height='487' alt='error-illustration' src='https://wpklik.com/wp-content/uploads/2019/03/A-404-Page-Best-Practices-and-Design-Inspiration.jpg' 
        sx={{
          height: '400px !important',
          my: '15px !important',
        }} />
        <Link passHref href='/'>
          <Button component='a' variant='contained' color='secondary' sx={{ px: 5.5, mt: 5 }}>
            Trang chủ
          </Button>
        </Link>
      </Box>
      <FooterIllustrations image={<TreeIllustration alt='tree' src='/images/pages/tree.png' />} />
    </Box>
  )
}

Error403.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error403
