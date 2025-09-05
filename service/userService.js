const User = require('../models/User');
const Driver = require('../models/Driver');
const Employee = require('../models/Employee');
exports.checkUserIsTaken = async (email,phone,userName) => {
    const query = {email,phone,userName};
    return await User.findOne({$or: [query]});
}

exports.checkCarlicenseNumber = async (licenseNumber) => {
    const query = {licenseNumber};
    return await Driver.findOne({$or: [query]});
}

exports.checkEmployeeIsTaken = async (employee) => {
    const query = {employee};
    return await Employee.findOne({$or: [query]});
}