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
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useTheme } from '../context/ThemeContext';

function SignUp() {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate=useNavigate()
    const [fullName,setFullName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [mobile,setMobile]=useState("")
    const [err,setErr]=useState("")
    const [loading,setLoading]=useState(false)
    const dispatch=useDispatch()
    const { currentMode, theme } = useTheme()

     const handleSignUp=async () => {
        setLoading(true)
        try {
            const result=await axios.post(`${serverUrl}/api/auth/signup`,{
                fullName,email,password,mobile,role
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
        if(!mobile){
          return setErr("mobile no is required")
        }
        const provider=new GoogleAuthProvider()
        const result=await signInWithPopup(auth,provider)
  try {
    const {data}=await axios.post(`${serverUrl}/api/auth/google-auth`,{
        fullName:result.user.displayName,
        email:result.user.email,
        role,
        mobile
    },{withCredentials:true})
   dispatch(setUserData(data))
  } catch (error) {
    console.log(error)
  }
     }
    return (
        <div className={`min-h-screen w-full flex items-center justify-center p-4 transition-all duration-500 ${currentMode.bg}`}>
            <div className={`rounded-2xl shadow-2xl w-full max-w-md p-8 border transition-all duration-300 ${currentMode.card} ${currentMode.border}`}>
                <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Vingo</h1>
                <p className={`mb-8 ${currentMode.textMuted}`}> Create your account to get started with delicious food deliveries
                </p>

                {/* fullName */}

                <div className='mb-4'>
                    <label htmlFor="fullName" className={`block font-medium mb-1 ${currentMode.text}`}>Full Name</label>
                    <input type="text" className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-all duration-200 ${currentMode.input}`} placeholder='Enter your Full Name' onChange={(e)=>setFullName(e.target.value)} value={fullName} required/>
                </div>
                {/* email */}

                <div className='mb-4'>
                    <label htmlFor="email" className={`block font-medium mb-1 ${currentMode.text}`}>Email</label>
                    <input type="email" className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-all duration-200 ${currentMode.input}`} placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)} value={email} required/>
                </div>
                {/* mobile*/}

                <div className='mb-4'>
                    <label htmlFor="mobile" className={`block font-medium mb-1 ${currentMode.text}`}>Mobile</label>
                    <input type="text" className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-all duration-200 ${currentMode.input}`} placeholder='Enter your Mobile Number' onChange={(e)=>setMobile(e.target.value)} value={mobile} required/>
                </div>
                {/* password*/}

                <div className='mb-4'>
                    <label htmlFor="password" className={`block font-medium mb-1 ${currentMode.text}`}>Password</label>
                    <div className='relative'>
                        <input type={`${showPassword ? "text" : "password"}`} className={`w-full border rounded-lg px-3 py-2 focus:outline-none pr-10 transition-all duration-200 ${currentMode.input}`} placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)} value={password} required/>

                        <button className={`absolute right-3 cursor-pointer top-[14px] ${currentMode.textMuted}`} onClick={() => setShowPassword(prev => !prev)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                    </div>
                </div>
                {/* role*/}

                <div className='mb-4'>
                    <label htmlFor="role" className={`block font-medium mb-1 ${currentMode.text}`}>Role</label>
                    <div className='flex gap-2'>
                        {["user", "owner", "deliveryBoy"].map((r) => (
                            <button
                                key={r}
                                className={`flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-all duration-200 cursor-pointer ${
                                    role === r 
                                        ? `text-white bg-gradient-to-r ${theme.gradient}` 
                                        : `${currentMode.border} ${currentMode.text} hover:opacity-80`
                                }`}
                                onClick={()=>setRole(r)}>
                                {r === "deliveryBoy" ? "Delivery" : r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

            <button className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-white bg-gradient-to-r ${theme.gradient}`} onClick={handleSignUp} disabled={loading}>
                {loading?<ClipLoader size={20} color='white'/>:"Sign Up"}
            
            </button>
            {err && <p className='text-red-500 text-center my-[10px]'>*{err}</p>}
            

            <button className={`w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-3 transition-all duration-200 cursor-pointer ${currentMode.border} ${currentMode.buttonSecondary}`} onClick={handleGoogleAuth}>
<FcGoogle size={20}/>
<span>Sign up with Google</span>
            </button>
            <p className={`text-center mt-6 cursor-pointer ${currentMode.text}`} onClick={()=>navigate("/signin")}>Already have an account ?  <span className={`font-semibold ${currentMode.icon}`}>Sign In</span></p>
            </div>
        </div>
    )
}


export default SignUp
