// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'

// ** Layout Import
import { FormLabel, Grid, Paper } from '@mui/material'
import { GenerateRule, Rule } from '../collaborator-register/RulesDialog'
import { CharityCreatingModel } from 'src/models/Charity'
import { useRouter } from 'next/router'

const ruleList: Rule[] = [
	{
		title: 'Đáp ứng các yêu cầu pháp lý',
		content:
			'Tổ chức từ thiện phải tuân thủ các quy định và yêu cầu pháp lý của quốc gia nơi tổ chức hoạt động.'
	},
	{
		title: 'Quản lý tài chính',
		content:
			'Tổ chức phải duy trì sự minh bạch và trách nhiệm trong quản lý tài chính, bao gồm báo cáo tài chính và sử dụng hiệu quả các nguồn tài trợ.'
	},
	{
		title: 'Tư duy chiến lược',
		content:
			'Tổ chức cần phát triển một chiến lược dài hạn để đạt được mục tiêu từ thiện và tạo ra tác động lớn đối với cộng đồng.'
	},
	{
		title: 'Mục tiêu từ thiện',
		content:
			'Tổ chức phải có mục tiêu từ thiện rõ ràng và góp phần vào việc cải thiện cuộc sống cho cộng đồng.'
	},
	{
		title: 'Chính sách an toàn thông tin',
		content:
			'Tổ chức cần áp dụng các biện pháp bảo vệ thông tin cá nhân và đảm bảo an toàn thông tin của người được hỗ trợ và nhà tài trợ.'
	},
	{
		title: 'Tuân thủ đạo đức',
		content:
			'Tổ chức phải tuân thủ các nguyên tắc đạo đức cao nhất trong hoạt động từ thiện và tránh các hoạt động phi đạo đức.'
	},
	{
		title: 'Trách nhiệm xã hội',
		content:
			'Tổ chức phải thể hiện trách nhiệm xã hội và đóng góp tích cực vào cộng đồng thông qua các hoạt động từ thiện.'
	},
	{
		title: 'Quản lý tình nguyện viên',
		content:
			'Tổ chức cần có chính sách và quy trình để quản lý và tạo điều kiện thuận lợi cho tình nguyện viên tham gia.'
	},
	{
		title: 'Báo cáo và giám sát',
		content:
			'Tổ chức phải có chế độ báo cáo và giám sát để đảm bảo sự minh bạch và hiệu quả trong hoạt động từ thiện.'
	},
	{
		title: 'Tuân thủ quy định thuế',
		content:
			'Tổ chức phải tuân thủ các quy định thuế và nộp thuế đúng hạn theo quy định của quốc gia.'
	}
]

const benefitlist: Rule[] = [
	{
		title: 'Nhận hỗ trợ tài chính',
		content:
			'Tổ chức từ thiện có quyền nhận được hỗ trợ tài chính từ cá nhân, doanh nghiệp, tổ chức và chính phủ.'
	},

	{
		title: 'Tạo được tác động tích cực',
		content:
			'Tổ chức có thể tạo ra tác động tích cực trong cộng đồng bằng cách cải thiện chất lượng cuộc sống và giúp đỡ những người gặp khó khăn.'
	},

	{
		title: 'Xây dựng mạng lưới',
		content:
			'Tổ chức có thể xây dựng mạng lưới với các đối tác, tình nguyện viên và nhà tài trợ để mở rộng tác động và tài trợ.'
	},
	{
		title: 'Tạo cơ hội phát triển',
		content:
			'Tổ chức từ thiện có thể tạo cơ hội phát triển cho các thành viên trong tổ chức và cộng đồng mà nó phụcđáp.'
	},
	{
		title: 'Được công nhận và tôn trọng',
		content:
			'Tổ chức từ thiện được công nhận và tôn trọng vì công việc và tác động tích cực mà nó mang lại cho cộng đồng.'
	},
	{
		title: 'Tiếp cận nguồn lực',
		content:
			'Tổ chức có quyền tiếp cận nguồn lực và hỗ trợ từ các tổ chức, doanh nghiệp và cá nhân để thực hiện các dự án từ thiện.'
	},
	{
		title: 'Tự do tổ chức và quản lý',
		content:
			'Tổ chức có quyền tự do tổ chức và quản lý hoạt động từ thiện của mình theo phương pháp và quy trình mà nó cho là phù hợp và hiệu quả.'
	},
	{
		title: 'Tạo sự thay đổi xã hội',
		content:
			'Tổ chức có quyền tạo ra sự thay đổi xã hội và nâng cao chất lượng cuộc sống cho cộng đồng mà nó phục vụ.'
	},
	{
		title: 'Nhận sự ủng hộ và đồng lòng',
		content:
			'Tổ chức từ thiện có quyền nhận được sự ủng hộ và đồng lòng từ cộng đồng và các bên liên quan trong việc thực hiện nhiệm vụ của mình.'
	},

	{
		title: 'Góp phần vào xây dựng một thế giới tốt đẹp hơn',
		content:
			'Tổ chức từ thiện có quyền góp phần vào xây dựng một thế giới tốt đẹp hơn bằng cách giúp đỡ những người gặp khó khăn và thúc đẩy nhân đạo, sự công bằng và sự phát triển bền vững.'
	}
]

interface TermsAndBenefitViewProps {
	nameNextTab: string
	handleChangeTab: (tabName: string, charityModel?: CharityCreatingModel) => void
}

const TermsAndBenefitView = (props: TermsAndBenefitViewProps) => {
	const [confirmed, setConfirmed] = useState<boolean>(false)
	const { nameNextTab, handleChangeTab } = props
	const router = useRouter()

	useEffect(() => {
		return () => {
			setConfirmed(false)
		}
	}, [])

	return (
		<Paper
			sx={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				height: '100vh',
				overflow: 'auto',
				padding: 10
			}}
		>
			<Typography fontWeight={600} variant='h5' textAlign={'center'}>
				Điều khoản & Quyền lợi
			</Typography>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 3,
					border: '1px solid ',
					m: 5,
					p: 5,
					borderRadius: '12.5px'
				}}
			>
				<Box>
					<Typography variant='h6'>1. Điều khoản</Typography>
					<Divider />
					<Grid container direction={'column'} spacing={2} p={5}>
						{ruleList.map((item, index) => (
							<Grid key={index} item>
								<GenerateRule rule={item} />
							</Grid>
						))}
					</Grid>
				</Box>
				<Box>
					<Typography variant='h6'>2. Quyền lợi</Typography>
					<Divider />
					<Grid container direction={'column'} spacing={2} p={5}>
						{benefitlist.map((item, index) => (
							<Grid key={index} item>
								<GenerateRule rule={item} />
							</Grid>
						))}
					</Grid>
				</Box>
			</Box>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<FormControl
					fullWidth
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center'
					}}
				>
					<Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)}></Checkbox>
					<FormLabel onClick={() => setConfirmed(!confirmed)}>
						Cam kết thực hiện đúng điều khoản
					</FormLabel>
				</FormControl>

				<Grid container justifyContent={'center'} spacing={3}>
					<Grid item>
						<Button
							onClick={() => {
								router.push('/tinh-nguyen-vien/dang-nhap')
							}}
						>
							Quay lại
						</Button>
					</Grid>
					<Grid item>
						<Button
							variant='contained'
							disabled={!confirmed}
							onClick={() => {
								if (confirmed) {
									handleChangeTab(nameNextTab)
								}
							}}
						>
							Xác nhận
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	)
}
export default TermsAndBenefitView
