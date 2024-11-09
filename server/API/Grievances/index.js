import express from 'express';
import mongoose from 'mongoose';
import {LetterRequest, EmployeeGrievancesTrack} from  "../../Database/allModels" // Assuming the model is saved here

const router = express.Router();

// Helper function to find a document by ID
const findRequestById = async (id) => {
  return await LetterRequest.findById(id);
};

/**
 * Route to add a new request
 * POST /api/requests/:category
 */
// POST endpoint to add a new request for a specific category and track it
router.post('/:employeeId/:category/:role', async (req, res) => {
  const { employeeId, category, role } = req.params;

  // Prepare the data to be saved
  const letterRequestData = {
    name: req.body.name,
    gender: req.body.gender,
    fatherName: req.body.fatherName,
    age: req.body.age,
    aadharId: req.body.aadharId,
    phoneNumber: req.body.phoneNumber,
    letterRequired: req.body.letterRequired,
    to: req.body.letterRequired ? req.body.to : undefined,
    purpose: req.body.letterRequired ? req.body.purpose : undefined,
    category
  };

  // Validate and add grievance reference data
  switch (category) {
    case 'GrievanceRef':
      if (!req.body.grievanceRef || !req.body.grievanceRef.subject || !req.body.grievanceRef.content) {
        return res.status(400).json({ message: 'GrievanceRef data is incomplete.' });
      }
      letterRequestData.grievanceRef = req.body.grievanceRef;
      break;
    case 'Others':
      letterRequestData.others = req.body.others;
      break;
    case 'CMRF':
      letterRequestData.cmrf = req.body.cmrf;
      break;
    case 'JOBS':
      letterRequestData.jobs = req.body.JOBS;
      break;
    case 'DEVELOPMENT':
      letterRequestData.development = req.body.DEVELOPMENT;
      break;
    case 'Transfer':
      console.log("transfer");
      console.log(req.body.Transfer);
      letterRequestData["transfer"] = req.body.Transfer;
      break;
    default:
      return res.status(400).json({ message: 'Invalid category' });
  }

  // Create a new LetterRequest instance
  const letterRequest = new LetterRequest(letterRequestData);

  try {
    // Save the data to the database
    const savedLetterRequest = await letterRequest.save();
    if(role=="1"){
      // Check for existing grievance tracking for the employee
      let grievanceTracking = await EmployeeGrievancesTrack.findOne({ employeeId });

      // If it doesn't exist, create a new tracking document
      if (!grievanceTracking) {
        grievanceTracking = new EmployeeGrievancesTrack({
          employeeId,
          grievanceCategories: {}
        });
      }

      // Push the new letter request ID into the appropriate category
      if (!grievanceTracking.grievanceCategories[category]) {
        grievanceTracking.grievanceCategories[category] = [];
      }
      grievanceTracking.grievanceCategories[category].push(savedLetterRequest._id);

      // Save the tracking document
      await grievanceTracking.save();
    }
    res.status(201).json({ message: 'Letter request added successfully', letterRequest: savedLetterRequest });
  } catch (error) {
    console.error('Error adding letter request:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * Route to update an existing request
 * PUT /api/requests/:category/:id
 */
// PUT endpoint to update an existing letter request
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Prepare the updated data
  const updatedData = {
    name: req.body.name,
    gender: req.body.gender,
    fatherName: req.body.fatherName,
    age: req.body.age,
    aadharId: req.body.aadharId,
    phoneNumber: req.body.phoneNumber,
    letterRequired: req.body.letterRequired,
    to: req.body.letterRequired ? req.body.to : undefined,
    purpose: req.body.letterRequired ? req.body.purpose : undefined,
    category: req.body.category,
  };

  // Add dynamic fields based on the category
  switch (req.body.category) {
    case 'GrievanceRef':
      if (req.body.grievanceRef && req.body.grievanceRef.subject && req.body.grievanceRef.content) {
        updatedData.grievanceRef = req.body.grievanceRef; // Directly assign
      } else {
        return res.status(400).json({ message: 'GrievanceRef data is incomplete.' });
      }
      break;
    case 'CMRF':
      updatedData.cmrf = req.body.cmrf;
      break;
    case 'JOBS':
      updatedData.jobs = req.body.jobs;
      break;
    case 'DEVELOPMENT':
      updatedData.development = req.body.development;
      break;
    case 'Transfer':
      updatedData.transfer = req.body.transfer;
      break;
    case 'Others':
      updatedData.grievanceRef = req.body.grievanceRef;
      break;
    default:
      return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    // Find the letter request by ID and update it
    const updatedLetterRequest = await LetterRequest.findByIdAndUpdate(id, updatedData, { new: true });
    
    if (!updatedLetterRequest) {
      return res.status(404).json({ message: 'Letter request not found' });
    }

    res.status(200).json({ message: 'Letter request updated successfully', updatedLetterRequest });
  } catch (error) {
    console.error('Error updating letter request:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;