import mongoose from 'mongoose';
const alarmSchema = new mongoose.Schema({
    Hour:{
        type: Number,
        required: true

    },
    label:{
        type: String,
        default: ''
    },
    Minute:{
        type: Number,
        required: true
    },
    AMPM:{
        type: String,
        required: true
    },
    ringtone:{
        type: String,
        required: true
    }
});
export default mongoose.model('Alarm', alarmSchema);