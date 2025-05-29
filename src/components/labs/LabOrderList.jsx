import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  Button,
  Chip,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

const LabOrderList = ({ labOrders, showPatient = true, showActions = true }) => {
  const navigate = useNavigate();

  if (!labOrders || labOrders.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No lab orders found
        </Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'pending':
        return <PendingIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {showPatient && <TableCell>Patient</TableCell>}
            <TableCell>Order ID</TableCell>
            <TableCell>Order Date</TableCell>
            <TableCell>Test Type</TableCell>
            <TableCell>Status</TableCell>
            {showActions && <TableCell align="center">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {labOrders.map((order) => (
            <TableRow 
              key={order._id}
              hover
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              {showPatient && (
                <TableCell>
                  {order.patient?.firstName} {order.patient?.lastName}
                  {order.patient?.patientId && (
                    <Typography variant="caption" display="block" color="text.secondary">
                      ID: {order.patient.patientId}
                    </Typography>
                  )}
                </TableCell>
              )}
              <TableCell>
                <Typography variant="body2" fontFamily="monospace">
                  {order._id.substring(0, 8).toUpperCase()}
                </Typography>
              </TableCell>
              <TableCell>
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {order.tests?.map((test, index) => (
                    <Chip 
                      key={index}
                      label={test.name}
                      size="small"
                      variant="outlined"
                    />
                  )) || 'N/A'}
                </Box>
              </TableCell>
              <TableCell>
                <Chip
                  label={order.status || 'N/A'}
                  color={getStatusColor(order.status)}
                  icon={getStatusIcon(order.status)}
                  size="small"
                  sx={{ textTransform: 'capitalize' }}
                />
              </TableCell>
              {showActions && (
                <TableCell align="right">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/lab/reports/create/${order._id}`);
                      }}
                      disabled={order.status === 'completed'}
                      sx={{ minWidth: 140 }}
                    >
                      {order.status === 'completed' ? 'Reported' : 'Enter Results'}
                    </Button>
                    {order.status === 'completed' && (
                      <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        startIcon={<VisibilityIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/lab/reports/${order._id}`);
                        }}
                        sx={{ minWidth: 120 }}
                      >
                        View Report
                      </Button>
                    )}
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LabOrderList;