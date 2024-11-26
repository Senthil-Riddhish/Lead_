import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GrievanceTable = () => {
  const [grievances, setGrievances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenInfo, setUserInfo] = useState({
    userId: '',
    role: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios.post('http://localhost:8000/auth/getTokeninfo', { token })
        .then(response => {
          const { userId, role } = response.data;
          setUserInfo({ userId, role });
          fetchGrievances(userId,role);
        })
        .catch(() => navigate('/login'));
    }
  }, [navigate]);

  const fetchGrievances = async (userId,role) => {
    try {
      console.log(userId);
      const response = await fetch(`http://localhost:8000/grievances/getdocuments/${userId}/${role}`);
      if (!response.ok) {
        throw new Error('Failed to fetch grievances');
      }
      const data = await response.json();
      console.log("data : ", data);
      setGrievances(data.grievanceCategories);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  const handleEdit = (grievanceId) => {
    navigate('/grievances', { state: { grievanceId } });
  };  

  const renderGrievanceRows = (grievanceCategory) => {
    return grievanceCategory.map((grievance, index) => (
      <tr key={index}>
        <td>{grievance.category}</td>
        <td>{grievance.name}</td>
        <td>{grievance.age}</td>
        <td>{grievance.fatherName}</td>
        <td>{grievance.phoneNumber}</td>
        <td>
          <Button 
            variant="primary" 
            onClick={() => handleEdit(grievance._id)}
          >
            Edit
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <Container className="mt-5">
      <h2>Employee Grievance Records</h2>
      {Object.keys(grievances).map((category, idx) => (
        <Row key={idx} className="mb-4">
          <Col md={12}>
            <div className="category-section">
              <h4 className="category-title">{category}</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Father Name</th>
                    <th>Phone Number</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {renderGrievanceRows(grievances[category])}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default GrievanceTable;