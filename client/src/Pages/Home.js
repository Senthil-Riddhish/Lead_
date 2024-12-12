import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const initializePage = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          navigate('/login');
        } else {
          const tokenResponse = await axios.post(
            'http://localhost:8000/auth/getTokeninfo',
            { token }
          );
          const { userId, role } = tokenResponse.data;
          setUserInfo({ userId, role });

          // Fetch consolidated data based on user role
          const response = await axios.get(
            `http://localhost:8000/grievances/consolidated-data/${userId}/${role}`
          );
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Error initializing page:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    initializePage();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Error loading data!</div>;
  }

  // Extract data for the table and charts
  const grievanceCategories = data.grievanceCategories || {};
  const grievanceLabels = Object.keys(grievanceCategories);
  const grievanceCounts = grievanceLabels.map((category) => ({
    category,
    count: grievanceCategories[category].length,
  }));

  const totalACs = data.allAC?.length || 0;
  const totalEmployees = data.employees?.length || 0;

  // Calculate total records
  const totalRecords = grievanceLabels.reduce(
    (acc, category) => acc + grievanceCategories[category].length,
    0
  );

  // Data for Pie and Bar charts
  const pieChartData = grievanceCounts.map(({ category, count }) => ({
    name: category,
    value: count,
  }));

  return (
    <div style={{ width: '80%', margin: '0 auto', marginTop: '20px' }}>
      <h1>Welcome, {userInfo.role}</h1>

      {/* First row: Charts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        {/* Pie Chart */}
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h3>Grievance Distribution</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div style={{ flex: 1, marginLeft: '20px' }}>
          <h3>Grievance Counts by Category</h3>
          <BarChart width={500} height={400} data={pieChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      {/* Second row: Tables */}
      <div>
        {/* Grievance Table */}
        <h3>Grievance Count Details</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Category</th>
              <th style={tableHeaderStyle}>Count</th>
            </tr>
          </thead>
          <tbody>
            {grievanceCounts.map(({ category, count }, index) => (
              <tr key={index}>
                <td style={tableCellStyle}>{category}</td>
                <td style={tableCellStyle}>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Table */}
        <h3>Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {userInfo.role !== 1 && <th style={tableHeaderStyle}>Total ACs</th>}
              {userInfo.role !== 1 && <th style={tableHeaderStyle}>Total Employees</th>}
              <th style={tableHeaderStyle}>Total Records</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {userInfo.role !== 1 && <td style={tableCellStyle}>{totalACs}</td>}
              {userInfo.role !== 1 && <td style={tableCellStyle}>{totalEmployees}</td>}
              <td style={tableCellStyle}>{totalRecords}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Table styles
const tableHeaderStyle = {
  backgroundColor: '#f4f4f4',
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
  fontWeight: 'bold',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
};

export default Home;
