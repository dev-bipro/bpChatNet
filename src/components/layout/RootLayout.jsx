import React from 'react'
import { Outlet } from 'react-router-dom'
import Grid from '@mui/material/Grid';

import Sidebar from '../sidebar/Sidebar';

const RootLayout = () => {


  



  return (
    <>
    <Grid container spacing={2}>
        <Grid item xs={2}>
        <Sidebar/>
        </Grid>
        <Grid item xs={10}>
        <Outlet/>
        </Grid>
    </Grid>
        
        
    </>
  )
}

export default RootLayout