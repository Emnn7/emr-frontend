import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Chip,
  InputAdornment
} from '@mui/material';
import { Search, Edit, Visibility } from '@mui/icons-material';
import { fetchPatients } from '../../redux/slices/patientSlice';
import { useNavigate } from 'react-router-dom';

const PatientManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { patients, loading } = useSelector((state) => state.patient);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchPatients({ doctorId: user._id }))
        .unwrap()
        .then(data => console.log('Patients data:', data))
        .catch(err => console.error('Error fetching patients:', err));
    }
  }, [dispatch, user]);

  const getFullName = (patient) =>
    `${patient.firstName || ''} ${patient.lastName || ''}`.trim();

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const filteredPatients = (patients || []).filter((patient) => {
    const fullName = getFullName(patient).toLowerCase();
    const phone = (patient.phone || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || phone.includes(search);
  });

  const handleViewPatient = (patientId) => {
    navigate(`/doctors/patients/${patientId}`);
  };

  if (loading) return <Typography>Loading patients...</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Patient Management
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patients by name or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Last Visit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No patients found
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient._id}>
                  <TableCell>{getFullName(patient) || '-'}</TableCell>
                  <TableCell>{patient.phone || '-'}</TableCell>
                  <TableCell>{calculateAge(patient.dateOfBirth)}</TableCell>
                  <TableCell>
                    {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : '-'}
                  </TableCell>
                  <TableCell>
                    {patient.lastVisit
                      ? new Date(patient.lastVisit).toLocaleDateString()
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={patient.active ? 'Active' : 'Inactive'}
                      color={patient.active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewPatient(patient._id)}>
                      <Visibility color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PatientManagement;