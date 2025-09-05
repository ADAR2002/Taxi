const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        require: true,
        unique: true
    },
    jobRole: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Job Role',
        require: true,
    },
    status: {
        type: String,
        enum: ['Aproved', 'Rejected', 'Pending'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

const employeeModel = mongoose.model('Employee', employeeSchema);
module.exports = employeeModel;


