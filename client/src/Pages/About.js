import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AddAC from "../Components/AddAC";
import Mandal from "../Components/Mandal";
import AllotmentComponent from "../Components/Allotment";
const About = () => {
  const [selectedContent, setSelectedContent] = useState('ac');

  const handleContentChange = (content) => setSelectedContent(content);

  return (
    <Container className="text-center my-4">
      {/* Button Section */}
      <Row className="justify-content-center my-4">
        <Col xs="auto" className="d-flex justify-content-around">
          <Button 
            variant="primary" 
            onClick={() => handleContentChange('ac')}
            className="mx-2"
          >
            Add AC
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleContentChange('mandal')}
            className="mx-2"
          >
            Add Mandal
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleContentChange('allotment')}
            className="mx-2"
          >
            Allotment
          </Button>
        </Col>
      </Row>

      {/* Conditional Content Display */}
      <Row>
        <Col>
          <section className="content-section">
            {selectedContent === 'ac' && (
              <AddAC/>
            )}
            {selectedContent === 'mandal' && (
              <Mandal/>
            )}
            {selectedContent === 'allotment' && (
              <AllotmentComponent/>
            )}
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export default About;