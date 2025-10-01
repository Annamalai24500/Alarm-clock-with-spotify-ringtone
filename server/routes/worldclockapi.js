import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();//timezones.data.data.data
import World from '../models/worldschema.js';
router.get('/timezones', async (req,res)=>{
    try {
        const timezones = await axios.get(`https://api.apyhub.com/data/dictionary/timezone`,{
            headers:{
                "apy-token":process.env.API_KEY_FOR_TIMEZONE,
                "Content-Type":"application/json"
            }
        });
        const filtered = [];
        for(let timezone of timezones.data.data){
            if(timezone.value && timezone.value.includes('/') && !filtered.includes(timezone.value)){
                filtered.push(timezone.value);
            }
        }
        res.json({success:true,filtered,message:"Timezones fetched "});
    } catch (error) {
        console.log(error);
    }
});
router.get('/world',async (req,res)=>{
    try{
        const {timezone} = req.query;
        const time = await axios.get(`https://api.api-ninjas.com/v1/timezone?timezone=${timezone}`,{
            headers:{
                "X-Api-Key":process.env.API_KEY_FOR_LOCALTIME,
            }
        });
        const clocks = await World.find();
        for(let clock of clocks){
            if(clock.timezone === timezone){
                return res.json({success:false,message:"Clock already exists"});
            }
        }
        const clock = await World.create({timezone,time:time.data.local_time});
        if(!clock){
            return res.json({success:false,message:"Error in creating clock"});
        }
        res.json({success:true,message:"Time fetched successfully and created clock"});
    }
    catch(error){
        res.json({success:false,message:error?.message});
        console.log(error);
    }
});
router.get('/getworldclocks',async(req,res)=>{
    try {
        const clocks = await World.find();
        if(!clocks){
            return res.json({success:false,message:"No clocks found"});
        }
        res.json({success:true,clocks,message:"Clocks fetched successfully"});
    } catch (error) {
        console.log(error);
    }
});
router.put('/updatetimeforclocks',async(req,res)=>{
    try {
        const clocks =await World.find();
        if(!clocks) return res.json({success:false,message:"No clocks bro"});
        for(let clock of clocks){
            const time = await axios.get(`https://api.api-ninjas.com/v1/timezone?timezone=${clock.timezone}`,{
            headers:{
                "X-Api-Key":process.env.API_KEY_FOR_LOCALTIME,
            }
        });
        let currenttime = time.data.local_time
        await World.findByIdAndUpdate(clock._id,{time:currenttime},{new:true});
        }
        res.send({success:true,message:"Clocks updated successfully"});
    } catch (error) {
        console.log(error);
    }
});
export default router;