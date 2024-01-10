import { Box, Chip, Grid, Paper, Stack, Typography } from '@mui/material'

function SingleItemTab(props: any) {
  return (
    <Paper
      elevation={5}
      sx={{
        ...(props.isActive && {
          bgcolor:"#a7ffeb"
           }),
        mb: 5,      
         p: 3
      }}
      onClick={() => {
        props?.setDataSearch({
          ...props?.dataSearch,
          itemId: props?.item?.itemTemplateId,        
        })
        props?.setCurrentSelected(props?.item?.itemTemplateId)
      }}
    >
      <Grid container alignItems={"center"} columnSpacing={3}>
      <Grid item xs={4}>
        <Box sx={{width:"80px", height:"80px"}}>
          <img src={props?.item?.image} alt='img item' width={"80px"} height={"80px"} style={{objectFit:"cover", borderRadius:"10px"}}/>
        </Box>
      </Grid>
        <Grid item xs={8}>
        {props?.isActive ? (
            <Typography
              sx={{
                ...(props.isActive && { textDecoration: 'underline' }),
              
                fontWeight: 700,
                fontSize: '16px',
                color: '#00b0ff',
                cursor: 'pointer'
              }}
                   
            >
              {props?.item?.name}
            </Typography>
          ) : (
            <Typography
              sx={{fontWeight: 700, cursor: 'pointer' }}                   
            >
              {props?.item?.name}
            </Typography>
          )}
          <Stack direction={"row"} spacing={2} sx={{mt: 1, overflow:"hidden"}}>
          {props?.item?.attributes?.map((a: any, index: any) => (
            <Chip size='small' key={index} label={a.attributeValue} color='primary' variant='filled' />
          ))}
          </Stack>
         
        </Grid>
      </Grid>
    </Paper>
  )
}

export default SingleItemTab
