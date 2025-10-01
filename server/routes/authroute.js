import express from 'express';
import dotenv from 'dotenv';
import qs from 'qs';
import axios from 'axios';
import request from 'request';
const router = express.Router();
dotenv.config();
const clientid = process.env.CLIENT_ID;
const clientsecret = process.env.CLIENT_SECRET;
var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
let access_token = '';
router.get('/login',async(req,res)=>{
 let scope = "streaming user-read-email user-read-private user-modify-playback-state";
 let state = generateRandomString(16);
 let auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: clientid,
    scope: scope,
    redirect_uri: "http://127.0.0.1:3000/auth/callback",
    state: state
  });
  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});
router.get('/callback',async(req,res)=>{
    try {
        let code = req.query.code;
        let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: "http://127.0.0.1:3000/auth/callback",
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(clientid + ':' + clientsecret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('http://localhost:5173/')
    }
  });
    } catch (error) {
        console.log(error);
    }
});
router.get('/token', (req, res) => {
  res.json(
     {
        access_token: access_token,
        success:true
     })
})
export default router;
