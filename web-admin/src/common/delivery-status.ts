import { ObjectLabel } from "src/models/common/CommonModel";

export const LIST_DELIVERY_STATUS : ObjectLabel[] = [
  {
    key: 'PENDING',
    value: 0, 
    label: 'Đang chờ'
  },
  {
    key: 'ACCEPTED',
    value: 1, 
    label: 'Đã chấp nhận'
  },
  {
    key: 'SHIPPING',
    value: 2, 
    label: 'Đang vận chuyển'
  },
  {
    key: 'ARRIVED_PICKUP',
    value: 3, 
    label: 'Đã đến điểm lấy hàng'
  },
  {
    key: 'REPORTED',
    value: 4, 
    label: 'Đã báo cáo'
  },
  {
    key: 'COLLECTED',
    value: 5, 
    label: 'Đã lấy hàng'
  },
  {
    key: 'ARRIVED_DELIVERY',
    value: 6, 
    label: 'Đã đến điểm giao hàng'
  },
  {
    key: 'DELIVERED',
    value: 7, 
    label: 'Đã giao hàng'
  },
  {
    key: 'FINISHED',
    value: 8, 
    label: 'Hoàn thành'
  },
  {
    key: 'EXPIRED',
    value: 9, 
    label: 'Đã hết hạn'
  } 
]

export const DELIVERY_TYPE : {
  [key: string]: number;
} = {
  DONATED_REQUEST_TO_BRANCH: 0,
  BRANCH_TO_AID_REQUEST: 1,
  BRANCH_TO_BRANCH: 2,
}

export const scheduleRouteStatus: ObjectLabel[] = [
  { key: 'PENDING', value: 0, label: 'Đang chờ' },
  { key: 'ACCEPTED', value: 1, label: 'Đã chấp nhận' },
  { key: 'PROCESSING', value: 2, label: 'Đang xử lý' },
  { key: 'FINISHED', value: 3, label: 'Hoàn thành' },
  { key: 'CANCEL', value: 4, label: 'Đã bị hủy' }
]