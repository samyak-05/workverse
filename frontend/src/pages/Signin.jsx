import React, { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import {Navigate} from 'react-router-dom'

function Signin() {
  let [show, setShow] = useState(false);
  let {userData,setUserData} = useContext(userDataContext);
  let {serverUrl} = useContext(authDataContext);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err,setErr] = useState("");
  
    const handleSignin = async (e) =>{
      e.preventDefault();
      setLoading(true);
      try{
        let res = await axios.post(serverUrl+"/api/auth/signin",{
          email,
          password
        },{withCredentials:true});
        console.log(res);
        setUserData(res.data);
        Navigate("/");
        setEmail("");
        setPassword("");
        setLoading(false);
        setErr(false);
      } catch(err){
        setErr(err.response?.data?.message || err.message);
        setLoading(false);
        console.log("Error during signin:", err);
      }
    }
    return (
      <div className="w-full min-h-screen bg-[#F3F2F0] flex flex-col items-center justify-start">
        <div className="w-full mb-3">
          <div className="max-w-[1128px] mx-auto px-6 pt-4">
            <img
              src={logo}
              alt="WorkVerse"
              className="h-20 w-auto"
            />
          </div>
        </div>
        <div className="text-[29px] md:text-[34px] mb-3">Welcome Back!</div>
        <form className="w-[90%] max-w-[400px] h-[350px] md:shadow-xl bg-white flex flex-col justify-start  p-[15px] rounded-md" onSubmit={handleSignin}>
          <label className="text-[20px]" htmlFor='email'>Email: </label>
          <input type="email" placeholder='enter email' value={email} onChange={(e)=>setEmail(e.target.value)} id="email" className='w-[100%] h-[50px] border-2 border-gray-500 text-gray-700 text-[18px] p-[10px] mb-[15px] rounded-md' required/>
          <label className="text-[20px]" htmlFor='password'>Password: </label>
          <div className='relative h-[50px] mb-[15px]'>
          <input type={show?"text":"password"} placeholder='enter password' value={password} onChange={(e)=>setPassword(e.target.value)} id="password" className='border-gray-500 w-[100%] text-gray-700 text-[18px] p-[10px]  rounded-md border-2' required/>
          <span className="absolute right-[15px] top-[12px] text-blue-700 cursor-pointer font-semibold" onClick={()=>setShow(prev=>!prev)}>{show?"Hide":"Show"}</span>
          </div>
          <button className='mt-5 bg-[blue] hover:bg-blue-700  text-white rounded-3xl p-[10px] font-bold text-[20px]' disabled={loading}>{loading?"Loading...":"Sign In"}</button>
          {err && <p className='text-red-600 text-center mt-2'>{err}</p>}
          <div className='text-center mt-[8px]'>Not on WorkVerse? <a href="/signup" className='text-blue-600 font-semibold'>Sign up</a></div>
        </form>
      </div>
    )
}

export default Signin
