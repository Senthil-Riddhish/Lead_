import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const Transfer = ({ formData, onChange }) => {
    const [selectedOption, setSelectedOption] = useState('');
    
    // Handle radio button change
    const handleOptionChange = (event) => {
        const { value } = event.target;
        setSelectedOption(value);
        onChange({ ...formData, option: value }); // Update parent formData with selected option
    };

    // Handle input change for text fields
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        onChange({ ...formData, [name]: value });
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
                                value={formData.from || ''}
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
                                value={formData.to || ''}
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
                                value={formData.retentionStartedAt || ''}
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
                                    value={formData.at || ''}
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
                                    value={formData.positionDesignation || ''}
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