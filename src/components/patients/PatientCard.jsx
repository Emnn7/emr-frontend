import React from 'react';
import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';
import { Phone } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
const PatientCard = ({ patients = [], loading, emptyMessage }) => {
  if (loading) return <CircularProgress />;
  if (!patients.length) return <div>{emptyMessage}</div>;

  return (
    <div>
      {patients.map(patient => (
        <Card key={patient._id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 2 }}>
                {patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6">
                  {patient.firstName} {patient.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {patient.gender}, {calculateAge(patient.dateOfBirth)} years
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Phone fontSize="small" sx={{ mr: 1 }} /> {patient.phone}
              </Typography>
              {/* Add other fields as needed */}
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper function to calculate age
function calculateAge(dob) {
  if (!dob) return 'Unknown';
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
export default PatientCard;