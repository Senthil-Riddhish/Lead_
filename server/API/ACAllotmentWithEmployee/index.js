const express = require('express');
import {Allotment, EmployeeModel, AC} from '../../Database/allModels'; // Import Allotment model
const router = express.Router();

// Add new allotment route
router.post('/add-allotment', async (req, res) => {
  try {
    const { employeeId, acId } = req.body;

    // Check if the employee exists
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Check if the AC exists
    const ac = await AC.findById(acId);
    if (!ac) {
      return res.status(404).json({ message: 'AC (Assembly Constituency) not found' });
    }

    // Check if the employee has already been assigned to the same AC
    const existingAllotment = await Allotment.findOne({ employee: employeeId, ac: acId });
    if (existingAllotment) {
      return res.status(403).json({ 
        message: `EMPLOYEE '${employee.name}' HAS ALREADY BEEN ASSIGNED WITH ${ac.name}` 
      });
    }

    // Create new allotment
    const newAllotment = new Allotment({
      employee: employeeId,
      ac: acId
    });

    // Save to database
    await newAllotment.save();

    // Return success response
    return res.status(200).json({ 
      status: 'success', 
      message: 'Allotment created successfully!', 
      allotment: newAllotment 
    });

  } catch (error) {
    // Handle validation or other errors
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error'
    });
  }
});

// Get all employees route
router.get('/getAll-employees', async (req, res) => {
  try {
    // Fetch all employees from the database excluding the password field
    const employees = await EmployeeModel.find({}, { password: 0 });

    // Check if employees are found
    if (employees.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No employees found'
      });
    }

    // Return success response with employee data
    return res.status(200).json({
      status: 'success',
      message: 'Employees retrieved successfully',
      employees: employees
    });

  } catch (error) {
    // Handle validation or other errors
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error'
    });
  }
});

router.get('/allotments', async (req, res) => {
  try {
    const allotments = await Allotment.find();
    if (allotments.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No allotments found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Allotments retrieved successfully',
      allotments: allotments
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error'
    });
  }
});

// Route to get the AC ID based on employee ID
router.get('/allotment/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Find the allotment for the specified employee ID
    const allotment = await Allotment.findOne({ employee: employeeId }); // Populate AC details if needed

    // Check if the allotment exists
    if (!allotment) {
      return res.status(404).json({ message: 'No allotment found for the specified employee' });
    }
    console.log(allotment);
    // Respond with the AC ID and additional AC information
    return res.status(200).json({
      status: 'success',
      allotedACId: allotment.ac
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error'
    });
  }
});


module.exports = router;
  