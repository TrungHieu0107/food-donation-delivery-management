// ** MUI Components
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import { ReactNode } from 'react'

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

interface CommonErrorProps {
  error: string
  action: ReactNode
}

const CommonError = (props: CommonErrorProps) => {
  const PageAction = props.action
  const error = props.error

  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            Lỗi 👨🏻‍💻
          </Typography>
          <Typography variant='h6' color={'red'} fontWeight={600}>
            {error}
          </Typography>
        </BoxWrapper>
        <Img
          height='487'
          alt='error-illustration'
          src='/images/pages/500.png'
          sx={{
            height: '300px !important',
            my: '15px !important'
          }}
        />
        {PageAction}
      </Box>
      <FooterIllustrations image={<TreeIllustration alt='tree' src='/images/pages/tree-3.png' />} />
    </Box>
  )
}

export default CommonError
