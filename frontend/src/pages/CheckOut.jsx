import React, { useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import { TbCurrentLocation } from "react-icons/tb";
import { IoLocationSharp } from "react-icons/io5";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css"
import { setAddress, setLocation } from '../redux/mapSlice';
import { MdDeliveryDining } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import axios from 'axios';
import { FaMobileScreenButton } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { addMyOrder, setTotalAmount } from '../redux/userSlice';
import { useTheme } from '../context/ThemeContext';

function RecenterMap({ location }) {
  if (location.lat && location.lon) {
    const map = useMap()
    map.setView([location.lat, location.lon], 16, { animate: true })
  }
  return null

}

function CheckOut() {
  const { location, address } = useSelector(state => state.map)
    const { cartItems ,totalAmount,userData} = useSelector(state => state.user)
  const [addressInput, setAddressInput] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  const deliveryFee=totalAmount>500?0:40
  const AmountWithDeliveryFee=totalAmount+deliveryFee
  const { currentMode, theme } = useTheme()







  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng
    dispatch(setLocation({ lat, lon: lng }))
    getAddressByLatLng(lat, lng)
  }
  const getCurrentLocation = () => {
      const latitude=userData.location.coordinates[1]
      const longitude=userData.location.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }))
      getAddressByLatLng(latitude, longitude)
   

  }

  const getAddressByLatLng = async (lat, lng) => {
    try {

      const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
      dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
      console.log(error)
    }
  }

  const getLatLngByAddress = async () => {
    try {
      const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`)
      const { lat, lon } = result.data.features[0].properties
      dispatch(setLocation({ lat, lon }))
    } catch (error) {
      console.log(error)
    }
  }

  const handlePlaceOrder=async () => {
    setLoading(true)
    setError("")
    try {
      const result=await axios.post(`${serverUrl}/api/order/place-order`,{
        paymentMethod,
        deliveryAddress:{
          text:addressInput,
          latitude:location.lat,
          longitude:location.lon
        },
        totalAmount:AmountWithDeliveryFee,
        cartItems
      },{withCredentials:true})

      if(paymentMethod=="cod"){
      dispatch(addMyOrder(result.data))
      navigate("/order-placed")
      }else if(paymentMethod=="online"){
        const orderId=result.data.orderId
        const razorOrder=result.data.razorOrder
        if(!razorOrder || !razorOrder.id){
          setError("Failed to create payment order. Please try again.")
          setLoading(false)
          return
        }
        openRazorpayWindow(orderId,razorOrder)
      }else if(paymentMethod=="upi"){
        const order=result.data.order
        const upiId=result.data.upiId
        const upiQrCode=result.data.upiQrCode
        const transactionId=result.data.transactionId
        if(!order || !upiId){
          setError("Failed to create UPI order. Please try again.")
          setLoading(false)
          return
        }
        navigate('/upi-payment', { state: { order, upiId, upiQrCode, transactionId } })
      }

    
    } catch (error) {
      console.log(error)
      setError(error.response?.data?.message || "Failed to place order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

const openRazorpayWindow=(orderId,razorOrder)=>{
  // Check if Razorpay is loaded
  if(!window.Razorpay){
    setError("Payment gateway not loaded. Please refresh the page and try again.")
    return
  }

  const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID
  if(!keyId){
    setError("Payment configuration error. Please contact support.")
    return
  }

  const options={
    key: keyId,
    amount: razorOrder.amount,
    currency: razorOrder.currency || 'INR',
    name: "UrbanBites",
    description: "Food Delivery Order",
    order_id: razorOrder.id,
    handler: async function (response) {
      try {
        const result=await axios.post(`${serverUrl}/api/order/verify-payment`,{
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          orderId
        },{withCredentials:true})
        dispatch(addMyOrder(result.data))
        navigate("/order-placed")
      } catch (error) {
        console.log(error)
        setError("Payment verification failed. Please contact support.")
      }
    },
    prefill: {
      name: userData?.fullName || "",
      email: userData?.email || "",
      contact: userData?.mobile || ""
    },
    theme: {
      color: "#ff4d2d"
    },
    modal: {
      ondismiss: function() {
        setLoading(false)
      }
    }
  }

  try {
    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', function (response) {
      setError("Payment failed: " + (response.error?.description || "Unknown error"))
      setLoading(false)
    })
    rzp.open()
  } catch (err) {
    console.error("Razorpay error:", err)
    setError("Failed to open payment window. Please try again.")
    setLoading(false)
  }
}


  useEffect(() => {
    setAddressInput(address)
  }, [address])
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 ${currentMode.bg}`}>
      <div className=' absolute top-[20px] left-[20px] z-[10]' onClick={() => navigate("/")}>
        <IoIosArrowRoundBack size={35} className={currentMode.icon} />
      </div>
      <div className={`w-full max-w-[900px] rounded-2xl shadow-2xl p-6 space-y-6 transition-all duration-300 ${currentMode.card}`}>
        <h1 className={`text-2xl font-bold ${currentMode.text}`}>Checkout</h1>


        {error && (
          <div className={`p-4 border rounded-xl text-sm ${currentMode.error}`}>
            {error}
          </div>
        )}

        <section>
          <h2 className={`text-lg font-semibold mb-2 flex items-center gap-2 ${currentMode.text}`}><IoLocationSharp className={currentMode.icon} /> Delivery Location</h2>
          <div className='flex gap-2 mb-3'>
            <input type="text" className={`flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${currentMode.input}`} placeholder='Enter Your Delivery Address..' value={addressInput} onChange={(e) => setAddressInput(e.target.value)} />
            <button className={`text-white px-3 py-2 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg bg-gradient-to-r ${theme.gradient}`} onClick={getLatLngByAddress}><IoSearchOutline size={17} /></button>
            <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg' onClick={getCurrentLocation}><TbCurrentLocation size={17} /></button>
          </div>

          <div className='rounded-xl border overflow-hidden'>
            <div className='h-64 w-full flex items-center justify-center'>
              <MapContainer
                className={"w-full h-full"}
                center={[location?.lat, location?.lon]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap location={location} />
                <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{ dragend: onDragEnd }} />


              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mb-3 ${currentMode.text}`}>Payment Method</h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-300 cursor-pointer ${paymentMethod === "cod" ? `${currentMode.border} ${currentMode.active} shadow-lg` : `${currentMode.border} hover:shadow-md`
              }`} onClick={() => setPaymentMethod("cod")}>

              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === "cod" ? `bg-gradient-to-r ${theme.gradient} text-white` : 'bg-green-100'}`}>
                <MdDeliveryDining className={`text-xl ${paymentMethod === "cod" ? 'text-white' : 'text-green-600'}`} />
              </span>
              <div >
                <p className={`font-medium ${currentMode.text}`}>Cash On Delivery</p>
                <p className={`text-xs ${currentMode.textMuted}`}>Pay when your food arrives</p>
              </div>

            </div>
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-300 cursor-pointer ${paymentMethod === "online" ? `${currentMode.border} ${currentMode.active} shadow-lg` : `${currentMode.border} hover:shadow-md`
              }`} onClick={() => setPaymentMethod("online")}>

              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === "online" ? `bg-gradient-to-r ${theme.gradient} text-white` : 'bg-purple-100'}`}>
                <FaMobileScreenButton className={`text-lg ${paymentMethod === "online" ? 'text-white' : 'text-purple-700'}`} />
              </span>
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === "online" ? `bg-gradient-to-r ${theme.gradient} text-white` : 'bg-blue-100'}`}>
                <FaCreditCard className={`text-lg ${paymentMethod === "online" ? 'text-white' : 'text-blue-700'}`} />
              </span>
              <div>
                <p className={`font-medium ${currentMode.text}`}>UPI / Credit / Debit Card</p>
                <p className={`text-xs ${currentMode.textMuted}`}>Pay Securely Online</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-300 cursor-pointer ${paymentMethod === "upi" ? `${currentMode.border} ${currentMode.active} shadow-lg` : `${currentMode.border} hover:shadow-md`
              }`} onClick={() => setPaymentMethod("upi")}>

              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === "upi" ? `bg-gradient-to-r ${theme.gradient} text-white` : 'bg-green-100'}`}>
                <FaMobileScreenButton className={`text-lg ${paymentMethod === "upi" ? 'text-white' : 'text-green-700'}`} />
              </span>
              <div>
                <p className={`font-medium ${currentMode.text}`}>UPI Payment</p>
                <p className={`text-xs ${currentMode.textMuted}`}>Pay directly to restaurant</p>
              </div>
            </div>
          </div>
        </section>


        <section>
          <h2 className={`text-lg font-semibold mb-3 ${currentMode.text}`}>Order Summary</h2>
