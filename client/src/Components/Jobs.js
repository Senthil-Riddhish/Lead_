import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const Jobs = ({ formData = { referencePerson: '', referencePhone: '', qualification: '', otherQualification: '' }, onChange }) => {
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleQualificationChange = (e) => {
    const selectedQualification = e.target.value;
    setShowOtherInput(selectedQualification === 'Others');
    onChange({ ...formData, qualification: selectedQualification, otherQualification: '' });
  };

  return (
    <Form>
      {/* Reference Details */}
      <h5>Reference Details</h5>
      <Row>
        <Col md={4}>
          <Form.Group controlId="referencePerson">
            <Form.Label>Reference Person</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter reference person"
              value={formData.referencePerson}
              onChange={(e) => onChange({ ...formData, referencePerson: e.target.value })}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="referencePhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              value={formData.referencePhone}
              onChange={(e) => onChange({ ...formData, referencePhone: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Qualifications */}
      <h5 className="mt-4">Qualifications</h5>
      <Row>
        <Col>
          {[
            'SSC', 'INTERMEDIATE', 'ITI', 'POLYTECHNIC', 'DEGREE', 'BCOM', 'B.TECH',
            'BA', 'DEGREE BACHELORS', 'B.SC', 'B.ED', 'MASTERS', 'MBA', 'Others'
          ].map((qualification) => (
            <Form.Check
              key={qualification}
              type="radio"
              label={qualification}
              name="qualification"
              value={qualification}
              checked={formData.qualification === qualification}
              onChange={handleQualificationChange}
            />
          ))}

          {/* Show other qualification input if "Others" is selected */}
          {showOtherInput && (
            <Form.Group controlId="otherQualification" className="mt-2">
              <Form.Label>Other Qualification</Form.Label>
              <Form.Control
                type="text"
                placeholder="Specify other qualification"
                value={formData.otherQualification}
                onChange={(e) => onChange({ ...formData, otherQualification: e.target.value })}
              />
            </Form.Group>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default Jobs;