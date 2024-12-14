import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LeaveManagement.css';

const LeaveManagement = ({ employeeId }) => {
    const [leaveData, setLeaveData] = useState([]);
    const [leaveHistory, setLeaveHistory] = useState([]);
    const [extraLeaves, setExtraLeaves] = useState(0);
    const [leaveType, setLeaveType] = useState('sick');
    const [leaveDate, setLeaveDate] = useState('');
    const [purpose, setPurpose] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchLeaveData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/employee/leave-data/${employeeId}`);
                setLeaveData(response.data.leaveData);
                setExtraLeaves(response.data.extraLeaves);
            } catch (err) {
                console.error('Error fetching leave data', err);
            }
        };

        const fetchLeaveHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/employee/leave-history/${employeeId}`);
                setLeaveHistory(response.data);
            } catch (err) {
                console.error('Error fetching leave history', err);
            }
        };

        fetchLeaveData();
        fetchLeaveHistory();
    }, [employeeId]);

    const handleApplyLeave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/employee/apply-leave', {
                employeeId,
                date: leaveDate,
                type: leaveType,
                purpose,
            });
            setSuccess(response.data.message);
            setError('');
            setLeaveDate('');
            setPurpose('');
            // Refetch data after successful application
            const resLeaveData = await axios.get(`http://localhost:8000/employee/leave-data/${employeeId}`);
            setLeaveData(resLeaveData.data.leaveData);
            setExtraLeaves(resLeaveData.data.extraLeaves);
            const resLeaveHistory = await axios.get(`http://localhost:8000/employee/leave-history/${employeeId}`);
            setLeaveHistory(resLeaveHistory.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error applying for leave');
            setSuccess('');
        }
    };

    const handleCancelLeave = async (leaveId) => {
        try {
            const response = await axios.put(`http://localhost:8000/employee/cancel-leave/${employeeId}/${leaveId}`);
            setSuccess(response.data.message);
            setError('');
            // Refetch data after successful application
            const resLeaveData = await axios.get(`http://localhost:8000/employee/leave-data/${employeeId}`);
            setLeaveData(resLeaveData.data.leaveData);
            setExtraLeaves(resLeaveData.data.extraLeaves);
            const resLeaveHistory = await axios.get(`http://localhost:8000/employee/leave-history/${employeeId}`);
            setLeaveHistory(resLeaveHistory.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error canceling leave');
            setSuccess('');
        }
    };

    return (
        <div className="leave-management-container">
            {/* Left Section: Apply Leave */}
            <div className="apply-leave">
                <h2>Apply for Leave</h2>
                <form onSubmit={handleApplyLeave}>
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={leaveDate}
                            onChange={(e) => setLeaveDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Leave Type</label>
                        <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required>
                            <option value="sick">Sick Leave</option>
                            <option value="casual">Casual Leave</option>
                            <option value="extra">Extra Leave</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Purpose</label>
                        <textarea
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">Apply Leave</button>
                </form>
                {success && <p className="success-message">{success}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>

            {/* Right Section: Leave Data */}
            <div className="leave-data">
                <h2>Leave Data</h2>
                {leaveData.length > 0 ? (
                    <table className="leave-table">
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Sick Leave</th>
                                <th>Casual Leave</th>
                                <th>Total Leave Left</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveData.map((data) => (
                                <tr key={`${data.month}-${data.year}`}>
                                    <td>{data.month}</td>
                                    <td>{data.sickLeave}</td>
                                    <td>{data.casualLeave}</td>
                                    <td>{data.totalLeaveLeft}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-message">No leave data available</p>
                )}
                <h3>Extra Leaves: {extraLeaves}</h3>

                <h2>Leave History</h2>
                {leaveHistory.length > 0 ? (
                    <table className="leave-history-table">
                        <thead>
                            <tr>
                                <th>Leave Date</th>
                                <th>Type</th>
                                <th>Purpose</th>
                                <th>Approved</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaveHistory.map((leave, index) => (
                                <tr key={index}>
                                    <td>{new Date(leave.date).toLocaleDateString()}</td>
                                    <td>{leave.type}</td>
                                    <td>{leave.purpose}</td>
                                    <td>{leave.approved}</td>
                                    <td>
                                        {leave.approved === 'NOT YET APPROVED' && (
                                            <button
                                                onClick={() => handleCancelLeave(leave._id)}
                                                className="cancel-button"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="empty-message">No leave history available</p>
                )}
            </div>
        </div>
    );
};

export default LeaveManagement;