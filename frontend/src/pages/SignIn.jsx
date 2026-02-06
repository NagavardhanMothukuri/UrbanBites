import React from 'react'
import { useState } from 'react';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useTheme } from '../context/ThemeContext';

function SignIn() {
    const [showPassword, setShowPassword] = useState(false)
    const navigate=useNavigate()
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [err,setErr]=useState("")
    const [loading,setLoading]=useState(false)
    const dispatch=useDispatch()
    const { currentMode, theme } = useTheme()

     const handleSignIn=async () => {
        setLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/auth/signin`,{
                email,password
            },{withCredentials:true})
           dispatch(setUserData(result.data))
            setErr("")
            setLoading(false)
        } catch (error) {
           setErr(error?.response?.data?.message)
           setLoading(false)
        }
     }
     const handleGoogleAuth=async () => {
             const provider=new GoogleAuthProvider()
             const result=await signInWithPopup(auth,provider)
       try {
         const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
             email:result.user.email,
         },{withCredentials:true})
         dispatch(setUserData(data))
       } catch (error) {
         console.log(error)
       }
          }
    return (
        <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-all duration-500 ${currentMode.bg}`}>
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-8 border transition-all duration-300 ${currentMode.card} ${currentMode.border}`}>
                <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>UrbanBites</h1>
                <p className={`mb-8 ${currentMode.textMuted}`}> Sign In to your account to get started with delicious food deliveries
                </p>

              
                {/* email */}

                <div className='mb-4'>
                    <label htmlFor="email" className={`block font-medium mb-1 ${currentMode.text}`}>Email</label>
                    <input type="email" className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-all duration-200 ${currentMode.input}`} placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                </div>
                {/* password*/}

                <div className='mb-4'>
                    <label htmlFor="password" className={`block font-medium mb-1 ${currentMode.text}`}>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} className={`w-full border rounded-lg px-3 py-2 focus:outline-none pr-10 transition-all duration-200 ${currentMode.input}`} placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} value={password} required/>

                        <button className={`absolute right-3 cursor-pointer top-[14px] ${currentMode.textMuted}`} onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                    </div>
                </div>
                <div className={`text-right mb-4 cursor-pointer font-medium ${currentMode.icon}`} onClick={()=>navigate("/forgot-password")}>
                  Forgot Password
                </div>
              

            <button className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-white bg-gradient-to-r ${theme.gradient}`} onClick={handleSignIn} disabled={loading}>
                {loading?<ClipLoader size={20} color='white'/>:"Sign In"}
            </button>
      {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}

            <button className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-3 transition-all duration-200 cursor-pointer ${currentMode.border} ${currentMode.buttonSecondary}`} onClick={handleGoogleAuth}>
<FcGoogle size={20}/>
<span>Sign In with Google</span>
            </button>
            <p className={`text-center mt-6 cursor-pointer ${currentMode.text}`} onClick={()=>navigate("/signup")}>Want to create a new account ?  <span className={`font-semibold ${currentMode.icon}`}>Sign Up</span></p>
            </div>
        </div>
    )
}


export default SignIn
