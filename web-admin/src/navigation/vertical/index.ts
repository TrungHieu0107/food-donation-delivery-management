// ** Icon imports
// import Table from 'mdi-material-ui/Table'

// import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'

// import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
// import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import AccessibilityNewOutlinedIcon from '@mui/icons-material/AccessibilityNewOutlined'
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import PortraitIcon from '@mui/icons-material/Portrait'
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined'
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined'

// ** Type import a
import { Category } from '@mui/icons-material'
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined'
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining'
import FlagCircleOutlinedIcon from '@mui/icons-material/FlagCircleOutlined'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import RouteIcon from '@mui/icons-material/Route'
import { AccountKey, FormatListCheckbox, GiftOutline } from 'mdi-material-ui'
import useSession from 'src/@core/hooks/useSession'
import { NavLink, VerticalNavItemsType } from 'src/@core/layouts/types'

const Navigation = (): VerticalNavItemsType => {
  const { session }: any = useSession()

  if (session?.user.role === 'SYSTEM_ADMIN') {
    return [
      {
        title: 'Bảng điều khiển',
        icon: HomeOutline,
        path: '/'
      },

      {
        title: 'Hoạt động từ thiện',
        icon: InventoryOutlinedIcon,
        path: '/danh-sach-hoat-dong'
      },
      {
        title: 'Yêu cầu quyên góp',
        icon: GiftOutline,
        path: '/quyen-gop',
        activeStart: '/quyen-gop'
      },
      {
        title: 'Yêu cầu hỗ trợ',
        icon: FavoriteBorderOutlinedIcon,
        path: '/danh-sach-yeu-cau-ho-tro'
      },

      {
        title: 'Vận chuyển',
        icon: DeliveryDiningIcon,
        path: '/van-chuyen',
        subNavLink: [
          {
            icon: ChecklistOutlinedIcon,
            title: 'Danh sách',
            path: '/van-chuyen/danh-sach-yeu-cau'
          },
          {
            icon: RouteIcon,
            title: 'Lịch trình',
            path: '/van-chuyen/tuyen-duong'
          }
        ]
      },
      {
        title: 'Vật phẩm',
        icon: InterestsOutlinedIcon,
        path: '/vat-pham',
        activeStart: '/vat-pham',
        subNavLink: [
          {
            title: 'Danh sách',
            icon: FormatListCheckbox,
            path: '/vat-pham/danh-sach'
          } as NavLink,
          {
            title: 'Thể loại',
            icon: Category,
            path: '/vat-pham/loai-vat-pham'
          } as NavLink
        ]
      },

      {
        title: 'Người dùng',
        icon: PortraitIcon,
        path: '/quan-ly-nguoi-dung',
        activeStart: '/quan-ly-nguoi-dung',
        subNavLink: [
          {
            icon: PortraitIcon,
            title: 'Người đóng góp',
            path: '/quan-ly-nguoi-dung/nguoi-dung-thuong'
          } as NavLink,
          {
            icon: AdminPanelSettingsOutlinedIcon,
            title: 'Quản trị viên nhánh',
            path: '/quan-ly-nguoi-dung/quan-tri-vien-chi-nhanh'
          } as NavLink,
          {
            icon: AccessibilityNewOutlinedIcon,
            title: 'Hỗ trợ vận chuyển',
            path: '/quan-ly-nguoi-dung/cong-tac-vien'
          } as NavLink
        ]
      },
      {
        title: 'Bài viết',
        icon: ArticleOutlinedIcon,
        path: '/bai-viet'
      },
      {
        title: 'Danh sách báo cáo',
        icon: FlagCircleOutlinedIcon,
        path: '/danh-sach-bao-cao'
      },
      {
        title: 'Tổ chức từ thiện',
        icon: LoyaltyOutlinedIcon,
        path: '/to-chuc-tu-thien'
      },
      {
        title: 'Chi nhánh hệ thống',
        icon: HomeWorkOutlinedIcon,
        path: '/danh-sach-chi-nhanh'
      },
      {
        title: 'Quyền truy cập',
        icon: AccountKey,
        path: '/quyen-truy-cap'
      },

      {
        title: 'Thiết lập tài khoản',
        icon: AccountCogOutline,
        path: '/thiet-lap-tai-khoan'
      }
    ]
  } else {
    return [
      {
        title: 'Bảng điều khiển',
        icon: HomeOutline,
        path: '/'
      },

      {
        title: 'Hoạt động từ thiện',
        icon: InventoryOutlinedIcon,
        path: '/danh-sach-hoat-dong'
      },
      {
        title: 'Yêu cầu quyên góp',
        icon: GiftOutline,
        path: '/quyen-gop',
        activeStart: '/quyen-gop'
      },
      {
        title: 'Yêu cầu hỗ trợ',
        icon: FavoriteBorderOutlinedIcon,
        path: '/danh-sach-yeu-cau-ho-tro'
      },
      {
        title: 'Vận chuyển',
        icon: DeliveryDiningIcon,
        path: '/van-chuyen',
        subNavLink: [
          {
            icon: ChecklistOutlinedIcon,
            title: 'Danh sách',
            path: '/van-chuyen'
          },
          {
            icon: RouteIcon,
            title: 'Lịch trình',
            path: '/van-chuyen/tuyen-duong'
          }
        ]
      },
      {
        title: 'Quản lý kho',
        icon: WarehouseOutlinedIcon,
        path: '/quan-ly-kho/danh-sach',
        subNavLink: [
          {
            icon: FormatListCheckbox,
            title: 'Danh sách',
            path: '/quan-ly-kho/danh-sach'
          },
          {
            icon: LoginIcon,
            title: 'Nhập kho',
            path: '/quan-ly-kho/nhap-kho-truc-tiep'
          },
          {
            icon: LogoutIcon,
            title: 'Xuất kho',
            path: '/quan-ly-kho/xuat-kho'
          },
          {
            icon: HistoryEduIcon,
            title: 'Lịch sử',
            path: '/quan-ly-kho/lich-su'
          }
        ]
      },
      {
        title: 'Danh sách báo cáo',
        icon: FlagCircleOutlinedIcon,
        path: '/danh-sach-bao-cao'
      },
      {
        title: 'Vật phẩm',
        icon: InterestsOutlinedIcon,
        path: '/vat-pham',
        activeStart: '/vat-pham',
        subNavLink: [
          {
            title: 'Danh sách',
            icon: FormatListCheckbox,
            path: '/vat-pham/danh-sach'
          } as NavLink,
          {
            title: 'Thể loại',
            icon: Category,
            path: '/vat-pham/loai-vat-pham'
          } as NavLink
        ]
      },
      {
        title: 'Chi nhánh hệ thống',
        icon: BallotOutlinedIcon,
        path: '/danh-sach-chi-nhanh'
      },
      {
        title: 'Tổ chức từ thiện',
        icon: LoyaltyOutlinedIcon,
        path: '/to-chuc-tu-thien'
      },
      {
        title: 'Chi nhánh của tôi',
        icon: HomeWorkOutlinedIcon,
        path: '/chi-nhanh-cua-toi'
      },
      {
        title: 'Bài viết',
        icon: ArticleOutlinedIcon,
        path: '/bai-viet'
      },
      {
        title: 'Thiết lập tài khoản',
        icon: AccountCogOutline,
        path: '/thiet-lap-tai-khoan'
      }
    ]
  }
}

export default Navigation
