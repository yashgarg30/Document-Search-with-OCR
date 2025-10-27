const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const uploadRoutes = require('./routes/upload');
const searchRoutes = require('./routes/search');
const jobsRoutes = require('./routes/jobs');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('mongo connected'))
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/jobs', jobsRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

module.exports = app;
