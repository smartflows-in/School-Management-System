const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

const router = express.Router();

// Configure multer for file uploads (in-memory)
const upload = multer({ storage: multer.memoryStorage() });

// External API URL
const EXTERNAL_API_URL = 'https://aadhar-extraction.onrender.com/api/v1/extract-aadhaar';

// POST /api/admissions/extract-aadhaar
router.post('/extract-aadhaar', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_FILE', message: 'No file uploaded' },
      timestamp: new Date().toISOString()
    });
  }

  try {
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const externalResponse = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const externalBody = await externalResponse.text();
    let result;
    try {
      result = JSON.parse(externalBody);
    } catch {
      throw new Error(`External API invalid JSON: ${externalBody}`);
    }

    if (!externalResponse.ok) {
      console.error('External API full response:', result);
      return res.status(externalResponse.status).json(result);
    }

    res.json(result);
  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'EXTRACTION_FAILED', message: error.message },
      timestamp: new Date().toISOString()
    });
  }
});

// NEW: POST /api/admissions/submit
router.post('/submit', express.json(), (req, res) => {
  const studentData = req.body;
  console.log('Submitted Student Data:', studentData); // For now; extend to DB/Firebase
  // TODO: Save to Firebase or file
  res.json({ success: true, message: 'Data saved successfully' });
});

module.exports = router;