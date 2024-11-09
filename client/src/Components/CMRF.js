import React, { useState, useEffect }  from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CMRF = ({
  formData = {
    cmrf: {
      patientName: '',
      relation: '',
      fatherName: '',
      patientAadharId: '',
      patientPhoneNumber: '',
      address: '',
      hospitalName: '',
      disease: '',
      dateOfAdmission: '',
      dateOfDischarge: '',
      totalAmount: '',
      ac: '',
      mandal: '',
      village: ''
    }
  },
  onChange,
  userRole,
  acData,
  assignedAc
}) => {
  const [selectedAc, setSelectedAc] = useState(userRole === 0 ? '' : assignedAc);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    if (userRole === 1 && assignedAc) {
      const selectedAcMandals = acData[assignedAc]?.mandals || {};
      setMandals(Object.entries(selectedAcMandals).map(([mandalId, mandalInfo]) => ({
        id: mandalId,
        name: mandalInfo.name,
        villages: mandalInfo.village || []
      })));
      onChange({
        ...formData,
        cmrf: {
          ...formData.cmrf,
          ac: assignedAc,
          mandal: '',
          village: ''
        }
      });
    }
  }, [assignedAc, acData, userRole]);

  const handleAcChange = (event) => {
    const acId = event.target.value;
    setSelectedAc(acId);

    const selectedAcMandals = acData[acId]?.mandals || {};
    setMandals(Object.entries(selectedAcMandals).map(([mandalId, mandalInfo]) => ({
      id: mandalId,
      name: mandalInfo.name,
      villages: mandalInfo.village || []
    })));

    onChange({
      ...formData,
      cmrf: {
        ...formData.cmrf,
        ac: acId,
        mandal: '',
        village: ''
      }
    });
    setVillages([]); // Reset villages when AC changes
  };

  const handleMandalChange = (event) => {
    const mandalId = event.target.value;

    const selectedMandal = mandals.find(m => m.id === mandalId);
    setVillages(selectedMandal ? selectedMandal.villages : []); // Set villages if mandal is found

    onChange({
      ...formData,
      cmrf: {
        ...formData.cmrf,
        mandal: mandalId,
        village: ''
      }
    });
  };

  const handleVillageChange = (event) => {
    const villageId = event.target.value;

    onChange({
      ...formData,
      cmrf: {
        ...formData.cmrf,
        village: villageId
      }
    });
  }
  return (
  <Form>
    {/* Patient Details */}
    <h5>Patient Details</h5>
    <Row className="mb-3">
        {userRole === 0 && (
          <Col md={12}>
            <Form.Group controlId="ac-select">
              <Form.Label>Select AC</Form.Label>
              <Form.Control as="select" value={formData.cmrf?.ac || ''} onChange={handleAcChange}>
                <option value="">Select AC</option>
                {Object.entries(acData).map(([acId, acInfo]) => (
                  <option key={acId} value={acId}>
                    {acInfo.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        )}
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="mandal-select">
            <Form.Label>Select Mandal</Form.Label>
            <Form.Control
              as="select"
              value={formData.cmrf?.mandal || ''}
              onChange={handleMandalChange}
              disabled={!selectedAc && userRole === 0}
            >
              <option value="">Select Mandal</option>
              {mandals.map((mandal) => (
                <option key={mandal.id} value={mandal.id}>
                  {mandal.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={12}>
          <Form.Group controlId="village-select">
            <Form.Label>Select Village</Form.Label>
            <Form.Control
              as="select"
              value={formData.cmrf?.village || ''}
              onChange={handleVillageChange}
              disabled={!formData.cmrf?.mandal}
            >
              <option value="">Select Village</option>
              {villages.map((village) => (
                <option key={village._id} value={village._id}>
                  {village.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    <Row>
      <Col md={4}>
        <Form.Group controlId="patientName">
          <Form.Label>Patient Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter patient name"
            value={formData.cmrf?.patientName || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  patientName: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
  <Form.Group controlId="relation">
    <Form.Label>Relation</Form.Label>
    <Form.Control
      as="select"
      value={formData.cmrf?.relation || ''}
      onChange={(e) =>
        onChange({
          ...formData,
          cmrf: {
            ...formData.cmrf,
            relation: e.target.value
          }
        })
      }
    >
      <option value="" disabled>Select Relation</option>
      <option value="S/O">S/O</option>
      <option value="D/O">D/O</option>
      <option value="O/O">O/O</option>
    </Form.Control>
  </Form.Group>
</Col>
      <Col md={4}>
        <Form.Group controlId="fatherName">
          <Form.Label>Father's Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter father's name"
            value={formData.cmrf?.fatherName || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  fatherName: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="aadharCard">
          <Form.Label>Aadhar Card</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Aadhar card number"
            value={formData.cmrf?.patientAadharId || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  patientAadharId: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
  <Form.Group controlId="phoneNumber">
    <Form.Label>Phone Number</Form.Label>
    <Form.Control
      type="tel"
      placeholder="Enter phone number"
      value={formData.cmrf?.patientPhoneNumber || ''} // Corrected key
      onChange={(e) =>
        onChange({
          ...formData,
          cmrf: {
            ...formData.cmrf,
            patientPhoneNumber: e.target.value // Corrected key
          }
        })
      }
    />
  </Form.Group>
</Col>
      <Col md={4}>
        <Form.Group controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter address"
            value={formData.cmrf?.address || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  address: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
    </Row>

    {/* Hospital Details */}
    <h5 className="mt-4">Hospital Details</h5>
    <Row>
      <Col md={4}>
        <Form.Group controlId="hospitalName">
          <Form.Label>Hospital Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter hospital name"
            value={formData.cmrf?.hospitalName || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  hospitalName: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="disease">
          <Form.Label>Disease Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter disease name"
            value={formData.cmrf?.disease || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  disease: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="dateOfAdmission">
          <Form.Label>Date of Admission</Form.Label>
          <Form.Control
            type="date"
            value={formData.cmrf?.dateOfAdmission || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  dateOfAdmission: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="dateOfDischarge">
          <Form.Label>Date of Discharge</Form.Label>
          <Form.Control
            type="date"
            value={formData.cmrf?.dateOfDischarge || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  dateOfDischarge: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId="totalAmount">
          <Form.Label>Total Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter total amount"
            value={formData.cmrf?.totalAmount || ''}
            onChange={(e) =>
              onChange({
                ...formData,
                cmrf: {
                  ...formData.cmrf,
                  totalAmount: e.target.value
                }
              })
            }
          />
        </Form.Group>
      </Col>
    </Row>
  </Form>
  );
};

export default CMRF;