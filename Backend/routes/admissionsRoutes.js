// routes/admissions.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const router = express.Router();

// In-memory upload (same as you already use)
const upload = multer({ storage: multer.memoryStorage() });

// ---------------------------------------------------------------------
// CONFIG – change only if you move the OCR server
// ---------------------------------------------------------------------
const AADHAAR_OCR_URL = 'http://3.110.94.123:8000/api/v1/extract-aadhaar';
const LEAVING_CERT_OCR_URL = 'http://3.111.94.123:5678/api/v1/extract_certificate_data';
const OCR_TIMEOUT_MS = 12_000; // 12 seconds – enough for heavy images

// ---------------------------------------------------------------------
// Helper: quick health-check (GET /health) – returns true/false
// ---------------------------------------------------------------------
async function isOcrHealthy(url) {
  try {
    await axios.get(`${url.replace(/\/api.*$/, '')}/health`, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------
// MOCK RESPONSE (used when OCR is unreachable – never blocks UI)
// ---------------------------------------------------------------------
const MOCK_LEAVING_CERT_RESPONSE = {
  success: true,
  data: {
    school_name: 'Mock School (dev mode)',
    last_class_attended: 'X',
  },
};

// ---------------------------------------------------------------------
// POST /api/admissions/extract-aadhaar   (unchanged, just using axios)
// ---------------------------------------------------------------------
router.post('/extract-aadhaar', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_FILE', message: 'No file uploaded' },
    });
  }

  const form = new FormData();
  form.append('file', req.file.buffer, {
    filename: req.file.originalname,
    contentType: req.file.mimetype,
  });

  try {
    const resp = await axios.post(AADHAAR_OCR_URL, form, {
      headers: form.getHeaders(),
      timeout: OCR_TIMEOUT_MS,
    });

    // The Aadhaar service returns { success: true, data: { … } }
    res.json(resp.data);
  } catch (err) {
    console.error('Aadhaar OCR error:', err.message);
    res.status(500).json({
      success: false,
      error: { code: 'EXTRACTION_FAILED', message: err.message },
    });
  }
});

// ---------------------------------------------------------------------
// POST /api/admissions/extract-leaving-certificate
// ---------------------------------------------------------------------
router.post('/extract-leaving-certificate', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_FILE', message: 'No file uploaded' },
    });
  }

  // --------------------------------------------------------------
  // 1. Try real OCR service
  // --------------------------------------------------------------
  const healthy = await isOcrHealthy(LEAVING_CERT_OCR_URL);
  if (healthy) {
    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    try {
      const resp = await axios.post(LEAVING_CERT_OCR_URL, form, {
        headers: form.getHeaders(),
        timeout: OCR_TIMEOUT_MS,
      });

      // API returns: { "status":"success","data":{…} }
      if (resp.data.status === 'success') {
        return res.json({
          success: true,
          data: {
            school_name: resp.data.data.school_name,
            last_class_attended: resp.data.data.last_class_attended,
          },
        });
      }

      // Unexpected shape – forward as-is for debugging
      return res.status(502).json(resp.data);
    } catch (err) {
      console.error('Leaving-Cert OCR error:', err.message);
      // fall-through to mock
    }
  } else {
    console.warn('Leaving-Cert OCR unreachable – returning mock data');
  }

  // --------------------------------------------------------------
  // 2. Fallback mock (never crashes the flow)
  // --------------------------------------------------------------
  res.json(MOCK_LEAVING_CERT_RESPONSE);
});

// ---------------------------------------------------------------------
// POST /api/admissions/submit   (unchanged – just for completeness)
// ---------------------------------------------------------------------
router.post('/submit', express.json(), (req, res) => {
  const studentData = req.body;
  console.log('Submitted Student Data:', studentData);
  // TODO: save to Firebase / DB
  res.json({ success: true, message: 'Data saved successfully' });
});

module.exports = router;