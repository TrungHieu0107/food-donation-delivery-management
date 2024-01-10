import { ObjectLabel } from 'src/models/common/CommonModel'

export const NotificationStatus: {
  [key: string]: ObjectLabel
} = {
  NEW: {
    key: 'NEW',
    label: 'Mới',
    value: 0
  },
  SEEN: {
    key: 'SEEN',
    label: 'Đã xem',
    value: 1
  }
}

export const LIST_NOTIFICATION_STATUS: ObjectLabel[] = [
  {
    key: 'NEW',
    label: 'Chưa xem',
    value: 0
  },
  {
    key: 'SEEN',
    label: 'Đã xem',
    value: 1
  }
]

export const NotificationType: {
  [key: string]: ObjectLabel
} = {
  NOTIFYING: {
    key: 'NOTIFYING',
    label: 'Thông báo',
    value: 0
  },
  WARNING: {
    key: 'WARNING',
    label: 'Cảnh báo',
    value: 1
  }
}

export const LIST_NOTIFICATION_TYPE: ObjectLabel[] = [
  {
    key: 'NOTIFYING',
    label: 'Thông báo',
    value: 0
  },
  {
    key: 'WARNING',
    label: 'Cảnh báo',
    value: 1
  }
]

export const COLLABORATOR_STATUS: {
  [key: string]: ObjectLabel
} = {
  ACTIVE: {
    key: 'ACTIVE',
    label: 'Hoạt động',
    value: 0
  },
  INACTIVE: {
    key: 'INACTIVE',
    label: 'Không hoạt động',
    value: 1
  },
  DELETED: {
    key: 'DELETED',
    label: 'Đã xáo',
    value: 2
  },
  UNVERIFIED: {
    key: 'UNVERIFIED',
    label: 'Chưa xác thực',
    value: 3
  }
}

export const LIST_COLLABORATOR_STATUS: ObjectLabel[] = [
  {
    key: 'ACTIVE',
    label: 'Hoạt động',
    value: 0
  },
  {
    key: 'INACTIVE',
    label: 'Không hoạt động',
    value: 1
  },

  // {
  //   key: 'DELETED',
  //   label: 'Đã xóa',
  //   value: 2
  // },
  {
    key: 'UNVERIFIED',
    label: 'Chưa xác thực',
    value: 2
  }
]
