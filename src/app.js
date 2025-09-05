const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./config/socket");
const { setIO } = require("./utils/notifier");

const app = express();

app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb',extended:true}));

dotenv.config();
app.use(cors());
app.use(express.json());
// connect DB
mongoose.connect(process.env.DP_URL)
    .then(() => console.log('Connect mongoDB...'))
    .catch(err => console.error('MONGO_ERROR:', err));

const server = http.createServer(app);
//const io = initSocket(server);
//setIO(io);
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