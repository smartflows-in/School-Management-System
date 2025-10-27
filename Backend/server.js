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

app.use(cors({
  origin: [
    'https://schools.smartflows.in', // your frontend
    'http://localhost:5173' // keep this for local testing
  ],

  credentials: true
}));
app.use(express.json());

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/admissions', admissionsRoutes); // NEW: Mount the new routes

app.get('/', (req, res) => res.send('Backend running with Firebase!'));

app.listen(PORT, () => console.log(`Server on port ${PORT}`));