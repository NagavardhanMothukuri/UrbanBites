import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import { useTheme } from '../context/ThemeContext';

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)
    const { currentMode, theme } = useTheme()
    
    return (
        <div className={`min-h-screen flex justify-center p-6 transition-all duration-500 ${currentMode.bg}`}>

            <div className='w-full max-w-[800px]'>
                <div className='flex items-center gap-[20px] mb-6 '>
                    <div className=' z-[10] ' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={35} className={currentMode.icon} />
                    </div>
                    <h1 className={`text-2xl font-bold text-start ${currentMode.text}`}>Your Cart</h1>
                </div>
                {cartItems?.length == 0 ? (
                    <p className={`text-lg text-center ${currentMode.textMuted}`}>Your Cart is Empty</p>
                ) : (<>
                    <div className='space-y-4'>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>
                    <div className={`mt-6 p-4 rounded-xl shadow-lg flex justify-between items-center border transition-all duration-300 ${currentMode.card} ${currentMode.border}`}>

                        <h1 className={`text-lg font-semibold ${currentMode.text}`}>Total Amount</h1>
                        <span className={`text-xl font-bold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>₹{totalAmount}</span>
                    </div>
                    <div className='mt-4 flex justify-end' > 
                        <button className={`text-white px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer bg-gradient-to-r ${theme.gradient}`} onClick={()=>navigate("/checkout")}>Proceed to CheckOut</button>
                    </div>
                </>
                )}

            </div>
        </div>
    )
}

export default CartPage
