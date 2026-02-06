import React from 'react'
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import { useDispatch } from 'react-redux';
import { removeCartItem, updateQuantity } from '../redux/userSlice';
import { useTheme } from '../context/ThemeContext';

function CartItemCard({data}) {
    const dispatch=useDispatch()
    const { currentMode, theme, isDarkMode } = useTheme()

    const handleIncrease=(id,currentQty)=>{
       dispatch(updateQuantity({id,quantity:currentQty+1}))
    }
      const handleDecrease=(id,currentQty)=>{
        if(currentQty>1){
  dispatch(updateQuantity({id,quantity:currentQty-1}))
        }
        
    }
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl shadow-lg border transition-all duration-300 ${currentMode.card} ${currentMode.border}`}>
      <div className='flex items-center gap-4'>
        <img src={data.image} alt="" className={`w-20 h-20 object-cover rounded-lg border ${currentMode.border}`}/>
        <div>
            <h1 className={`font-medium ${currentMode.text}`}>{data.name}</h1>
            <p className={`text-sm ${currentMode.textMuted}`}>₹{data.price} x {data.quantity}</p>
            <p className={`font-bold ${currentMode.text}`}>₹{data.price*data.quantity}</p>
        </div>
      </div>
      <div className='flex items-center gap-3'>
        <button className={`p-2 cursor-pointer rounded-full transition-all duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={()=>handleDecrease(data.id,data.quantity)}>
        <FaMinus size={12} className={currentMode.text}/>
        </button>
        <span className={currentMode.text}>{data.quantity}</span>
        <button className={`p-2 cursor-pointer rounded-full transition-all duration-200 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}  onClick={()=>handleIncrease(data.id,data.quantity)}>
        <FaPlus size={12} className={currentMode.text}/>
        </button>
        <button className={`p-2 rounded-full transition-all duration-200 ${isDarkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
 onClick={()=>dispatch(removeCartItem(data.id))}>
<CiTrash size={18}/>
        </button>
      </div>
    </div>
  )
}


export default CartItemCard
