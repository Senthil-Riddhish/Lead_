import express from "express";
import mongoose from "mongoose";
import {EmployeeModel, EmployeeGrievancesTrack, AssignedwithTrackingDocument, Allotment} from "../../Database/allModels";
import { ValidateEmployee } from "../../Validation/employeeValidation";
const router = express.Router();

router.delete('/delete-employee/:id', async (req, res) => {
  const { id } = req.params;

  // Validate the ID format
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
  if (!isValidObjectId) {
    return res.status(400).json({ message: 'Invalid employee ID' });
  }

  try { 
    // Attempt to delete the employee
    const deletedEmployee = await EmployeeModel.findByIdAndDelete(id);
    console.log(deletedEmployee, id );
    
    if (!deletedEmployee) {
      console.error('Employee not found with ID:', id);
      return res.status(404).json({ message: 'Employee not found' });
    }

    console.log('Deleted Employee:', deletedEmployee);

    // Delete any associated allotment for the employee
    const deletedAllotments = await Allotment.deleteMany({ employee: id });

    console.log('Deleted Allotments Count:', deletedAllotments.deletedCount);

    // Find related EmployeeGrievancesTrack document
    const grievancesTrack = await EmployeeGrievancesTrack.findOne({ employeeId: id });
    console.log(grievancesTrack);
    if (grievancesTrack) {
      console.log('Found GrievancesTrack:', grievancesTrack);

      const { grievanceCategories } = grievancesTrack;

      for (const category in grievanceCategories) {
        const grievanceIds = grievanceCategories[category];
        for (const grievanceId of grievanceIds) {
          // Delete documents in AssignedwithTrackingDocument referencing this grievance ID
          const deletedTrackingDocs = await AssignedwithTrackingDocument.deleteMany({
            referenceTrackingDocument: grievancesTrack._id,
            referenceGrievanceDocument: grievanceId,
          });
          console.log(
            `Deleted ${deletedTrackingDocs.deletedCount} tracking documents for grievance ID: ${grievanceId}`
          );
        }
      }

      // Delete the EmployeeGrievancesTrack document
      await EmployeeGrievancesTrack.findByIdAndDelete(grievancesTrack._id);
    }

    return res.status(200).json({
      message: 'Employee, related documents, and allotments deleted successfully',
      deletedAllotments: deletedAllotments.deletedCount,
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update employee details route
router.put('/edit-employee/:id', async (req, res) => {
  try {
    const employeeId = req.params.id;
    const updateData = { ...req.body }; // Clone the request body to avoid direct mutation

    // Remove the `_id` field from updateData
    var tempFormData = updateData
    delete tempFormData._id;
    delete tempFormData.createdAt 
    delete  tempFormData.updatedAt 
    delete  tempFormData.__v  

    // Validate the employee data using Joi
    await ValidateEmployee(tempFormData);

    // Check if the employee exists
    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        status: 'error',
        message: 'Employee not found',
      });
    }

    // Update employee details while ensuring _id is not modified
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
    if (error.isJoi) {
      // Joi validation error
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        details: error.details.map((detail) => detail.message), // Detailed validation errors
      });
    }

    // Generic error handling
    console.error('Error updating employee:', error);
    return res.status(error.statusCode || 500).json({
      status: 'error',
      message: error.message || 'Internal server error',
    });
  }
});

export default router;
  