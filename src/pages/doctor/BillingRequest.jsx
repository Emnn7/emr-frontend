import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {Typography, TextField, Button, Grid, Paper, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { createBilling } from '../../redux/slices/billingSlice';

const BillingRequest = () => {
  const { patientId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    items: [{
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }],
    notes: '',
    status: 'pending'
  });

  const serviceOptions = [
    { description: 'Consultation', unitPrice: 100 },
    { description: 'Follow-up Visit', unitPrice: 75 },
    { description: 'Basic Metabolic Panel', unitPrice: 50 },
    { description: 'Complete Blood Count', unitPrice: 60 },
    { description: 'Urinalysis', unitPrice: 40 },
    { description: 'Prescription', unitPrice: 0 } // Will be calculated based on meds
  ];

  const handleServiceChange = (index, value) => {
    const selectedService = serviceOptions.find(s => s.description === value);
    const items = [...formData.items];
    
    if (selectedService) {
      items[index] = {
        ...items[index],
        description: selectedService.description,
        unitPrice: selectedService.unitPrice,
        total: selectedService.unitPrice * items[index].quantity
      };
    } else {
      items[index] = {
        ...items[index],
        description: value,
        total: items[index].unitPrice * items[index].quantity
      };
    }

    setFormData({ ...formData, items });
  };

  const handleQuantityChange = (index, value) => {
    const quantity = parseInt(value) || 0;
    const items = [...formData.items];
    items[index] = {
      ...items[index],
      quantity,
      total: items[index].unitPrice * quantity
    };
    setFormData({ ...formData, items });
  };

  const handlePriceChange = (index, value) => {
    const unitPrice = parseFloat(value) || 0;
    const items = [...formData.items];
    items[index] = {
      ...items[index],
      unitPrice,
      total: unitPrice * items[index].quantity
    };
    setFormData({ ...formData, items });
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0
        }
      ]
    });
  };

  const handleRemoveItem = (index) => {
    const items = [...formData.items];
    items.splice(index, 1);
    setFormData({ ...formData, items });
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subtotal = calculateTotal();
    
    dispatch(createBilling({
      patient: patientId,
      createdBy: user._id,
      createdByModel: user.role === 'doctor' ? 'Doctor' : 'Admin',
      items: formData.items,
      subtotal,
      total: subtotal,
      notes: formData.notes,
      status: formData.status
    })).then(() => {
      navigate(`/patients/${patientId}`);
    });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        New Billing Request
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {formData.items.map((item, index) => (
            <React.Fragment key={index}>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel>Service/Item</InputLabel>
                  <Select
                    value={item.description}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                    label="Service/Item"
                  >
                    {serviceOptions.map((service) => (
                      <MenuItem key={service.description} value={service.description}>
                        {service.description} (${service.unitPrice})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Unit Price"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Total"
                  value={`$${item.total.toFixed(2)}`}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                {index > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </Button>
                )}
              </Grid>
            </React.Fragment>
          ))}

          <Grid item xs={12}>
            <Button
              variant="outlined"
              onClick={handleAddItem}
            >
              Add Item
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">
              Total: ${calculateTotal().toFixed(2)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Submit Billing Request
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BillingRequest;