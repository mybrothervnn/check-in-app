require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const DEFAULT_MONGO = 'mongodb://blj:bljadmin@vnapp.online:27118/blj_order_demo';
const mongoUri = process.env.MONGO_URI || DEFAULT_MONGO;
const PORT = +(process.env.PORT || 3000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';

// Middleware
app.use(express.json()); 
// app.use(express.urlencoded({ extended: true })); //Parse URL-encoded request bodies (form data)
// app.use(cors({ origin: FRONTEND_ORIGIN })); //Enable CORS (Cross-Origin Resource Sharing) from your frontend origin
app.use(cors({
  origin: '*', // Chấp nhận tất cả các origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  // Loại bỏ credentials: true
}));

// Routes
const customersRouter = require('./routes/customers');
app.use('/api/customers', customersRouter);

app.get('/health', (req, res) => res.json({ ok: true, startedAt: new Date().toISOString() }));

// default route
app.get('/', (req, res) => res.send('Check-in app server is running'));

// Connect to MongoDB and start server
mongoose.set('strictQuery', true);
mongoose
  .connect(mongoUri, { autoIndex: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    // still start server so endpoints can return failures in a meaningful way
    app.listen(PORT, () => {
      console.log('Server started, but MongoDB connection failed. See logs.');
    });
  });
