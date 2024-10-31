import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import GrievanceRefForm from '../Components/GrievanceRef';
import CmrfForm from '../Components/CMRF';

const LetterRequestForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    // General Details
    name: '',
    gender: '',
    fatherName: '',
    age: '',
    aadharId: '',
    phoneNumber: '',
    letterRequired: false,
    to: '',
    purpose: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data to Submit:", formData);
    // Add API call here
  };

  const renderCategoryForm = () => {
    switch (selectedCategory) {
      case 'GrievanceRef':
        return <GrievanceRefForm formData={formData} setFormData={setFormData} />;
      case 'CMRF':
        return <CmrfForm formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <h3 className="my-4">Letter Request Form</h3>
      <Form onSubmit={handleSubmit}>
        {/* General Details Section */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formFatherName">
              <Form.Label>Father's Name</Form.Label>
              <Form.Control
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formAadharId">
              <Form.Label>Aadhar ID</Form.Label>
              <Form.Control
                type="text"
                name="aadharId"
                value={formData.aadharId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formLetterRequired">
              <Form.Label>Letter Required</Form.Label>
              <Form.Check
                type="checkbox"
                name="letterRequired"
                checked={formData.letterRequired}
                onChange={(e) => setFormData({ ...formData, letterRequired: e.target.checked })}
              />
            </Form.Group>
          </Col>
          {formData.letterRequired && (
            <>
              <Col md={4}>
                <Form.Group controlId="formTo">
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="text"
                    name="to"
                    value={formData.to}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="formPurpose">
                  <Form.Label>Purpose</Form.Label>
                  <Form.Control
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </>
          )}
        </Row>

        {/* Category Selection */}
        <Row className="mb-4">
          <Col>
            <h5>Select Category</h5>
            <div className="d-flex justify-content-between">
              {['GrievanceRef', 'CMRF', 'JOBS', 'DEVELOPMENT', 'Transfer', 'Others'].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedCategory(cat)}
                  className="me-2"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Render Selected Category Form */}
        {renderCategoryForm()}

        {/* Submit Button */}
        <Row className="mt-4">
          <Col>
            <Button variant="success" type="submit" className="w-100">
              Submit Request
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default LetterRequestForm;