// server.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const expenseRoute = require('./routes/expenseRoute');
const productRoute = require ('./routes/productRoutes')
const tableRoute = require ('./routes/tableRoute');
const settingsRoute = require('./routes/settingsRoute');
const billRoute = require('./routes/billRoute');
const billhistory =require('./routes/billhistoryRoute')
const savedOrderRoutes = require('./routes/savedOrderRoutes');
const heldBillsRoutes = require('./routes/heldBillsRoute');
const walkinOrderRoute = require ('./routes/walkinOrderRoute');

const app = express();
connectDB();

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api', expenseRoute);
app.use('/api', productRoute)
app.use('/api',tableRoute);
app.use('/api', settingsRoute);
app.use('/api',billRoute);
app.use('/api',billhistory)
app.use('/api', savedOrderRoutes);
app.use('/api', heldBillsRoutes);
app.use('/api', walkinOrderRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));