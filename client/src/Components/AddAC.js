import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table, Spinner } from 'react-bootstrap';
import axios from 'axios';

const AddAC = () => {
  const [acs, setAcs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentAC, setCurrentAC] = useState({});
  const [newAC, setNewAC] = useState({
    name: '',
    parliamentaryConstituency: '',
    PCId: '',
    pocMobileNumber: '',
  });

  useEffect(() => {
    fetchACs();
  }, []);

  const fetchACs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/ac/getAll-ac');
      setAcs(response.data.data);
    } catch (error) {
      console.error('Error fetching ACs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAC = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/ac/add-ac', newAC);
  
      // Append the new AC data to the existing `acs` state
      setAcs((prevAcs) => [...prevAcs, response.data.data]);
  
      // Reset the form fields
      setNewAC({ name: '', parliamentaryConstituency: '', PCId: '', pocMobileNumber: '' });
    } catch (error) {
      console.error('Error adding AC:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (ac) => {
    setCurrentAC(ac);
    setShowModal(true);
  };

  const handleUpdateAC = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:8000/ac/edit-ac/${currentAC._id}`,{
        "name": currentAC.name,
        "parliamentaryConstituency": currentAC.parliamentaryConstituency,
        "PCId": currentAC.PCId,
        "pocMobileNumber": currentAC.pocMobileNumber
      });
      
      // Find the index of the updated AC in the existing `acs` array
      const updatedACIndex = acs.findIndex(ac => ac._id === currentAC._id);
  
      // Create a new array to hold the updated records
      const updatedACs = [...acs];
  
      // Replace the updated AC record with the response data
      if (updatedACIndex !== -1) {
        updatedACs[updatedACIndex] = response.data.data;
      }
  
      // Update the state with the new array
      setAcs(updatedACs);
  
      // Close the modal
      setShowModal(false);
    } catch (error) {
      console.error('Error updating AC:', error);
    } finally {
      setLoading(false);
    }
  };  

  const handleInputChange = (e) => {
    setNewAC({ ...newAC, [e.target.name]: e.target.value });
  };

  const handleModalInputChange = (e) => {
    setCurrentAC({ ...currentAC, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4">
      <h2>Add Assembly Constituency</h2>
      <Form onSubmit={handleAddAC}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={newAC.name}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Parliamentary Constituency</Form.Label>
          <Form.Control
            type="text"
            name="parliamentaryConstituency"
            value={newAC.parliamentaryConstituency}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>PC ID</Form.Label>
          <Form.Control
            type="text"
            name="PCId"
            value={newAC.PCId}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>POC Mobile Number</Form.Label>
          <Form.Control
            type="text"
            name="pocMobileNumber"
            value={newAC.pocMobileNumber}
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-3">
          {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Add AC'}
        </Button>
      </Form>

      <h2 className="mt-5">All Assembly Constituencies</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
          <p>Loading data...</p>
        </div>
      ) : (
        <Table bordered striped responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Parliamentary Constituency</th>
              <th>PC ID</th>
              <th>POC Mobile Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {acs.map((ac) => (
              <tr key={ac._id}>
                <td>{ac.name}</td>
                <td>{ac.parliamentaryConstituency}</td>
                <td>{ac.PCId}</td>
                <td>{ac.pocMobileNumber}</td>
                <td>
                  <Button variant="warning" onClick={() => openEditModal(ac)}>
                    Update
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Update Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update AC</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentAC.name}
                onChange={handleModalInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Parliamentary Constituency</Form.Label>
              <Form.Control
                type="text"
                name="parliamentaryConstituency"
                value={currentAC.parliamentaryConstituency}
                onChange={handleModalInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>PC ID</Form.Label>
              <Form.Control
                type="text"
                name="PCId"
                value={currentAC.PCId}
                onChange={handleModalInputChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>POC Mobile Number</Form.Label>
              <Form.Control
                type="text"
                name="pocMobileNumber"
                value={currentAC.pocMobileNumber}
                onChange={handleModalInputChange}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateAC}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Update AC'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAC;