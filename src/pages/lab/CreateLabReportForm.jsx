import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createLabReport } from '../../redux/slices/labReportSlice';

const CreateLabReportForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { labOrder, loading: orderLoading } = useSelector((state) => state.labOrder);
  const { loading, error } = useSelector((state) => state.labReport);

  const [formData, setFormData] = useState({
    findings: '',
    notes: '',
    tests: []
  });

  useEffect(() => {
    if (labOrder && labOrder.tests) {
      // Initialize test results
      const initialTests = labOrder.tests.map(test => ({
        testId: test._id,
        name: test.name,
        result: '',
        unit: test.unit || '',
        normalRange: test.normalRange || '',
        abnormalFlag: 'normal'
      }));
      
      setFormData(prev => ({
        ...prev,
        tests: initialTests
      }));
    }
  }, [labOrder]);

  const handleTestChange = (index, field, value) => {
    const updatedTests = [...formData.tests];
    updatedTests[index][field] = value;
    setFormData({ ...formData, tests: updatedTests });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const reportData = {
      order: orderId,
      patient: labOrder.patient._id,
      tests: formData.tests,
      findings: formData.findings,
      notes: formData.notes,
      status: 'completed'
    };

    dispatch(createLabReport(reportData))
      .then((action) => {
        if (action.payload) {
          navigate(`/lab/reports/${action.payload._id}`);
        }
      });
  };

  if (orderLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!labOrder) {
    return (
      <Alert severity="error" sx={{ maxWidth: 800, mx: 'auto', mt: 3 }}>
        No lab order found
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Lab Report for Order #{orderId?.substring(0, 8)}
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Patient Information</Typography>
        <Typography>
          {labOrder.patient?.firstName} {labOrder.patient?.lastName}
        </Typography>
        <Typography>Order Date: {new Date(labOrder.createdAt).toLocaleDateString()}</Typography>
      </Paper>

      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Test Results</Typography>
          
          {formData.tests.map((test, index) => (
            <Box key={test.testId} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {test.name}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Result"
                    value={test.result}
                    onChange={(e) => handleTestChange(index, 'result', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Unit"
                    value={test.unit}
                    onChange={(e) => handleTestChange(index, 'unit', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Flag</InputLabel>
                    <Select
                      value={test.abnormalFlag}
                      label="Flag"
                      onChange={(e) => handleTestChange(index, 'abnormalFlag', e.target.value)}
                    >
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="critical">Critical</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              {test.normalRange && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Normal Range: {test.normalRange}
                </Typography>
              )}
            </Box>
          ))}
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Additional Information</Typography>
          
          <TextField
            fullWidth
            label="Findings"
            multiline
            rows={4}
            value={formData.findings}
            onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Report'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}
      </form>
    </Box>
  );
};

export default CreateLabReportForm;