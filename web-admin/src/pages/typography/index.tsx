'use client'

import Grid from '@mui/material/Grid'

import React from 'react';
import dynamic from 'next/dynamic'

const TypographyPage = () => {
  const Map = dynamic(() => import("src/layouts/components/map/MapComponent"), { ssr: false });

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <TypographyHeadings /> */}
       <Map/>
      </Grid>
      {/* <Grid item xs={12}>
        <TypographyTexts />
      </Grid> */}
    </Grid>

   
  )
}

export default TypographyPage
