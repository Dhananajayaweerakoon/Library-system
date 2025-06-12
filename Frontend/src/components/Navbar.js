import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <LibraryBooksIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Library System
        </Typography>
        <Box>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Books
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/add"
          >
            Add Book
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/borrowings"
          >
            Student Borrowings
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 