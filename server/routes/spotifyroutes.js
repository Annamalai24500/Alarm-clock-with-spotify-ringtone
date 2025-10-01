import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'qs';
import Ringtone from '../models/ringtoneschema.js';
import Alarm from '../models/alarmschema.js';
dotenv.config();
const router = express.Router();
const clientid = process.env.CLIENT_ID;
const clientsecret = process.env.CLIENT_SECRET;
const auth_token = Buffer.from(`${clientid}:${clientsecret}`, 'utf-8').toString('base64');
const getAuth = async()=>{
    try {
        const token_url = 'https://accounts.spotify.com/api/token';
        const data = qs.stringify({'grant_type':'client_credentials'});
        const response = await axios.post(token_url, data, {
            headers: { 
                'Authorization': `Basic ${auth_token}`,
                'Content-Type': 'application/x-www-form-urlencoded' 
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.log(error);
    }
}
router.get('/',async(req,res)=>{
    try {
        const playlistid ='35lHvGWbIJMJLBNnbu2gLm';
        const access_token = await getAuth();
        const url = `https://api.spotify.com/v1/playlists/${playlistid}/tracks`;
        const response = await axios.get(url,{
            headers:{
                Authorization:`Bearer ${access_token}`
            },
            params:{
                limit:10
            }
        });
        const ringtones = await Ringtone.find();
        if(ringtones.length<11){
        response.data.items.map(async(item)=>{
            const existingRingtone = await Ringtone.find({ spotifyid: item.track.id });
            if(existingRingtone.length === 0){
                const newRingtone = new Ringtone({
                    name: item.track.name,
                    spotifyid: item.track.id,
                    url:item.track.uri,
            });
            await newRingtone.save();
        }else{
            console.log("Ringtone already exists");
        }
        });
        }else{
            console.log("Ringtones already exist in database");
        }
        console.log(ringtones);
        res.json({message:"Songs fetched successfully",data:ringtones,success:true});
    } catch (error) {
        console.log(error)
    }
});
router.get('/getringtones',async(req,res)=>{
    try {
        const ringtones = await Ringtone.find();
        if(ringtones.length === 0){
            res.json({message:"No ringtones found",data:[],success:false});
        }
        res.json({success:true,message:"Ringtones fetched successfully",data:ringtones});
    } catch (error) {
        console.log(error);
    }
});
// i added imageurl lete in the schema thats why ignore this bro.
router.get('/addimageurl',async(req,res)=>{
    try {
        const ringtones = await Ringtone.find();
        const access_token = await getAuth();
        ringtones.map(async(ringtone)=>{
            const url = `https://api.spotify.com/v1/tracks/${ringtone.spotifyid}`;
            const response = await axios.get(url,{
                headers:{
                    Authorization:`Bearer ${access_token}`,
                }
            });
            let imageurl = response.data.album.images[0].url;
            await Ringtone.updateOne({spotifyid:ringtone.spotifyid},{imageurl:imageurl});
        });
        res.json({message:"Image URLs added successfully",success:true});
    } catch(error) {
        console.log(error);
    }
});
router.post('/createalarm',async(req,res)=>{
    try {
        const {Hour, Minute, AMPM, label, ringtone} = req.body;
        const alarms = await Alarm.find();
        for(let alarm of alarms){
            if(alarm.Hour === Hour && alarm.Minute === Minute && alarm.AMPM === AMPM){
                res.json({message:"Alarm already exists",success:false});
                return;
            }
        }
        const alarm1 =await Alarm.create({Hour, Minute, AMPM, label, ringtone});
        await alarm1.save();
        res.send({message:"Alarm created successfully",success:true});
    } catch (error) {
        console.log(error);
    }
});
router.get('/getalarms',async(req,res)=>{
    try {
        const alarms = await Alarm.find();
        if(alarms.length === 0){
            res.json({message:"No alarms found",data:[],success:false});
            return;
        }
        res.json({success:true,message:"Alarms found successfully",data:alarms});
    } catch (error) {
        console.log("error");
    }
});
export default router;