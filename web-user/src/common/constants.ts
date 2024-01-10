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
