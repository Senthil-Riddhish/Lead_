import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Table, Form, Modal } from 'react-bootstrap';
import axios from 'axios';

const Mandal = () => {
  const [acs, setAcs] = useState([]);
  const [selectedAc, setSelectedAc] = useState(null);
  const [mandals, setMandals] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newMandalName, setNewMandalName] = useState('');
  const [selectedMandal, setSelectedMandal] = useState(null);
  const [updateMandalName, setUpdateMandalName] = useState('');
  const [showVillageModal, setShowVillageModal] = useState(false);
  const [villages, setVillages] = useState([]);
  const [newVillageName, setNewVillageName] = useState('');
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [updateVillageName, setUpdateVillageName] = useState('');

  // Fetch all ACs
  useEffect(() => {
    axios.get('http://localhost:8000/ac/getAll-ac')
      .then((response) => {
        setAcs(response.data.data);
      })
      .catch((error) => console.error('Error fetching ACs:', error));
  }, []);

  // Fetch mandals for selected AC
  const handleAcChange = (event) => {
    const acId = event.target.value;
    const selectedAcData = acs.find(ac => ac._id === acId);
    setSelectedAc(selectedAcData);
    setMandals(selectedAcData.mandals);
  };

  // Show add modal
  const openAddModal = () => setShowAddModal(true);

  // Close add modal
  const closeAddModal = () => {
    setShowAddModal(false);
    setNewMandalName('');
  };

  // Add mandal
  const addMandal = () => {
    axios.post(`http://localhost:8000/ac/add-mandal/${selectedAc._id}`, { name: newMandalName })
      .then((response) => {
        setMandals([...mandals, response.data.data]);
        closeAddModal();
      })
      .catch((error) => console.error('Error adding mandal:', error));
  };

  // Show update modal
  const openUpdateModal = (mandal) => {
    setSelectedMandal(mandal);
    setUpdateMandalName(mandal.name);
    setShowUpdateModal(true);
  };

  // Close update modal
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedMandal(null);
    setUpdateMandalName('');
  };

    // Update mandal
  const updateMandal = () => {
    axios.put(`http://localhost:8000/ac/edit-mandal/${selectedAc._id}/${selectedMandal._id}`, { name: updateMandalName })
      .then(() => {
        const updatedMandals = mandals.map(m => m._id === selectedMandal._id ? { ...m, name: updateMandalName } : m);
        setMandals(updatedMandals);
        closeUpdateModal();
      })
      .catch((error) => console.error('Error updating mandal:', error));
  };

  // Open Village Modal
  const openVillageModal = (mandal) => {
    setSelectedMandal(mandal);
    setVillages(mandal.villages);
    setShowVillageModal(true);
  };

  const deleteMandal = (mandal) => {
    console.log(mandal, selectedAc);
  }
  // Close Village Modal
  const closeVillageModal = () => {
    setShowVillageModal(false);
    setSelectedMandal(null);
    setVillages([]);
  };

  // Add village
  const addVillage = () => {
    axios.post(`http://localhost:8000/ac/add-village/${selectedAc._id}/${selectedMandal._id}`, { name: newVillageName })
      .then((response) => {
        setVillages([...villages, response.data.data]);
        setNewVillageName('');
      })
      .catch((error) => console.error('Error adding village:', error));
  };

  // Show update modal for Village
  const openUpdateVillageModal = (village) => {
    setSelectedVillage(village);
    setUpdateVillageName(village.name);
  };

  // Update village
  const updateVillage = () => {
    axios.put(`http://localhost:8000/ac/edit-village/${selectedAc._id}/${selectedMandal._id}/${selectedVillage._id}`, { name: updateVillageName })
      .then(() => {
        const updatedVillages = villages.map(v => v._id === selectedVillage._id ? { ...v, name: updateVillageName } : v);
        setVillages(updatedVillages);
        setSelectedVillage(null);
        setUpdateVillageName('');
      })
      .catch((error) => console.error('Error updating village:', error));
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Form.Select onChange={handleAcChange} defaultValue="">
            <option value="" disabled>Select an AC</option>
            {acs.map(ac => (
              <option key={ac._id} value={ac._id}>{ac.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          {selectedAc && (
            <Button variant="primary" onClick={openAddModal}>
              Add Mandal
            </Button>
          )}
        </Col>
      </Row>

      {/* Mandal Table */}
      {mandals.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Mandal Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mandals.map(mandal => (
              <tr key={mandal._id}>
                <td>{mandal.name}</td>
                <td>
                  <Button className='me-2' variant="outline-secondary" onClick={() => openUpdateModal(mandal)}>Update Mandal</Button>
                  <Button className='me-2' variant="outline-secondary" onClick={() => openVillageModal(mandal)}>Village</Button>
                  <Button variant="outline-secondary" onClick={() => deleteMandal(mandal)}>Delete Mandal</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Mandal Modal */}
      <Modal show={showAddModal} onHide={closeAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Mandal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="mandalName">
            <Form.Label>Mandal Name</Form.Label>
            <Form.Control 
              type="text" 
              value={newMandalName} 
              onChange={(e) => setNewMandalName(e.target.value)} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeAddModal}>Close</Button>
          <Button variant="primary" onClick={addMandal}>Submit</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Mandal Modal */}
      <Modal show={showUpdateModal} onHide={closeUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Mandal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="updateMandalName">
            <Form.Label>Mandal Name</Form.Label>
            <Form.Control 
              type="text" 
              value={updateMandalName} 
              onChange={(e) => setUpdateMandalName(e.target.value)} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdateModal}>Close</Button>
          <Button variant="primary" onClick={updateMandal}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Village Modal */}
      <Modal show={showVillageModal} onHide={closeVillageModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Villages in {selectedMandal && selectedMandal.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="villageName">
            <Form.Label>New Village Name</Form.Label>
            <Form.Control 
              type="text" 
              value={newVillageName} 
              onChange={(e) => setNewVillageName(e.target.value)} 
            />
            <Button variant="primary" className="mt-2" onClick={addVillage}>Add Village</Button>
          </Form.Group>
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Village Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {villages.map(village => (
                <tr key={village._id}>
                  <td>{village.name}</td>
                  <td>
                    <Button variant="outline-secondary" onClick={() => openUpdateVillageModal(village)}>Update</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeVillageModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Village Modal */}
      {selectedVillage && (
        <Modal show={true} onHide={() => setSelectedVillage(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Village</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="updateVillageName">
              <Form.Label>Village Name</Form.Label>
              <Form.Control 
                type="text" 
                value={updateVillageName} 
                onChange={(e) => setUpdateVillageName(e.target.value)} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedVillage(null)}>Close</Button>
            <Button variant="primary" onClick={updateVillage}>Update</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default Mandal;