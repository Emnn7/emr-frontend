import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography
} from '@mui/material';

const MedicalHistoryForm = ({ initialValues, onSubmit }) => {
  const validationSchema = Yup.object().shape({
    symptomAssessment: Yup.string().required('Symptom assessment is required'),
    clinicalInterview: Yup.string().required('Clinical interview is required'),
    doctorNotes: Yup.string().required('Doctor notes are required'),
    pastMedicalHistory: Yup.string(),
    familyHistory: Yup.string(),
    allergies: Yup.string(),
    currentMedications: Yup.string(),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      symptomAssessment: '',
      clinicalInterview: '',
      doctorNotes: '',
      pastMedicalHistory: '',
      familyHistory: '',
      allergies: '',
      currentMedications: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Medical History
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Symptom Assessment"
              name="symptomAssessment"
              value={formik.values.symptomAssessment}
              onChange={formik.handleChange}
              error={formik.touched.symptomAssessment && Boolean(formik.errors.symptomAssessment)}
              helperText={formik.touched.symptomAssessment && formik.errors.symptomAssessment}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Clinical Interview"
              name="clinicalInterview"
              value={formik.values.clinicalInterview}
              onChange={formik.handleChange}
              error={formik.touched.clinicalInterview && Boolean(formik.errors.clinicalInterview)}
              helperText={formik.touched.clinicalInterview && formik.errors.clinicalInterview}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Doctor Notes"
              name="doctorNotes"
              value={formik.values.doctorNotes}
              onChange={formik.handleChange}
              error={formik.touched.doctorNotes && Boolean(formik.errors.doctorNotes)}
              helperText={formik.touched.doctorNotes && formik.errors.doctorNotes}
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Past Medical History"
              name="pastMedicalHistory"
              value={formik.values.pastMedicalHistory}
              onChange={formik.handleChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Family History"
              name="familyHistory"
              value={formik.values.familyHistory}
              onChange={formik.handleChange}
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Allergies"
              name="allergies"
              value={formik.values.allergies}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Current Medications"
              name="currentMedications"
              value={formik.values.currentMedications}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Save Medical History
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default MedicalHistoryForm;