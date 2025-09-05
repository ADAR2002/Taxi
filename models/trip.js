const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    },
    driverID: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Driver'
    },
    start_location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    end_location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    distance_km: Number,
    duration_min: Number,
    price: Number,
    status: {
        type: String,
        enum: ["Panding", "Accepted", "Started", "Completed", "Cancelled"],
        default: "Panding"
    }
}, {
    timestamps: true
});
tripSchema.index({start_location:"2dsphere"});
tripSchema.index({end_location:"2dsphere"});

const tripModel = mongoose.model('Trip', tripSchema);
module.exports = tripModel