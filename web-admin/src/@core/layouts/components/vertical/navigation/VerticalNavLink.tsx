// ** React Imports
import { ElementType, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'
import ChevronUp from 'mdi-material-ui/ChevronUp'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'
import { Collapse, List } from '@mui/material'
import { customColor } from 'src/@core/theme/color'

interface Props {
  item: NavLink
  settings: Settings
  navVisible?: boolean
  hover?: boolean
  toggleNavVisibility: () => void
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  color: 'red !important',
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity .25s ease-in-out',
  '& .MuiTypography-root, .MuiSvgIcon-root': {
    color: '#003D58',
    fontWeight: 500
  },
  '&.active, &.active:hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: customColor.navItemActive
  },
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.common.white} !important`
  }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  color: '#003D58',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility, hover }: Props) => {
  // ** Hooks
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isActive, setIsActive] = useState<boolean>(false)

  const IconTag: ReactNode = item.icon

  useEffect(() => {
    const isNavLinkActive = () => {
      if ((item as NavLink).subNavLink) {
        let isActive = item.activeStart ? router.pathname.startsWith(item.activeStart) : false
        item.subNavLink?.map(subItem => {
          isActive = isActive ? true : router.pathname === subItem.path || handleURLQueries(router, subItem.path)
        })
        if (isActive) {
          setOpen(true)
        }
        if (!isActive) {
          setOpen(false)
        }
        setIsActive(isActive || handleURLQueries(router, item.path))
      } else {
        if (item.path) {
          if (item.path === '/' && router.pathname === '/') {
            setIsActive(true)

            return
          }
          setIsActive(
            (router.pathname.startsWith(item.path) && item.path !== '/') || handleURLQueries(router, item.path)
          )
        }
      }
    }
    isNavLinkActive()
  }, [item, router])

  const isSubNavLinkActive = (subItem: NavLink) => {
    return router.pathname === subItem.path || handleURLQueries(router, subItem.path)
  }

  if ((item as NavLink).subNavLink) {
    return (
      <>
        <ListItem
          disablePadding
          className='nav-link'
          disabled={item.disabled || false}
          sx={{ mt: 1.5, px: '0 !important' }}
        >
          <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
            <MenuNavLink
              component={'a'}
              className={isActive ? 'active' : ''}
              {...(item.openInNewTab ? { target: '_blank' } : null)}
              onClick={e => {
                setOpen(open ? false : true)
                e.preventDefault()
                e.stopPropagation()
                if (item.path === undefined) {
                  e.preventDefault()
                  e.stopPropagation()
                }

                // if (navVisible) {
                //   toggleNavVisibility()
                // }
              }}
              sx={{
                pl: 5.5,
                ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
              }}
            >
              <ListItemIcon
                sx={{
                  mr: 2.5,
                  color: 'text.primary',
                  transition: 'margin .25s ease-in-out'
                }}
              >
                <UserIcon icon={IconTag} />
              </ListItemIcon>

              {hover && [
                <MenuItemTextMetaWrapper key={1}>
                  <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{item.title}</Typography>
                  {item.badgeContent ? (
                    <Chip
                      label={item.badgeContent}
                      color={item.badgeColor || 'primary'}
                      sx={{
                        height: 20,
                        fontWeight: 500,
                        marginLeft: 1.25,
                        '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                      }}
                    />
                  ) : null}
                </MenuItemTextMetaWrapper>,
                <ChevronUp
                  key={2}
                  sx={{
                    transform: !open ? 'rotate(180deg)' : 'rotate(360deg)',
                    transition: 'transform 150ms ease'
                  }}
                />
              ]}
            </MenuNavLink>
          </Link>
        </ListItem>
        <Collapse in={open && hover} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            {item.subNavLink?.map((subItem, index) => {
              return (
                <ListItem
                  key={index}
                  disablePadding
                  className='nav-link'
                  disabled={subItem.disabled || false}
                  sx={{ mt: 1.5, px: '0 !important' }}
                >
                  <Link passHref href={subItem.path === undefined ? '/' : `${subItem.path}`}>
                    <MenuNavLink
                      component={'a'}
                      className={isSubNavLinkActive(subItem) ? 'active' : ''}
                      {...(subItem.openInNewTab ? { target: '_blank' } : null)}
                      onClick={e => {
                        if (subItem.path === router.pathname) {
                          e.preventDefault()
                          e.stopPropagation()
                        }
                        if (subItem.path === undefined) {
                          e.preventDefault()
                          e.stopPropagation()
                        }
                        if (navVisible) {
                          toggleNavVisibility()
                        }
                      }}
                      sx={{
                        pl: 10,
                        ...(subItem.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          mr: 2.5,
                          color: 'text.primary',
                          transition: 'margin .25s ease-in-out'
                        }}
                      >
                        <UserIcon icon={subItem.icon} />
                      </ListItemIcon>

                      <MenuItemTextMetaWrapper>
                        <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{subItem.title}</Typography>
                        {subItem.badgeContent ? (
                          <Chip
                            label={subItem.badgeContent}
                            color={subItem.badgeColor || 'primary'}
                            sx={{
                              height: 20,
                              fontWeight: 500,
                              marginLeft: 1.25,
                              '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                            }}
                          />
                        ) : null}
                      </MenuItemTextMetaWrapper>
                    </MenuNavLink>
                  </Link>
                </ListItem>
              )
            })}
          </List>
        </Collapse>
      </>
    )
  } else {
    return (
      <ListItem
        disablePadding
        className='nav-link'
        disabled={item.disabled || false}
        sx={{ mt: 1.5, px: '0 !important' }}
      >
        <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
          <MenuNavLink
            component={'a'}
            className={isActive ? 'active' : ''}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            onClick={e => {
              if (item.path === router.pathname) {
                e.preventDefault()
                e.stopPropagation()
              }
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
              if (navVisible) {
                toggleNavVisibility()
              }
            }}
            sx={{
              pl: 5.5,
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
            }}
          >
            <ListItemIcon
              sx={{
                mr: 2.5,
                color: 'text.primary',
                transition: 'margin .25s ease-in-out'
              }}
            >
              <UserIcon icon={IconTag} />
            </ListItemIcon>

            {hover && (
              <MenuItemTextMetaWrapper>
                <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{item.title}</Typography>
                {item.badgeContent ? (
                  <Chip
                    label={item.badgeContent}
                    color={item.badgeColor || 'primary'}
                    sx={{
                      height: 20,
                      fontWeight: 500,
                      marginLeft: 1.25,
                      '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                    }}
                  />
                ) : null}
              </MenuItemTextMetaWrapper>
            )}
          </MenuNavLink>
        </Link>
      </ListItem>
    )
  }
}

export default VerticalNavLink
