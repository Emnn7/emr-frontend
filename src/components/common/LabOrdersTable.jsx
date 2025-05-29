import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLabOrders } from '../../redux/slices/adminSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from '@mui/material';

const LabOrdersTable = () => {
  const dispatch = useDispatch();
  const { labOrders, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchLabOrders());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <div>Error: {error}</div>;
  if (!labOrders || labOrders.length === 0)
    return <Typography>No lab orders available.</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Tests</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Requested By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {labOrders.map((order) => (
    <TableRow key={order._id}>
      <TableCell>{order._id}</TableCell>
      <TableCell>
        {order.patient ? `${order.patient.firstName} ${order.patient.lastName}` : 'N/A'}
      </TableCell>
      <TableCell>
        {order.tests?.map(test => test.name).join(', ') || 'N/A'}
      </TableCell>
      <TableCell>{order.status || 'pending'}</TableCell>
      <TableCell>
        {order.doctor ? `${order.doctor.firstName} ${order.doctor.lastName}` : 'N/A'}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </Table>
    </TableContainer>
  );
};

export default LabOrdersTable;
