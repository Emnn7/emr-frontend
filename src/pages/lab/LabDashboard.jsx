import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Grid, 
  Typography, 
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  Science as ScienceIcon,
  LocalHospital as HospitalIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Today as TodayIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import StatCard from '../../components/common/StatCard';
import { fetchLabOrders, fetchLabReports } from '../../redux/slices/labOrderSlice';
import { fetchVitalSigns } from '../../redux/slices/vitalSignsSlice';
import AbnormalResultsAlert from '../../components/labs/AbnormalResultsAlert';
import LabOrdersList from '../../components/labs/LabOrderList';
import NotificationBell from '../../components/NotificationBell';

const LabDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { labOrders, loading: ordersLoading } = useSelector((state) => state.labOrder);
  const { reports, loading: reportsLoading } = useSelector((state) => state.labReport);
  const { vitalSigns = [], loading: vitalsLoading } = useSelector((state) => state.vitalSigns);

  const loading = ordersLoading || reportsLoading || vitalsLoading;


  useEffect(() => {
    dispatch(fetchLabOrders({ status: 'pending' }));
    dispatch(fetchLabReports({ status: 'completed', limit: 5 }));
 dispatch(fetchVitalSigns());
  }, [dispatch]);

  // Calculate statistics
  const pendingOrders = labOrders?.filter(order => order.status === 'pending');
  const inProgressOrders = labOrders?.filter((order) => order.status === 'In Progress') || [];
 const completedToday = Array.isArray(reports)
  ? reports.filter(report => 
      new Date(report.createdAt).toDateString() === new Date().toDateString()
    ).length
  : 0;
const abnormalResults = Array.isArray(reports)
  ? reports.filter(report => report.abnormalFlag && report.abnormalFlag !== 'normal')
  : [];

const vitalsRecordedToday = Array.isArray(vitalSigns)
  ? vitalSigns.filter(vital => 
      new Date(vital.createdAt).toDateString() === new Date().toDateString()
    ).length
  : 0;


  // Chart data
  const weeklyTestData = [
    { name: 'Mon', tests: 12, abnormal: 2 },
    { name: 'Tue', tests: 19, abnormal: 3 },
    { name: 'Wed', tests: 15, abnormal: 1 },
    { name: 'Thu', tests: 8, abnormal: 0 },
    { name: 'Fri', tests: 11, abnormal: 2 },
    { name: 'Sat', tests: 3, abnormal: 0 }
  ];

  const vitalTrendsData = [
    { name: 'Jan', temp: 36.5, hr: 72, bp: '120/80' },
    { name: 'Feb', temp: 36.6, hr: 75, bp: '118/78' },
    { name: 'Mar', temp: 36.7, hr: 70, bp: '122/82' },
    { name: 'Apr', temp: 36.4, hr: 68, bp: '119/79' },
    { name: 'May', temp: 36.8, hr: 74, bp: '121/80' },
  ];
  
// Add these near the top of your component
console.log('Lab Orders:', labOrders);
console.log('Pending Orders:', pendingOrders);
console.log('Vital Signs:', vitalSigns);
console.log('Loading states:', { ordersLoading, reportsLoading, vitalsLoading });
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4">Lab Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <NotificationBell />
      <Button 
  variant="contained" 
  startIcon={<AddIcon />}
  onClick={() => navigate('/lab/vital-signs/new')} 
>
  New Recording
</Button>
        </Box>
      </Box>

      <AbnormalResultsAlert results={abnormalResults.slice(0, 3)} />

      <Grid container spacing={3}>
        {/* Stat Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PeopleIcon}
            title="Patients Today"
            value={labOrders.length}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ScienceIcon}
            title="Tests Today"
            value={labOrders.reduce((acc, order) => acc + order.tests.length, 0)}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={HospitalIcon}
            title="Pending Tests"
            value={pendingOrders.length}
            loading={loading}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AssignmentIcon}
            title="Completed Today"
            value={completedToday}
            loading={loading}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={WarningIcon}
            title="Abnormal Results"
            value={abnormalResults.length}
            loading={loading}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TodayIcon}
            title="Vitals Recorded"
            value={vitalsRecordedToday}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ScienceIcon}
            title="In Progress"
            value={inProgressOrders.length}
            loading={loading}
            color="info"
          />
        </Grid>
      </Grid>

  {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Weekly Test Volume
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyTestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="tests" 
                  fill={theme.palette.primary.main} 
                  name="Total Tests"
                />
                <Bar 
                  dataKey="abnormal" 
                  fill={theme.palette.error.main} 
                  name="Abnormal Results"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Vital Signs Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={vitalTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="temp"
                  stroke={theme.palette.primary.main}
                  name="Temperature (°C)"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="hr"
                  stroke={theme.palette.secondary.main}
                  name="Heart Rate (bpm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Pending Orders
            </Typography>
            <LabOrdersList 
              labOrders={pendingOrders.slice(0, 5)} 
              showPatient={true} 
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Vital Signs
            </Typography>
            {vitalSigns.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Temp (°C)</TableCell>
                      <TableCell>BP</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {vitalSigns.slice(0, 5).map((vital) => (
  <TableRow key={vital._id}>
    <TableCell>
      {vital.patient?.firstName} {vital.patient?.lastName}
    </TableCell>
    <TableCell>
      {vital.temperature && typeof vital.temperature === 'object'
        ? `${vital.temperature.value} ${vital.temperature.unit}`
        : vital.temperature || 'N/A'}
    </TableCell>
    <TableCell>
      {vital.bloodPressure 
        ? `${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}` 
        : 'N/A'}
    </TableCell>
    <TableCell>
      {new Date(vital.createdAt).toLocaleString()}
    </TableCell>
  </TableRow>
))}

                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No recent vital signs recorded
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LabDashboard;