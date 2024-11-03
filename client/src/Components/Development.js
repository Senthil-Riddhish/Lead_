import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const Development = ({
    formData,
    onChange,
    userRole,
    acData,
    assignedAc
}) => {
    const [localFormData, setLocalFormData] = useState(formData);
    const [selectedAc, setSelectedAc] = useState(userRole === 0 ? '' : assignedAc); // Set AC based on role
    const [mandals, setMandals] = useState([]);
    const [villages, setVillages] = useState([]);

    // Load mandals if AC is pre-assigned (for employee)
    useEffect(() => {
        if (userRole === 1 && assignedAc) {
            const selectedAcMandals = acData[assignedAc]?.mandals || {};
            setMandals(Object.entries(selectedAcMandals).map(([mandalId, mandalInfo]) => ({
                id: mandalId,
                name: mandalInfo.name,
                villages: mandalInfo.village || []
            })));
        }
    }, [assignedAc, acData, userRole]);

    // Handle AC change for admin
    const handleAcChange = (event) => {
        const acId = event.target.value;
        setSelectedAc(acId);

        // Update the mandals based on the selected AC
        const selectedAcMandals = acData[acId]?.mandals || {};
        setMandals(Object.entries(selectedAcMandals).map(([mandalId, mandalInfo]) => ({
            id: mandalId,
            name: mandalInfo.name,
            villages: mandalInfo.village || []
        })));

        // Clear village selection when AC changes
        setLocalFormData((prevData) => ({
            ...prevData,
            ac: acId,
            mandal: '',
            village: ''
        }));
        setVillages([]); // Clear villages
    };

    // Handle Mandal change
    const handleMandalChange = (event) => {
        const mandalId = event.target.value;
        setLocalFormData((prevData) => ({
            ...prevData,
            mandal: mandalId,
            village: ''
        }));

        // Update villages based on the selected mandal
        const selectedMandal = mandals.find(m => m.id === mandalId);
        setVillages(selectedMandal ? selectedMandal.villages : []);
    };

    // Handle Village change
    const handleVillageChange = (event) => {
        const villageId = event.target.value;
        setLocalFormData((prevData) => ({
            ...prevData,
            village: villageId
        }));
    };

    // Handle Authority change
    const handleAuthorityChange = (event) => {
        const authority = event.target.value;
        setLocalFormData((prevData) => ({
            ...prevData,
            authority
        }));
    };

    // Handle Issue change
    const handleIssueChange = (event) => {
        const issue = event.target.value;
        setLocalFormData((prevData) => ({
            ...prevData,
            issue
        }));
    };

    // Handle Letter Issue change
    const handleLetterIssueChange = (event) => {
        const letterIssue = event.target.value === "yes";
        setLocalFormData((prevData) => ({
            ...prevData,
            letterIssue
        }));
    };

    // Sync localFormData with parent formData on save
    const handleSave = () => {
        onChange(localFormData);
    };

    return (
        <Form>
            <Row className="mb-3">
                {userRole === 0 && (
                    <Col md={12}>
                        <Form.Group controlId="ac-select">
                            <Form.Label>Select AC</Form.Label>
                            <Form.Control as="select" value={selectedAc} onChange={handleAcChange}>
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

            {/* Mandal Selection */}
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Group controlId="mandal-select">
                        <Form.Label>Select Mandal</Form.Label>
                        <Form.Control
                            as="select"
                            value={localFormData.mandal || ''}
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

            {/* Village Selection */}
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Group controlId="village-select">
                        <Form.Label>Select Village</Form.Label>
                        <Form.Control
                            as="select"
                            value={localFormData.village || ''}
                            onChange={handleVillageChange}
                            disabled={!localFormData.mandal}
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

            {/* Authority Field */}
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Group controlId="authority">
                        <Form.Label>Authority</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Authority"
                            value={localFormData.authority || ''}
                            onChange={handleAuthorityChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Issue Field */}
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Group controlId="issue">
                        <Form.Label>Issue</Form.Label>
                        <Form.Control
                            as="textarea"
                            placeholder="Issue"
                            value={localFormData.issue || ''}
                            onChange={handleIssueChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Letter Issue Radio Buttons */}
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Label>Letter Issue</Form.Label>
                    <Form.Group>
                        <Form.Check
                            type="radio"
                            label="Yes"
                            value="yes"
                            checked={localFormData.letterIssue === true}
                            onChange={handleLetterIssueChange}
                            name="letterIssue"
                        />
                        <Form.Check
                            type="radio"
                            label="No"
                            value="no"
                            checked={localFormData.letterIssue === false}
                            onChange={handleLetterIssueChange}
                            name="letterIssue"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
};

export default Development;