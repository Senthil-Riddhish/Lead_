import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CMRF = ({
  formData = {
    patientName: '',
    relation: '',
    fatherName: '',
    aadharCard: '',
    phoneNumber: '',
    address: '',
    hospitalName: '',
    diseaseName: '',
    dateOfAdmission: '',
    dateOfDischarge: '',
    totalAmount: '',
  },
  onChange
}) => (
  <Form>
    {/* Patient Details */}
    <h5>Patient Details</h5>
    <Row>
      <Col md={4}>
        <Form.Group controlId="patientName">
          <Form.Label>Patient Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter patient name"
            value={formData.patientName}
            onChange={(e) => onChange({ ...formData, patientName: e.target.value })}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="relation">
          <Form.Label>Relation</Form.Label>
          <Form.Control
            as="select"
            value={formData.relation}
            onChange={(e) => onChange({ ...formData, relation: e.target.value })}
          >
            <option value="S/O">S/O</option>
            <option value="D/O">D/O</option>
            <option value="O/O">O/O</option>
          </Form.Control>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="fatherName">
          <Form.Label>Father's Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter father's name"
            value={formData.fatherName}
            onChange={(e) => onChange({ ...formData, fatherName: e.target.value })}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="aadharCard">
          <Form.Label>Aadhar Card</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Aadhar card number"
            value={formData.aadharCard}
            onChange={(e) => onChange({ ...formData, aadharCard: e.target.value })}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter phone number"
            value={formData.phoneNumber}
            onChange={(e) => onChange({ ...formData, phoneNumber: e.target.value })}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={formData.address}
            onChange={(e) => onChange({ ...formData, address: e.target.value })}
          />
        </Form.Group>
      </Col>
    </Row>

    {/* Hospital Details */}
    <h5 className="mt-4">Hospital Details</h5>
    <Row>
      <Col md={4}>
        <Form.Group controlId="hospitalName">
          <Form.Label>Hospital Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter hospital name"
            value={formData.hospitalName}
            onChange={(e) => onChange({ ...formData, hospitalName: e.target.value })}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="diseaseName">
          <Form.Label>Disease Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter disease name"
            value={formData.diseaseName}
            onChange={(e) => onChange({ ...formData, diseaseName: e.target.value })}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="dateOfAdmission">
          <Form.Label>Date of Admission</Form.Label>
          <Form.Control
            type="date"
            value={formData.dateOfAdmission}
            onChange={(e) => onChange({ ...formData, dateOfAdmission: e.target.value })}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="dateOfDischarge">
          <Form.Label>Date of Discharge</Form.Label>
          <Form.Control
            type="date"
            value={formData.dateOfDischarge}
            onChange={(e) => onChange({ ...formData, dateOfDischarge: e.target.value })}
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="totalAmount">
          <Form.Label>Total Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter total amount"
            value={formData.totalAmount}
            onChange={(e) => onChange({ ...formData, totalAmount: e.target.value })}
          />
        </Form.Group>
      </Col>
    </Row>
  </Form>
);

export default CMRF;