import React, { useEffect, useState } from 'react'
import { FaLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { serverUrl } from '../App';
import { setSearchItems, setUserData } from '../redux/userSlice';
import { FaPlus } from "react-icons/fa6";
import { TbReceipt2 } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

function Nav() {
    const { userData, currentCity ,cartItems} = useSelector(state => state.user)
        const { myShopData} = useSelector(state => state.owner)
    const [showInfo, setShowInfo] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [query,setQuery]=useState("")
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const { currentMode, theme, isDarkMode } = useTheme()

    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    const handleSearchItems=async () => {
      try {
        const result=await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${currentCity}`,{withCredentials:true})
    dispatch(setSearchItems(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=>{
        if(query){
handleSearchItems()
        }else{
              dispatch(setSearchItems(null))
        }

    },[query])
    return (
        <div className={`w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] overflow-visible transition-all duration-300 ${currentMode.nav}`}>

            {showSearch && userData.role == "user" && <div className={`w-[90%] h-[70px] shadow-xl rounded-lg items-center gap-[20px] flex fixed top-[80px] left-[5%] md:hidden ${currentMode.card}`}>
                <div className={`flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>
                    <FaLocationDot size={25} className={currentMode.icon} />
                    <div className={`w-[80%] truncate ${currentMode.textMuted}`}>{currentCity}</div>
                </div>
                <div className='w-[80%] flex items-center gap-[10px]'>
                    <IoIosSearch size={25} className={currentMode.icon} />
                    <input type="text" placeholder='search delicious food...' className={`px-[10px] outline-0 w-full bg-transparent ${currentMode.text}`} onChange={(e)=>setQuery(e.target.value)} value={query}/>
                </div>
            </div>}



            <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>UrbanBites</h1>
            {userData.role == "user" && <div className={`md:w-[60%] lg:w-[40%] h-[70px] shadow-xl rounded-lg items-center gap-[20px] hidden md:flex ${currentMode.card}`}>
                <div className={`flex items-center w-[30%] overflow-hidden gap-[10px] px-[10px] border-r-[2px] ${isDarkMode ? 'border-gray-600' : 'border-gray-400'}`}>
                    <FaLocationDot size={25} className={currentMode.icon} />
                    <div className={`w-[80%] truncate ${currentMode.textMuted}`}>{currentCity}</div>
                </div>
                <div className='w-[80%] flex items-center gap-[10px]'>
                    <IoIosSearch size={25} className={currentMode.icon} />
                    <input type="text" placeholder='search delicious food...' className={`px-[10px] outline-0 w-full bg-transparent ${currentMode.text}`} onChange={(e)=>setQuery(e.target.value)} value={query}/>
                </div>
            </div>}

            <div className='flex items-center gap-4'>
                <ThemeSwitcher />
                
                {userData.role == "user" && (showSearch ? <RxCross2 size={25} className={`${currentMode.icon} md:hidden`} onClick={() => setShowSearch(false)} /> : <IoIosSearch size={25} className={`${currentMode.icon} md:hidden`} onClick={() => setShowSearch(true)} />)
                }
                {userData.role == "owner"? <>
                 {myShopData && <> <button className={`hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full ${currentMode.buttonSecondary}`} onClick={()=>navigate("/add-item")}>
                        <FaPlus size={20} />
                        <span>Add Food Item</span>
                    </button>
                      <button className={`md:hidden flex items-center p-2 cursor-pointer rounded-full ${currentMode.buttonSecondary}`} onClick={()=>navigate("/add-item")}>
                        <FaPlus size={20} />
                    </button></>}
                   
                    <div className={`hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg font-medium ${currentMode.buttonSecondary}`} onClick={()=>navigate("/my-orders")}>
                      <TbReceipt2 size={20}/>
                      <span>My Orders</span>
                      
                    </div>
                     <div className={`md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg font-medium ${currentMode.buttonSecondary}`} onClick={()=>navigate("/my-orders")}>
                      <TbReceipt2 size={20}/>
                      
                    </div>
                </>: (
                    <>
                 {userData.role=="user" &&    <div className='relative cursor-pointer' onClick={()=>navigate("/cart")}>
                    <FiShoppingCart size={25} className={currentMode.icon} />
                    <span className={`absolute right-[-9px] top-[-12px] ${currentMode.icon}`}>{cartItems.length}</span>
                </div>}   
           


                <button className={`hidden md:block px-3 py-1 rounded-lg text-sm font-medium ${currentMode.buttonSecondary}`} onClick={()=>navigate("/my-orders")}>
                    My Orders
                </button>
                    </>
                )}



                <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-white text-[18px] shadow-xl font-semibold cursor-pointer bg-gradient-to-r ${theme.gradient}`} onClick={() => setShowInfo(prev => !prev)}>
                    {userData?.fullName.slice(0, 1)}
                </div>
                {showInfo && <div className={`fixed top-[80px] right-[10px] 
                    ${userData.role=="deliveryBoy"?"md:right-[20%] lg:right-[40%]":"md:right-[10%] lg:right-[25%]"} w-[180px] shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999] ${currentMode.card}`}>
                    <div className={`text-[17px] font-semibold ${currentMode.text}`}>{userData.fullName}</div>
                    {userData.role=="user" && <div className={`md:hidden font-semibold cursor-pointer ${currentMode.icon}`} onClick={()=>navigate("/my-orders")}>My Orders</div>}
                    
                    <div className={`font-semibold cursor-pointer ${currentMode.icon}`} onClick={handleLogOut}>Log Out</div>
                </div>}

            </div>
        </div>
    )
}



export default Nav
