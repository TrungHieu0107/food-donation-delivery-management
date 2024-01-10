'use client'

// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet-control-geocoder/dist/Control.Geocoder.css' // Import CSS của thư viện

// import { ToastProvider } from 'react-toast-notifications'

// import { SessionProvider, signOut, useSession } from 'next-auth/react'
// import React, { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import { Box, CircularProgress, Stack, Typography } from '@mui/material'
import { AuthProvider } from 'src/@core/context/authContext'
import useSession from 'src/@core/hooks/useSession'

type ExtendedNextPage = NextPage & {
  auth?: {
    role: string[]
  }

  // Thêm thuộc tính auth với kiểu boolean
}

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: ExtendedNextPage
  emotionCache: EmotionCache
  session: any
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName}`}</title>
          <meta name='description' content={`${themeConfig.templateName} `} />
          <meta name='keywords' content='ADMIN PAGE' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>

        {/* <SessionProvider session={session}> */}

        <AuthProvider>  
          <SettingsProvider>
            <SettingsConsumer>
              {({ settings }) => {
                return (
                  <ThemeComponent settings={settings}>
                    {Component.auth ? (
                      <Auth role={Component.auth.role}>{getLayout(<Component {...pageProps} />)}</Auth>
                    ) : (
                      <>{getLayout(<Component {...pageProps} />)}</>
                    )}
                  </ThemeComponent>
                )
              }}
            </SettingsConsumer>
          </SettingsProvider>
          </AuthProvider>
        {/* </SessionProvider> */}
        <ToastContainer
          position='top-right'
          autoClose={6000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{
            zIndex: '999990 !important'
          }}
        />
      </CacheProvider>
  )
}

export default App

interface AuthProps {
  children: React.ReactNode
  role: string[] // Chỉnh kiểu của role
}

const Auth: React.FC<AuthProps> = ({ children, role }) => {
  const { session }: any = useSession()
  const isUser = !!session?.user
  const router = useRouter()

  // useEffect(() => {
  //   if (status === 'loading') return
  //   if (status === 'unauthenticated') router.replace('/quan-tri-vien/dang-nhap')
  // }, [isUser, status, role, router, session])
  if(!isUser){
    // router.replace('/quan-tri-vien/dang-nhap')
    if(typeof window !== "undefined"){
      window.location.href = "/quan-tri-vien/dang-nhap";
    }     
    
    return <></>
  }
  if (isUser) {
    if (role && !role.includes(session?.user?.role || 'None')) {
      router.push('/403')

      // signOut({
      //   callbackUrl: '/403'
      // })

      return <></>
    }

    return <Box>{children}</Box>
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return ( 
  <Stack
    direction={'row'}
    justifyContent={'center'}
    alignItems={'center'}
    sx={{
      height: '100vh',
      gap: 3
    }}
  >
    <CircularProgress color='info' />
    <Typography fontWeight={600}>Kiểm tra phân quyền....</Typography>
  </Stack>)
}
