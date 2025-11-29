const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const candidateRoutes = require('./routes/candidate');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb://localhost:27017/candidate-referral'
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/api', candidateRoutes);

app.listen(5000, () =>
  console.log('Server running on port 5000')
);