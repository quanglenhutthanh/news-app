"use client"

import { AppBar, Toolbar, Typography } from "@mui/material";


export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div">
                    News App
                </Typography>
            </Toolbar>
        </AppBar>
    )
}