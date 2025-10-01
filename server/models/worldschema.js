import mongoose from 'mongoose';
const worldSchema = new mongoose.Schema({
    timezone:{
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    }
});
export default mongoose.model('World', worldSchema);