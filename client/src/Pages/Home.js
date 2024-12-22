import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2'; // Import chart components from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'; // Import necessary chart.js elements
import 'bootstrap/dist/css/bootstrap.min.css';

// Register the necessary chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [profile, setProfile] = useState(null);
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
          const profileResponse = await axios.get(`http://localhost:8000/employee/profile/${userId}`);
          setProfile(profileResponse.data);

          const response = await axios.get(
            `http://localhost:8000/grievances/consolidated-data/${userId}/${role}`
          );
          setData(response.data.data);
          console.log(response.data.data);
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
    return <div className="loading-screen">Loading...</div>;
  }

  if (!data) {
    return <div>Error loading data!</div>;
  }

  const grievanceCategories = data?.grievanceCategories || {};
  const grievanceLabels = Object.keys(grievanceCategories || {});
  const grievanceCounts = grievanceLabels.map((category) => ({
    category,
    count: grievanceCategories[category]?.length || 0,
  }));

  const totalACs = data.allAC?.length || 0;
  const totalEmployees = data.employees?.length || 0;
  const totalRecords = grievanceCounts.reduce(
    (acc, { count }) => acc + (count || 0),
    0
  );
  const pieChartData = {
    labels: grievanceCounts.map((item) => item.category),
    datasets: [
      {
        data: grievanceCounts.map((item) => item.count),
        backgroundColor: COLORS,
      },
    ],
  };

  // Pie chart options with legend below the chart
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Set legend position to bottom
      },
    },
  };
  // Bar chart data and options
  const barChartData = {
    labels: grievanceCounts.map((item) => item.category),
    datasets: [
      {
        label: 'Grievances',
        data: grievanceCounts.map((item) => item.count),
        backgroundColor: COLORS,
      },
    ],
  };

  return (
    <Container>
      <h1 className="text-center my-4">
        Welcome, {userInfo.role ? profile.name : `${profile.firstname} ${profile.lastname}`}
      </h1>
      <Row className="mb-4">
        {/* Charts in one row */}
        <Col xs={12} md={6} className="mb-4">
          <div className="chart-card" style={{ height: '400px' }}>
            <h3 style={{textAlign:"center"}}>Grievance Distribution</h3>
            {/* Pie Chart with legend below */}
            <Pie data={pieChartData} options={pieChartOptions} width={40} height={30} />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="chart-card"  style={{ height: '400px' }}>
            <h3 style={{textAlign:"center"}}>Grievance Counts by Category</h3>
            {/* Bar Chart */}
            <Bar data={barChartData} width={40} height={30} />
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={12} md={6} className="mb-4">
          <div className="card shadow-lg p-3 text-center">
            <h3 className="text-center">Total Records</h3>
            <div className="card-value">{totalRecords}</div>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="card shadow-lg p-3 text-center">
            <h3 className="text-center">Total Employees</h3>
            <div className="card-value">{totalEmployees}</div>
          </div>
        </Col>
      </Row>

      <Row>
        {grievanceCounts.map(({ category, count }, index) => (
          <Col xs={12} md={4} key={index} className="mb-4">
            <div className="card shadow-lg p-3 text-center">
              <h4>{category}</h4>
              <div className="card-value">{count}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;