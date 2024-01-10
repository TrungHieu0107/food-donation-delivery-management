import AddHomeOutlinedIcon from '@mui/icons-material/AddHomeOutlined'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined'
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import { Box, Chip, Collapse, Stack, Typography } from '@mui/material'
import moment from 'moment'
import { useState } from 'react'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'

// interface ExpandMoreProps extends IconButtonProps {
//   expand: boolean
// }
// const ExpandMore = styled((props: ExpandMoreProps) => {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { expand, ...other } = props

//   return <IconButton {...other} />
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest
//   })
// }))

function DetailHistoryStockOfBranch({ d = {} }: any) {
  const [expanded, setExpanded] = useState<any>(false)
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Box
      sx={{ mb: 5, p: 5, width: '100%', borderRadius: '15px', cursor: 'pointer', border:"2px solid #a7ffeb" }}
      onClick={handleExpandClick}
    >
      <Stack direction={'row'} justifyContent={'space-between'}>
        <Box>
          <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mb: 2 }}>
            <LogoutIcon />
            <Typography>Nơi cho: {d.pickUpPoint}</Typography>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mb: 2 }}>
            <LoginIcon />
            <Typography>Nơi nhận: {d.deliveryPoint ? d.deliveryPoint : 'Không'}</Typography>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mb: 2 }}>
            <Diversity1OutlinedIcon />
            <Typography>Nhà hảo tâm: {d.donorName ? d.donorName : 'Không'}</Typography>
          </Stack>

          <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mb: 2 }}>
            <EventAvailableOutlinedIcon />
            <Typography>
              Ngày tạo: {d.createdDate ? moment(d.createdDate).format('DD/MM/YYYY') : 'Không xác định'}
            </Typography>
          </Stack>
        </Box>
        <Box>
          {d.type === 'IMPORT' && <Chip label={'Nhập kho'} color='info' icon={<AddHomeOutlinedIcon />} sx={{ p: 1 }} />}
          {d.type === 'EXPORT' && (
            <Chip label={'Xuất kho'} color='success' icon={<DeliveryDiningOutlinedIcon />} sx={{ p: 1 }} />
          )}
        </Box>
      </Stack>
      {/* <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label='show more'>
        <ExpandMoreIcon />
      </ExpandMore> */}
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mb: 2 }}>
          <CampaignOutlinedIcon />
          <Typography>Hoạt động tiếp nhận: {d.activityName ? d.activityName : 'Không'}</Typography>
        </Stack>
        <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mb: 2 }}>
          <CategoryOutlinedIcon />
          <Typography sx={{ mb: 2, fontWeight: 600}}>
            <span style={{color:"rgba(58, 53, 65, 0.87)", fontWeight:"normal" }}>Vật phẩm:</span> {d.quantity} {d.unit} {d.name}
          </Typography>
         {d.attributeValues?.length > 0 && (
          <Stack direction={'row'} alignItems={'center'} spacing={3} sx={{ mb: 2 }}>          
            {d.attributeValues?.map((a: any, index: any) => (
              <Chip label={a} key={index} color='primary' size='small' sx={{ p: 1 }} />
            ))}
          </Stack>
        )}
        </Stack>
        

        <Stack direction={'row'} alignItems={'center'} spacing={2} sx={{ mt: 2, mb: 2 }}>
          <EditNoteOutlinedIcon />
          <Typography>Ghi chú: {d.note ? d.note : 'Không'}</Typography>
        </Stack>
      </Collapse>
    </Box>
  )
}

export default DetailHistoryStockOfBranch
