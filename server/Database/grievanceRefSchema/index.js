const mongoose = require('mongoose');

// Sub-schema for GrievanceRef and Others (Categories 1 & 6)
const grievanceRefSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  content: { type: String, required: true }
});

// Sub-schema for CMRF (Category 2)
const cmrfSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  relation: { type: String, enum: ['S/O', 'F/O', 'O/O'], required: true },  // Relation
  fatherName: { type: String, required: true },
  patientAadharId: { type: String, required: true },
  patientPhoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  mandal: { type: mongoose.Schema.Types.ObjectId, ref: 'Mandal', required: true },
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
  hospitalName: { type: String, required: true },
  disease: { type: String, required: true },
  dateOfAdmission: { type: Date, required: true },
  dateOfDischarge: { type: Date, required: true },
  totalIncrement: { type: Number, required: true }
});

// Sub-schema for JOBS (Category 3)
const jobsSchema = new mongoose.Schema({
  referencePersonName: { type: String, required: true },
  referencePhoneNumber: { type: String, required: true },
  qualification: { type: String, required: true }
});

// Sub-schema for Development (Category 4)
const developmentSchema = new mongoose.Schema({
  mandal: { type: mongoose.Schema.Types.ObjectId, ref: 'Mandal', required: true },
  village: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
  authority: { type: String, required: true },
  issue: { type: String, required: true },
  letterIssued: { type: Boolean, required: true }
});

// Sub-schema for Transfer (Category 5)
const transferSchema = new mongoose.Schema({
  transferType: { type: String, enum: ['Transfer', 'Retention', 'Recommendation', 'New Post Recommended'], required: true },
  fromVillage: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },  // Used only for Transfer
  toVillage: { type: mongoose.Schema.Types.ObjectId, ref: 'Village' },    // Used only for Transfer
  retentionStartedAt: { type: Date },  // Used only for Retention
  recommendationPosition: { type: String }, // Used for Recommendation/New Post Recommended
  recommendationLocation: { type: String }  // Used for Recommendation/New Post Recommended
});

// Main Schema
const letterRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  fatherName: { type: String, required: true },
  age: { type: Number, required: true },
  aadharId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  letterRequired: { type: Boolean, required: true },
  to: {
    type: String,
    required: function () { return this.letterRequired; } // Only if letterRequired is true
  },
  purpose: {
    type: String,
    required: function () { return this.letterRequired; } // Only if letterRequired is true
  },

  // Category field
  category: { type: String, enum: ['GrievanceRef', 'CMRF', 'JOBS', 'DEVELOPMENT', 'Transfer', 'Others'], required: true },

  // Dynamic fields based on category selection
  grievanceRef: grievanceRefSchema,  // For categories 1 & 6
  cmrf: cmrfSchema,  // For category 2
  jobs: jobsSchema,  // For category 3
  development: developmentSchema,  // For category 4
  transfer: transferSchema,  // For category 5
  
  // Token for tracking
  token: { type: String, default: () => generateToken(), unique: true }

}, { timestamps: true });

// Function to generate token (as in previous example)
const generateToken = () => {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
};

// Create the model
const LetterRequest = mongoose.model('LetterRequest', letterRequestSchema);

export default LetterRequest;