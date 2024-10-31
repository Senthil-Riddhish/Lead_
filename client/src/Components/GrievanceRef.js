import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const GrievanceRef = ({ data, onChange }) => (
  <Form>
    <Row>
      <Col md={4}>
        <Form.Group controlId="subject">
          <Form.Label>Subject</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter subject"
            value={data.subject}
            onChange={(e) => onChange({ ...data, subject: e.target.value })}
          />
        </Form.Group>
      </Col>
      <Col md={8}>
        <Form.Group controlId="content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter content"
            value={data.content}
            onChange={(e) => onChange({ ...data, content: e.target.value })}
          />
        </Form.Group>
      </Col>
    </Row>
  </Form>
);

export default GrievanceRef;