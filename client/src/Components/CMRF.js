import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CMRF = ({ data, onChange }) => (
  <Form>
    <Row>
      <Col md={4}>
        <Form.Group controlId="patientName">
          <Form.Label>Patient Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter patient name"
            value={data.patientName}
            onChange={(e) => onChange({ ...data, patientName: e.target.value })}
          />
        </Form.Group>
      </Col>
      {/* Add other fields similarly */}
      {/* Example for Relation field */}
      <Col md={4}>
        <Form.Group controlId="relation">
          <Form.Label>Relation</Form.Label>
          <Form.Control
            as="select"
            value={data.relation}
            onChange={(e) => onChange({ ...data, relation: e.target.value })}
          >
            <option value="S/O">S/O</option>
            <option value="F/O">F/O</option>
            <option value="O/O">O/O</option>
          </Form.Control>
        </Form.Group>
      </Col>
      {/* Continue for other fields... */}
    </Row>
  </Form>
);

export default CMRF;