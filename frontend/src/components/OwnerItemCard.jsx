import axios from 'axios';
import React from 'react'
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
import { useTheme } from '../context/ThemeContext';

function OwnerItemCard({data}) {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const { currentMode, theme } = useTheme()
    const handleDelete=async () => {

      try {
        const result=await axios.get(`${serverUrl}/api/item/delete/${data._id}`,{withCredentials:true})
        dispatch(setMyShopData(result.data))
      } catch (error) {
        console.log(error)
      }
    }
  return (
    <div className={`flex rounded-lg shadow-lg overflow-hidden border w-full max-w-2xl transition-all duration-300 ${currentMode.card} ${currentMode.border}`}>
      <div className={`w-36 flex-shrink-0 ${currentMode.cardAlt} relative`}>
        <img src={data.image} alt="" className='w-full h-full object-cover'/>
        {data.discount && data.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow">
            {data.discount}% OFF
          </div>
        )}
      </div>
      <div className='flex flex-col justify-between p-3 flex-1'>
          <div>
<h2 className={`text-base font-semibold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>{data.name}</h2>
<p className={currentMode.textMuted}><span className={`font-medium ${currentMode.text}`}>Category:</span> {data.category}</p>
<p className={currentMode.textMuted}><span className={`font-medium ${currentMode.text}`}>Food Type:</span> {data.foodType}</p>
          </div>
          <div className='flex items-center justify-between'>
            <div className={`font-bold ${((data.discount || 0) > 0) ? '' : `bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}`}>
                {data.discount && data.discount > 0 ? (
                    <>
                        <span className="line-through text-gray-500">₹{data.price}</span> <span className="font-bold text-green-600">₹{Math.round(data.price * (1 - data.discount / 100))}</span>
                    </>
                ) : (
                    <>₹{data.price}</>
                )}
            </div>
          <div className='flex items-center gap-2'>
<div className={`p-2 cursor-pointer rounded-full transition-all duration-200 ${currentMode.icon} hover:bg-opacity-10 hover:bg-gray-500`} onClick={()=>navigate(`/edit-item/${data._id}`)}>
<FaPen size={16}/>
</div>
<div className={`p-2 cursor-pointer rounded-full transition-all duration-200 ${currentMode.icon} hover:bg-opacity-10 hover:bg-gray-500`} onClick={handleDelete}>
<FaTrashAlt size={16}/>
</div>
          </div>

          </div>
      </div>
    </div>
  )
}


export default OwnerItemCard
