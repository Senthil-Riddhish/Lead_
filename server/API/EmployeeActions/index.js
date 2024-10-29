import express from "express";
import {EmployeeModel} from "../../Database/allModels";
import { ValidateEmployee } from "../../Validation/employeeValidation";
const router = express.Router();

// Update employee details route
router.put('/edit-employee/:id', async (req, res) => {
  try {
    // Validate the employee data using Joi
    await ValidateEmployee(req.body);
    
    const employeeId = req.params.id;
    const updateData = req.body;

    // Check if the employee exists
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found',
      });
    }

    // Update employee details
    Object.keys(updateData).forEach((key) => {
      employee[key] = updateData[key];
    });

    // Save updated employee details to the database
    const updatedEmployee = await employee.save();

    // Return success response with updated employee data
    return res.status(200).json({
      status: 'success',
      message: 'Employee details updated successfully!',
      employee: updatedEmployee,
    });

  } catch (error) {
    // Check if the error is a Joi validation error
    if (error.isJoi) {
      // Send a specific status code for validation errors
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map((detail) => detail.message), // Provides detailed validation errors
      });
    }
    // Handle other errors
    console.log(error);
    return res.status(error.statusCode || 500).json({
      message: error.message || 'Internal server error',
    });
  }
});

  export default router;
