const mongoose = require('mongoose');
const jobRoleSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        require: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
    }
},
    {
        timestamps: true
    }
);

const roleModel = mongoose.model('Job Role',jobRoleSchema);

module.exports = roleModel;