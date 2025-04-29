import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Tabs, 
  Tab, 
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { testSQLInjection, testBruteForce, checkPermissions, generateReport } from '../services/api';

const ScanForm = () => {
  const [tabValue, setTabValue] = useState(0);
  const [target, setTarget] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [wordlist, setWordlist] = useState(['admin', 'password', '123456', 'root', 'test']);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setResults(null);
    setError(null);
  };

  const handleScan = async () => {
    if (!target || !username || !password) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let response;
      const credentials = { username, password };
      
      switch(tabValue) {
        case 0: // SQL Injection
          response = await testSQLInjection(target, credentials);
          break;
        case 1: // Brute Force
          response = await testBruteForce(target, credentials, wordlist);
          break;
        case 2: // Permissions
          response = await checkPermissions(target, credentials);
          break;
        default:
          throw new Error('Invalid scan type');
      }
      
      setResults(response.data || response); // Handle both response formats
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!results) return;
    
    setLoading(true);
    try {
      const report = await generateReport({
        scanType: ['SQL Injection', 'Brute Force', 'Permissions'][tabValue],
        target,
        results
      });
      
      // Handle both response formats
      const downloadUrl = report.downloadUrl || report.data?.downloadUrl;
      if (downloadUrl) {
        window.open(`${process.env.REACT_APP_API_URL}${downloadUrl}`, '_blank');
      } else {
        throw new Error('No download URL received');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Database Vulnerability Scanner
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="SQL Injection" />
        <Tab label="Brute Force" />
        <Tab label="Permissions" />
      </Tabs>
      
      <Box component="form" sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Target Server"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={togglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        {tabValue === 1 && (
          <TextField
            fullWidth
            label="Wordlist (comma separated)"
            value={wordlist.join(',')}
            onChange={(e) => setWordlist(e.target.value.split(',').map(w => w.trim()))}
            margin="normal"
            helperText="Common passwords to test"
          />
        )}
        
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleScan}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Run Scan
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {results && (
        <>
          <Typography variant="h6" gutterBottom>
            Scan Results
          </Typography>
          
          {tabValue === 0 && results.results && (
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
                  {results.results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.test || 'N/A'}</TableCell>
                      <TableCell sx={{ wordBreak: 'break-all' }}>
                        {result.payload || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={result.vulnerable ? 'Vulnerable' : 'Secure'} 
                          color={result.vulnerable ? 'error' : 'success'} 
                        />
                      </TableCell>
                      <TableCell>{result.evidence || result.message || 'No details'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {tabValue === 1 && results.results && (
            <Box>
              {results.success ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  Password found: {results.results.find(r => r.success)?.password || 'Unknown'}
                </Alert>
              ) : (
                <Alert severity="success" sx={{ mb: 2 }}>
                  No passwords from the wordlist worked
                </Alert>
              )}
              
              <Typography variant="subtitle1" gutterBottom>
                Attempts:
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Password</TableCell>
                      <TableCell>Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{result.password || 'N/A'}</TableCell>
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
          )}
          
          {tabValue === 2 && (
            <Box>
              {results.serverPermissions && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Server Permissions:
                  </Typography>
                  <pre>{JSON.stringify(results.serverPermissions, null, 2)}</pre>
                </>
              )}
              
              {results.databasePermissions && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Database Permissions:
                  </Typography>
                  <pre>{JSON.stringify(results.databasePermissions, null, 2)}</pre>
                </>
              )}
              
              {results.roleMemberships && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Role Memberships:
                  </Typography>
                  <pre>{JSON.stringify(results.roleMemberships, null, 2)}</pre>
                </>
              )}
            </Box>
          )}
          
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGenerateReport}
              disabled={loading || !results}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Generate PDF Report
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ScanForm;