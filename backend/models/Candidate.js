const mongoose = require('mongoose');
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  jobTitle: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Hired'], default: 'Pending' },
  resumeUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);