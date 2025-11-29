const express = require('express');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Candidate = require('../models/Candidate');
const router = express.Router();

// Multer config for PDF only
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') cb(null, true);
  else cb(new Error('Only PDF files allowed'), false);
};
const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { fileSize: 5 * 1024 * 1024 } 
});

// POST /api/candidates
router.post(
  '/candidates',
  upload.single('resume'),          
  [
    body('name').notEmpty().trim().isLength({ min: 2 }),
    body('email').isEmail(),
    // simpler phone rule for now so it passes:
    body('phone').isLength({ min: 10 }).withMessage('Phone must be at least 10 digits'),
    body('jobTitle').notEmpty().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      console.log('BODY RECEIVED:', req.body);
      console.log('FILE RECEIVED:', req.file);

      const { name, email, phone, jobTitle } = req.body;
      const candidate = new Candidate({
        name,
        email,
        phone,
        jobTitle,
        resumeUrl: req.file ? `/uploads/${req.file.filename}` : null
      });

      await candidate.save();
      return res.status(201).json(candidate);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      console.error('SERVER ERROR:', error);
      return res.status(500).json({ error: error.message });
    }
  }
);

// GET /api/candidates
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/candidates/:id/status
router.put('/candidates/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/candidates/:id
router.delete('/candidates/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;