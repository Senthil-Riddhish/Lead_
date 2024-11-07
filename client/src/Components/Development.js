import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const Development = ({
    formData = {
        DEVELOPMENT: {
            ac: '',
            mandal: '',
            village: '',
            authority: '',
            issue: '',
            letterIssue: false,
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
            DEVELOPMENT: {
                ...formData.DEVELOPMENT,
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
            DEVELOPMENT: {
                ...formData.DEVELOPMENT,
                mandal: mandalId,
                village: ''
            }
        });
    };

    const handleVillageChange = (event) => {
        const villageId = event.target.value;

        onChange({
            ...formData,
            DEVELOPMENT: {
                ...formData.DEVELOPMENT,
                village: villageId
            }
        });
    };

    const handleAuthorityChange = (event) => {
        const authority = event.target.value;

        onChange({
            ...formData,
            DEVELOPMENT: {
                ...formData.DEVELOPMENT,
                authority
            }
        });
    };

    const handleIssueChange = (event) => {
        const issue = event.target.value;

        onChange({
            ...formData,
            DEVELOPMENT: {
                ...formData.DEVELOPMENT,
                issue
            }
        });
    };

    const handleLetterIssueChange = (event) => {
        const letterIssue = event.target.value === "yes";

        onChange({
            ...formData,
            DEVELOPMENT: {
                ...formData.DEVELOPMENT,
                letterIssue
            }
        });
    };

    return (
        <Form>
            <Row className="mb-3">
                {userRole === 0 && (
                    <Col md={12}>
                        <Form.Group controlId="ac-select">
                            <Form.Label>Select AC</Form.Label>
                            <Form.Control as="select" value={formData.DEVELOPMENT?.ac || ''} onChange={handleAcChange}>
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
                            value={formData.DEVELOPMENT?.mandal || ''}
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
                            value={formData.DEVELOPMENT?.village || ''}
                            onChange={handleVillageChange}
                            disabled={!formData.DEVELOPMENT?.mandal}
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

            <Row className="mb-3">
                <Col md={12}>
                    <Form.Group controlId="authority">
                        <Form.Label>Authority</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Authority"
                            value={formData.DEVELOPMENT?.authority || ''}
                            onChange={handleAuthorityChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={12}>
                    <Form.Group controlId="issue">
                        <Form.Label>Issue</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Issue"
                            value={formData.DEVELOPMENT?.issue || ''}
                            onChange={handleIssueChange}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col md={12}>
                    <Form.Group controlId="letter-issue">
                        <Form.Label>Letter Issue</Form.Label>
                        <Form.Control as="select" value={formData.DEVELOPMENT?.letterIssue ? "yes" : "no"} onChange={handleLetterIssueChange}>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
};

export default Development;