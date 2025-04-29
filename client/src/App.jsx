import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ScanPage from './pages/ScanPage';
import ReportsPage from './pages/ReportsPage';
import Navbar from './components/Navbar';
import { AuthProvider } from './services/auth';
import ReportViewer from './components/ReportViewer';
import RegisterPage from './pages/RegisterPage'; // Import the RegisterPage component

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router> {/* Router should wrap everything */}
        <AuthProvider> {/* AuthProvider inside Router */}
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/view/:id" element={<ReportViewer />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
