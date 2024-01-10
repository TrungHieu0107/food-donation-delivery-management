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

const Error401 = () => {
  return (
    <Box className='content-center'>
      <Box  sx={{ p: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', bgcolor:"rgba(255,255,255, 0.75)" }} 
      component={Paper}>
        <BoxWrapper>
          <Typography variant='h1'>401</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            You are not authorized! 🔐
          </Typography>
          <Typography variant='body2'>You don&prime;t have permission to access this page. Go Home!</Typography>
        </BoxWrapper>
        <Img
          height='400'
          alt='error-illustration'
          src='data:image/png;base64,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'
          sx={{
            height: '400px !important',
            my: '15px !important'
          }}
        />
        <Link passHref href='/quan-tri-vien/dang-nhap'>
          <Button component='a' color='info' variant='contained' sx={{ px: 5.5 }}>
            Quay lại đăng nhập
          </Button>
        </Link>
      </Box>
      <FooterIllustrations />
    </Box>
  )
}

Error401.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Error401
