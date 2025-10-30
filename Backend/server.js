const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const admissionsRoutes = require('./routes/admissionsRoutes'); // Existing admissions routes (e.g., extraction)
const submitToSheetRoutes = require('./routes/submitToSheet'); // NEW: Import the sheet submission proxy

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Your existing CORS config (good for localhost and prod)
app.use(cors({
  origin: [
    'https://schools.smartflows.in', // your frontend
    'http://localhost:5173' // keep this for local testing
  ],
  credentials: true
}));

app.use(express.json());

// Your existing routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admissions', admissionsRoutes); // Existing (e.g., extract-aadhaar, extract-leaving-certificate)

// NEW: Mount the submit-to-sheet route under /api/admissions
app.use('/api/admissions', submitToSheetRoutes);

app.get('/', (req, res) => res.send('Backend running with Firebase!'));

// Your existing OCR timeout or other configs can go here if needed, e.g.:
// app.use((req, res, next) => {
//   req.setTimeout(OCR_TIMEOUT_MS); // Assuming OCR_TIMEOUT_MS is defined
//   next();
// });

app.listen(PORT, () => console.log(`Server on port ${PORT}`));