import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { getReportById, downloadReport } from '../services/api';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const ReportViewer = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await getReportById(id);
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleDownload = async () => {
    try {
      await downloadReport(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderVulnerabilities = () => {
    if (!report.results) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Vulnerability Details
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Test</TableCell>
                <TableCell>Payload</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.test}</TableCell>
                  <TableCell sx={{ wordBreak: 'break-all' }}>{result.payload}</TableCell>
                  <TableCell>
                    <Chip 
                      label={result.vulnerable ? 'Vulnerable' : 'Secure'} 
                      color={result.vulnerable ? 'error' : 'success'} 
                    />
                  </TableCell>
                  <TableCell>{result.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderBruteForceResults = () => {
    if (!report.results) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Brute Force Results
        </Typography>
        {report.success ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            Password found: {report.results.find(r => r.success)?.password}
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 2 }}>
            No passwords from the wordlist worked
          </Alert>
        )}
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Password</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.password}</TableCell>
                  <TableCell>
                    {result.success ? (
                      <Chip label="Success" color="error" />
                    ) : (
                      <Chip label="Failed" color="default" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  const renderPermissions = () => {
    if (!report.serverPermissions && !report.databasePermissions && !report.roleMemberships) {
      return null;
    }

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Permission Analysis
        </Typography>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Server Permissions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(report.serverPermissions, null, 2)}
            </pre>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Database Permissions</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(report.databasePermissions, null, 2)}
            </pre>
          </AccordionDetails>
        </Accordion>
        
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Role Memberships</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {JSON.stringify(report.roleMemberships, null, 2)}
            </pre>
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  };

  const renderRecommendations = () => {
    const recommendations = {
      'SQL Injection': [
        'Implement parameterized queries or prepared statements',
        'Use stored procedures',
        'Apply proper input validation and sanitization',
        'Follow the principle of least privilege for database accounts',
        'Regularly update and patch your database system'
      ],
      'Brute Force': [
        'Enforce strong password policies',
        'Implement account lockout after failed attempts',
        'Enable multi-factor authentication',
        'Monitor for brute force attempts',
        'Use password managers to generate and store complex passwords'
      ],
      'Permissions': [
        'Review and remove unnecessary permissions',
        'Follow the principle of least privilege',
        'Regularly audit user permissions',
        'Implement role-based access control',
        'Remove or disable unused accounts'
      ]
    };

    const scanType = report?.scanType || 'SQL Injection';
    const relevantRecs = recommendations[scanType] || recommendations['SQL Injection'];

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Security Recommendations
        </Typography>
        <Paper elevation={2} sx={{ p: 2 }}>
          <List>
            {relevantRecs.map((rec, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${index + 1}. ${rec}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    );
  };

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

  if (!report) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Report not found
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Scan Report: {report.scanType}
            </Typography>
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>Target:</strong> {report.target}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">
              <strong>Date:</strong> {new Date(report.createdAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Typography>
            This scan detected {report.vulnerabilities || 0} potential vulnerabilities in the target database.
          </Typography>
        </Box>
        
        {report.scanType === 'SQL Injection' && renderVulnerabilities()}
        {report.scanType === 'Brute Force' && renderBruteForceResults()}
        {report.scanType === 'Permissions' && renderPermissions()}
        
        {renderRecommendations()}
      </Paper>
    </Box>
  );
};

export default ReportViewer;