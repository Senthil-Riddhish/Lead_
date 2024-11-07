import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CMRF = ({
  formData = {
    cmrf: {
      patientName: '',
      patientrelation: '',
      patientfatherName: '',
      patientaadharCard: '',
      patientphoneNumber: '',
      patientaddress: '',
      hospitalName: '',
      diseaseName: '',
      dateOfAdmission: '',
      dateOfDischarge: '',
      totalAmount: '',
    }
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
            value={formData.cmrf?.patientName || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  patientName: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="relation">
          <Form.Label>Relation</Form.Label>
          <Form.Control
            as="select"
            value={formData.cmrf?.relation || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  patientrelation: e.target.value
                }
              })
            }
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
            value={formData.cmrf?.fatherName || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  patientfatherName: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="aadharCard">
          <Form.Label>Aadhar Card</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Aadhar card number"
            value={formData.cmrf?.aadharCard || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  patientaadharCard: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="phoneNumber">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Enter phone number"
            value={formData.cmrf?.phoneNumber || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  patientphoneNumber: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={formData.cmrf?.address || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  patientaddress: e.target.value
                }
              })
            }
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
            value={formData.cmrf?.hospitalName || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  hospitalName: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="diseaseName">
          <Form.Label>Disease Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter disease name"
            value={formData.cmrf?.diseaseName || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  diseaseName: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="dateOfAdmission">
          <Form.Label>Date of Admission</Form.Label>
          <Form.Control
            type="date"
            value={formData.cmrf?.dateOfAdmission || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  dateOfAdmission: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="dateOfDischarge">
          <Form.Label>Date of Discharge</Form.Label>
          <Form.Control
            type="date"
            value={formData.cmrf?.dateOfDischarge || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  dateOfDischarge: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="totalAmount">
          <Form.Label>Total Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter total amount"
            value={formData.cmrf?.totalAmount || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  totalAmount: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
    </Row>
  </Form>
);

export default CMRF;