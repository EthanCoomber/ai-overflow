import React from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  Stack,
  Alert
} from "@mui/material";
import { useLogin } from "../../hooks/useLogin";
import "./loginPage.css";

const Login = () => {
  const { email, password, error, handleEmailChange, handlePasswordChange, handleSubmit } = useLogin();

  return (
    <Container className="container">
      <Paper className="paper" elevation={6}>
        <Typography
          variant="h4"
          component="h2"
          className="title"
        >
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate className="form">
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
              className="text-field"
            />
            <TextField
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={password}
              onChange={handlePasswordChange}
              className="text-field"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              className="login-button"
            >
              Login
            </Button>
          </Stack>
        </Box>
        <Box className="signup-link">
          <Button
            component={Link}
            to="/signup"
            variant="text"
            size="small"
            className="signup-button"
          >
            Don&apos;t have an account? Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
