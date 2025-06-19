import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';

function AddBook() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    pages: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const clearForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      pages: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/books', formData);
      setMessage({ type: 'success', text: 'Book added successfully!' });
      clearForm();
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      let errorMsg = 'Error adding book. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes('ISBN already exists')) {
          errorMsg = 'A book with this ISBN already exists.';
        } else {
          errorMsg = error.response.data.message;
        }
      }
      setMessage({ type: 'error', text: errorMsg });
      console.error('Error adding book:', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Add New Book
        </Typography>
        {message.text && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Pages"
            name="pages"
            type="number"
            value={formData.pages}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Add Book
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddBook; 