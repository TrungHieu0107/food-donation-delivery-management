import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Typography
} from '@mui/material'
import { useState } from 'react'
import DialogCustom from 'src/@core/layouts/components/dialog/Dialog'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useRouter } from 'next/router'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

interface RulesDialogProps {
  acceptRules: boolean
  handleAcceptRules: (value: boolean) => void
}

export interface Rule {
  title: string
  content: string
}

export const GenerateRule = ({ rule }: { rule: Rule }) => {
  return (
		<Accordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls='panel1a-content'
				id='panel1a-header'
			>
				<Typography
					width={'100%'}
					fontWeight={600}
					sx={{
						borderBottom: (theme) => `1px solid ${hexToRGBA(theme.palette.grey[600], 0.3)}`
					}}
				>
					{rule.title}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography>{rule.content}</Typography>
			</AccordionDetails>
		</Accordion>
	)
}

const ruleList: Rule[] = [
	{
		title: 'Độ Tuổi và Pháp Lý',
		content: 'Đăng ký viên phải từ 18 tuổi trở lên và có giấy tờ tùy thân hợp pháp.'
	},
	{
		title: 'Phương Tiện Di Chuyển',
		content:
			'Đăng ký viên phải sở hữu phải sở hữu phương tiện di chuyển là xe máy.'
	},
	{
		title: 'Giấy Phép Lái Xe và Bảo Hiểm',
		content:
			'Nếu sử dụng xe cơ giới, đăng ký viên cần có giấy phép lái xe hợp lệ và bảo hiểm phương tiện.'
	},
	{
		title: 'Sức Khỏe và An Toàn',
		content:
			'Đăng ký viên cần khẳng định rằng họ có sức khỏe tốt và không mắc các bệnh có thể ảnh hưởng đến khả năng vận chuyển an toàn.'
	},
	{
		title: 'Đào Tạo và Hướng Dẫn',
		content:
			'Đăng ký viên sẽ phải hoàn thành một khóa đào tạo ngắn về an toàn thực phẩm và hướng dẫn vận chuyển cụ thể của tổ chức.'
	},

	{
		title: 'Cam Kết Thời Gian',
		content:
			'Đăng ký viên cần cam kết một lượng thời gian nhất định mỗi tuần hoặc tháng cho công việc vận chuyển.'
	},
	{
		title: 'Bảo Mật Thông Tin',
		content:
			'Đăng ký viên phải tuân thủ các quy định về bảo mật thông tin cá nhân của người nhận thức ăn.'
	},
	{
		title: 'Tuân Thủ Quy Định',
		content:
			'Đăng ký viên phải tuân thủ tất cả các quy định pháp luật và quy định an toàn giao thông khi thực hiện công việc.'
	},
	{
		title: 'Giao Tiếp Hiệu Quả',
		content: 'Đăng ký viên cần có khả năng giao tiếp tốt và thái độ thân thiện với người nhận.'
	},
	{
		title: 'Phản Hồi và Đánh Giá',
		content:
			'Đăng ký viên phải sẵn lòng nhận phản hồi và tham gia vào quá trình đánh giá định kỳ để nâng cao chất lượng.'
	}
]

export default function RulesDialog(props: RulesDialogProps) {
  const { acceptRules, handleAcceptRules } = props
  const [open, setOpen] = useState<boolean>(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleClose = () => {
    if (acceptRules) {
      setOpen(false)

      return
    }

    setError('Bạn phải chấp nhận điều khoản')
  }

  return (
    <>
      <DialogCustom
        width={500}
        content={
          <Grid container direction={'column'} spacing={2} p={5}>
            {ruleList.map((item, index) => (
              <Grid key={index} item>
                <GenerateRule rule={item} />
              </Grid>
            ))}
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={acceptRules}
                    onChange={e => {
                      handleAcceptRules(e.target.checked)
                    }}
                  />
                }
                label='Chấp nhiều điều khoản'
              />
              {error && <FormHelperText error={true}>{error}</FormHelperText>}
            </Grid>
          </Grid>
        }
        handleClose={handleClose}
        open={open}
        title={'Điều khoản'}
        action={
          <>
            <Button
              color='secondary'
              onClick={() => {
                router.push('/')
              }}
            >
              Quay lại
            </Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={() => {
                handleClose()
              }}
            >
              Đồng ý
            </Button>
          </>
        }
      />
    </>
  )
}
