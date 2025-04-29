import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';  // Import the authentication context

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();  // Use register function from auth context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(username, password); // Call register method from useAuth context
      navigate('/dashboard'); // Redirect to the dashboard after successful registration
    } catch (err) {
      setError('Registration failed, please try again');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          required
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          required
          type="password"
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          sx={{ marginTop: 2 }}
        >
          Register
        </Button>
      </form>

      <Button
        variant="text"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
        onClick={() => navigate('/login')}
      >
        Already have an account? Login here
      </Button>
    </Box>
  );
};

export default RegisterPage;
