import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from '@mui/material';
import axios from 'axios';

function BookList() {
  const [books, setBooks] = useState([]);
  const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowerInfo, setBorrowerInfo] = useState({
    name: '',
    studentNumber: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/books/search?query=${searchQuery}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const handleBorrow = async (book) => {
    setSelectedBook(book);
    setOpenBorrowDialog(true);
  };

  const handleReturn = async (bookId) => {
    try {
      // Update book status
      await axios.patch(`http://localhost:5000/api/books/${bookId}/return`);

      // Find the active borrowing record for this book
      const borrowingsResponse = await axios.get('http://localhost:5000/api/borrowings');
      const activeBorrowing = borrowingsResponse.data.find(
        borrowing => borrowing.bookIsbn === books.find(b => b._id === bookId)?.isbn && 
                    borrowing.status === 'active'
      );

      if (activeBorrowing) {
        // Update borrowing status to returned
        await axios.patch(`http://localhost:5000/api/borrowings/${activeBorrowing._id}/return`);
      }

      fetchBooks();
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleBorrowSubmit = async () => {
    try {
      // Update book status
      await axios.patch(`http://localhost:5000/api/books/${selectedBook._id}/borrow`, {
        borrowedBy: `${borrowerInfo.name} (${borrowerInfo.studentNumber})`
      });

      // Create borrowing record
      const returnDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
      await axios.post('http://localhost:5000/api/borrowings', {
        studentName: borrowerInfo.name,
        studentNumber: borrowerInfo.studentNumber,
        bookTitle: selectedBook.title,
        bookIsbn: selectedBook.isbn,
        returnDate: returnDate
      });

      setOpenBorrowDialog(false);
      setBorrowerInfo({ name: '', studentNumber: '' });
      fetchBooks();
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  const handleBorrowerInfoChange = (e) => {
    setBorrowerInfo({
      ...borrowerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleRemove = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/books/${bookId}`);
      fetchBooks();
    } catch (error) {
      alert('Error removing book.');
      console.error('Error removing book:', error);
    }
  };

  const handleUpdate = (book) => {
    // Placeholder for update logic (e.g., open a dialog or navigate to update page)
    alert('Update feature coming soon!');
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
        {books.map((book) => (
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
                  Pages: {book.pages}
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
                <Button
                  variant="contained"
                  color={book.status === 'available' ? 'primary' : 'secondary'}
                  onClick={() => book.status === 'available' ? handleBorrow(book) : handleReturn(book._id)}
                  sx={{ mt: 2, mr: 1 }}
                >
                  {book.status === 'available' ? 'Borrow' : 'Return'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemove(book._id)}
                  sx={{ mt: 2, mr: 1 }}
                >
                  Remove
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleUpdate(book)}
                  sx={{ mt: 2 }}
                >
                  Update
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openBorrowDialog} onClose={() => setOpenBorrowDialog(false)}>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Student Name"
            name="name"
            fullWidth
            value={borrowerInfo.name}
            onChange={handleBorrowerInfoChange}
            required
          />
          <TextField
            margin="dense"
            label="Student Number"
            name="studentNumber"
            fullWidth
            value={borrowerInfo.studentNumber}
            onChange={handleBorrowerInfoChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBorrowDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleBorrowSubmit} 
            color="primary"
            disabled={!borrowerInfo.name || !borrowerInfo.studentNumber}
          >
            Borrow
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default BookList; 