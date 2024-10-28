import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container, Row, Col, Navbar, Button, Offcanvas, Image } from 'react-bootstrap';
import Home from './Pages/Home';
import About from './Pages/About';
import Services from './Pages/Services';
import "./App.css";
import { FaHome } from "react-icons/fa";
import { RiGovernmentLine } from "react-icons/ri";
import { TiContacts } from "react-icons/ti";
import logo from "./Images/leadlogo.PNG"

const Sidebar = ({ toggleSidebar }) => (
  <div className="sidebar-container d-flex flex-column p-3" style={{ width: '100%', backgroundColor: 'white' }}>
    <div className="sidebar-header d-flex align-items-center mb-4">
      <img src={logo} alt="Menu Icon" className="me-2" style={{ width: '100px', height: '50px' }} /> {/* Adjust width/height as needed */}

    </div>
    <Link to="/home" onClick={toggleSidebar} className="sidebar-link mb-3">
      <FaHome className="me-2" />
      Home
    </Link>
    <Link to="/about" onClick={toggleSidebar} className="sidebar-link mb-3">
      <RiGovernmentLine className="me-2" />
      Assembly Constitution
    </Link>
    <Link to="/services" onClick={toggleSidebar} className="sidebar-link mb-3">
      <RiGovernmentLine className="me-2" />
      Services
    </Link>
    <Link to="/contact" onClick={toggleSidebar} className="sidebar-link mb-3">
      <TiContacts className="me-2" />
      Contact
    </Link>
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

          <Col md={3} lg={2} className="p-0 d-none d-md-block sidebar">
            <Sidebar />
          </Col>

          <Col xs={12} md={9} lg={10} className="p-0">
            <Navbar className="bg-body-tertiary">
              <Container>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                  <Navbar.Text className='me-5'>
                    Signed in as: <a href="#login">Mark Otto</a>
                  </Navbar.Text>
                  <Button variant="outline-success">Search</Button>
                </Navbar.Collapse>
              </Container>
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