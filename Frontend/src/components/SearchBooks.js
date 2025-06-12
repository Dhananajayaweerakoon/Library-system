import React, { useState } from 'react';
import {
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import axios from 'axios';

function SearchBooks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/books/search?query=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search books by title, author, or ISBN"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Search
        </Button>
      </Box>

      <Grid container spacing={3}>
        {searchResults.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {book.title}
                </Typography>
                <Typography color="textSecondary">
                  Author: {book.author}
                </Typography>
                <Typography color="textSecondary">
                  ISBN: {book.isbn}
                </Typography>
                <Typography color="textSecondary">
                  Status: {book.status}
                </Typography>
                {book.status === 'borrowed' && (
                  <>
                    <Typography color="textSecondary">
                      Borrowed by: {book.borrowedBy}
                    </Typography>
                    <Typography color="textSecondary">
                      Return date: {new Date(book.returnDate).toLocaleDateString()}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default SearchBooks; 