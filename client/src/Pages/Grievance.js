import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import GrievanceRefForm from '../Components/GrievanceRef';
import CmrfForm from '../Components/CMRF';
import Jobs from '../Components/Jobs';
import Development from '../Components/Development';
import Transfer from '../Components/Transfer';
import Others from '../Components/Others';
import axios from 'axios';

const LetterRequestForm = () => {
  const [tokenInfo, setUserInfo] = useState({
    userId: '',
    role: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [acData, setAcData] = useState({});
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedAc, setSelectedAc] = useState('');
  const [selectedMandal, setSelectedMandal] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    relation: '',
    fatherName: '',
    age: '',
    aadharId: '',
    phoneNumber: '',
    letterRequired: false,
    to: '',
    purpose: '',
    acId: '',
    mandalId: '',
    villageId: ''
  });
  const location = useLocation();
  const grievanceId = location.state?.grievanceId || null;

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios.post('http://localhost:8000/auth/getTokeninfo', { token })
        .then(response => {
          const { userId, role } = response.data;
          setUserInfo({ userId, role });
          if (role === 1) {
            fetchEmployeeAcDetails(userId);
          } else if (role === 0) {
            fetchAllAcData();
          }
        })
        .catch(() => navigate('/login'));
    }
  }, [navigate]);
  useEffect(() => {
    console.log("Received grievanceId:", grievanceId);
    if (grievanceId) {
      console.log("Received grievanceId:", grievanceId);
      // Perform any actions with the grievanceId, like fetching specific grievance details
    }
  }, [grievanceId]);
  const fetchEmployeeAcDetails = async (employeeId) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/allotment/allotment/${employeeId}`);
      const allotedACId = data.allotedACId;
      const acDetails = await axios.get('http://localhost:8000/ac/getAll-ac');
      createAcMap(acDetails.data, allotedACId);
    } catch (error) {
      console.error("Error fetching AC details:", error);
    }
  };

  const fetchAllAcData = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/ac/getAll-ac');
      createAcMap(data);
    } catch (error) {
      console.error("Error fetching all AC data:", error);
    }
  };

  const createAcMap = (data, allotedACId = '') => {
    const acMap = {};
    data.data.forEach(ac => {
      acMap[ac._id] = {
        name: ac.name,
        mandals: ac.mandals.reduce((acc, mandal) => {
          acc[mandal._id] = {
            name: mandal.name,
            village: mandal.villages
          }
          return acc;
        }, {})
      };
    });
    setAcData(acMap);

    if (allotedACId && acMap[allotedACId]) {
      setSelectedAc(allotedACId);
      console.log(acMap[allotedACId].mandals);
      let arr = [];
      
      Object.entries(acMap[allotedACId].mandals).forEach(([key, value]) => {
          arr.push({
              key: key,
              value: value
          });
          console.log("Mandal ID:", key);
          console.log("Mandal Data:", value);
      });
      
      console.log(arr);
      setMandals(arr);
  }  
  };

  const handleAcChange = (e) => {
    const acId = e.target.value;
    setSelectedAc(acId);
    console.log(acData[acId]?.mandals);
    setMandals(Object.keys(acData[acId]?.mandals || {}));
    let arr = [];
      
      Object.entries(acData[acId]?.mandals).forEach(([key, value]) => {
          arr.push({
              key: key,
              value: value
          });
          console.log("Mandal ID:", key);
          console.log("Mandal Data:", value);
      });
      setMandals(arr);
    setSelectedMandal('');
    setVillages([]);
  };

  const handleMandalChange = (e) => {
    const mandalId = e.target.value;
    console.log(mandalId);
    setSelectedMandal(mandalId);
    console.log(acData[selectedAc]?.mandals[mandalId].village || []);
    setVillages(acData[selectedAc]?.mandals[mandalId].village || []);
  };

  const handleVillageChange=(e) => {
    const villageId = e.target.value;
    console.log(villageId);
    setSelectedVillage(villageId);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };  

  const handleRelationChange = (e) => {
    setFormData({ ...formData, relation: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("ac",selectedAc);
    // console.log("mandal", selectedMandal);
    // console.log("village",selectedVillage);
    // formData["acId"] = selectedAc;
    // formData["mandalId"] = selectedMandal;
    // formData["villageId"] = selectedVillage;
    console.log("Form Data to Submit:", formData);
    axios.post(
      `http://localhost:8000/grievances/${tokenInfo.userId}/${selectedCategory}/${tokenInfo.role}`,
      formData, // send formData as the request body
      {
        headers: {
          'Content-Type': 'application/json', // specify JSON content type
        },
      }
    )
    .then((response) => {
      console.log("Response:", response.data);
      setSelectedCategory('');
      setFormData({
        name: '',
        gender: '',
        relation: '',
        fatherName: '',
        age: '',
        aadharId: '',
        phoneNumber: '',
        letterRequired: false,
        to: '',
        purpose: '',
        acId: '',
        mandalId: '',
        villageId: ''
      })
    })
    .catch((error) => {
      console.log(error.status);
      console.error("Error submitting form:", error);
    });
  };

  const renderCategoryForm = () => {
    switch (selectedCategory) {
      case 'GrievanceRef':
        return <GrievanceRefForm formData={formData} onChange={setFormData} />;
      case 'CMRF':
        return <CmrfForm formData={formData} onChange={setFormData} userRole={tokenInfo.role}
        acData={acData}
        assignedAc={selectedAc}/>;
      case 'JOBS':
        return <Jobs formData={formData} onChange={setFormData} />;
      case 'DEVELOPMENT':
        return <Development
        formData={formData}
        onChange={setFormData}
        userRole={tokenInfo.role}
        acData={acData}
        assignedAc={selectedAc}
      />
      case 'Transfer':
        return <Transfer formData={formData} onChange={setFormData} />
      case 'Others':
        return <Others formData={formData} onChange={setFormData} />
      default:
        return null;
    }
  };

  const handleCategoryClick = (category) => {
    console.log(selectedCategory)
    const updatedFormData = { ...formData };
    switch (selectedCategory) {
      case 'GrievanceRef':
        delete updatedFormData['grievanceRef'];
        break;
      case 'CMRF':
        delete updatedFormData['cmrf'];
        break;
      case 'JOBS':
        delete updatedFormData['JOBS'];
        break;
      case 'DEVELOPMENT':
        delete updatedFormData['DEVELOPMENT'];
        break;
      case 'Transfer':
        delete updatedFormData['Transfer'];
        break;
      case 'Others':
        delete updatedFormData['Others'];
        break;
      default:
        console.log("No action defined for this category");
        break;
    }
    setFormData(updatedFormData);
    setSelectedCategory(category);
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <Container>
      <Row className="my-2">
        <Col>
          <h6>Current Date: {currentDate}</h6>
        </Col>
      </Row>

      <h3 className="my-4">Letter Request Form</h3>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formGender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formRelation">
              <Form.Label>Relation</Form.Label>
              <div className="d-flex">
                <Form.Check
                  type="radio"
                  label="S/O"
                  name="relation"
                  value="S/O"
                  checked={formData.relation === 'S/O'}
                  onChange={handleRelationChange}
                  inline
                />
                <Form.Check
                  type="radio"
                  label="D/O"
                  name="relation"
                  value="D/O"
                  checked={formData.relation === 'D/O'}
                  onChange={handleRelationChange}
                  inline
                />
                <Form.Check
                  type="radio"
                  label="O/O"
                  name="relation"
                  value="O/O"
                  checked={formData.relation === 'O/O'}
                  onChange={handleRelationChange}
                  inline
                />
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formFatherName">
              <Form.Label>Father's Name</Form.Label>
              <Form.Control
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formAge">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formAadharId">
              <Form.Label>Aadhar ID</Form.Label>
              <Form.Control
                type="text"
                name="aadharId"
                value={formData.aadharId}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h5>Select Category</h5>
            <div className="d-flex justify-content-between">
              {['GrievanceRef', 'CMRF', 'JOBS', 'DEVELOPMENT', 'Transfer', 'Others'].map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'primary' : 'outline-primary'}
                  onClick={() => handleCategoryClick(cat)}
                  className="me-2"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
        {tokenInfo.role === 0 ? (
  <Row className="mb-3">
    <Col md={4}>
      <Form.Group controlId="formAcSelect">
        <Form.Label>AC</Form.Label>
        <Form.Control as="select" value={selectedAc} onChange={handleAcChange}>
          <option value="">Select AC</option>
          {Object.keys(acData).map(acId => (
            <option key={acId} value={acId}>
              {acData[acId].name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </Col>
  </Row>
) : (
  <>
    <h5>Employee AC ID:</h5>
    {acData[selectedAc] ? (
      <p>{acData[selectedAc].name}</p>
    ) : (
      <p>Loading AC information...</p>
    )}
  </>
)}

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formMandalSelect">
              <Form.Label>Mandal</Form.Label>
              <Form.Control as="select" value={selectedMandal} onChange={handleMandalChange}>
                <option value="">Select Mandal</option>
                {mandals.map(mandal => (
                  <option key={mandal.key} value={mandal.key}>
                    {mandal.value.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formVillageSelect">
              <Form.Label>Village</Form.Label>
              <Form.Control as="select" value={selectedVillage} onChange={handleVillageChange}>
                <option value="">Select Village</option>
                {villages.map(village => (
                  <option key={village._id} value={village._id}>
                    {village.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        {renderCategoryForm()}
        <Row>
          <Col>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default LetterRequestForm;