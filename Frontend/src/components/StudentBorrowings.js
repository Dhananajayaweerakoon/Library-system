import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import axios from 'axios';

function StudentBorrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchBorrowings();
  }, [showAll]);

  const fetchBorrowings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/borrowings');
      // Filter active borrowings if showAll is false
      const filteredBorrowings = showAll 
        ? response.data 
        : response.data.filter(borrowing => borrowing.status === 'active');
      setBorrowings(filteredBorrowings);
    } catch (error) {
      console.error('Error fetching borrowings:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/borrowings/search?query=${searchQuery}`);
      // Filter active borrowings if showAll is false
      const filteredBorrowings = showAll 
        ? response.data 
        : response.data.filter(borrowing => borrowing.status === 'active');
      setBorrowings(filteredBorrowings);
    } catch (error) {
      console.error('Error searching borrowings:', error);
    }
  };

  const handleToggleShowAll = (event) => {
    setShowAll(event.target.checked);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Student Borrowings
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showAll}
              onChange={handleToggleShowAll}
              color="primary"
            />
          }
          label="Show all borrowings (including returned)"
        />
      </Box>

      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search by student name, number, book title, or ISBN"
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Student Number</TableCell>
              <TableCell>Book Title</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Borrow Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowings.map((borrowing) => (
              <TableRow 
                key={borrowing._id}
                sx={{ 
                  backgroundColor: borrowing.status === 'active' ? 'inherit' : '#f5f5f5'
                }}
              >
                <TableCell>{borrowing.studentName}</TableCell>
                <TableCell>{borrowing.studentNumber}</TableCell>
                <TableCell>{borrowing.bookTitle}</TableCell>
                <TableCell>{borrowing.bookIsbn}</TableCell>
                <TableCell>
                  {new Date(borrowing.borrowDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(borrowing.returnDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Typography
                    color={borrowing.status === 'active' ? 'primary' : 'textSecondary'}
                  >
                    {borrowing.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default StudentBorrowings; 