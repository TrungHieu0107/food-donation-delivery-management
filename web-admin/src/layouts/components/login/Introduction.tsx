import * as React from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'

export default function Introduction() {
  return (
    <Box
      className='content-center'
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        paddingX: 10,
        justifyContent: 'space-between',
        gap: 2,
        flex: 2
      }}
    >
      <Card sx={{ zIndex: 1, width: '100%' }}>
        <CardContent
          sx={{
            padding: 5,
            display: 'flex',
            justifyContent: 'flex-start',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          <img src={process.env.IMAGE || ''} width='200px' height='150px' />

          <Box
            sx={{
              margin: 5
            }}
          >
            <Typography
              variant='body2'
              sx={{
                fontWeight: '700'
              }}
            >
              {' '}
              Miêu tả hình ảnh{' '}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ zIndex: 1, width: '100%' }}>
        <CardContent
          sx={{
            padding: 5,
            display: 'flex',
            justifyContent: 'flex-end',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          <Box
            sx={{
              margin: 5
            }}
          >
            <Typography
              variant='body2'
              sx={{
                fontWeight: '700'
              }}
            >
              {' '}
              Miêu tả hình ảnh{' '}
            </Typography>
          </Box>
          <img src={process.env.IMAGE || ''} width='200px' height='150px' />
        </CardContent>
      </Card>
      <Card sx={{ zIndex: 1, width: '100%' }}>
        <CardContent
          sx={{
            padding: 5,
            display: 'flex',
            justifyContent: 'flex-start',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          <img src={process.env.IMAGE || ''} width='200px' height='150px' />
          <Box
            sx={{
              margin: 5
            }}
          >
            <Typography
              variant='body2'
              sx={{
                fontWeight: '700'
              }}
            >
              {' '}
              Miêu tả hình ảnh{' '}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
