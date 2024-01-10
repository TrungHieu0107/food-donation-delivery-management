export const BASE_URL = 'https://fooddonationdeliverymanagementapi20231220102042.azurewebsites.net'

// export const BASE_URL = 'https://localhost:44395'

export const KEY = {
	BASE_URL_API: `${BASE_URL}/api/v1`,
	SEARCH_LABEL: 'Tìm kiếm',
	OK: 'Đồng ý',
	NO: 'Không',
	YES: 'Có',
	FORMAT_DATE_Y_M_D: 'YYYY-MM-DD',
	FORMAT_DATE_Y_M_D_H_M: 'YYYY-MM-DD HH:mm',
	FORMAT_DATE_d_m_y: 'DD-MM-yyyy',
	FORMAT_DATE_d_m_y_H_M: 'DD-MM-yyyy HH:mm',
	'YYYY-MM-DDTHH:mm:ss': 'YYYY-MM-DDTHH:mm:ss',
	REFRESH_TOKEN: 'refresh-token',
	TOKEN: 'token',
	REMEMBER: 'remember-login',
	LOGO_URL: '/images/logos/logo-heart.png',
	LOGO_WITH_NAME_URL: '/images/logos/logo-horizontal.png',
	ROLE: {
		BRANCH_ADMIN: 'BRANCH_ADMIN',
		SYSTEM_ADMIN: 'SYSTEM_ADMIN',
		CONTRIBUTOR: 'CONTRIBUTOR',
		CHARITY: 'CHARITY',
		GUEST: 'Guest'
	},
	COLOR: {
		MENU_COLOR: '#77D7D3',
		PRIMARY: '#256D85',
		SECONDARY: '#FF6D6D'
	},
	MESSAGE: {
		COMMON_ERROR: 'Một số lỗi xảy ra vui lòng thử lại sau.'
	},
	ACTIVITY: {
		STATUS: [
			{
				id: '-1',
				name: 'Tất cả'
			},
			{
				id: '0',
				name: 'Chưa bắt đầu'
			},
			{
				id: '1',
				name: 'Đang hoạt động'
			},
			{
				id: '2',
				name: 'Kết thúc'
			}
		]
	},
	DEFAULT_VALUE: '_'
}

export const Role: any = {
	CONTRIBUTOR: 'Người đóng góp',
	CHARITY: 'Tổ chức từ thiện',
	COLLABORATOR: 'Cộng tác viên'
}

export const DaysOfWeek: any = {
	Monday: 'Thứ 2',
	Tuesday: 'Thứ 3',
	Wednesday: 'Thứ 4',
	Thursday: 'Thứ 5',
	Friday: 'Thứ 6',
	Saturday: 'Thứ 7',
	Sunday: 'Chủ nhật'
}

interface ScheduledTimes {
	day?: string
	label?: string
	startTime?: string
	endTime?: string
	status?: boolean
}

export const ScheduledTimesList: ScheduledTimes[] = [
	{
		day: 'Thứ 2',
		label: 'Thứ 2',
		status: true,
		startTime: '',
		endTime: ''
	},
	{
		day: 'Thứ 3',
		label: 'Thứ 3',
		status: true,
		startTime: '',
		endTime: ''
	},
	{
		day: 'Thứ 4',
		label: 'Thứ 4',
		status: true,
		startTime: '',
		endTime: ''
	},
	{
		day: 'Thứ 5',
		label: 'Thứ 5',
		status: true,
		startTime: '',
		endTime: ''
	},
	{
		day: 'Thứ 6',
		label: 'Thứ 6',
		status: true,
		startTime: '',
		endTime: ''
	},
	{
		day: 'Thứ 7',
		label: 'Thứ 7',
		status: true,
		startTime: '',
		endTime: ''
	},
	{
		day: 'Chủ nhật',
		label: 'Chủ nhật',
		status: true,
		startTime: '',
		endTime: ''
	}
]

export const daysOfWeek: any = {
	Monday: 'Thứ 2',
	Tuesday: 'Thứ 3',
	Wednesday: 'Thứ 4',
	Thursday: 'Thứ 5',
	Friday: 'Thứ 6',
	Saturday: 'Thứ 7',
	Sunday: 'Chủ nhật'
}
