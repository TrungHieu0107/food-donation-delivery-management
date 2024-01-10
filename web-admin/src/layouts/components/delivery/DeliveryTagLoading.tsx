import { Skeleton, Card, Box } from '@mui/material'
import * as React from 'react';

export default function DeliveryItemTagLoading () {
  return (
    <Card
      sx={{
        padding: '10px',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContents: 'space-between'
        }}
      >
        <Skeleton
          sx={{
            height: '70px',
            width: '150px'
          }}
        />
        <Skeleton
          sx={{
            height: '50px',
            width: '150px'
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContents: 'space-between'
        }}
      >
        <Skeleton
          sx={{
            height: '70px',
            width: '150px'
          }}
        />
        <Skeleton
          sx={{
            height: '50px',
            width: '150px'
          }}
        />
      </Box>
    </Card>
  )
}
