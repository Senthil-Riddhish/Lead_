const mongoose = require('mongoose');

const EmployeeGrievancesTrackSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Assuming you have an Employee model
    required: true,
    unique: true,
  },
  grievanceCategories: {
    GrievanceRef: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LetterRequest' }],
    CMRF: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LetterRequest' }],
    JOBS: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JOBS' }],
    DEVELOPMENT: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DEVELOPMENT' }],
    Transfer: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transfer' }],
    Others: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LetterRequest' }]
  }
}, { timestamps: true });

const EmployeeGrievancesTrack = mongoose.model('EmployeeGrievancesTrack', EmployeeGrievancesTrackSchema);
export default EmployeeGrievancesTrack;