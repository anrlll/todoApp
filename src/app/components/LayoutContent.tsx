'use client';

import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, IconButton } from '@mui/material';
import { Assignment as TodoIcon, Schedule as TimeTableIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const drawerWidth = 240;

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 64,
            boxSizing: 'border-box',
            transition: 'width 0.2s',
            overflowX: 'hidden',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          p: 1,
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        }}>
          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
        <Box sx={{ 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/"
                sx={{ 
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  width: '100%',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 0,
                    justifyContent: 'center',
                    width: 40,
                  }}
                >
                  <TodoIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Todoリスト" 
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton 
                component={Link} 
                href="/timetable"
                sx={{ 
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  width: '100%',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 0,
                    justifyContent: 'center',
                    width: 40,
                  }}
                >
                  <TimeTableIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="タイムテーブル" 
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
} 