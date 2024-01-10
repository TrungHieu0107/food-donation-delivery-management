// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline';

// ** Type import
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import { VerticalNavItemsType } from 'src/@core/layouts/types';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';

const navigation = (): VerticalNavItemsType => [
  {
    title: 'Trang chủ',
    icon: HomeOutline,
    path: '/'
  },
  {
    title: 'Hoạt động',
    icon: VolunteerActivismOutlinedIcon,
    path: '/hoat-dong'
  },
  {
    title: 'Chi nhánh hệ thống',
    icon: HomeWorkOutlinedIcon,
    path: '/chi-nhanh-he-thong'
  },
  {
    title: 'Tổ chức liên kết',
    icon: LoyaltyOutlinedIcon,
    path: '/to-chuc-tu-thien/danh-sach'
  },
  {
    title: 'Góc chia sẻ',
    icon: ArticleOutlinedIcon,
    path: '/bai-dang'
  }

  // {
  //   title: 'Khác',
  //   icon: More,
  //   subNavLink: [
  //     {
  //       title: 'Sao kê quyên góp',
  //       icon: Poll,
  //       path: '/thong-ke-quyen-gop'
  //     } as NavLink,
  //     {
  //       title: 'Các chi nhánh',
  //       icon: SourceBranch,
  //       path: '/cac-chi-nhanh'
  //     } as NavLink,
  //     {
  //       title: 'Tổ chức liên kết',
  //       icon: SourceBranch,
  //       path: '/to-chuc-lien-ket'
  //     } as NavLink,
  //     {
  //       title: 'Lịch sử quyên góp',
  //       icon: History,
  //       path: '/lich-su-quyen-gop'
  //     } as NavLink,
  //     {
  //       title: 'Đăng ký cộng tác viên',
  //       icon: HandshakeOutline,
  //       path: '/dang-ky-cong-tac-vien'
  //     } as NavLink
  //   ]
  // }
]

export default navigation
