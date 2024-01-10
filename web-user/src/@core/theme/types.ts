import { PaletteColor, PaletteColorOptions } from "@mui/material"

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: PaletteColor,
    customColors: {
      main: string
      tableHeaderBg: string
      primaryGradient: string
    }
  }
  interface PaletteOptions {
    tertiary?: PaletteColorOptions,
    customColors?: {
      main?: string
      tableHeaderBg?: string
      primaryGradient?: string
    }
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    tertiary: true
  }
}

export {}
