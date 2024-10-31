import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CMRF = ({ formData = { patientName: '', relation: '' }, onChange }) => (
  <Form>
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
            <option value="F/O">F/O</option>
            <option value="O/O">O/O</option>
          </Form.Control>
        </Form.Group>
      </Col>
    </Row>
  </Form>
);

export default CMRF;