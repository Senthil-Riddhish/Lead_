import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Sidebar = () => {
  return (
    <ListGroup variant="flush" className="vh-100 border-end">
      <ListGroup.Item className="bg-primary text-white">
        <h4 className="mb-0">Menu</h4>
      </ListGroup.Item>
      <LinkContainer to="/home">
        <ListGroup.Item action>Home</ListGroup.Item>
      </LinkContainer>
      <LinkContainer to="/about">
        <ListGroup.Item action>About</ListGroup.Item>
      </LinkContainer>
      <LinkContainer to="/services">
        <ListGroup.Item action>Services</ListGroup.Item>
      </LinkContainer>
      <LinkContainer to="/contact">
        <ListGroup.Item action>Contact</ListGroup.Item>
      </LinkContainer>
    </ListGroup>
  );
};

export default Sidebar;