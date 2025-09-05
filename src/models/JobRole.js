const mongoose = require('mongoose');
const jobRoleSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    roles:{
        type: [String],
        default:[]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
    }
},
    {
        timestamps: true
    }
);

const roleModel = mongoose.model('Job Role', jobRoleSchema);

module.exports = roleModel;