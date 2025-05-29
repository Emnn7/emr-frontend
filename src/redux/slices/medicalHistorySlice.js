// src/redux/slices/medicalHistorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async action to create medical history
export const createMedicalHistory = createAsyncThunk(
  'medicalHistory/createMedicalHistory',
  async ({ patientId, doctorId, historyData }, { rejectWithValue }) => {
    try {
      // Structure the data to match your backend expectations
      const payload = {
        patient: patientId,
        doctor: doctorId,
        ...historyData,
        // Ensure arrays are properly formatted
        allergies: historyData.allergies || [],
        currentMedications: historyData.currentMedications || [],
      };

      const response = await api.post('/medicalHistory', payload);
      return response.data;
    } catch (err) {
      // Enhanced error handling
      console.error('Error creating medical history:', err.response?.data || err.message);
      return rejectWithValue({
        message: err.response?.data?.message || 'Failed to create medical history',
        details: err.response?.data?.errors || null,
        status: err.response?.status || 500
      });
    }
  }
);

// Async action to fetch medical history by patient
export const fetchPatientMedicalHistory = createAsyncThunk(
  'medicalHistory/fetchPatientMedicalHistory',
  async (params, { rejectWithValue }) => {
    try {
      let url;
      if (typeof params === 'string') {
        // Patient ID only
        url = `/medicalHistory/patient/${params}`;
      } else {
        // Object with doctorId or patientId
        url = params.doctorId 
          ? `/medicalHistory/doctor/${params.doctorId}`
          : `/medicalHistory/patient/${params.patientId}`;
      }
      const response = await api.get(url);
      console.log('API Response:', response.data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
  createStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const medicalHistorySlice = createSlice({
  name: 'medicalHistory',
  initialState,
  reducers: {
    resetMedicalHistoryState: (state) => {
      state.loading = false;
      state.error = null;
      state.createStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Medical History Cases
      .addCase(createMedicalHistory.pending, (state) => {
        state.loading = true;
        state.createStatus = 'loading';
        state.error = null;
      })
      .addCase(createMedicalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.createStatus = 'succeeded';
        state.data = action.payload.data;
      })
      .addCase(createMedicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.createStatus = 'failed';
        state.error = action.payload;
      })
      
      // Fetch Medical History Cases
      .addCase(fetchPatientMedicalHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientMedicalHistory.fulfilled, (state, action) => {
  state.loading = false;
  // Handle direct array response or nested data property
  state.data = Array.isArray(action.payload) 
    ? action.payload 
    : action.payload.data || action.payload.medicalHistory || [];
})
      .addCase(fetchPatientMedicalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMedicalHistoryState } = medicalHistorySlice.actions;
export default medicalHistorySlice.reducer;