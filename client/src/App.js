import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Row, Col, Navbar, Button, Offcanvas } from 'react-bootstrap';
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import "./App.css";

const Sidebar = ({ toggleSidebar }) => (
  <div className="d-flex flex-column" style={{ width: '100%' }}>
    <Link to="/home" onClick={toggleSidebar} className="mb-3">Home</Link>
    <Link to="/about" onClick={toggleSidebar} className="mb-3">Assembly Constitution</Link>
    <Link to="/services" onClick={toggleSidebar} className="mb-3">Services</Link>
    <Link to="/contact" onClick={toggleSidebar} className="mb-3">Contact</Link>
  </div>
);

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <Router>
      <Container fluid>
        <Navbar bg="light" className="d-md-none">
          <Button variant="primary" onClick={toggleSidebar}>
            ☰
          </Button>
        </Navbar>

        <Row className="flex-nowrap">
          <Offcanvas show={showSidebar} onHide={toggleSidebar} className="d-md-none">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Sidebar toggleSidebar={toggleSidebar} />
            </Offcanvas.Body>
          </Offcanvas>

          <Col 
            md={3} 
            lg={2} 
            className="p-0 d-none d-md-block sidebar" 
          >
            <Sidebar />
          </Col>

          <Col xs={12} md={9} lg={10} className='p-0'>
            <Navbar className="bg-body-tertiary">
                <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                  <Navbar.Text>
                    Signed in as: <a href="#login">Mark Otto</a>
                  </Navbar.Text>
                  <Button variant="outline-success">Search</Button>
                </Navbar.Collapse>
            </Navbar>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Services />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
};

export default App;