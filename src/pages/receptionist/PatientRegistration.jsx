import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  Alert
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { addPatient } from '../../redux/slices/patientSlice';
import patientAPI from '../../api/patientAPI';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    country: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    hasInsurance: false,
    insuranceProvider: '',
    insurancePolicyNumber: '',
    bloodGroup: 'unknown'
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    return phone.length >= 10; // Basic validation for phone length
  };

  const validateDateOfBirth = (dob) => {
    if (!dob) return false;
    const dobDate = new Date(dob);
    const today = new Date();
    return dobDate < today;
  };

  const validate = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!validateDateOfBirth(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Date of birth must be in the past';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Emergency contact validation if any field is filled
    const emergencyFieldsFilled = 
      formData.emergencyContactName || 
      formData.emergencyContactPhone || 
      formData.emergencyContactRelationship;
      
    if (emergencyFieldsFilled) {
      if (!formData.emergencyContactName.trim()) {
        newErrors.emergencyContactName = 'Emergency contact name is required';
      }
      if (!formData.emergencyContactPhone) {
        newErrors.emergencyContactPhone = 'Emergency contact phone is required';
      } else if (!validatePhone(formData.emergencyContactPhone)) {
        newErrors.emergencyContactPhone = 'Please enter a valid phone number';
      }
      if (!formData.emergencyContactRelationship.trim()) {
        newErrors.emergencyContactRelationship = 'Relationship is required';
      }
    }
    
    // Insurance validation if hasInsurance is checked
    if (formData.hasInsurance) {
      if (!formData.insuranceProvider.trim()) {
        newErrors.insuranceProvider = 'Insurance provider is required';
      }
      if (!formData.insurancePolicyNumber.trim()) {
        newErrors.insurancePolicyNumber = 'Policy number is required';
      }
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (value) => {
    setFormData({ ...formData, phoneNumber: value });
    if (errors.phoneNumber) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phoneNumber;
        return newErrors;
      });
    }
  };

  const handleEmergencyPhoneChange = (value) => {
    setFormData({ ...formData, emergencyContactPhone: value });
    if (errors.emergencyContactPhone) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.emergencyContactPhone;
        return newErrors;
      });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitError('');
  
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    
    // Scroll to the first error
    const firstErrorField = Object.keys(validationErrors)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return;
  }

    try {
      const patientData = {
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        phone: formData.phoneNumber,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        emergencyContact: (formData.emergencyContactName || formData.emergencyContactPhone || formData.emergencyContactRelationship) ? {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: formData.emergencyContactRelationship
        } : undefined,
        bloodGroup: formData.bloodGroup,
        insurance: formData.hasInsurance ? {
          provider: formData.insuranceProvider,
          policyNumber: formData.insurancePolicyNumber
        } : undefined
      };

       const response = await patientAPI.createPatient(patientData);
    dispatch(addPatient(response));
    navigate('/receptionist/dashboard');
  } catch (err) {
    console.error('Failed to register patient:', err);
    
    // Handle duplicate phone number error specifically
    if (err.response?.data?.message?.includes('phone number already exists')) {
      setErrors({
        ...errors,
        phoneNumber: 'This phone number is already registered. Please use a different number.'
      });
      setSubmitError('A patient with this phone number already exists. Please use a different number or check existing records.');
      
      // Scroll to phone number field
      const phoneInput = document.querySelector('[name="phoneNumber"]');
      if (phoneInput) {
        phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } 
    // Handle other API validation errors
    else if (err.response?.data?.errors) {
      const apiErrors = {};
      err.response.data.errors.forEach(error => {
        const fieldMap = {
          'phone': 'phoneNumber',
          'emergencyContact.phone': 'emergencyContactPhone'
        };
        
        const fieldName = fieldMap[error.path] || error.path;
        apiErrors[fieldName] = error.message;
      });
      setErrors(apiErrors);
      setSubmitError('Please correct the highlighted errors and try again.');
    } 
    // Generic error
    else {
      setSubmitError('Failed to register patient. Please check your information and try again.');
    }
  }
};
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Patient Registration
      </Typography>
      <Paper sx={{ p: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.phoneNumber}>
                <PhoneInput
                  country={'us'}
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  inputProps={{
                    name: 'phoneNumber',
                    required: true,
                  }}
                  containerStyle={{ width: '100%' }}
                  inputStyle={{ 
                    width: '100%', 
                    height: '56px',
                    borderColor: errors.phoneNumber ? '#f44336' : undefined
                  }}
                />
                {errors.phoneNumber && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {errors.phoneNumber}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={!!errors.dateOfBirth}
                helperText={errors.dateOfBirth}
                required
                inputProps={{
                  max: new Date().toISOString().split('T')[0] // Prevent future dates
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Blood Group</InputLabel>
                <Select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  label="Blood Group"
                >
                  <MenuItem value="unknown">Unknown</MenuItem>
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Emergency Contact */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Emergency Contact
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
                error={!!errors.emergencyContactName}
                helperText={errors.emergencyContactName}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.emergencyContactPhone}>
                <PhoneInput
                  country={'us'}
                  value={formData.emergencyContactPhone}
                  onChange={handleEmergencyPhoneChange}
                  inputProps={{
                    name: 'emergencyContactPhone',
                  }}
                  containerStyle={{ width: '100%' }}
                  inputStyle={{ 
                    width: '100%', 
                    height: '56px',
                    borderColor: errors.emergencyContactPhone ? '#f44336' : undefined
                  }}
                />
                {errors.emergencyContactPhone && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {errors.emergencyContactPhone}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Relationship"
                name="emergencyContactRelationship"
                value={formData.emergencyContactRelationship}
                onChange={handleChange}
                error={!!errors.emergencyContactRelationship}
                helperText={errors.emergencyContactRelationship}
              />
            </Grid>
            
            {/* Insurance */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Insurance Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasInsurance}
                    onChange={handleChange}
                    name="hasInsurance"
                  />
                }
                label="Has Insurance"
              />
            </Grid>
            
            {formData.hasInsurance && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Insurance Provider"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleChange}
                    error={!!errors.insuranceProvider}
                    helperText={errors.insuranceProvider}
                    required={formData.hasInsurance}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Policy Number"
                    name="insurancePolicyNumber"
                    value={formData.insurancePolicyNumber}
                    onChange={handleChange}
                    error={!!errors.insurancePolicyNumber}
                    helperText={errors.insurancePolicyNumber}
                    required={formData.hasInsurance}
                  />
                </Grid>
              </>
            )}
            
            {/* Form Actions */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => navigate('/receptionist/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                >
                  Save Patient
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default PatientRegistration;