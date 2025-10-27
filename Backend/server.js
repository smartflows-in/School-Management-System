const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const admissionsRoutes = require('./routes/admissionsRoutes'); // NEW: Import the new routes

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Option 1: Recommended - Add your Vercel frontend to allowed origins (keeps credentials: true for auth)
app.use(cors({
  origin: [
    'https://schools.smartflows.in', // your frontend
    'https://school-management-system-6y6i.vercel.app', // Add this: Your Vercel frontend
    'http://localhost:5173' // keep this for local testing
  ],
  credentials: true
}));

// Option 2: Permissive (for testing) - Allows all origins but drops credentials (uncomment if needed)
// app.use(cors({
//   origin: '*', // Allows requests from any domain
//   credentials: false // Must set to false with '*' (no cookies/auth across origins)
// }));

app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admissions', admissionsRoutes); // NEW: Mount the new routes

app.get('/', (req, res) => res.send('Backend running with Firebase!'));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));