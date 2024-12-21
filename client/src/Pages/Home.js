import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  const pieChartOptions = {
    chart: {
      type: 'pie',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    labels: grievanceCounts.map((item) => item.category),
    colors: COLORS,
    legend: {
      position: 'bottom',
    },
  };

  const pieChartSeries = grievanceCounts.map((item) => item.count);

  const barChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 3,
        color: '#000',
        opacity: 0.4,
      },
    },
    xaxis: {
      categories: grievanceCounts.map((item) => item.category),
      labels: {
        rotate: -45, // Rotate labels to a 45-degree angle
        style: {
          fontSize: '10px', // Reduce font size for labels
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        endingShape: 'rounded',
      },
    },
    colors: COLORS,
    dataLabels: {
      enabled: false,
    },
  };  

  const barChartSeries = [
    {
      name: 'Grievances',
      data: grievanceCounts.map((item) => item.count),
    },
  ];

  return (
    <Container>
      <h1 className="text-center my-4">
        Welcome, {userInfo.role ? profile.name : `${profile.firstname} ${profile.lastname}`}
      </h1>

      <Row className="mb-4">
        {/* Charts in one row */}
        <Col xs={12} md={6} className="mb-4">
          <div className="chart-card">
            <h3>Grievance Distribution (Pie Chart)</h3>
            <Chart options={pieChartOptions} series={pieChartSeries} type="pie" width="100%" height={300} />
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="chart-card">
            <h3>Grievance Counts by Category (Bar Chart)</h3>
            <Chart options={barChartOptions} series={barChartSeries} type="bar" width="100%" height={300} />
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={12} md={6} className="mb-4">
          <div className="card shadow-lg p-3  text-center">
            <h3 className="text-center">Total Records</h3>
            <div className="card-value">{totalRecords}</div>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="card shadow-lg p-3  text-center">
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