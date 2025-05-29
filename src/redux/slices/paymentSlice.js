// src/redux/slices/paymentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchUnpaidBills = createAsyncThunk(
  'payment/fetchUnpaidBills',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/billings/status/pending');
      return response.data.data.billings; // Direct array of bills
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchRecentPayments = createAsyncThunk(
  'payment/fetchRecentPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payments/today');
      return response.data.data.payments; // Match backend structure
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchPaymentStats = createAsyncThunk(
  'payment/fetchPaymentStats',
  async (_, { rejectWithValue }) => {
    try {
      // Get unpaid bills count and total
      const unpaidResponse = await api.get('/billings/status/pending');
      const unpaidBills = unpaidResponse.data.data.billings || [];
      
      // Get today's payments
      const todayResponse = await api.get('/payments/today');
      const todayPayments = todayResponse.data.data.payments || [];
      
      return {
        unpaidCount: unpaidBills.length,
        unpaidTotal: unpaidBills.reduce((sum, bill) => sum + bill.total, 0),
        todayCount: todayPayments.length,
        todayTotal: todayPayments.reduce((sum, payment) => sum + payment.amount, 0)
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'payment/updatePaymentStatus',
  async ({ paymentId, status }) => {
    const response = await api.patch(`/payments/${paymentId}/status`, { status });
    return response.data;
  }
);

export const fetchBillingById = createAsyncThunk(
  'payment/fetchBillingById',
  async (billingId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/billings/${billingId}`);
      return response.data.data.billing;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    unpaidBills: [],
    recentPayments: [],
    paymentStats: {
      unpaidCount: 0,
      unpaidTotal: 0,
      todayCount: 0,
      todayTotal: 0
    },
    loading: false,
    error: null
  },
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Unpaid Bills
      .addCase(fetchUnpaidBills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnpaidBills.fulfilled, (state, action) => {
        state.unpaidBills = action.payload; // Directly use the array
        state.loading = false;
      })
      .addCase(fetchUnpaidBills.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Fetch Recent Payments
      .addCase(fetchRecentPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentPayments.fulfilled, (state, action) => {
        state.recentPayments = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecentPayments.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Fetch Payment Stats
      .addCase(fetchPaymentStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.paymentStats = action.payload;
        state.loading = false;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Create Payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.recentPayments.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      
      // Update Payment Status
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const index = state.unpaidBills.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.unpaidBills[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(fetchBillingById.pending, (state) => {
  state.loading = true;
})
.addCase(fetchBillingById.fulfilled, (state, action) => {
  state.billing = action.payload;
  state.loading = false;
})
.addCase(fetchBillingById.rejected, (state, action) => {
  state.error = action.payload;
  state.loading = false;
})
  }
});

export const { clearPaymentError } = paymentSlice.actions;
export default paymentSlice.reducer;