"use client";
import { Box, Button, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Drawer, AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { useState, ReactNode, useEffect } from 'react';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useRouter } from "next/navigation";
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from "./lib/auth";
import Cookies from "js-cookie";


type Anchor = 'top' | 'left' | 'bottom' | 'right';

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  useAuth();

  const handleDrawerButtonClick = (text: string) => {
    switch (text) {
      case 'Inicio':
        router.push('/main');
        break;
      case 'Reportes':
        router.push('/main/reports');
        break;
      case 'Alumnos':
        router.push('/main/students');
        break;
      case 'Añadir alumno':
        router.push('/main/table');
        break;
      case 'Gestión de usuarios':
        router.push('/main/users');
        break;
      case 'Documentos alumnos':
        router.push('/main/docs');
        break;
      default:
        break;
    }
  };

  const logout = () => {
    window.location.href = '/';
    Cookies.remove('xvlf');
  }


  const [state, setState] = useState({
    left: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inicio', 'Reportes', 'Alumnos', 'Añadir alumno', 'Gestión de usuarios', 'Documentos alumnos'].map((text, index) => (
          <ListItem key={text} disablePadding onClick={() => handleDrawerButtonClick(text)}>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer('left', true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Seguimientos
          </Typography>
          <Button color="inherit" onClick={() => logout()}>Cerrar sesión</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor={'left'}
        open={state['left']}
        onClose={toggleDrawer('left', false)}
      >
        {list('left')}
      </Drawer>
      <div style={{ paddingTop: '64px' }}> {/* Adjust paddingTop to match the height of the AppBar */}
        <main style={{ flex: 1, padding: '20px' }}>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
