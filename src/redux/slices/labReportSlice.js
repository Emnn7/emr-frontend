import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchLabReports = createAsyncThunk(
  'labReports/fetchAll',
  async () => {
    const response = await api.get('/lab-reports');
    return response.data;
  }
);

export const fetchPatientLabReports = createAsyncThunk(
    'labReports/fetchByPatient',
    async (patientId, { rejectWithValue }) => {
      try {
        const response = await api.get(`/lab-reports/patient/${patientId}`);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  export const createLabReport = createAsyncThunk(
    'labReports/createLabReport',
    async (reportData, { rejectWithValue }) => {
      try {
        const response = await api.post('/lab-reports', reportData);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );

  export const generateLabReportPDF = createAsyncThunk(
    'labReports/generatePDF',
    async (reportId, { rejectWithValue }) => {
      try {
        const response = await api.get(`/lab-reports/${reportId}/pdf`);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  export const verifyLabReport = createAsyncThunk(
    'labReports/verify',
    async ({ id, notes }, { rejectWithValue }) => {
      try {
        const response = await api.patch(`/lab-reports/${id}/verify`, { notes });
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
      }
    }
  );
  

const labReportSlice = createSlice({
  name: 'labReports',
  initialState: {
    reports: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
  .addCase(fetchPatientLabReports.pending, (state) => {
    state.status = 'loading';
  })
  .addCase(fetchPatientLabReports.fulfilled, (state, action) => {
    state.status = 'succeeded';
    state.reports = action.payload;
  })
  .addCase(fetchPatientLabReports.rejected, (state, action) => {
    state.status = 'failed';
    state.error = action.payload;
  })

      .addCase(fetchLabReports.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLabReports.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reports = action.payload;
      })
      .addCase(fetchLabReports.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createLabReport.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createLabReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reports.push(action.payload);
      })
      .addCase(createLabReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default labReportSlice.reducer;