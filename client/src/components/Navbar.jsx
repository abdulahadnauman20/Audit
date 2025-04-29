import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../services/auth';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MSSQL Pentest Tool
        </Typography>
        
        {user ? (
          <Box>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/scan">Scan</Button>
            <Button color="inherit" component={Link} to="/reports">Reports</Button>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">Login</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
