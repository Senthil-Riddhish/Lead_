import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
const CreateEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    fatherName: '',
    address: '',
    email: '',
    phoneNumber: '',
    panId: '',
    aadharId: '',
    scores: {
      xth: '',  
      xiith: '',
      bachelors: '',
      masters: '',
    },
    epf: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('scores.')) {
      const scoreKey = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        scores: { ...prevState.scores, [scoreKey]: value }
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await axios.post('http://localhost:8000/auth/create-emp', {
        credentials: formData
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Successfully Created",
        showConfirmButton: false,
        timer: 1500
      });
      setFormData({
        name: '',
        age: '',
        fatherName: '',
        address: '',
        email: '',
        phoneNumber: '',
        panId: '',
        aadharId: '',
        scores: {
          xth: '',
          xiith: '',
          bachelors: '',
          masters: '',
        },
        epf: '',
        password: ''
      });
    } catch (error) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: error.response.data.error,
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  return (
    <Container>
      <h2>Create Employee</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                placeholder="Enter Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formFatherName">
              <Form.Label>Father's Name</Form.Label>
              <Form.Control
                type="text"
                name="fatherName"
                placeholder="Enter Father's Name"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                placeholder="Enter Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                placeholder="Enter Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formPanId">
              <Form.Label>PAN ID</Form.Label>
              <Form.Control
                type="text"
                name="panId"
                placeholder="Enter PAN ID"
                value={formData.panId}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formAadharId">
              <Form.Label>Aadhar ID</Form.Label>
              <Form.Control
                type="text"
                name="aadharId"
                placeholder="Enter Aadhar ID"
                value={formData.aadharId}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formEpf">
              <Form.Label>EPF</Form.Label>
              <Form.Control
                type="text"
                name="epf"
                placeholder="Enter EPF"
                value={formData.epf}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formXthScore">
              <Form.Label>Xth Score</Form.Label>
              <Form.Control
                type="number"
                name="scores.xth"
                placeholder="Enter Xth Score"
                value={formData.scores.xth}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formXiithScore">
              <Form.Label>XIIth Score</Form.Label>
              <Form.Control
                type="number"
                name="scores.xiith"
                placeholder="Enter XIIth Score"
                value={formData.scores.xiith}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBachelorsScore">
              <Form.Label>Bachelors Score</Form.Label>
              <Form.Control
                type="number"
                name="scores.bachelors"
                placeholder="Enter Bachelors Score"
                value={formData.scores.bachelors}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formMastersScore">
              <Form.Label>Masters Score</Form.Label>
              <Form.Control
                type="number"
                name="scores.masters"
                placeholder="Enter Masters Score"
                value={formData.scores.masters}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" variant="primary">Create Employee</Button>
      </Form>
    </Container>
  );
};

export default CreateEmployee;