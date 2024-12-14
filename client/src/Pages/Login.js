import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Navbar from 'react-bootstrap/Navbar';
import './Login.css'; // Import CSS for styling
import logo from "../Images/leadlogo.PNG";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/auth/signin', {
        credentials: {
          email,
          password,
        },
      });

      if (response.data.status === 'success') {
        sessionStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Successfully Signed-In',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: 'swal-title', // Class for the title
            popup: 'swal-popup', // Class for the popup
          },
        });
      } else {
        Swal.fire({
          position: 'top-end',
          title: 'Invalid credentials',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            title: 'swal-title',
            popup: 'swal-popup',
          },
        });
      }
    } catch (error) {
      Swal.fire({
        position: 'top-end',
        title: 'Login failed. Please try again.',
        showConfirmButton: false,
        timer: 1500,
        customClass: {
          title: 'swal-title',
          popup: 'swal-popup',
        },
      });
    }
  };

  const TextLinkExample = () => {
    return (
      <Container className="login-container">
        <Navbar>
          <Container>
            <Navbar.Brand href="#home">
              <img
                src={logo} // Replace this with the actual path to your logo
                alt="Company Logo"
                style={{ height: '40px' }} // Adjust height as needed
              />
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
              <Form onSubmit={handleLogin} className="d-flex align-items-center">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  className="me-2"
                  style={{ maxWidth: '200px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Form.Control
                  type="password"
                  placeholder="Password"
                  className="me-2"
                  style={{ maxWidth: '200px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Form>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>
    );
  };

  return (
    <TextLinkExample />
  );
};

export default Login;