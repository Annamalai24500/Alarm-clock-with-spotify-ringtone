import mongoose from 'mongoose';
const ringtoneSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    spotifyid:{
        type: String,
        required: true
    },
    url:{
        type: String,
        required: true
    },
    imageurl:{
        type: String,
        requried:true
    }
});
export default mongoose.model('Ringtone', ringtoneSchema);