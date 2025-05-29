import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, Grid, Paper, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Chip, IconButton, Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { fetchAppointments } from '../../redux/slices/appointmentSlice';
import { format } from 'date-fns';

const AppointmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { appointments = [], loading } = useSelector((state) => state.appointment) || {};

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'pending': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h1" variant="h5">
                Appointment Management
              </Typography>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Patient</TableCell>
                      <TableCell>Doctor</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment._id}>
                        <TableCell>{appointment.appointmentId || appointment._id}</TableCell>
                        <TableCell>
                          {appointment.patient
                            ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {appointment.doctor
                            ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {appointment.date && !isNaN(new Date(appointment.date))
                            ? `${format(new Date(appointment.date), 'MMM dd, yyyy')} at ${appointment.time || 'N/A'}`
                            : 'Invalid date'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton onClick={() => navigate(`/appointments/${appointment._id}`)}>
                              <CalendarIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AppointmentsPage;
