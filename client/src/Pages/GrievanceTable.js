import React, { useEffect, useState } from 'react';
import { Table, Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import JsonToPdf from './PDFView';
import { useNavigate } from 'react-router-dom';

const GrievanceTable = () => {
  const [grievanceCategories, setGrievanceCategories] = useState([]);
  const [grievances, setGrievances] = useState({});
  const [allGrievances, setAllGrievances] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [acData, setAcData] = useState({});
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedAc, setSelectedAc] = useState('');
  const [selectedMandal, setSelectedMandal] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [isAcAllocated, setIsAcAllocated] = useState(true);
  const [token, setToken] = useState('');
  const [acMap, setAcMap] = useState(new Map());
  const [mandalMap, setMandalMap] = useState(new Map());
  const [villageMap, setVillageMap] = useState(new Map());  
  const [tokenInfo, setUserInfo] = useState({
    userId: '',
    role: ''
  });

  const navigate = useNavigate();
  useEffect(() => {
    const initializePage = async () => {
      try {
        const token = sessionStorage.getItem('token');
        console.log(token);
        if (!token) {
          navigate('/login');
        } else {
          const tokenResponse = await axios.post('http://localhost:8000/auth/getTokeninfo', { token });
          const { userId, role } = tokenResponse.data;
          setUserInfo({ userId, role });
          fetchGrievances(userId, role);
          if (role === 1) {
            await fetchEmployeeAcDetails(userId);
          } else if (role === 0) {
            await fetchAllAcData();
          }
        }
      } catch (error) {
        console.error('Error initializing page:', error);
        navigate('/login');
      } finally {
        setLoading(false); // Set loading to false after all requests complete
      }
    };

    initializePage();
  }, [navigate]);
  const fetchAllACMandalVillageData = (jsonData) => {
    const acMapTemp = new Map();
    const mandalMapTemp = new Map();
    const villageMapTemp = new Map();
  
    // Populate temporary maps
    jsonData.data.forEach(ac => {
      acMapTemp.set(ac._id, ac.name);
      ac.mandals.forEach(mandal => {
        mandalMapTemp.set(mandal._id, mandal.name);
        mandal.villages.forEach(village => {
          villageMapTemp.set(village._id, village.name);
        });
      });
    });
  
    // Update state with the populated maps
    setAcMap(acMapTemp);
    setMandalMap(mandalMapTemp);
    setVillageMap(villageMapTemp);
  
    // Log to verify
    console.log("AC Map:", acMapTemp);
    console.log("Mandal Map:", mandalMapTemp);
    console.log("Village Map:", villageMapTemp);
  };  
  const fetchEmployeeAcDetails = async (employeeId) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/allotment/employee-allotment/${employeeId}`);
      const allotedACId = data.allotedACId;

      if (!allotedACId) {
        setIsAcAllocated(false);
        return;
      }

      const acDetails = await axios.get('http://localhost:8000/ac/getAll-ac');
      fetchAllACMandalVillageData(acDetails.data)
      createAcMap(acDetails.data, allotedACId);
    } catch (error) {
      console.error('Error fetching AC details:', error);
      setIsAcAllocated(false);
    }
  };

  const fetchAllAcData = async (allotedACId = '', allocatedMandalId = '', allocatedVillageId = '') => {
    try {
      const { data } = await axios.get('http://localhost:8000/ac/getAll-ac');
      fetchAllACMandalVillageData(data);
      createAcMap(data, allotedACId, allocatedMandalId, allocatedVillageId);
    } catch (error) {
      console.error('Error fetching all AC data:', error);
    }
  };


  const createAcMap = (data, allotedACId = '', allocatedMandalId = '', allocatedVillageId = '') => {
    const acMap = {};
    data.data.forEach((ac) => {
      acMap[ac._id] = {
        name: ac.name,
        mandals: ac.mandals.reduce((acc, mandal) => {
          acc[mandal._id] = {
            name: mandal.name,
            village: mandal.villages
          };
          return acc;
        }, {})
      };
    });
    setAcData(acMap);
    if (allotedACId && acMap[allotedACId]) {
      setSelectedAc(allotedACId);
      setMandals(Object.entries(acMap[allotedACId].mandals).map(([key, value]) => ({ key, value })));
    }
  };

  const handleAcChange = (e) => {
    const acId = e.target.value;
    setSelectedAc(acId);
    console.log("selected ac : ", selectedAc);
    if (acId) {
      setMandals(Object.keys(acData[acId]?.mandals || {}));
      let arr = [];
      Object.entries(acData[acId]?.mandals).forEach(([key, value]) => {
        arr.push({
          key: key,
          value: value
        });
      });
      setMandals(arr);
      setSelectedMandal('');
      setVillages([]);
    } else {
      setMandals([]);
      setVillages([]);
    }
  };

  const handleMandalChange = (e) => {
    const mandalId = e.target.value;
    console.log(mandalId);
    setSelectedMandal(mandalId);
    if (mandalId) {
      setVillages(acData[selectedAc]?.mandals[mandalId].village || []);
    } else {
      setVillages([]);
    }
  };

  const handleTokenChange = (e) => {
    setToken(e.target.value); // Update state on input change
  };

  const handleVillageChange = (e) => {
    const villageId = e.target.value;
    setSelectedVillage(villageId);
  }

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
  };

  const fetchGrievances = async (userId, role) => {
    try {
      const response = await fetch(`http://localhost:8000/grievances/getdocuments/${userId}/${role}`);
      if (!response.ok) {
        throw new Error('Failed to fetch grievances');
      }
      const data = await response.json();
      setGrievances(data.grievanceCategories);
      setAllGrievances(data.grievanceCategories);
      // Extract keys and update the grievanceCategories state
      const categories = Object.keys(data.grievanceCategories);
      setGrievanceCategories(categories);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          Error: {error}
        </Alert>
      </Container>
    );
  }

  const handleEdit = (grievanceId) => {
    navigate('/grievances', { state: { grievanceId } });
  };

  const deleteEdit = async (grievanceId, category) => {
    try {
      console.log(grievanceId, category);

      // Call the delete API
      const response = await axios.get(`http://localhost:8000/grievances/delete-grievance/${grievanceId}`);
      if (response.status === 200) {
        console.log("Grievance deleted successfully:", grievanceId);

        // Update the grievances state by removing the deleted grievance from the specific category
        setGrievances((prevGrievances) => {
          const updatedCategory = prevGrievances[category].filter(
            (grievance) => grievance._id !== grievanceId
          );

          return {
            ...prevGrievances,
            [category]: updatedCategory,
          };
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Successfully Deleted",
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        console.error("Failed to delete grievance:", response.data.message);
      }
    } catch (error) {
      console.error("EFrror while deleting grievance:", error);
    }
  };

  const renderGrievanceRows = (grievanceCategory) => {
    return grievanceCategory.map((grievance, index) => (
      <tr key={index}>
        <td>{grievance.category}</td>
        <td>{grievance.token}</td>
        <td>{grievance.name}</td>
        <td>{acMap.get(grievance.acId)}</td>
        <td>{mandalMap.get(grievance.mandalId)}</td>
        <td>{villageMap.get(grievance.villageId)}</td>
        <td>{grievance.phoneNumber}</td>
        <td>
          <Button
            variant="primary"
            onClick={() => handleEdit(grievance._id)}
          >
            Edit
          </Button>
        </td>
        <td>
          <Button
            variant="primary"
            onClick={() => deleteEdit(grievance._id, grievance.category)}
          >
            Delete
          </Button>
        </td>
        <td>
          <JsonToPdf jsonData={grievance} acName={acMap} mandalName={mandalMap} villageName={villageMap}/>
        </td>
      </tr>
    ));
  };

  const handleButtonClick = () => {
    console.log("grievances : ", grievances);
    console.log("Token : ", token);
    console.log("Category : ", selectedCategory);
    console.log("AC : ", selectedAc);
    console.log("Mandal : ", selectedMandal);
    console.log("Village : ", selectedVillage);

    // Flatten all grievance arrays from the category keys
    console.log(allGrievances);
    const allGrievancesjson = Object.values(allGrievances).flat();
    // Filtering logic
    console.log(allGrievancesjson);
    const filteredGrievances = allGrievancesjson.filter((doc) => {
      // Apply filters only if respective values are selected
      const matchesAc = selectedAc ? doc.acId === selectedAc : true;
      const matchesMandal = selectedMandal ? doc.mandalId === selectedMandal : true;
      const matchesVillage = selectedVillage ? doc.villageId === selectedVillage : true;
      const matchesCategory = selectedCategory ? doc.category === selectedCategory : true;
      const matchesToekn = token ? doc.token === token : true;

      // All conditions must match
      return matchesAc && matchesMandal && matchesVillage && matchesCategory && matchesToekn;
    });

    console.log("Filtered Grievances:", filteredGrievances);

    // Grouping the filtered grievances by category
    const groupedGrievances = filteredGrievances.reduce((acc, doc) => {
      const category = doc.category; // Default to "Uncategorized" if no category is found
      if (!acc[category]) {
        acc[category] = []; // Initialize the category array if it doesn't exist
      }
      acc[category].push(doc); // Add the document to the appropriate category
      return acc;
    }, {});

    // Logging the grouped grievances
    console.log("Grouped Grievances by Category:", groupedGrievances);

    // Updating the grievances state with the grouped data
    setGrievances(groupedGrievances);
  };


  return (
    <Container className="mt-5">
      <h2>Employee Grievance Records</h2>
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
              {mandals.map((mandal) => (
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
              {villages.map((village) => (
                <option key={village._id} value={village._id}>
                  {village.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formCategorySelect">
            <Form.Label>Category</Form.Label>
            <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Select Category</option>
              {grievanceCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="formTokenField">
            <Form.Label>Token</Form.Label>
            <Form.Control
              type="text"
              value={token}
              placeholder="Enter Token"
              onChange={handleTokenChange}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button variant="primary" onClick={handleButtonClick}>
            Submit
          </Button>
        </Col>
      </Row>
      {Object.keys(grievances).map((category, idx) => (
        <Row key={idx} className="mb-4">
          <Col md={12}>
            <div className="category-section">
              <h4 className="category-title">{category}</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Token</th>
                    <th>Name</th>
                    <th>AC</th>
                    <th>Mandal</th>
                    <th>Village</th>
                    <th>Phone Number</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {renderGrievanceRows(grievances[category])}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default GrievanceTable;