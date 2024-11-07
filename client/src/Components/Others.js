import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const Others = ({ formData = {}, onChange }) => {
  // Ensure formData.Others is defined
  const { subject = '', content = '' } = formData.Others || {};

  return (
    <Form>
      <Row>
        <Col md={4}>
          <Form.Group controlId="subject">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) =>
                onChange({
                  ...formData,
                  Others: { ...formData.Others, subject: e.target.value },
                })
              }
            />
          </Form.Group>
        </Col>
        <Col md={8}>
          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Enter content"
              value={content}
              onChange={(e) =>
                onChange({
                  ...formData,
                  Others: { ...formData.Others, content: e.target.value },
                })
              }
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default Others;