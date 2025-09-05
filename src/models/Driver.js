
const mongoose = require('mongoose');

const driverSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        require: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Aproved', 'Rejected', 'Pending'],
        default: 'Pending'
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    licenseNumber: {
        type: String,
        require: true,
        unique: true
    },
    vehicleType: {
        type: String,
        enum:["Vip","Regular","Economic"],
        require: true,
        default:"Regular"
    },
    vehicleSize: {
        type: Number,
        enum:[4,6,12,24],
        default:4,
        require: true,
    },
    location:{
        type:{
            type:String,
            default:'Point'
        },
        coordinates:{
            type:[Number],
            default:[0,0]
        }
    }
}, {
    timestamps: true
});
driverSchema.index({location:"2dsphere"});
const driverModel = mongoose.model('Driver', driverSchema);
module.exports = driverModel;

