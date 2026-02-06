import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoy from '../components/DeliveryBoy'
import { useTheme } from '../context/ThemeContext'

function Home() {
    const { userData } = useSelector(state => state.user)
    const { currentMode } = useTheme()
    
    return (
        <div className={`w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center transition-all duration-500 ${currentMode.bg}`}>
            {userData.role === "user" && <UserDashboard />}
            {userData.role === "owner" && <OwnerDashboard />}
            {userData.role === "deliveryBoy" && <DeliveryBoy />}
        </div>
    )
}

export default Home
