import * as React from 'react'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'

// import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Grid, Typography } from '@mui/material'

function LinearProgressWithLabel(
  props: LinearProgressProps & {
    data: any

    // progress: number
    // target: number
  }
) {
  let progress = 0, target = 0
  if(props.data){
  for(let i = 0; i < props?.data?.length; i++) {
     progress = progress + props.data[i].process
     target = target + props.data[i].target
  }
  }
  console.log(progress, target);
  const value = Math.round((progress === 0 ? progress : 0.00000000001 / target === 0 ? target : 1) * 100)

  return (
    <Grid container spacing={2} alignItems={"center"}>
      <Grid item xs={11} >
        <LinearProgress color='info' sx={{height:"10px", borderRadius:"10px"}} variant='determinate' {...props} value={value} />
      </Grid>

      <Grid item xs={1}>
        <Typography variant='body2' color='text.secondary'>{`${value ? value: 0}%`}</Typography>
      </Grid>
    </Grid>
  )
}

interface LinearWithValueLabelProps {
  data: any

  // progress: number
  // target: number
}

export default function LinearWithValueLabel(props: LinearWithValueLabelProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel 
       data={props.data}

      // progress={props.progress} target={props.target} 
      />
    </Box>
  )
}
