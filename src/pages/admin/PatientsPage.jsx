import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Container, Grid, Paper, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, IconButton, Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as ViewIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { fetchPatients } from '../../redux/slices/patientSlice';

const PatientsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients = [], loading } = useSelector((state) => state.patient) || {};
  const { user } = useSelector((state) => state.auth) || {};

  // Debug Redux state
  useEffect(() => {
    console.log('Current patients data:', patients);
  }, [patients]);

  useEffect(() => {
    dispatch(fetchPatients({})); // Or { doctorId: user?._id } if needed
  }, [dispatch]);

  const handleViewPatient = (patientId) => {
    navigate(`/patients/${patientId}`); // Adjust based on your route
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography component="h1" variant="h5">
                Patient Management
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
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {patients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No patients found
                        </TableCell>
                      </TableRow>
                    ) : (
                      patients.map((patient) => (
                        <TableRow key={patient._id}>
                          <TableCell>{patient.patientId || patient._id}</TableCell>
                          <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                          <TableCell>{patient.email}</TableCell>
                          <TableCell>{patient.phone}</TableCell>
                          <TableCell>
                            <Tooltip title="View Details">
                              <IconButton onClick={() => handleViewPatient(patient._id)}>
                                <ViewIcon color="primary" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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

export default PatientsPage;