import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUtensils } from "react-icons/fa";
import { FaMobileAlt } from "react-icons/fa";
import { useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';
import { useTheme } from '../context/ThemeContext';

function CreateEditShop() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.owner)
    const { currentCity,currentState,currentAddress } = useSelector(state => state.user)
    const [name,setName]=useState(myShopData?.name || "")
     const [address,setAddress]=useState(myShopData?.address || currentAddress)
     const [city,setCity]=useState(myShopData?.city || currentCity)
       const [state,setState]=useState(myShopData?.state || currentState)
       const [upiId,setUpiId]=useState(myShopData?.upiId || "")
       const [frontendImage,setFrontendImage]=useState(myShopData?.image || null)
       const [backendImage,setBackendImage]=useState(null)
       const [loading,setLoading]=useState(false)
       const dispatch=useDispatch()
       const { currentMode, theme } = useTheme()

       const handleImage=(e)=>{
        const file=e.target.files[0]
        setBackendImage(file)
        setFrontendImage(URL.createObjectURL(file))
       }

       const handleSubmit=async (e)=>{
        e.preventDefault()
        setLoading(true)
        try {
           const formData=new FormData()
           formData.append("name",name) 
           formData.append("city",city) 
           formData.append("state",state) 
           formData.append("address",address) 
           formData.append("upiId",upiId) 
           if(backendImage){
            formData.append("image",backendImage)
           }
           const result=await axios.post(`${serverUrl}/api/shop/create-edit`,formData,{withCredentials:true})
           dispatch(setMyShopData(result.data))
          setLoading(false)
          navigate(`/shop/${result.data._id}`)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
       }
    return (
        <div className={`flex justify-center flex-col items-center p-6 relative min-h-screen transition-all duration-500 ${currentMode.bg}`}>
            <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]' onClick={() => navigate("/")}>
                <IoIosArrowRoundBack size={35} className={currentMode.icon} />
            </div>

            <div className={`max-w-lg w-full shadow-2xl rounded-2xl p-8 border transition-all duration-300 ${currentMode.card} ${currentMode.border}`}>
                <div className='flex flex-col items-center mb-6'>
                    <div className={`p-4 rounded-full mb-4 bg-gradient-to-r ${theme.gradient} bg-opacity-10`}>
                        <FaUtensils className={`w-16 h-16 text-white`} />
                    </div>
                    <div className={`text-3xl font-extrabold ${currentMode.text}`}>
                        {myShopData ? "Edit Shop" : "Add Shop"}
                    </div>
                </div>

                <form className='space-y-5' onSubmit={handleSubmit}>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${currentMode.text}`}>Name</label>
                        <input type="text" placeholder='Enter Shop Name' className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${currentMode.input} focus:ring-${theme.primary}-500`}
                        onChange={(e)=>setName(e.target.value)}
                        value={name}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${currentMode.text}`}>Shop Image</label>
                        <input type="file" accept='image/*' className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${currentMode.input}`} onChange={handleImage}  />
                        {frontendImage &&   <div className='mt-4'>
                            <img src={frontendImage} alt="" className={`w-full h-48 object-cover rounded-lg border ${currentMode.border}`}/>
                        </div>}
                      
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                           <label className={`block text-sm font-medium mb-1 ${currentMode.text}`}>City</label>
                        <input type="text" placeholder='City' className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${currentMode.input}`} onChange={(e)=>setCity(e.target.value)}
                        value={city}/> 
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${currentMode.text}`}>State</label>
                        <input type="text" placeholder='State' className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${currentMode.input}`} onChange={(e)=>setState(e.target.value)}
                        value={state}/> 
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${currentMode.text}`}>Address</label>
                        <input type="text" placeholder='Enter Shop Address' className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${currentMode.input}`} onChange={(e)=>setAddress(e.target.value)}
                        value={address}/> 
                    </div>
                    
                    {/* UPI ID Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-1 flex items-center gap-2 ${currentMode.text}`}>
                            <FaMobileAlt className={currentMode.icon} />
                            UPI ID (for receiving payments)
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter your UPI ID (e.g., yourname@upi)' 
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${currentMode.input}`} 
                            onChange={(e)=>setUpiId(e.target.value)}
                            value={upiId}
                        />
                        <p className={`text-xs mt-1 ${currentMode.textMuted}`}>
                            Customers will pay to this UPI ID via QR code
                        </p>
                    </div>

                    <button className={`w-full text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-r ${theme.gradient}`} disabled={loading}>
                        {loading?<ClipLoader size={20} color='white'/>:"Save"}
                    
                    </button>
                </form>

            </div>
                
                

        </div>
    )
}

export default CreateEditShop
