// Updated PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Divider,
  Alert
} from '@mui/material';
import { updatePaymentStatus, createPayment, clearPaymentError, fetchBillingById } from '../../redux/slices/paymentSlice';
import { fetchAppointmentById } from '../../redux/slices/appointmentSlice';

const PaymentForm = () => {
  const { id } = useParams(); // Changed from appointmentId to id
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { appointment, loading: appointmentLoading } = useSelector((state) => state.appointment);
  const { billing, loading: billingLoading } = useSelector((state) => state.payment);
  const { loading, error } = useSelector((state) => state.payment);
  
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState(0);
  
  useEffect(() => {
    if (id) {
      // First try to fetch as appointment ID
      dispatch(fetchAppointmentById(id))
        .unwrap()
        .catch(() => {
          // If not an appointment, try as billing ID
          dispatch(fetchBillingById(id));
        });
    }
  }, [id, dispatch]);
  
  useEffect(() => {
    const total = appointment?.billing?.totalAmount || billing?.total;
    if (total) {
      setAmountReceived(total);
    }
    console.log("Billing Services:", billing?.services);
  console.log("Appointment Billing Services:", appointment?.billing?.services);
  }, [appointment, billing]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const paymentData = {
      billing: billing?._id || appointment?.billing?._id,
      patient: (billing?.patient || appointment?.patient)?._id,
      services: billing?.services || appointment?.billing?.services,
      totalAmount: billing?.total || appointment?.billing?.totalAmount,
      paymentMethod,
      amountReceived,
      status: amountReceived >= (billing?.total || appointment?.billing?.totalAmount) ? 'Paid' : 'Partial'
    };
    
    dispatch(createPayment(paymentData))
      .unwrap()
      .then(() => {
        navigate('/receptionist/payments');
      });
  };

  // Loading states
  if (appointmentLoading || billingLoading) return <Typography>Loading...</Typography>;
  
  // Check if we have either appointment with billing or direct billing data
  const hasData = (appointment && appointment.billing) || billing;
  if (!hasData) return <Typography>No payment information found</Typography>;

  const handleMarkAsPaid = () => {
  const billingId = billing?._id || appointment?.billing?._id;

  if (!billingId) return;

  dispatch(updatePaymentStatus({
    billingId,
    status: 'Paid'
  }))
    .unwrap()
    .then(() => {
      navigate('/receptionist/payments');
    });
};


  return (
    <Box component={Paper} p={4}>
      <Typography variant="h5" gutterBottom>
        Process Payment
      </Typography>
      
      {error && (
        <Alert severity="error" onClose={() => dispatch(clearPaymentError())} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Patient Details
          </Typography>
          <Typography>
            Patient: {(billing?.patient || appointment?.patient)?.firstName} {(billing?.patient || appointment?.patient)?.lastName}
          </Typography>
          {appointment && (
            <>
              <Typography>Date: {new Date(appointment.appointmentDate).toLocaleString()}</Typography>
              <Typography>Doctor: {appointment.doctor.firstName} {appointment.doctor.lastName}</Typography>
            </>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Services
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(billing?.services || appointment?.billing?.services)?.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell>{service.code}</TableCell>
                    <TableCell>{service.description}</TableCell>
                    <TableCell>${service.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box mt={2} textAlign="right">
            <Typography variant="subtitle1">
              Total Amount: <strong>${billing?.total || appointment?.billing?.totalAmount}</strong>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value="cash">Cash</option>
              <option value="card">Credit/Debit Card</option>
              <option value="insurance">Insurance</option>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Amount Received"
              type="number"
              value={amountReceived}
              onChange={(e) => setAmountReceived(parseFloat(e.target.value))}
              inputProps={{
                step: "0.01",
                min: "0"
              }}
            />
          </Grid>
        </Grid>
        
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/receptionist')}
          >
            Cancel
          </Button>
          
          {(appointment?.billing?.status || billing?.status) === 'Unpaid' ? (
            <Button 
              variant="contained" 
              type="submit"
              disabled={loading}
            >
              Process Payment
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleMarkAsPaid}
              disabled={loading}
            >
              Mark as Paid
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentForm;