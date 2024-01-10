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
      <Card sx={{ zIndex: 1, width: '100%',  bgcolor:"rgba(255,255,255, 0.75)" }}>
        <CardContent
          sx={{
            padding: 5,
            display: 'flex',
            justifyContent: 'flex-start',
            alignContent: 'center',
            alignItems: 'center',
           
          }}
        >
          <img src={"https://cdn.thuvienphapluat.vn//uploads/tintuc/2022/09/28/lam-tu-thien.jpg"} alt='img' width='200px' height='150px' />

          <Box
            sx={{
              margin: 5,
             
            }}
          >
            <Typography
              variant='body1'
              sx={{
                fontWeight: '700'
              }}
              align='center'
            >
              
              Hành động từ thiện nhỏ bé cũng có thể tạo nên những đổi thay lớn lao - mỗi việc làm tốt đẹp đều là một bước tiến về phía một thế giới tốt đẹp hơn
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Card sx={{ zIndex: 1, width: '100%',  bgcolor:"rgba(255,255,255, 0.75)" }}>
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
              variant='body1'
              sx={{
                fontWeight: '700'
              }}
              align='center'
            >
              
              Chia sẻ không chỉ là việc cho đi, mà còn là cách để kết nối con tim và sự hiểu biết giữa con người với nhau
            </Typography>
          </Box>
          <img src={"https://kttvvietbac.org/dai/uploads/news/2019_03/anh2_2.jpg"} alt='img' width='200px' height='150px' />
        </CardContent>
      </Card>
      <Card sx={{ zIndex: 1, width: '100%',  bgcolor:"rgba(255,255,255, 0.75)" }}>
        <CardContent
          sx={{
            padding: 5,
            display: 'flex',
            justifyContent: 'flex-start',
            alignContent: 'center',
            alignItems: 'center'
          }}
        >
          <img src={"https://www.evn.com.vn/userfile/VH/User/minhphuongtcdl/images/2019/3/Bannucongpcphuyenphatcom.jpg"} alt='img' width='200px' height='150px' />
          <Box
            sx={{
              margin: 5
            }}
          >
            <Typography
              variant='body1'
              sx={{
                fontWeight: '700'
              }}
              align='center'
            >
              
              Khi chúng ta giúp đỡ người khác, chính chúng ta cũng nhận được sức mạnh và niềm vui - việc từ thiện là hành trình của cả người cho và người nhận
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
