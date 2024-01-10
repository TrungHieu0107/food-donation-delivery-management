export const BASE_URL = 'https://fooddonationdeliverymanagementapi20231220102042.azurewebsites.net'

// export const BASE_URL = 'https://localhost:44395'
export const KEY = {
  BASE_URL_API: `${BASE_URL}/api/v1`,
  SEARCH_LABEL: 'Tìm kiếm',
  OK: 'Đồng ý',
  NO: 'Không',
  YES: 'Có',
  KEY_FORMAT_DATE: 'DD/MM/YYYY',
  FORMAT_DATE_H_M_D_M_Y: ' HH:mm DD-MM-YYYY',
  FORMAT_DATE_d_m_y: 'DD/MM/YYYY',
  FORMAT_DATE_Y_M_D: 'YYYY/MM/DD',
  FORMAT_DATE_Y_M_D_H_M: 'HH:mm, DD/MM/YYYY',
  FORMAT_DATE_d_m_y_H_M: 'HH:mm, DD/MM/YYYY',
  'YYYY-MM-DDTHH:mm:ss': 'YYYY-MM-DDTHH:mm:ss',
  REFRESH_TOKEN: 'refresh-token',
  TOKEN: 'token',
  REMEMBER: 'remember-login',
  LOGO_URL: '/images/logos/logo-heart.png',
  LOGO_HORIZONTAL_URL: '/images/logos/logo-horizontal.png',
  ROLE: {
    BRANCH_ADMIN: 'BRANCH_ADMIN',
    SYSTEM_ADMIN: 'SYSTEM_ADMIN',
    FREE_VOLUNTEER: 'VOLUNTEER',
    CHARITY: 'CHARITY_UNIT',
    GUEST: 'Guest',
    COLABORATOR: 'COLLABORATOR'
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
  DEFAULT_IMAGE: '/images/cards/paypal.png',
  DEFAULT_VALUE: '_',
  DELIVERY_TYPE: {
    DONATED_REQUEST_TO_BRANCH: 'DONATED_REQUEST_TO_BRANCH',
    BRANCH_TO_AID_REQUEST: 'BRANCH_TO_AID_REQUEST',
    BRANCH_TO_BRANCH: 'BRANCH_TO_BRANCH'
  }
}

export const Role: any = {
  VOLUNTEER: 'Tình nguyện viên',
  CHARITY_UNIT: 'Tổ chức từ thiện',
  COLLABORATOR: 'Cộng tác viên',
  SYSTEM_ADMIN: 'Quản trị viên hệ thống',
  BRANCH_ADMIN: 'Quản trị viên chi nhánh'
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
