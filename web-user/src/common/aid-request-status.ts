import { ObjectLabel } from 'src/models/common/CommonModel'

export const ListAidRequestStatus: ObjectLabel[] = [
	{ key: 'PENDING', label: 'Đang chờ xử lý', value: 0 },
	{ key: 'ACCEPTED', label: 'Đã chấp nhận', value: 1 },
	{ key: 'REJECTED', label: 'Đã từ chối', value: 2 },
	{ key: 'CANCELED', label: 'Đã hủy', value: 3 },
	{ key: 'EXPIRED', label: 'Đã hết hạn', value: 4 },
	{ key: 'PROCESSING', label: 'Đang xử lý', value: 5 },
	{ key: 'SELF_SHIPPING', label: 'Tự vận chuyển', value: 6 },
	{ key: 'REPORTED', label: 'Đã báo cáo', value: 7 },
	{ key: 'FINISHED', label: 'Đã hoàn thành', value: 8 }
]
