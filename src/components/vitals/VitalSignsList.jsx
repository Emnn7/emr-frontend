import React from 'react';
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
  CircularProgress
} from '@mui/material';

const VitalSignsList = ({ vitalSigns, loading = false }) => {
  // Ensure vitalSigns is always an array
  const safeVitalSigns = Array.isArray(vitalSigns) ? vitalSigns : [];
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (safeVitalSigns.length === 0) {
    return (
      <Box p={2}>
        <Typography variant="body1" color="textSecondary">
          No vital signs recorded
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Vital Signs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Temperature (°C)</TableCell>
              <TableCell>Blood Pressure</TableCell>
              <TableCell>Heart Rate</TableCell>
              <TableCell>Respiratory Rate</TableCell>
            </TableRow>
          </TableHead>
         <TableBody>
  {safeVitalSigns.map((vital, index) => (
    <TableRow key={index}>
      <TableCell>
        {vital.date ? new Date(vital.date).toLocaleDateString() : 'N/A'}
      </TableCell>
      <TableCell>
        {typeof vital.temperature === 'object'
          ? `${vital.temperature.value} ${vital.temperature.unit}`
          : vital.temperature || 'N/A'}
      </TableCell>
      <TableCell>
        {typeof vital.bloodPressure === 'object'
          ? `${vital.bloodPressure.value} ${vital.bloodPressure.unit}`
          : vital.bloodPressure || 'N/A'}
      </TableCell>
      <TableCell>
        {typeof vital.heartRate === 'object'
          ? `${vital.heartRate.value} ${vital.heartRate.unit}`
          : vital.heartRate || 'N/A'}
      </TableCell>
      <TableCell>
        {typeof vital.respiratoryRate === 'object'
          ? `${vital.respiratoryRate.value} ${vital.respiratoryRate.unit}`
          : vital.respiratoryRate || 'N/A'}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default VitalSignsList;