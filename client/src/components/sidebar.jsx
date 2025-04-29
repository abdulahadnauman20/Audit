import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CodeIcon from '@mui/icons-material/Code';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
  },
}));

const Sidebar = () => {
  return (
    <StyledDrawer variant="permanent">
      <Toolbar /> {/* This pushes content below the app bar */}
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/sql-injection">
          <ListItemIcon><CodeIcon /></ListItemIcon>
          <ListItemText primary="SQL Injection" />
        </ListItem>
        <ListItem button component={Link} to="/brute-force">
          <ListItemIcon><LockOpenIcon /></ListItemIcon>
          <ListItemText primary="Brute Force" />
        </ListItem>
        <ListItem button component={Link} to="/permissions">
          <ListItemIcon><LockIcon /></ListItemIcon>
          <ListItemText primary="Permissions" />
        </ListItem>
        <ListItem button component={Link} to="/reports">
          <ListItemIcon><AssessmentIcon /></ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItem>
      </List>
    </StyledDrawer>
  );
};

export default Sidebar;