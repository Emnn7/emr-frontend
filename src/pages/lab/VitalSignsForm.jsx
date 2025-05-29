import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  FormControlLabel, 
  Checkbox,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { recordVitalSigns } from '../../redux/slices/vitalSignsSlice';
import patientAPI from '../../api/patientAPI';
import { calculateAge } from '../../utils/dateUtils';

const VitalSignsForm = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: { systolic: '', diastolic: '' },
    respiratoryRate: '',
    oxygenSaturation: '',
    height: '',
    weight: '',
    bloodSugar: '',
    fasting: false,
    notes: ''
  });

  const [bmi, setBmi] = useState(null);
  const [bmiClassification, setBmiClassification] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setIsLoading(true);
         const data = await patientAPI.getPatientForVitals(patientId);
    setPatient(data);
      } catch (err) {
        setError(err.message || 'Failed to load patient data');
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);

  useEffect(() => {
    // Calculate BMI when height or weight changes
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const calculatedBmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBmi);

      // Classify BMI
      if (calculatedBmi < 18.5) {
        setBmiClassification('Underweight');
      } else if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        setBmiClassification('Normal weight');
      } else if (calculatedBmi >= 25 && calculatedBmi < 30) {
        setBmiClassification('Overweight');
      } else if (calculatedBmi >= 30 && calculatedBmi < 35) {
        setBmiClassification('Obese Class I');
      } else if (calculatedBmi >= 35 && calculatedBmi < 40) {
        setBmiClassification('Obese Class II');
      } else {
        setBmiClassification('Obese Class III');
      }
    } else {
      setBmi(null);
      setBmiClassification('');
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'systolic' || name === 'diastolic') {
      setFormData({
        ...formData,
        bloodPressure: {
          ...formData.bloodPressure,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  if (!patientId) {
    setError('No patient selected');
    return;
  }

  const vitalSignsData = {
    patient: patientId,
      temperature: formData.temperature ? { value: parseFloat(formData.temperature) } : undefined,
      heartRate: formData.heartRate ? { value: parseInt(formData.heartRate) } : undefined,
      bloodPressure: formData.bloodPressure.systolic && formData.bloodPressure.diastolic ? {
        systolic: parseInt(formData.bloodPressure.systolic),
        diastolic: parseInt(formData.bloodPressure.diastolic)
      } : undefined,
      respiratoryRate: formData.respiratoryRate ? { value: parseInt(formData.respiratoryRate) } : undefined,
      oxygenSaturation: formData.oxygenSaturation ? { value: parseInt(formData.oxygenSaturation) } : undefined,
      height: formData.height ? { value: parseInt(formData.height) } : undefined,
      weight: formData.weight ? { value: parseInt(formData.weight) } : undefined,
      bmi: bmi ? { 
        value: parseFloat(bmi),
        classification: bmiClassification 
      } : undefined,
      bloodSugar: formData.bloodSugar ? {
        value: parseInt(formData.bloodSugar),
        fasting: formData.fasting
      } : undefined,
      notes: formData.notes
    };

    dispatch(recordVitalSigns({ patientId, vitalData: vitalSignsData })) // Pass both params
    .then(() => {
      navigate(`/lab/dashboard`);
    })
   .catch((err) => {
  if (err.response?.status === 403) {
    setError('You do not have permission to record vital signs. Please contact your administrator.');
  } else {
    setError(err.message || 'Failed to save vital signs');
  }
});
};

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!patient) {
    return (
      <Alert severity="warning" sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
        No patient selected. Please select a patient first.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, mx: 'auto', my: 3 }}>
      <Typography variant="h5" gutterBottom>
        Record Vital Signs
      </Typography>
      
      {/* Patient Information Section */}
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        backgroundColor: 'grey.100', 
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="subtitle1" component="div">
            <strong>{patient.firstName} {patient.lastName}</strong>
          </Typography>
          <Typography variant="body2" component="div">
            ID: {patient.patientId} | {calculateAge(patient.dateOfBirth)} years | {patient.gender}
          </Typography>
          {patient.phone && (
            <Typography variant="body2" component="div">
              Phone: {patient.phone}
            </Typography>
          )}
        </Box>
        <Chip 
          label="Vital Signs" 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Vital Signs Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Row 1 - Basic Vitals */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Temperature (°C)"
              name="temperature"
              type="number"
              value={formData.temperature}
              onChange={handleChange}
              inputProps={{ step: "0.1", min: 30, max: 45 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Heart Rate (bpm)"
              name="heartRate"
              type="number"
              value={formData.heartRate}
              onChange={handleChange}
              inputProps={{ min: 30, max: 200 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Respiratory Rate (breaths/min)"
              name="respiratoryRate"
              type="number"
              value={formData.respiratoryRate}
              onChange={handleChange}
              inputProps={{ min: 10, max: 40 }}
            />
          </Grid>

          {/* Row 2 - Blood Pressure */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Systolic BP (mmHg)"
              name="systolic"
              type="number"
              value={formData.bloodPressure.systolic}
              onChange={handleChange}
              inputProps={{ min: 70, max: 200 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Diastolic BP (mmHg)"
              name="diastolic"
              type="number"
              value={formData.bloodPressure.diastolic}
              onChange={handleChange}
              inputProps={{ min: 40, max: 120 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Oxygen Saturation (%)"
              name="oxygenSaturation"
              type="number"
              value={formData.oxygenSaturation}
              onChange={handleChange}
              inputProps={{ min: 70, max: 100 }}
            />
          </Grid>

          {/* Row 3 - Height, Weight, BMI */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Height (cm)"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              inputProps={{ min: 50, max: 250 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Weight (kg)"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              inputProps={{ min: 2, max: 200 }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              p: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1
            }}>
              <Typography variant="body2" color="text.secondary">
                BMI: {bmi || '--'}
              </Typography>
              {bmiClassification && (
                <Typography variant="body2" color="primary">
                  {bmiClassification}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Row 4 - Blood Sugar */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Blood Sugar (mg/dL)"
              name="bloodSugar"
              type="number"
              value={formData.bloodSugar}
              onChange={handleChange}
              inputProps={{ min: 50, max: 500 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="fasting"
                  checked={formData.fasting}
                  onChange={handleCheckboxChange}
                  color="primary"
                />
              }
              label="Fasting"
            />
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clinical Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Enter any additional observations or concerns..."
            />
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(-1)}
                sx={{ minWidth: 120 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                sx={{ minWidth: 120 }}
              >
                Save Vitals
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default VitalSignsForm;