const express = require('express');
import {Allotment, EmployeeModel, AC} from '../../Database/allModels'; // Import Allotment model
import ErrorResponse  from '../../Utils/ErrorResponse'; // Custom error response class

const router = express.Router();

// Add new allotment route
router.post('/add-allotment', async (req, res) => {
  try {
    const { employeeId, acId} = req.body;

    // Check if the employee exists
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      throw new ErrorResponse('Employee not found', 404);
    }

    // Check if the AC exists
    const ac = await AC.findById(acId);
    if (!ac) {
      throw new ErrorResponse('AC (Assembly Constituency) not found', 404);
    }
    console.log(employeeId, acId);
    
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

module.exports = router;
  