import React, { useState } from 'react'
import './forgetPassword.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Heading from '../../../components/Heading';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
    const auth = getAuth();
    let [email,setEmail]= useState("")
    const navigate = useNavigate() ;

    let handleForgetPassword = ()=>{
        sendPasswordResetEmail(auth, email).then(() => {
           console.log("ok")
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            // ..
          });
    }


  return (
    <div className='forgetpage'>
        <div className="forgetbox">
            <Heading tagName="h2" className="frgtPassHeading" title="forget password" />
            <br/>
            <TextField onChange={(e)=>setEmail(e.target.value)} name='email' type='email' className="forgetInput" id="outlined-basic" label="Email Address" variant="outlined" />
            <br/>
            <Button onClick={handleForgetPassword} className="forgetBtn" variant="contained">sign in</Button>
            <br/>
            <Button onClick={() => navigate("/")} className="forgetBtn" variant="contained">go to login</Button>
        </div>
    </div>
  )
}

export default ForgetPassword