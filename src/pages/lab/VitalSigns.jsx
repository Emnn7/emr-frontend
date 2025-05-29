import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { Search, Add, Speed as QuickIcon, List as DetailedIcon } from '@mui/icons-material';
import { fetchPatients } from '../../redux/slices/patientSlice';
import labAPI from '../../api/labAPI';

const quickEntryFields = [
  { name: 'temperature', label: 'Temp (°C)' },
  { name: 'bloodPressure', label: 'BP (mmHg)' },
  { name: 'heartRate', label: 'HR (bpm)' },
  { name: 'oxygenSaturation', label: 'SpO₂ (%)' }
];

const VitalSigns = () => {
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patient);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [formData, setFormData] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    height: '',
    weight: '',
    bmi: '',
    bloodSugar: '',
  });
  const [entryMode, setEntryMode] = useState('quick');

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleOpenForm = (patient) => {
    setCurrentPatient(patient);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setCurrentPatient(null);
    setFormData({
      temperature: '',
      heartRate: '',
      bloodPressure: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      height: '',
      weight: '',
      bmi: '',
      bloodSugar: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Calculate BMI if height or weight changes
    if (name === 'height' || name === 'weight') {
      const height = name === 'height' ? value : formData.height;
      const weight = name === 'weight' ? value : formData.weight;
      if (height && weight) {
        const heightInMeters = height / 100;
        const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
        setFormData((prev) => ({
          ...prev,
          bmi: bmiValue,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await labAPI.recordVitalSigns(currentPatient._id, formData);
      handleCloseForm();
    } catch (err) {
      console.error('Failed to record vital signs:', err);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phoneNumber.includes(searchTerm)
  );

  const VitalSignsForm = ({ open, onClose, onSubmit, patient, formData, handleChange }) => {
    if (!patient) return null;

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Record Vital Signs for {patient.fullName}
        </DialogTitle>
        <form onSubmit={onSubmit}>
          <DialogContent>
            <ToggleButtonGroup
              value={entryMode}
              exclusive
              onChange={(e, newMode) => setEntryMode(newMode)}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="quick">
                <QuickIcon sx={{ mr: 1 }} /> Quick Entry
              </ToggleButton>
              <ToggleButton value="detailed">
                <DetailedIcon sx={{ mr: 1 }} /> Detailed
              </ToggleButton>
            </ToggleButtonGroup>

            {entryMode === 'quick' ? (
              <Grid container spacing={2}>
                {quickEntryFields.map((field) => (
                  <Grid item xs={6} sm={3} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleChange}
                      type="number"
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Temperature (°C)"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Heart Rate (bpm)"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Blood Pressure (mmHg)"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    placeholder="120/80"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Respiratory Rate (breaths/min)"
                    name="respiratoryRate"
                    value={formData.respiratoryRate}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Oxygen Saturation (%)"
                    name="oxygenSaturation"
                    value={formData.oxygenSaturation}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="BMI"
                    name="bmi"
                    value={formData.bmi}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Blood Sugar (mg/dL)"
                    name="bloodSugar"
                    value={formData.bloodSugar}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Vital Signs Recording
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search patients by name or phone"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <Search color="action" />,
            }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Last Recorded</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient._id}>
                <TableCell>{patient.fullName}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                <TableCell>
                  {patient.vitalSigns?.length
                    ? new Date(patient.vitalSigns[0].date).toLocaleString()
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(patient)}>
                    <Add color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <VitalSignsForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        patient={currentPatient}
        formData={formData}
        handleChange={handleChange}
      />
    </Box>
  );
};

export default VitalSigns;