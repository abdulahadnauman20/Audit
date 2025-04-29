import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Link,
  CircularProgress,
  Alert
} from '@mui/material';
import { getScanHistory } from '../services/api';
import { Link as RouterLink } from 'react-router-dom';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getScanHistory();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Scan Reports
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Scan Type</TableCell>
                <TableCell>Target</TableCell>
                <TableCell>Vulnerabilities</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{report.scanType}</TableCell>
                  <TableCell>{report.target}</TableCell>
                  <TableCell>
                    {report.vulnerabilities || 0}
                  </TableCell>
                  <TableCell>
                    <Link 
                      component={RouterLink} 
                      to={`/reports/view/${report.id}`}
                      sx={{ mr: 2 }}
                    >
                      View
                    </Link>
                    <Link 
                      href={`${process.env.REACT_APP_API_URL}/reports/download/${report.id}`}
                      download
                    >
                      Download
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ReportsPage;