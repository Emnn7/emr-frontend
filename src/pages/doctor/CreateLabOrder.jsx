import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createLabOrder } from '../../redux/slices/labOrderSlice';
import { fetchLabTestCatalog } from '../../redux/slices/labTestCatalogSlice';

const CreateLabOrder = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { tests: catalogTests, loading } = useSelector((state) => state.labTestCatalog);

  const [selectedTests, setSelectedTests] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(fetchLabTestCatalog());
  }, [dispatch]);

  const handleTestToggle = (test) => {
    const exists = selectedTests.find((t) => t.code === test.code);
    if (exists) {
      setSelectedTests(selectedTests.filter((t) => t.code !== test.code));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTests.length === 0) return;

    dispatch(
      createLabOrder({
        patient: patientId,
        doctor: user._id,
        tests: selectedTests,
        notes,
      })
    ).then(() => {
      navigate(`/doctor/patients/${patientId}`);
    });
  };

  // Group catalog tests by category
  const groupTestsByCategory = (tests) => {
    const groups = {};
    tests.forEach((test) => {
      const category = test.category || 'Uncategorized';
      if (!groups[category]) groups[category] = [];
      groups[category].push(test);
    });
    return Object.entries(groups).map(([category, tests]) => ({ category, tests }));
  };

  const testGroups = groupTestsByCategory(catalogTests || []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        New Lab Order
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {testGroups.length === 0 ? (
                <Typography>No lab tests available. Please contact admin.</Typography>
              ) : (
                testGroups.map((group) => (
                  <Accordion key={group.category} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1">{group.category}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={1}>
                        {group.tests.map((test) => (
                          <Grid item xs={12} sm={6} md={4} key={test._id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selectedTests.some((t) => t.code === test.code)}
                                  onChange={() => handleTestToggle(test)}
                                />
                              }
                              label={test.name}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={selectedTests.length === 0}
              >
                Create Lab Order
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Paper>
  );
};

export default CreateLabOrder;
