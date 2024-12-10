import express from "express";
import {EmployeeModel, EmployeeGrievancesTrack, AssignedwithTrackingDocument, Allotment} from "../../Database/allModels";
import { ValidateEmployee } from "../../Validation/employeeValidation";
const router = express.Router();

// Delete Employee Endpoint
router.delete('/delete-employee/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the employee
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Delete any associated allotment for the employee
    const deletedAllotments = await Allotment.deleteMany({ employee: id });

    // Find related EmployeeGrievancesTrack document
    const grievancesTrack = await EmployeeGrievancesTrack.findOne({ employeeId: id });

    if (grievancesTrack) {
      // Iterate through grievance categories and their IDs to clean up references
      const { grievanceCategories } = grievancesTrack;

      for (const category in grievanceCategories) {
        const grievanceIds = grievanceCategories[category];
        for (const grievanceId of grievanceIds) {
          // Delete documents in AssignedwithTrackingDocument referencing this grievance ID
          await AssignedwithTrackingDocument.deleteMany({
            referenceTrackingDocument: grievancesTrack._id,
            referenceGrievanceDocument: grievanceId,
          });
        }
      }

      // Delete the EmployeeGrievancesTrack document
      await EmployeeGrievancesTrack.findByIdAndDelete(grievancesTrack._id);
    }

    return res.status(200).json({
      message: 'Employee, related documents, and allotments deleted successfully',
      deletedAllotments: deletedAllotments.deletedCount, // Number of deleted allotments
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

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
