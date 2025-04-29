import React from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { useAuth } from '../services/auth';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.username}!
      </Typography>
      
      <Typography variant="body1" paragraph>
        Use this tool to test your MSSQL databases for common vulnerabilities like SQL injection,
        weak passwords, and misconfigured permissions.
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                SQL Injection Testing
              </Typography>
              <Typography variant="body2">
                Test your database for SQL injection vulnerabilities using various attack vectors.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Brute Force Testing
              </Typography>
              <Typography variant="body2">
                Test for weak passwords using dictionary attacks.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Permission Analysis
              </Typography>
              <Typography variant="body2">
                Check for misconfigured permissions and excessive privileges.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;