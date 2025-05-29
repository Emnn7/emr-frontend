import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box
} from '@mui/material';

const BillingTable = ({ bills, loading, error }) => {
  console.log('BillingTable received:', {
    bills,
    billsCount: bills?.length,
    loading,
    error
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading bills: {error}
      </Alert>
    );
  }

  if (!bills || bills.length === 0) {
    return (
      <Alert severity="info">
        No billing records found
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Items</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill._id}>
              <TableCell>{bill._id.substring(0, 8)}...</TableCell>
              <TableCell>
                {bill.patient 
                  ? `${bill.patient.firstName} ${bill.patient.lastName}`
                  : 'N/A'}
              </TableCell>
              <TableCell>
                {bill.items?.length || 0} items
              </TableCell>
              <TableCell>${(bill.total ?? 0).toFixed(2)}</TableCell>
              <TableCell>{bill.status}</TableCell>
              <TableCell>
                {new Date(bill.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BillingTable;