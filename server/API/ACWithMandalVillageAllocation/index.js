import express from 'express';
import {AC} from '../../Database/allModels'; // Your AC model
const {ValidateAC} = require('../../Validation/authentication'); // AC validation function
const authenticateToken = require('../../Middleware/authMiddleware'); // JWT authentication middleware

const Router = express.Router();

Router.get('/getAll-ac', async (req, res) => {
  try {
    // Fetch all AC records from the database
    const getAllac = await AC.find();

    // Return the retrieved data
    return res.status(200).json({ data: getAllac });
  } catch (error) {
    // Return a 500 error for any issues that arise during fetching
    return res.status(500).json({ message: 'Error fetching AC records' });
  }
})

// POST route to add a new AC record
Router.post('/add-ac', authenticateToken, async (req, res) => {
    try {
        // Validate the request body
        await ValidateAC(req.body);
        
        // Insert the new AC record into the database
        const newAC = new AC(req.body);
        await newAC.save();

        return res.status(201).json({ message: 'AC record added successfully!', data: newAC });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({message: error.details[0].message})// Pass the first validation error message
        }

        // General error handling for database issues, etc.
        return res.status(500).json({message: 'Error adding AC record'})
    }
});

Router.put('/edit-ac/:id', authenticateToken, async (req, res) => {
  try {
    // Validate the request body (to make sure updated data is valid)
    await ValidateAC(req.body);
    console.log(req.params.id);
    // Find the AC record by ID and update it with the new data
    const updatedAC = await AC.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied on update
    });

    if (!updatedAC) {
      return res.status(404).json({ message: 'AC record not found' });
    }

    return res.status(200).json({ status: 'success', message: 'AC record updated successfully!', data: updatedAC });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ message: error.details[0].message }); // Validation error response
    }

    // General error handling
    console.log(error);
    
    return res.status(500).json({ message: 'Error updating AC record' });
  }
});

Router.get('/getAll-mandal/:acId', authenticateToken, async(req,res) =>{
  try {
    // Find the AC record by ID and populate the mandals
    const ac = await AC.findById(req.params.acId)
    // Check if the AC record exists
    if (!ac) {
      return res.status(404).json({ message: 'AC not found' });
    }

    // Return the mandals associated with the AC
    return res.status(200).json({ acId: ac._id, mandal: ac.mandals });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving mandals', error: error.message });
  }
})

Router.post('/add-mandal/:acId', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const acId = req.params.acId;
  
  try {
    // Find AC and push a new Mandal to the mandals array
    const ac = await AC.findByIdAndUpdate(
      acId,
      { $push: { mandals: { name } } }, // Add mandal to array
      { new: true }
    );

    if (!ac) {
      return res.status(404).json({ message: 'AC not found' });
    }

    return res.status(200).json({ message: 'Mandal added successfully', data: ac.mandals[ac.mandals.length - 1] });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding Mandal' });
  }
});

Router.put('/edit-mandal/:acId/:mandalId', authenticateToken, async (req, res) => {
    const { name } = req.body;
    const { acId, mandalId } = req.params;
  
    try {
      const ac = await AC.findOneAndUpdate(
        { _id: acId, 'mandals._id': mandalId },
        { $set: { 'mandals.$.name': name } }, // Update the specific mandal's name
        { new: true }
      );
  
      if (!ac) {
        return res.status(404).json({ message: 'AC or Mandal not found' });
      }
  
      return res.status(200).json({ message: 'Mandal updated successfully', data: ac });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating Mandal' });
    }
  });

  Router.put('/edit-village/:acId/:mandalId/:villageId', authenticateToken, async (req, res) => {
  const { name, population } = req.body;
  const { acId, mandalId, villageId } = req.params;

  try {
    const ac = await AC.findOneAndUpdate(
      { _id: acId, 'mandals._id': mandalId, 'mandals.villages._id': villageId },
      { $set: { 'mandals.$[mandal].villages.$[village].name': name, 'mandals.$[mandal].villages.$[village].population': population } }, // Update specific village fields
      {
        arrayFilters: [{ 'mandal._id': mandalId }, { 'village._id': villageId }],
        new: true,
      }
    );

    if (!ac) {
      return res.status(404).json({ message: 'AC, Mandal, or Village not found' });
    }

    return res.status(200).json({ message: 'Village updated successfully', data: ac });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating village' });
  }
});

Router.post('/add-village/:acId/:mandalId', authenticateToken, async (req, res) => {
  const { name, population } = req.body;
  const { acId, mandalId } = req.params;

  try {
    // Find the AC and the mandal, and push a new village to the villages array
    const ac = await AC.findOneAndUpdate(
      { _id: acId, 'mandals._id': mandalId },
      { $push: { 'mandals.$.villages': { name } } }, // Add village to specific mandal
      { new: true }
    );

    if (!ac) {
      return res.status(404).json({ message: 'AC or Mandal not found' });
    }

    const gerSelectedAC = await AC.findOne(
      { _id: acId, 'mandals._id': mandalId },
      { 'mandals.$': 1 } // Return only the mandal with the matching _id
    );
    const villages = gerSelectedAC.mandals[0].villages;
    const lastVillage = villages[villages.length - 1];

    return res.status(200).json({ message: 'Village added successfully', data: lastVillage });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding village' });
  }
});


export default Router;