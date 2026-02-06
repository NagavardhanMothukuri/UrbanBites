import React from 'react'
import Nav from './NaV.JSX'
import { useSelector } from 'react-redux'
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaPen } from "react-icons/fa";
import OwnerItemCard from './ownerItemCard';
import { useTheme } from '../context/ThemeContext';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  const navigate = useNavigate()
  const { currentMode, theme } = useTheme()

  
  return (
    <div className={`w-full min-h-screen flex flex-col items-center transition-all duration-500 ${currentMode.bg}`}>

      <Nav />
      {!myShopData &&
        <div className='flex justify-center items-center p-4 sm:p-6'>
          <div className={`w-full max-w-md shadow-lg rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 ${currentMode.card} ${currentMode.border}`}>
            <div className='flex flex-col items-center text-center'>
              <div className={`p-4 rounded-full mb-4 bg-gradient-to-r ${theme.gradient}`}>
                <FaUtensils className='text-white w-16 h-16 sm:w-20 sm:h-20' />
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${currentMode.text}`}>Add Your Restaurant</h2>
              <p className={`mb-4 text-sm sm:text-base ${currentMode.textMuted}`}>Join our food delivery platform and reach thousands of hungry customers every day.
              </p>
              <button className={`text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r ${theme.gradient}`} onClick={() => navigate("/create-edit-shop")}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      }


      {myShopData &&
        <div className='w-full flex flex-col items-center gap-6 px-4 sm:px-6'>
          <h1 className={`text-2xl sm:text-3xl flex items-center gap-3 mt-8 text-center ${currentMode.text}`}>
            <div className={`p-3 rounded-full bg-gradient-to-r ${theme.gradient}`}>
              <FaUtensils className='text-white w-14 h-14' />
            </div>
            Welcome to {myShopData.name}
          </h1>

          <div className={`shadow-lg rounded-xl overflow-hidden border hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative ${currentMode.card} ${currentMode.border}`}>
            <div className={`absolute top-4 right-4 text-white p-2 rounded-full shadow-md transition-all cursor-pointer bg-gradient-to-r ${theme.gradient}`} onClick={()=>navigate("/create-edit-shop")}>
<FaPen size={20}/>
            </div>
             <img src={myShopData.image} alt={myShopData.name} className='w-full h-48 sm:h-64 object-cover'/>
             <div className='p-4 sm:p-6'>
              <h1 className={`text-xl sm:text-2xl font-bold mb-2 ${currentMode.text}`}>{myShopData.name}</h1>
              <p className={currentMode.textMuted}>{myShopData.city},{myShopData.state}</p>
              <p className={`mb-4 ${currentMode.textMuted}`}>{myShopData.address}</p>
            </div>
          </div>


          {myShopData.items.length==0 && 
            <div className='flex justify-center items-center p-4 sm:p-6'>
          <div className={`w-full max-w-md shadow-lg rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 ${currentMode.card} ${currentMode.border}`}>
            <div className='flex flex-col items-center text-center'>
              <div className={`p-4 rounded-full mb-4 bg-gradient-to-r ${theme.gradient}`}>
                <FaUtensils className='text-white w-16 h-16 sm:w-20 sm:h-20' />
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${currentMode.text}`}>Add Your Food Item</h2>
              <p className={`mb-4 text-sm sm:text-base ${currentMode.textMuted}`}>Share your delicious creations with our customers by adding them to the menu.
              </p>
              <button className={`text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-r ${theme.gradient}`} onClick={() => navigate("/add-item")}>
              Add Food
              </button>
            </div>
          </div>
        </div>
            }


            {myShopData.items.length>0 && <div className='flex flex-col items-center gap-4 w-full max-w-3xl '>
              {myShopData.items.map((item,index)=>(
                <OwnerItemCard data={item} key={index}/>
              ))}
              </div>}
            
        </div>}



    </div>
  )
}

export default OwnerDashboard
