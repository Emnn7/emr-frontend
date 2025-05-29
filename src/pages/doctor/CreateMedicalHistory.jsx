import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Box, Typography, TextField, Button, Paper, Grid, FormControl, 
  InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Divider
} from '@mui/material';
import { createMedicalHistory } from '../../redux/slices/medicalHistorySlice';

const CreateMedicalHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth); // Get current user
  
  const [formData, setFormData] = useState({
    symptoms: '',
    diagnosis: '',
    notes: '',
    familyHistory: '',
    followUpDate: '',
    pastIllnesses: '',
    surgicalHistory: '',
    allergies: [],
    currentMedications: [],
    lifestyle: {
      smoking: false,
      alcohol: false,
      exerciseFrequency: '',
      diet: ''
    }
  });

  const [newAllergy, setNewAllergy] = useState({ name: '', reaction: '', severity: 'moderate' });
  const [newMedication, setNewMedication] = useState({ 
    name: '', 
    dosage: '', 
    frequency: '', 
    startDate: '', 
    prescribedBy: '' 
  });

const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!formData.diagnosis) {
    alert('Diagnosis is required');
    return;
  }

  console.log("Submitting with data:", formData); // Debug

  dispatch(createMedicalHistory({ 
    patientId: id,
    doctorId: user.id,
    historyData: {
      ...formData,
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined,
      allergies: formData.allergies.filter(a => a.name),
      currentMedications: formData.currentMedications.filter(m => m.name)
    }
  }))
  .unwrap()
  .then((response) => {
    console.log("API Success:", response); // Debug
   navigate(`/doctor/patients/${id}`, {  // Use existing route
  state: { success: 'Medical history created successfully!' }
});
  })
  .catch(error => {
    console.error("API Error Details:", error); // Debug
    alert(`Failed to save: ${error.message || "Check console for details"}`);
  });
};

  const addAllergy = () => {
    if (newAllergy.name) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, newAllergy]
      });
      setNewAllergy({ name: '', reaction: '', severity: 'moderate' });
    }
  };

  const addMedication = () => {
    if (newMedication.name) {
      setFormData({
        ...formData,
        currentMedications: [...formData.currentMedications, newMedication]
      });
      setNewMedication({ 
        name: '', 
        dosage: '', 
        frequency: '', 
        startDate: '', 
        prescribedBy: '' 
      });
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>Initial Medical History Form</Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Symptoms and Diagnosis */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Symptoms"
              multiline
              rows={2}
              value={formData.symptoms}
              onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Diagnosis"
              multiline
              rows={2}
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              required
            />
          </Grid>

          {/* Past Medical History */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Past Illnesses (comma separated)"
              value={formData.pastIllnesses}
              onChange={(e) => setFormData({...formData, pastIllnesses: e.target.value})}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Surgical History"
              value={formData.surgicalHistory}
              onChange={(e) => setFormData({...formData, surgicalHistory: e.target.value})}
            />
          </Grid>

          {/* Allergies Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Allergies</Typography>
            
            {formData.allergies.map((allergy, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography><strong>{allergy.name}</strong></Typography>
                <Typography>Reaction: {allergy.reaction}</Typography>
                <Typography>Severity: {allergy.severity}</Typography>
              </Box>
            ))}

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Allergy Name"
                  value={newAllergy.name}
                  onChange={(e) => setNewAllergy({...newAllergy, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Reaction"
                  value={newAllergy.reaction}
                  onChange={(e) => setNewAllergy({...newAllergy, reaction: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={newAllergy.severity}
                    label="Severity"
                    onChange={(e) => setNewAllergy({...newAllergy, severity: e.target.value})}
                  >
                    <MenuItem value="mild">Mild</MenuItem>
                    <MenuItem value="moderate">Moderate</MenuItem>
                    <MenuItem value="severe">Severe</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button 
                  variant="outlined" 
                  onClick={addAllergy}
                  disabled={!newAllergy.name}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Current Medications Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Current Medications</Typography>
            
            {formData.currentMedications.map((med, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                <Typography><strong>{med.name}</strong></Typography>
                <Typography>Dosage: {med.dosage}</Typography>
                <Typography>Frequency: {med.frequency}</Typography>
                {med.startDate && <Typography>Start Date: {med.startDate}</Typography>}
                {med.prescribedBy && <Typography>Prescribed By: {med.prescribedBy}</Typography>}
              </Box>
            ))}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Medication Name"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Dosage"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Frequency"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={newMedication.startDate}
                  onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Prescribed By"
                  value={newMedication.prescribedBy}
                  onChange={(e) => setNewMedication({...newMedication, prescribedBy: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <Button 
                  variant="outlined" 
                  onClick={addMedication}
                  disabled={!newMedication.name}
                  sx={{ height: '100%' }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Lifestyle Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Lifestyle Information</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={formData.lifestyle.smoking}
                      onChange={(e) => setFormData({
                        ...formData, 
                        lifestyle: {...formData.lifestyle, smoking: e.target.checked}
                      })}
                    />
                  }
                  label="Smoking"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={formData.lifestyle.alcohol}
                      onChange={(e) => setFormData({
                        ...formData, 
                        lifestyle: {...formData.lifestyle, alcohol: e.target.checked}
                      })}
                    />
                  }
                  label="Alcohol Consumption"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Exercise Frequency"
                  value={formData.lifestyle.exerciseFrequency}
                  onChange={(e) => setFormData({
                    ...formData, 
                    lifestyle: {...formData.lifestyle, exerciseFrequency: e.target.value}
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Diet"
                  value={formData.lifestyle.diet}
                  onChange={(e) => setFormData({
                    ...formData, 
                    lifestyle: {...formData.lifestyle, diet: e.target.value}
                  })}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Family History */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Family History"
              multiline
              rows={3}
              value={formData.familyHistory}
              onChange={(e) => setFormData({...formData, familyHistory: e.target.value})}
            />
          </Grid>

          {/* Notes and Follow-up */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Additional Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Follow-up Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.followUpDate}
              onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit Medical History
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default CreateMedicalHistory;