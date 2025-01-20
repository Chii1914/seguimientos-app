'use client';
import localFont from 'next/font/local';
import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const Swis721BT = localFont({
  src: [
    { path: 'Utils/Swis721BT.ttf', weight: '400' },
    { path: 'Utils/Swis721BT italic.ttf', weight: '400'},
    { path: 'Utils/Swis721BT bold.ttf', weight: '700' },
    { path: 'Utils/Swis721BT bold italic.ttf', weight: '700'},
    { path: 'Utils/Swis721BT CN.ttf', weight: '400' },
    { path: 'Utils/Swis721BT CN bold.ttf', weight: '700' },
    { path: 'Utils/Swis721BT CN bold italic.ttf', weight: '700'},
  ],
});


const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: Swis721BT.style.fontFamily,
  },
});

export default theme;