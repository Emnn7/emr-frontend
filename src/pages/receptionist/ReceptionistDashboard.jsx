import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert } from '@mui/material';
import { People as PeopleIcon, CalendarToday as CalendarIcon, Add as AddIcon, AttachMoney as MoneyIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import StatCard from '../../components/common/StatCard';
import { fetchPatients, fetchRecentPatients } from '../../redux/slices/patientSlice';
import { fetchAppointments, fetchTodayAppointments } from '../../redux/slices/appointmentSlice';
import { fetchUnpaidBills, fetchRecentPayments, fetchPaymentStats } from '../../redux/slices/paymentSlice';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const ReceptionistDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    patients, 
    loading: patientsLoading, 
    recentPatients,
    duplicateWarning 
  } = useSelector((state) => state.patient);
  
  const { 
    appointments, 
    loading: appointmentsLoading, 
    todayAppointments 
  } = useSelector((state) => state.appointment);

  const {
    unpaidBills,
    recentPayments,
    paymentStats,
    loading: paymentsLoading
  } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchRecentPatients());
    dispatch(fetchAppointments());
    dispatch(fetchTodayAppointments());
    dispatch(fetchUnpaidBills());
    dispatch(fetchRecentPayments());
    dispatch(fetchPaymentStats());
  }, [dispatch]);


useEffect(() => {
  console.log('Current unpaidBills:', unpaidBills);
  console.log('Current paymentStats:', paymentStats);
}, [unpaidBills, paymentStats]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Receptionist Dashboard
      </Typography>
      
      {duplicateWarning && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Patient with this phone number already exists. Please check before registering.
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PeopleIcon}
            title="Total Patients"
            value={patients?.length || 0}
            loading={patientsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CalendarIcon}
            title="Today's Appointments"
            value={todayAppointments?.length || 0}
            loading={appointmentsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={MoneyIcon}
            title="Unpaid Bills"
            value={paymentStats?.unpaidCount || 0}
            subtitle={`$${paymentStats?.unpaidTotal || 0}`}
            loading={paymentsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ReceiptIcon}
            title="Today's Payments"
            value={paymentStats?.todayCount || 0}
            subtitle={`$${paymentStats?.todayTotal || 0}`}
            loading={paymentsLoading}
          />
        </Grid>
      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/receptionist/register')}
                  sx={{ mb: 2 }}
                >
                  Register Patient
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/receptionist/appointments')}
                  sx={{ mb: 2 }}
                >
                  Schedule Appointment
                </Button>
                <Button
                  variant="contained"
                  startIcon={<MoneyIcon />}
                  onClick={() => navigate('/receptionist/payments')}
                >
                  Process Payment
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
    <Grid item xs={12} sm={6} md={8}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Unpaid Bills
    </Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Patient</TableCell>
            <TableCell>Procedure Codes</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {unpaidBills && unpaidBills.length > 0 ? (
            unpaidBills.slice(0, 5).map((bill) => (
              <TableRow 
                key={bill._id}
                hover
                onClick={() => navigate(`/receptionist/payments/${bill._id}`)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  {bill.patient ? `${bill.patient.firstName} ${bill.patient.lastName}` : 'N/A'}
                </TableCell>
               <TableCell>
  {Array.isArray(bill.services) && bill.services.length > 0
    ? bill.services.map(s => s.code).join(', ')
    : 'N/A'}
</TableCell>

              <TableCell>${bill.total}</TableCell> 
                <TableCell>
                  {moment(bill.createdAt).format('MMM D, YYYY')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={bill.status} 
                    color={bill.status === 'Paid' ? 'success' : 'warning'} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No unpaid bills found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
</Grid>

      </Grid>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Patients
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Date Registered</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentPatients?.map((patient) => (
                    <TableRow key={patient._id}>
                      <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>
                        {moment(patient.createdAt).format('MMM D, YYYY')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Appointments
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayAppointments?.map((appt) => (
                    <TableRow key={appt._id}>
                      <TableCell>
                        {appt.patient ? `${appt.patient.firstName} ${appt.patient.lastName}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {appt.doctor ? `${appt.doctor.firstName} ${appt.doctor.lastName}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {moment(appt.appointmentDate).format('h:mm A')}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={appt.status} 
                          color={
                            appt.status === 'Completed' ? 'success' : 
                            appt.status === 'Cancelled' ? 'error' : 'primary'
                          } 
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

export default ReceptionistDashboard;