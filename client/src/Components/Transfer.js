import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const Transfer = ({ formData = { Transfer: {} }, onChange }) => {
    const [selectedOption, setSelectedOption] = useState(formData.Transfer?.option || '');
    
    // UseEffect to update form data only when the option changes
    useEffect(() => {
        // Prevent unnecessary updates if selectedOption hasn't changed
        if (formData.Transfer?.option !== selectedOption) {
            if (selectedOption === 'retention') {
                onChange({
                    ...formData,
                    Transfer: {
                        option: 'retention',
                        retentionStartedAt: formData.Transfer?.retentionStartedAt || '', // Retain relevant field
                    }
                });
            } else if (selectedOption === 'transfer') {
                onChange({
                    ...formData,
                    Transfer: {
                        option: 'transfer',
                        from: formData.Transfer?.from || '',
                        to: formData.Transfer?.to || '',
                    }
                });
            } else if (selectedOption === 'recommendation' || selectedOption === 'new_post_recommendation') {
                onChange({
                    ...formData,
                    Transfer: {
                        option: selectedOption,
                        at: formData.Transfer?.at || '',
                        positionDesignation: formData.Transfer?.positionDesignation || '',
                    }
                });
            }
        }
    }, [selectedOption, formData, onChange]);  // Depend on selectedOption to prevent infinite loops

    // Handle radio button change
    const handleOptionChange = (event) => {
        const { value } = event.target;
        setSelectedOption(value);
    };

    // Handle input change for text fields
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onChange({
            ...formData,
            Transfer: {
                ...formData.Transfer,
                [name]: value
            }
        });
    };

    return (
        <Form>
            <Row className="mb-3">
                <Col md={12}>
                    <Form.Label>Transfer Options</Form.Label>
                    <Form.Group>
                        <Form.Check
                            type="radio"
                            label="Transfer"
                            value="transfer"
                            checked={selectedOption === 'transfer'}
                            onChange={handleOptionChange}
                            name="transferOption"
                        />
                        <Form.Check
                            type="radio"
                            label="Retention"
                            value="retention"
                            checked={selectedOption === 'retention'}
                            onChange={handleOptionChange}
                            name="transferOption"
                        />
                        <Form.Check
                            type="radio"
                            label="Recommendation"
                            value="recommendation"
                            checked={selectedOption === 'recommendation'}
                            onChange={handleOptionChange}
                            name="transferOption"
                        />
                        <Form.Check
                            type="radio"
                            label="New Post Recommendation"
                            value="new_post_recommendation"
                            checked={selectedOption === 'new_post_recommendation'}
                            onChange={handleOptionChange}
                            name="transferOption"
                        />
                    </Form.Group>
                </Col>
            </Row>

            {/* Conditional Fields based on selected option */}
            {selectedOption === 'transfer' && (
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="from">
                            <Form.Label>From</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="From"
                                name="from"
                                value={formData.Transfer?.from || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="to">
                            <Form.Label>To</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="To"
                                name="to"
                                value={formData.Transfer?.to || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            )}

            {selectedOption === 'retention' && (
                <Row className="mb-3">
                    <Col md={12}>
                        <Form.Group controlId="retentionStartedAt">
                            <Form.Label>Retention Started At</Form.Label>
                            <Form.Control
                                type="date"
                                name="retentionStartedAt"
                                value={formData.Transfer?.retentionStartedAt || ''}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            )}

            {(selectedOption === 'recommendation' || selectedOption === 'new_post_recommendation') && (
                <>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="at">
                                <Form.Label>At</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="At"
                                    name="at"
                                    value={formData.Transfer?.at || ''}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="positionDesignation">
                                <Form.Label>Position Designation</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Position Designation"
                                    name="positionDesignation"
                                    value={formData.Transfer?.positionDesignation || ''}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </>
            )}
        </Form>
    );
};

export default Transfer;