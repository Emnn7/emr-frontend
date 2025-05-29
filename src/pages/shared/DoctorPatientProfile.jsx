import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Typography, Tabs, Tab, Paper, Grid, Avatar, Chip, Button, Alert
} from '@mui/material';
import {
  Person as PersonIcon,
   CalendarToday as CalendarIcon,
  LocalHospital as MedicalIcon,
  Science as LabIcon,
  Receipt as PrescriptionIcon,
  Add as AddIcon
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import { fetchPatientById } from '../../redux/slices/patientSlice';
import { fetchPatientAppointments } from '../../redux/slices/appointmentSlice';
import { fetchPatientPrescriptions } from '../../redux/slices/prescriptionSlice';
import { fetchPatientLabReports } from '../../redux/slices/labReportSlice';
import { fetchPatientMedicalHistory } from '../../redux/slices/medicalHistorySlice';
import { getConsultationsByPatient  } from '../../redux/slices/consultationSlice';


const DoctorPatientProfile = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);

  const { currentPatient, loading: patientLoading } = useSelector((state) => state.patient);
  const { appointments, loading: appointmentsLoading } = useSelector((state) => state.appointment);
  const { prescriptions, loading: prescriptionsLoading } = useSelector((state) => state.prescription);
  const { labReports, loading: labReportsLoading } = useSelector((state) => state.labReport);
  const { consultationsByPatient, loading: consultationsLoading } = useSelector(
  (state) => state.consultation
);
  const { data: medicalHistory, loading: medicalHistoryLoading } = useSelector((state) => state.medicalHistory);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
const consultations = consultationsByPatient[patientId] || [];
useEffect(() => {
  if (currentPatient && medicalHistory) {
    const safeMedicalHistory = Array.isArray(medicalHistory) ? medicalHistory : [];
    setIsFirstVisit(safeMedicalHistory.length === 0);
  }
}, [currentPatient, medicalHistory]);
  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientById(patientId));
      dispatch(fetchPatientAppointments(patientId));
      dispatch(fetchPatientPrescriptions(patientId));
      dispatch(fetchPatientLabReports(patientId));
      dispatch(fetchPatientMedicalHistory(patientId)); 
      dispatch(getConsultationsByPatient(patientId));
    }
  }, [dispatch, patientId]);
  
console.log('Patient ID from URL:', patientId);

console.log('Current Patient:', currentPatient); 
  console.log('Medical History in Patient Profile:', medicalHistory);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddConsultation = () => {
    navigate(`/consultations/new?patientId=${patientId}`);
  };

  const handleAddPrescription = () => {
    navigate(`/prescriptions/new/${patientId}`);
  };

  const handleOrderLabTest = () => {
    navigate(`/lab-orders/new/${patientId}`);
  };

 const handleAddMedicalHistory = () => {
    navigate(`/medical-history/new/${patientId}`);
  };

  if (patientLoading) return <div>Loading...</div>;
  if (!currentPatient) return <div>Patient not found</div>;
