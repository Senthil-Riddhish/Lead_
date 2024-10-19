import jwt from 'jsonwebtoken';

// Function to generate JWT token
const generateJwtToken = (userId, role) => {
    return jwt.sign({ user: userId, role }, "LeadContactByElection");
};

export default generateJwtToken;