<div className={`rounded-xl border p-4 space-y-2 transition-all duration-300 ${currentMode.border} ${currentMode.cardAlt}`}>
{cartItems.map((item,index)=>(
  <div key={index} className={`flex justify-between text-sm ${currentMode.text}`}>
<span>{item.name} x {item.quantity}</span>
<span>₹{item.price*item.quantity}</span>
  </div>
 
))}
 <hr className={`my-2 ${currentMode.border}`}/>
<div className={`flex justify-between font-medium ${currentMode.text}`}>
  <span>Subtotal</span>
  <span>{totalAmount}</span>
</div>
<div className={`flex justify-between ${currentMode.textMuted}`}>
  <span>Delivery Fee</span>
  <span>{deliveryFee==0?"Free":deliveryFee}</span>
</div>
<div className={`flex justify-between text-lg font-bold pt-2 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
    <span>Total</span>
  <span>{AmountWithDeliveryFee}</span>
</div>
</div>
        </section>
        <button 
          className={`w-full text-white py-3 rounded-xl font-semibold disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl bg-gradient-to-r ${theme.gradient}`} 
          onClick={handlePlaceOrder}
          disabled={loading}
        > 
          {loading ? "Processing..." : (paymentMethod=="cod"?"Place Order":"Pay & Place Order")}
        </button>


      </div>
    </div>
  )
}

export default CheckOut
