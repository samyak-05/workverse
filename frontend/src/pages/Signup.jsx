import React, { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';

function Signup() {
  let [show, setShow] = useState(false);
  let {serverUrl} = useContext(authDataContext);
  let {userData,setUserData} = useContext(userDataContext);
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [username, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);
  let [err,setErr] = useState("");
  let navigate = useNavigate();

  const handleSignup = async (e) => {
  e.preventDefault();

  const payload = {
    firstName,
    lastName,
    username,
    email,
    password
  };

  setLoading(true);

  try {
    const res = await axios.post(
      serverUrl + "/api/auth/signup",
      payload,
      { withCredentials: true }
    );

    setUserData(res.data);
    navigate("/");
    setFirstName("");
    setLastName("");
    setUserName("");
    setEmail("");
    setPassword("");
    setErr("");
  } catch (err) {
    setErr(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="w-full min-h-screen bg-[#F3F2F0] flex flex-col items-center justify-start">
      <div className="w-full mb-3">
        <div className="max-w-[1128px] mx-auto px-6 pt-4">
          <img
            src={logo}
            alt="LinkedIn"
            className="h-20 w-auto"
          />
        </div>
      </div>
      <div className="text-[29px] md:text-[34px] mb-3"> Your next opportunity awaits</div>
      <form className="w-[90%] max-w-[400px] h-[650px] md:shadow-xl bg-white flex flex-col justify-start  p-[15px] rounded-md" onSubmit={handleSignup}>
        <label className=" mt-[25px] text-[20px]" htmlFor='firstName'>First Name: </label>
        <input type="text" id="firstName" placeholder='enter first name' value={firstName} onChange={(e)=>setFirstName(e.target.value)} className='w-[100%] h-[50px] border-2 border-gray-500 text-gray-700 text-[18px] p-[10px] mb-[15px] rounded-md' required/>
        <label className="text-[20px]" htmlFor='lastName'>Last Name: </label>
        <input type="text" placeholder='enter last name' id="lastName" value={lastName} onChange={(e)=>setLastName(e.target.value)} className='w-[100%] h-[50px] border-2 border-gray-500 text-gray-700 text-[18px] p-[10px] mb-[15px] rounded-md'/>
        <label className="text-[20px]" htmlFor='username'>Username: </label>
        <input type="text" placeholder='enter username' id="username" value={username} onChange={(e)=>setUserName(e.target.value)} className='w-[100%] h-[50px] border-2 border-gray-500 text-gray-700 text-[18px] p-[10px] mb-[15px] rounded-md' required/>
        <label className="text-[20px]" htmlFor='email'>Email: </label>
        <input type="email" placeholder='enter email' value={email} onChange={(e)=>setEmail(e.target.value)} id="email" className='w-[100%] h-[50px] border-2 border-gray-500 text-gray-700 text-[18px] p-[10px] mb-[15px] rounded-md' required/>
        <label className="text-[20px]" htmlFor='password'>Password: </label>
        <div className='relative h-[50px] mb-[15px]'>
        <input type={show?"text":"password"} placeholder='enter password' value={password} onChange={(e)=>setPassword(e.target.value)} id="password" className='border-gray-500 w-[100%] text-gray-700 text-[18px] p-[10px]  rounded-md border-2' required/>
        <span className="absolute right-[15px] top-[12px] text-blue-700 cursor-pointer font-semibold" onClick={()=>setShow(prev=>!prev)}>{show?"Hide":"Show"}</span>
        </div>
        <div className='text-[14px] font-light text-center'>By clicking Agree & Join or Continue, you agree to the LinkedIn<a href="/" className='text-blue-700 font-medium'> User Agreement</a>, <a href="/" className='text-blue-700 font-medium'>Privacy Policy</a>, and <a href="/" className='text-blue-700 font-medium'>Cookie Policy</a>.</div>
        <button className='mt-5 bg-[blue] hover:bg-blue-700  text-white rounded-3xl p-[10px] font-bold text-[20px]' disabled={loading}>{loading?"Loading...":"Join & Agree"}</button>
        {err && <p className='text-red-600 text-center mt-2'>{err}</p>}
        <div className='text-center mt-[8px]'>Already on WorkVerse? <a href="/signin" className='text-blue-600 font-semibold'>Sign in</a></div>
      </form>
    </div>
  )
}

export default Signup
