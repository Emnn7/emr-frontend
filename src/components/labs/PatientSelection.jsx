import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  Paper,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import { Search as SearchIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { usePatientSearch } from '../../hooks/usePatientSearch';

const PatientSelection = () => {
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    patients,
    isLoading,
    error
  } = usePatientSearch();

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Select Patient for Vital Signs Recording
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search patients by name, ID, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          {patients?.length > 0 ? (
        patients.map((patient) => (
              <ListItem 
                key={patient.id}
                secondaryAction={
                  <IconButton 
                    edge="end"
                    onClick={() => navigate(`/lab/vital-signs/new/${patient._id}`)}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                }
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/lab/vital-signs/new/${patient._id}`)}
              >
                   <ListItemText 
      primary={`${patient.firstName} ${patient.lastName}`}
      secondary={
        <>
          <span>ID: {patient.patientId || 'N/A'}</span>
          <br />
          <span>Phone: {patient.phone || 'N/A'}</span>
        </>
      }
    />
  </ListItem>
            ))
          ) : (
             <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
          {searchTerm ? 'No patients found matching your search' : 'No patients available'}
        </Typography>
          )}
        </List>
      )}
    </Paper>
  );
};

export default PatientSelection;