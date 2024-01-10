// ** React Imports
import { ElementType, ReactNode, useState } from 'react'

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

interface Props {
  item: NavLink
  settings: Settings
  navVisible?: boolean
  toggleNavVisibility: () => void
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity .25s ease-in-out',
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.primary.main} !important`
  }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
  width: 'fit-content',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility }: Props) => {
  // ** Hooks
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const IconTag: ReactNode = item.icon

  const isNavLinkActive = () => {
    if ((item as NavLink).subNavLink) {
      let isActive = false
      item.subNavLink?.map(subItem =>{
        isActive = router.pathname === subItem.path || handleURLQueries(router, subItem.path)
      })

      return isActive
    } else {
      return router.pathname === item.path || handleURLQueries(router, item.path)
    }
  }

  const isSubNavLinkActive = (subItem: NavLink) => {
    return router.pathname === subItem.path || handleURLQueries(router, subItem.path)
  }

  if ((item as NavLink).subNavLink) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column'
        }}
        onMouseOver={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(true)}
      >
        <ListItem
          disablePadding
          className='nav-link'
          disabled={item.disabled || false}
          sx={{ px: '0 !important', height: '64px !important' }}
          onClick={() => setOpen(!open)}
        >
          <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
            <MenuNavLink
              component={'a'}
              className={isNavLinkActive() ? 'active' : ''}
              {...(item.openInNewTab ? { target: '_blank' } : null)}
              onClick={e => {
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
                pt: 0,
                pb: 0,
                height: '64px !important',
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

              <MenuItemTextMetaWrapper>
                <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })} sx={{
                  fontWeight: 600
                }} >{item.title}</Typography>
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
              <ListItemIcon
                sx={{
                  ml: 2.5,
                  color: 'text.primary',
                  transition: 'margin .25s ease-in-out'
                }}
              >
                <ChevronUp
                  sx={{
                    transform: open ? 'rotate(180deg)' : '',
                    transition: 'transform 150ms ease'
                  }}
                />
              </ListItemIcon>
            </MenuNavLink>
          </Link>
        </ListItem>
        <Collapse
          in={open}
          timeout='auto'
        >
          <List
            component='div'
            disablePadding
            sx={{
              backgroundColor: '#77D7D3',
              boxShadow: 5,
              borderBottomRightRadius: 5,
              borderBottomLeftRadius: 5
            }}
          >
            {item.subNavLink?.map((subItem, index) => {
              return (
                <ListItem
                  key={index}
                  disablePadding
                  className='nav-link'
                  disabled={subItem.disabled || false}
                  sx={{ px: '0 !important' }}
                  onClick={() => setOpen(!open)}
                >
                  <Link passHref href={subItem.path === undefined ? '/' : `${subItem.path}`}>
                    <MenuNavLink
                      component={'a'}
                      className={isSubNavLinkActive(subItem) ? 'active' : ''}
                      {...(subItem.openInNewTab ? { target: '_blank' } : null)}
                      onClick={e => {
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
                        <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })} sx={{
                          fontWeight: 600
                        }}>{subItem.title}</Typography>
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
      </Box>
    )
  } else {
    return (
      <ListItem disablePadding className='nav-link' disabled={item.disabled || false} sx={{ px: '0 !important' }}>
        <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
          <MenuNavLink
            component={'a'}
            className={isNavLinkActive() ? 'active' : ''}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            onClick={e => {
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
              pt: 0,
              pb: 0,
              height: '60px !important',
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

            <MenuItemTextMetaWrapper>
              <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })} sx={{
                fontWeight: 600
              }}>{item.title}</Typography>
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
          </MenuNavLink>
        </Link>
      </ListItem>
    )
  }
}

export default VerticalNavLink
