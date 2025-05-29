// src/components/payment/PaymentList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Button,
  Grid
} from '@mui/material';
import { AttachMoney as MoneyIcon } from '@mui/icons-material';
import { fetchUnpaidBills, fetchRecentPayments } from '../../redux/slices/paymentSlice';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const PaymentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    unpaidBills, 
    recentPayments, 
    loading 
  } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchUnpaidBills());
    dispatch(fetchRecentPayments());
  }, [dispatch]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Payments</Typography>
        <Button 
          variant="contained" 
          startIcon={<MoneyIcon />}
          onClick={() => navigate('/receptionist/payments/new')}
        >
          New Payment
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Unpaid Bills
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(unpaidBills) && unpaidBills.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No unpaid bills found
                      </TableCell>
                    </TableRow>
                  )}
                  {Array.isArray(unpaidBills) && unpaidBills.map((bill) => (
                    <TableRow key={bill._id}>
                      <TableCell>
                        {bill.patient?.firstName} {bill.patient?.lastName}
                      </TableCell>
                      <TableCell>
                        {moment(bill.createdAt).format('MMM D, YYYY')}
                      </TableCell>
                      <TableCell>${bill.total}</TableCell>
                      <TableCell>
                        <Chip 
                          label={bill.status} 
                          color="warning" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => navigate(`/receptionist/payments/${bill._id}`)}
                        >
                          Process
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Payments
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(recentPayments) && recentPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No recent payments found
                      </TableCell>
                    </TableRow>
                  )}
                  {Array.isArray(recentPayments) && recentPayments.map((payment) => (
                    <TableRow key={payment._id}>
                      <TableCell>
                        {payment.patient?.firstName} {payment.patient?.lastName}
                      </TableCell>
                      <TableCell>
                        {moment(payment.createdAt).format('MMM D, YYYY')}
                      </TableCell>
                      <TableCell>${payment.totalAmount}</TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status} 
                          color={payment.status === 'Paid' ? 'success' : 'warning'} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaymentList;