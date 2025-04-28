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
  Alert,
  FormHelperText,
} from "@mui/material";
import { useSignUpPage } from "../../hooks/useSignUpPage";
import "./signUpPage.css";

const Signup = () => {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    error,
    passwordError,
    handleSignup,
    handlePasswordChange,
  } = useSignUpPage();

  return (
    <Container id="signup-container">
      <Paper id="signup-paper" elevation={6}>
        <Typography id="signup-title" variant="h4" component="h2">
          Sign Up
        </Typography>

        {error && <Alert id="signup-error" severity="error">{error}</Alert>}

        <Box id="signup-form" component="form" onSubmit={handleSignup} noValidate>
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Box id="password-container">
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
                error={!!passwordError}
              />
              {passwordError && (
                <FormHelperText id="password-error" error>
                  {passwordError}
                </FormHelperText>
              )}
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              id="signup-button"
            >
              SIGN UP
            </Button>
          </Stack>

          <Box id="login-link-container">
            <Button
              id="login-link"
              component={Link}
              to="/login"
              variant="text"
              size="small"
            >
              Already have an account? Log In
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;