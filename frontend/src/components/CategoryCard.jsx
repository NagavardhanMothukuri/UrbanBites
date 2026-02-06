import React from 'react'
import { useTheme } from '../context/ThemeContext'

function CategoryCard({name,image,onClick}) {
  const { currentMode, theme, isDarkMode } = useTheme()
  
  return (
    <div className={`w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 shrink-0 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 relative cursor-pointer group ${currentMode.card} ${currentMode.border} ${currentMode.shadow}`} onClick={onClick}>
     <img src={image} alt="" className='w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500'/>
     <div className={`absolute bottom-0 w-full left-0 px-3 py-2 rounded-t-xl text-center shadow-lg text-sm font-medium backdrop-blur-md transition-all duration-300 bg-gradient-to-r ${theme.gradient} text-white`}>
{name}
     </div>
    </div>
  )
}

export default CategoryCard
