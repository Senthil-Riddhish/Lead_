import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Container, Row, Col, Navbar, Button, Offcanvas } from 'react-bootstrap';
import Home from './Pages/Home';
import About from './Pages/About';
import EmployeeManagement from './Pages/Services';
import Grievances from './Pages/Grievance';
import Login from './Pages/Login'; // Import Login component
import "./App.css";
import { FaHome } from "react-icons/fa";
import { RiGovernmentLine } from "react-icons/ri";
import { TiContacts } from "react-icons/ti";
import logo from "./Images/leadlogo.PNG";

const Sidebar = ({ toggleSidebar }) => (
  <div className="sidebar-container d-flex flex-column p-3" style={{ width: '100%', backgroundColor: 'white' }}>
    <div className="sidebar-header d-flex align-items-center mb-4">
      <img src={logo} alt="Menu Icon" className="me-2" style={{ width: '100px', height: '50px' }} />
    </div>
    <Link to="/home" onClick={toggleSidebar} className="sidebar-link mb-3">
      <FaHome className="me-2" />
      Home
    </Link>
    <Link to="/about" onClick={toggleSidebar} className="sidebar-link mb-3">
      <RiGovernmentLine className="me-2" />
      Assembly Constitution
    </Link>
    <Link to="/employee" onClick={toggleSidebar} className="sidebar-link mb-3">
      <RiGovernmentLine className="me-2" />
      Employee Management
    </Link>
    <Link to="/grievances" onClick={toggleSidebar} className="sidebar-link mb-3">
      <TiContacts className="me-2" />
      Grievances
    </Link>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false); // Define showSidebar and setShowSidebar

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <Router>
      <Container fluid>
        {isAuthenticated ? (
          <>
            <Navbar bg="light" className="d-md-none">
              <Button variant="primary" onClick={() => setShowSidebar(!showSidebar)}>
                ☰
              </Button>
            </Navbar>

            <Row className="flex-nowrap">
              <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="d-md-none">
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Sidebar toggleSidebar={() => setShowSidebar(false)} />
                </Offcanvas.Body>
              </Offcanvas>

              <Col md={3} lg={2} className="p-0 d-none d-md-block sidebar">
                <Sidebar />
              </Col>

              <Col xs={12} md={9} lg={10} className="p-0">
                <Navbar className="bg-body-tertiary">
                  <Container>
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
                  <Route path="/employee" element={<EmployeeManagement />} />
                  <Route path="/grievances" element={<Grievances />} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </Routes>
              </Col>
            </Row>
          </>
        ) : (
          <Routes>
            <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          </Routes>
        )}
      </Container>
    </Router>
  );
};

export default App;