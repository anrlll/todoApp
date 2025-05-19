'use client';

import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, IconButton } from '@mui/material';
import { Assignment as TodoIcon, Schedule as TimeTableIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const drawerWidth = 240;
const collapsedWidth = 64;

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
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedWidth,
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
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              href="/"
              sx={{ 
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
                width: '100%',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  width: 40,
                }}
              >
                <TodoIcon />
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary="Todoリスト" 
                  sx={{ ml: 2 }}
                />
              )}
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
              component={Link} 
              href="/timetable"
              sx={{ 
                minHeight: 48,
                justifyContent: 'center',
                px: 2.5,
                width: '100%',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  justifyContent: 'center',
                  width: 40,
                }}
              >
                <TimeTableIcon />
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary="タイムテーブル" 
                  sx={{ ml: 2 }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
} 