
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

app.use('/api/auth', authRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce Auth API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
