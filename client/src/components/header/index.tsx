import "./index.css";

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  TextField, 
  IconButton, 
  Box,
  Container,
  Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import { useHeader } from "../../hooks/useHeader";

/**
 * Header component for the application
 * 
 * Displays the application header with search functionality and user information.
 * If a user is logged in, shows their avatar, username, and email.
 * Provides a logout button for authenticated users.
 * 
 * @returns {JSX.Element} The rendered Header component
 */
const Header = () => {
  const { user, handleSearch, handleLogout, searchString, handleSearchString, handleKeyDown } = useHeader();

  return (
    <AppBar position="static" color="primary" sx={{ width: '100%' }} id="app-header">
      <Container maxWidth={false} disableGutters id="header-container">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }} id="header-toolbar">
            <TextField
              size="small"
              name="search"
              onChange={(e) => handleSearchString(e.target.value)}
              onKeyDown={handleKeyDown}
              defaultValue={searchString}
              placeholder="Search..."
              variant="outlined"
              id="search-input"
              sx={{ 
                mr: 1,
                backgroundColor: 'background.paper',
                borderRadius: 1,
                width: '260px !important'
              }}
            />
            <IconButton type="submit" color="inherit" aria-label="search" id="search-button" onClick={() => handleSearch(searchString)}>
              <SearchIcon />
            </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }} id="user-section">
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }} id="user-info">
                <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'secondary.main' }} id="user-avatar">
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }} id="user-details">
                  <Typography variant="subtitle2" sx={{ lineHeight: 1.2 }} id="user-name">
                    {user.username}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }} id="user-email">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Button
              color="inherit"
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              id="logout-button"
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
