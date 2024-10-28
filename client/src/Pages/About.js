import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AddAC from "../Components/AddAC";

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
            variant="success" 
            onClick={() => handleContentChange('village')}
            className="mx-2"
          >
            Add Village
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
              <div>
                <h2>Add Mandal</h2>
                <p>Here you can add a new Mandal to an existing AC.</p>
              </div>
            )}
            {selectedContent === 'village' && (
              <div>
                <h2>Add Village</h2>
                <p>Here you can add a new Village to an existing Mandal.</p>
              </div>
            )}
          </section>
        </Col>
      </Row>
    </Container>
  );
};

export default About;