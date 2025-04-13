"use client"

import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ReactNode } from 'react'

const theme = createTheme({
    palette:{
        mode: 'light',
        primary:{
            main:'#1976d2'
        },
        secondary:{
            main:'#f50057'
        }
    }
})

export default function ThemeRegistry({children}:{children: ReactNode}){
    return(
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
        </AppRouterCacheProvider>
        
    )
}

