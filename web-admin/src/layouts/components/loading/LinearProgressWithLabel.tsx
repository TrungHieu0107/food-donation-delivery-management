import * as React from 'react'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

function LinearProgressWithLabel(
  props: LinearProgressProps & {
    progress: number
    target: number
    unit: string
  }
) {
  const value = Math.round((props.progress / props.target) * 100)

  return (
    <Box sx={{ display: 'flex', alignItems: 'left', flexDirection: 'column' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant='determinate' {...props} value={value} />
      </Box>
      <Box sx={{ minWidth: 100, mt: 1, mb: 3 }}>
        <Typography
          variant='body2'
          color='text.secondary'
        >{`Hoàn thành: ${props.progress}/${props.target} (${props.unit})`}</Typography>
      </Box>
    </Box>
  )
}

interface LinearWithValueLabelProps {
  progress: number
  target: number
  unit: string
}

export default function LinearWithValueLabel(props: LinearWithValueLabelProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgressWithLabel progress={props.progress} target={props.target} unit={props.unit}/>
    </Box>
  )
}
