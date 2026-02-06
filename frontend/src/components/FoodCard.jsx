import React, { useState } from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import { useTheme } from '../context/ThemeContext';


function FoodCard({data}) {
const [quantity,setQuantity]=useState(0)
const dispatch=useDispatch()
const {cartItems}=useSelector(state=>state.user)
const { currentMode, theme, isDarkMode } = useTheme()

    const renderStars=(rating)=>{   //r=3
        const stars=[];
        for (let i = 1; i <= 5; i++) {
           stars.push(
            (i<=rating)?(
                <FaStar key={i} className='text-yellow-500 text-lg'/>
            ):(
                <FaRegStar key={i} className='text-yellow-500 text-lg'/>
            )
           )
            
        }
return stars
    }


const handleIncrease=()=>{
    const newQty=quantity+1
    setQuantity(newQty)
}
const handleDecrease=()=>{
    if(quantity>0){
const newQty=quantity-1
    setQuantity(newQty)
    }
    
}

  return (
    <div className={`w-[250px] rounded-2xl border-2 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col ${currentMode.card} ${currentMode.border} ${currentMode.shadow}`}>
      <div className={`relative w-full h-[170px] flex justify-center items-center ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
        <div className={`absolute top-3 right-3 rounded-full p-1 shadow ${currentMode.card}`}>{data.foodType=="veg"?<FaLeaf className='text-green-600 text-lg'/>:<FaDrumstickBite className='text-red-600 text-lg'/>}</div>
        {data.discount && data.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow">
            {data.discount}% OFF
          </div>
        )}

<img src={data.image} alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'/>
      </div>

      <div className="flex-1 flex flex-col p-4">
<h1 className={`font-semibold text-base truncate ${currentMode.text}`}>{data.name}</h1>

<div className='flex items-center gap-1 mt-1'>
{renderStars(data.rating?.average || 0)}
<span className={`text-xs ${currentMode.textMuted}`}>
    {data.rating?.count || 0}
</span>
</div>
      </div>

<div className='flex items-center justify-between mt-auto p-3'>
<span className={`font-bold text-lg ${currentMode.text}`}>
    {data.discount && data.discount > 0 ? (
        <>
            <span className="line-through text-gray-500">₹{data.price}</span> <span className="font-bold text-green-600">₹{Math.round(data.price * (1 - data.discount / 100))}</span>
        </>
    ) : (
        <>₹{data.price}</>
    )}
</span>

<div className={`flex items-center border rounded-full overflow-hidden shadow-sm ${currentMode.border}`}>
<button className={`px-2 py-1 transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`} onClick={handleDecrease}>
<FaMinus size={12} className={currentMode.text}/>
</button>
<span className={currentMode.text}>{quantity}</span>
<button className={`px-2 py-1 transition ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`} onClick={handleIncrease}>
<FaPlus size={12} className={currentMode.text}/>
</button>
<button className={`text-white px-3 py-2 transition-colors ${cartItems.some(i=>i.id==data._id)?'bg-gray-800':`bg-gradient-to-r ${theme.gradient}`}`}  onClick={()=>{
    quantity>0?dispatch(addToCart({
          id:data._id,
          name:data.name,
          price: data.discount && data.discount > 0 ? Math.round(data.price * (1 - data.discount / 100)) : data.price,
          image:data.image,
          shop:data.shop,
          quantity,
          foodType:data.foodType
})):null}}>
<FaShoppingCart size={16}/>
</button>
</div>
</div>


    </div>
  )
}


export default FoodCard