console.log("Consultations in tab:", consultations);
 console.log('Prescriptions in tab:', prescriptions); 
  return (
    <Box>
{/* Doctor Actions Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Doctor Actions</Typography>
        <Grid container spacing={2}>
        {isFirstVisit ? (
  <Button
    variant="contained"
    fullWidth
    startIcon={<AddIcon />}
    onClick={handleAddMedicalHistory}
  >
    Add Medical History
  </Button>
) : (
  <Button
    variant="contained"
    fullWidth
    startIcon={<AddIcon />}
    onClick={handleAddMedicalHistory}
  >
    Update Medical History
  </Button>
)}
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAddConsultation}
            >
              Add Consultation
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleAddPrescription}
            >
              Add Prescription
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddIcon />}
              onClick={handleOrderLabTest}
            >
              Order Lab Test
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Overview" icon={<PersonIcon />} />
          <Tab label="Appointments" icon={<CalendarIcon />}  />
          <Tab label="Medical History" icon={<MedicalIcon />} />
          <Tab label="Lab Results" icon={<LabIcon />} />
          <Tab label="Prescriptions" icon={<PrescriptionIcon />} />
           <Tab label="Consultations" icon={<MedicalIcon />} />
        </Tabs>
      </Paper>
      

      {tabValue === 0 && (
        <PatientOverviewTab
          patient={currentPatient}
          appointments={appointments}
          loading={appointmentsLoading}
        />
      )}
      {tabValue === 1 && <AppointmentsTab appointments={appointments} loading={appointmentsLoading} patient={currentPatient} />}
     {tabValue === 2 && (
  <MedicalHistoryTab 
    medicalHistory={medicalHistory || []} 
    loading={medicalHistoryLoading} 
    isFirstVisit={isFirstVisit}
  />
)}
      {tabValue === 3 && <LabResultsTab labReports={labReports} loading={labReportsLoading} />}
      {tabValue === 4 && <PrescriptionsTab prescriptions={prescriptions} loading={prescriptionsLoading} />}
      
      {tabValue === 5 && (
  <ConsultationsTab consultations={consultations} loading={consultationsLoading} />
)}

      
    </Box>
  );
};
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

// Tab Components
const PatientOverviewTab = ({ patient, appointments, loading }) => (
  <Grid container spacing={3}>
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        
        <Typography variant="h6" gutterBottom>Patient Overview</Typography>
        <Typography><strong>Name:</strong> {patient?.firstName} {patient?.lastName}</Typography>
        <Typography><strong>Age:</strong> {calculateAge(patient?.dateOfBirth)}</Typography>
        <Typography><strong>Gender:</strong> {patient?.gender || 'N/A'}</Typography>
      </Paper>
    </Grid>
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Recent Appointments</Typography>
        {loading ? (
          <Typography>Loading appointments...</Typography>
        ) : appointments?.length === 0 ? (
          <Typography>No appointments found</Typography>
        ) : (
          appointments.filter(appt => appt.patient?._id === patient._id).slice(0, 3).map((appointment) => (
            <Box key={appointment._id} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
             <Typography>
  <strong>{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'Date not available'}</strong>
</Typography>

<Typography>
  Doctor: {appointment.doctor ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 'N/A'}
</Typography>


              <Typography>Reason: {appointment.reason || 'N/A'}</Typography>
              <Chip
                label={appointment.status || 'unknown'}
                size="small"
                sx={{ mt: 1 }}
                color={
                  appointment.status === 'Completed' ? 'success' :
                    appointment.status === 'Cancelled' ? 'error' : 'primary'
                }
              />
            </Box>
          ))
        )}
      </Paper>
    </Grid>
  </Grid>
);

const AppointmentsTab = ({ appointments, loading, patient }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Appointments</Typography>
    {loading ? (
      <Typography>Loading appointments...</Typography>
    ) : appointments.length === 0 ? (
      <Typography>No appointments found</Typography>
    ) : (
      appointments.filter(appt => appt.patient?._id === patient._id).map((appointment) => (
        <Box key={appointment._id} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
          <Typography>
  <strong>{appointment.date ? new Date(appointment.date).toLocaleDateString() : 'Date not available'}</strong>
</Typography>

          <Typography>
  Doctor: {appointment.doctor ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 'N/A'}
</Typography>

          <Typography>Reason: {appointment.reason}</Typography>
          <Chip
            label={appointment.status}
            size="small"
            sx={{ mt: 1 }}
            color={appointment.status === 'Completed' ? 'success' : appointment.status === 'Cancelled' ? 'error' : 'primary'}
          />
        </Box>
      ))
    )}
  </Paper>
);

const MedicalHistoryTab = ({ medicalHistory = [], loading, isFirstVisit }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Medical History</Typography>
      {loading ? (
        <CircularProgress size={24} />
      ) : medicalHistory.length > 0 ? (
        <Accordion defaultExpanded>
          {medicalHistory.map((history, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Medical History Record #{index + 1}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography><strong>Past Illnesses:</strong> {history.pastIllnesses || 'N/A'}</Typography>
                <Typography><strong>Surgical History:</strong> {history.surgicalHistory || 'N/A'}</Typography>
                <Typography><strong>Family History:</strong> {history.familyHistory || 'N/A'}</Typography>
                
                <Typography sx={{ mt: 1 }}><strong>Allergies:</strong></Typography>
                {history.allergies?.length > 0 ? (
                  history.allergies.map((a, i) => (
                    <Typography key={i}>• {a.name} - {a.reaction} ({a.severity})</Typography>
                  ))
                ) : (
                  <Typography>No recorded allergies</Typography>
                )}

                <Typography sx={{ mt: 2 }}><strong>Current Medications:</strong></Typography>
                {history.currentMedications?.length > 0 ? (
                  history.currentMedications.map((med, i) => (
                    <Box key={i} sx={{ ml: 2, mb: 1 }}>
                      <Typography>• <strong>{med.name}</strong> - {med.dosage} ({med.frequency})</Typography>
                      {med.startDate && (
                        <Typography variant="body2">Started: {new Date(med.startDate).toLocaleDateString()}</Typography>
                      )}
                      {med.prescribedBy && (
                        <Typography variant="body2">Prescribed by: {med.prescribedBy}</Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography>No current medications</Typography>
                )}

                <Typography sx={{ mt: 2 }}><strong>Lifestyle:</strong></Typography>
                {history.lifestyle && (
                  <Box sx={{ ml: 2 }}>
                    <Typography>• Smoking: {history.lifestyle.smoking ? 'Yes' : 'No'}</Typography>
                    <Typography>• Alcohol: {history.lifestyle.alcohol ? 'Yes' : 'No'}</Typography>
                    {history.lifestyle.exerciseFrequency && (
                      <Typography>• Exercise: {history.lifestyle.exerciseFrequency}</Typography>
                    )}
                    {history.lifestyle.diet && (
                      <Typography>• Diet: {history.lifestyle.diet}</Typography>
                    )}
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Accordion>
      ) : (
        <Typography>No medical history available</Typography>
      )}
    </Paper>
  );
};

const LabResultsTab = ({ labReports, loading }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Lab Results</Typography>
    {loading ? (
      <Typography>Loading...</Typography>
       ) : !Array.isArray(labReports) || labReports.length === 0 ? (
      <Typography>No lab results found</Typography>
    ) : (
      labReports.map((report) => (
        <Box key={report._id} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
          <Typography><strong>{report.testName}</strong></Typography>
          <Typography>Result: {report.result}</Typography>
          <Typography variant="body2" color="text.secondary">Tested on: {new Date(report.dateTested).toLocaleDateString()}</Typography>
        </Box>
      ))
    )}
  </Paper>
);

const statusColors = {
  active: 'primary',
  completed: 'success',
  cancelled: 'error'
};

const PrescriptionsTab = ({ prescriptions, loading }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Prescriptions</Typography>
    {loading ? (
      <Typography>Loading...</Typography>
    ) : !Array.isArray(prescriptions) || prescriptions.length === 0 ? (
      <Typography>No prescriptions found</Typography>
    ) : (
      prescriptions.map((prescription) => (
        <Box key={prescription._id} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
          <Typography><strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</Typography>
          <Typography><strong>Doctor:</strong> Dr. {prescription.doctor?.lastName}</Typography>
          <Typography><strong>Diagnosis:</strong> {prescription.diagnosis || 'Not specified'}</Typography>
          <Typography><strong>Medications:</strong></Typography>
          <ul>
            {prescription.medications.map((med, index) => (
              <li key={index}>
                {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
                {med.instructions && ` - ${med.instructions}`}
              </li>
            ))}
          </ul>
          <Typography><strong>Status:</strong> 
            <Chip 
              label={prescription.status} 
              size="small" 
              color={statusColors[prescription.status] || 'default'}
              sx={{ ml: 1 }}
            />
          </Typography>
        </Box>
      ))
    )}
  </Paper>
);
const ConsultationsTab = ({ consultations, loading }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Consultations</Typography>
    {loading ? (
      <Typography>Loading consultations...</Typography>
    ) : !Array.isArray(consultations) || consultations.length === 0 ? (
      <Typography>No consultations found</Typography>
    ) : (
      consultations.map((consultation) => (
        <Box key={consultation._id} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
          <Typography><strong>Date:</strong> {new Date(consultation.createdAt).toLocaleDateString()}</Typography>
          <Typography><strong>Doctor:</strong> {consultation.doctor?.firstName} {consultation.doctor?.lastName}</Typography>
          <Typography><strong>Diagnosis:</strong> {consultation.diagnosis || 'N/A'}</Typography>
          <Typography><strong>Notes:</strong> {consultation.notes}</Typography>
          {consultation.symptoms?.length > 0 && (
            <Box>
              <Typography><strong>Symptoms:</strong></Typography>
              <ul>
                {consultation.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      ))
    )}
  </Paper>
);


export default DoctorPatientProfile;