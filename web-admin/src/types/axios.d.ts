// axios.d.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
export * from 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean // Add the _retry property
  }
}
