const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
// connect DB
mongoose.connect(process.env.DP_URL)
    .then(() => console.log('Connect mongoDB...'))
    .catch(err => console.error('MONGO_ERROR:', err));
// APIS
app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/users', require('./routes/userRoute'));
app.use('/api/roles', require('./routes/jobRoleRoute'));
app.use('/api/employees', require('./routes/employeeRoute'));
app.use('/api/driver', require('./routes/driverRoute'));
app.use('/api/trip', require('./routes/tripRoute'));



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`running at port ${PORT}`);
})