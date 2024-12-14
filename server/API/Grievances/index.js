import express from 'express';
import mongoose from 'mongoose';
import { LetterRequest, EmployeeGrievancesTrack, AssignedwithTrackingDocument,EmployeeModel, AC } from "../../Database/allModels" // Assuming the model is saved here
const router = express.Router();
/**
 * Route to add a new request
 * POST /api/requests/:category
 */
// POST endpoint to add a new request for a specific category and track it
router.post('/:employeeId/:category/:role', async (req, res) => {
  const { employeeId, category, role } = req.params;

  // Validate parameters
  if (!mongoose.Types.ObjectId.isValid(employeeId)) {
    return res.status(400).json({ message: 'Invalid employeeId' });
  }

  const validCategories = ['GrievanceRef', 'CMRF', 'JOBS', 'DEVELOPMENT', 'Transfer', 'Others'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    // Create a new LetterRequest instance
    const letterRequest = new LetterRequest(req.body);
    const savedLetterRequest = await letterRequest.save();

    if (role === "1") {
      // Check or create grievance tracking for the employee
      let grievanceTracking = await EmployeeGrievancesTrack.findOne({ employeeId });

      if (!grievanceTracking) {
        grievanceTracking = new EmployeeGrievancesTrack({
          employeeId,
          grievanceCategories: {}
        });
      }

      // Update the appropriate category
      if (!grievanceTracking.grievanceCategories[category]) {
        grievanceTracking.grievanceCategories[category] = [];
      }
      grievanceTracking.grievanceCategories[category].push(savedLetterRequest._id);
      await grievanceTracking.save();

      // Create and save AssignedwithTrackingDocument
      const assignWithTrackingDocument = new AssignedwithTrackingDocument({
        referenceGrievanceDocument: savedLetterRequest._id,
        referenceTrackingDocument: grievanceTracking._id
      });
      await assignWithTrackingDocument.save();
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
  console.log("put request");

  try {
    // Fetch the existing LetterRequest document
    const alreadyStoredDocument = await LetterRequest.findById(id);

    if (!alreadyStoredDocument) {
      return res.status(404).json({ message: "Document not Found" });
    }
    855
    // Check if `acId` has changed
    if (alreadyStoredDocument.acId != req.body.acId) {
      // Find the AssignedwithTrackingDocument associated with this LetterRequest
      const assignedTrackingDoc = await AssignedwithTrackingDocument.findOne({
        referenceGrievanceDocument: id,
      });

      if (assignedTrackingDoc) {
        // Find the EmployeeGrievancesTrack document referenced by `referenceTrackingDocument`
        const grievanceTracking = await EmployeeGrievancesTrack.findById(
          assignedTrackingDoc.referenceTrackingDocument
        );

        if (grievanceTracking) {
          // Remove the `id` from the old category array
          const categoryArray =
            grievanceTracking.grievanceCategories[alreadyStoredDocument.category] || [];
          grievanceTracking.grievanceCategories[alreadyStoredDocument.category] = categoryArray.filter(
            (docId) => docId.toString() !== id
          );

          // Save the updated grievance tracking document
          await grievanceTracking.save();
        }

        // Optionally, you might also want to delete the AssignedwithTrackingDocument if necessary
        await AssignedwithTrackingDocument.deleteOne({
          referenceGrievanceDocument: id,
        });
      }
    } else if (alreadyStoredDocument.category != req.body.category) {
      console.log("category not common");
      const assignedTrackingDoc = await AssignedwithTrackingDocument.findOne({
        referenceGrievanceDocument: id,
      });

      if (assignedTrackingDoc) {
        // Find the EmployeeGrievancesTrack document referenced by `referenceTrackingDocument`
        const grievanceTracking = await EmployeeGrievancesTrack.findById(
          assignedTrackingDoc.referenceTrackingDocument
        );
        if (grievanceTracking) {
          console.log("grievanceTracking : ", grievanceTracking);

          // Remove the `id` from the old category array
          const oldCategoryArray =
            grievanceTracking.grievanceCategories[alreadyStoredDocument.category] || [];
          console.log("oldCategoryArray : ", oldCategoryArray);
          grievanceTracking.grievanceCategories[alreadyStoredDocument.category] = oldCategoryArray.filter(
            (docId) => docId.toString() !== id
          );

          // Add the `id` to the new category array
          if (!grievanceTracking.grievanceCategories[req.body.category]) {
            grievanceTracking.grievanceCategories[req.body.category] = [];
          }
          grievanceTracking.grievanceCategories[req.body.category].push(id);

          // Save the updated grievance tracking document
          await grievanceTracking.save();
        }
      }
    }
    const [, , count] = req.body.token.split('/'); // Extract count from the token
    // Generate the current date in the format YYYY-MM-DD
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0];

    // Generate the updated token with the new category and current date
    const updatedToken = `${req.body.category}/${formattedDate}/${count}`;
    req.body.token = updatedToken;
    // Replace the old document with the new data
    await LetterRequest.replaceOne({ _id: id }, req.body);

    res.status(200).json({ message: "Successfully Updated" });
  } catch (error) {
    console.error("Error updating letter request:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

router.get('/getdocuments/:employeeId/:role', async (req, res) => {
  const { employeeId, role } = req.params;
  console.log(employeeId, role);

  try {
    if (role === '0') {
      // Role 0: Fetch all documents from LetterRequest and categorize them
      const letterRequests = await LetterRequest.find();

      // Initialize categorized object
      const categorizedGrievances = {
        GrievanceRef: [],
        CMRF: [],
        JOBS: [],
        DEVELOPMENT: [],
        Transfer: [],
        Others: []
      };

      // Categorize documents based on the 'category' field
      letterRequests.forEach((doc) => {
        const category = doc.category;
        if (categorizedGrievances[category]) {
          categorizedGrievances[category].push(doc);
        } else {
          console.log("Dosent match with any category");
          //categorizedGrievances.Others.push(doc); // Default to "Others" if category doesn't match
        }
      });

      return res.json({
        employeeId,
        grievanceCategories: categorizedGrievances
      });
    } else {
      // Default functionality for other roles
      const employeeGrievances1 = await EmployeeGrievancesTrack.findOne({ employeeId })
      console.log(employeeGrievances1);
      if(!employeeGrievances1) {
        return res.status(200).json({grievanceCategories: {}})
      }

      const employeeGrievances = await EmployeeGrievancesTrack.findOne({ employeeId })
        .populate('grievanceCategories.GrievanceRef')
        .populate('grievanceCategories.CMRF')
        .populate('grievanceCategories.JOBS')
        .populate('grievanceCategories.DEVELOPMENT')
        .populate('grievanceCategories.Transfer')
        .populate('grievanceCategories.Others');

      if (!employeeGrievances) {
        return res.status(404).json({ message: 'Grievances not found for this employee' });
      }
      console.log("employeeGrievances : ",employeeGrievances);
      res.json(employeeGrievances);
    }
  } catch (error) {
    console.error('Error retrieving grievances:', error);
    return res.status(500).json({ message: 'Error retrieving grievances' });
  }
});


// GET endpoint to retrieve an existing letter request by ID
router.get('/getdocument/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Find the letter request by ID
    const letterRequest = await LetterRequest.findById(id);

    if (!letterRequest) {
      return res.status(404).json({ message: 'Letter request not found' });
    }

    // Return the letter request data
    res.status(200).json({ message: 'Letter request retrieved successfully', letterRequest });
  } catch (error) {
    console.error('Error retrieving letter request:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE Grievance Router
router.get('/delete-grievance/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // Step 1: Find and delete the grievance document in LetterRequest
    const grievanceDoc = await LetterRequest.findByIdAndDelete(id);
    if (!grievanceDoc) {
      console.log(grievanceDoc);
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Step 2: Find and delete the related document in AssignedwithTrackingDocument
    const trackingDoc = await AssignedwithTrackingDocument.findOneAndDelete({ referenceGrievanceDocument: id });
    if (!trackingDoc) {
      return res.status(404).json({ message: 'Assigned tracking document not found' });
    }

    // Step 3: Find the EmployeeGrievancesTrack document using referenceTrackingDocument
    const employeeTrackDoc = await EmployeeGrievancesTrack.findById(trackingDoc.referenceTrackingDocument);
    if (!employeeTrackDoc) {
      return res.status(404).json({ message: 'Employee grievance track document not found' });
    }

    // Step 4: Remove the grievance ID from the corresponding grievance category
    const { category } = grievanceDoc; // Get category from the deleted grievance
    if (employeeTrackDoc.grievanceCategories[category]) {
      employeeTrackDoc.grievanceCategories[category] = employeeTrackDoc.grievanceCategories[category].filter(
        (grievanceId) => grievanceId.toString() !== id
      );

      // Save the updated EmployeeGrievancesTrack document
      await employeeTrackDoc.save();
    }

    return res.status(200).json({ message: 'Grievance and related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting grievance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Consolidated API route
router.get('/consolidated-data/:userId/:role', async (req, res) => {
  const { userId, role } = req.params;

  try {
    if (role === '0') {
      // Role 0: Fetch all ACs, all employees, and categorized documents

      // Fetch all AC records
      const getAllAC = await AC.find() || [];

      // Fetch all employees excluding password
      const employees = await EmployeeModel.find({}, { password: 0 }) || [];

      // Fetch and categorize grievances
      const letterRequests = await LetterRequest.find();
      const categorizedGrievances = {
        GrievanceRef: [],
        CMRF: [],
        JOBS: [],
        DEVELOPMENT: [],
        Transfer: [],
        Others: []
      };

      letterRequests.forEach((doc) => {
        const category = doc.category;
        if (categorizedGrievances[category]) {
          categorizedGrievances[category].push(doc);
        } else {
          console.log("Doesn't match with any category");
        }
      });

      // Return consolidated data
      return res.status(200).json({
        status: 'success',
        data: {
          allAC: getAllAC,
          employees,
          grievanceCategories: categorizedGrievances
        }
      });

    } else if (role === '1') {
      // Role 1: Fetch grievances for a specific employee
      const employeeGrievances = await EmployeeGrievancesTrack.findOne({ employeeId: userId })
        .populate('grievanceCategories.GrievanceRef')
        .populate('grievanceCategories.CMRF')
        .populate('grievanceCategories.JOBS')
        .populate('grievanceCategories.DEVELOPMENT')
        .populate('grievanceCategories.Transfer')
        .populate('grievanceCategories.Others');

      if (!employeeGrievances) {
        return res.status(200).json({
          status: 'success',
          data: {
            grievanceCategories: {
              GrievanceRef: [],
              CMRF: [],
              JOBS: [],
              DEVELOPMENT: [],
              Transfer: [],
              Others: []
            }
          }
        });
      }

      // Return employee grievances
      return res.status(200).json({
        status: 'success',
        data: employeeGrievances
      });
    } else {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid role provided'
      });
    }

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;