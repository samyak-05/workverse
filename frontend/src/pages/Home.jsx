import React from 'react'
import Navbar from '../components/Navbar.jsx'
import dp from '../assets/dp.png'
import { FaPlus } from "react-icons/fa"
import { userDataContext } from '../context/UserContext.jsx'
import { FaPen } from "react-icons/fa";


function Home() {
  let {userData} = React.useContext(userDataContext)

  return (
    <div className='w-full min-h-[100vh] bg-[#f2f3ef] flex justify-center items-start md:flex-row pt-[90px] p-[20px] gap-[20px] flex-col'>
      <Navbar />

      <div className='w-full lg:w-[20%] min-h-[250px] bg-white shadow-lg rounded-lg p-[10px] relative'>

        <div className="w-full h-[100px] bg-gray-600 rounded overflow-hidden"></div>

        <div className="absolute w-[90px] h-[90px] top-[55px] left-[10px] cursor-pointer">
          <img
            src={dp}
            alt=""
            className="w-full h-full rounded-full object-cover"
          />

          <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute bottom-[18px] right-[18px] rounded-full flex justify-center items-center">
            <FaPlus className="text-white text-[12px]" />
          </div>
        </div>

        <div className="mt-[30px] pl-[10px]">
          <div className="font-semibold text-[20px]">{userData.firstName} {userData.lastName}</div>
          <div className="font-semibold text-[17px]">{userData.headline || ""}</div>
          <div className="font-semibold text-[13px] text-gray-600">{userData.location}</div>
          <div className="w-[100%] mt-[15px]">
             <button className='flex justify-center items-center gap-[5px] p-[2px] border  border-blue-600 rounded-xl w-[100%] text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-150'>Edit Profile <FaPen/></button> 
          </div>
        </div>

      </div>

      <div className='w-full lg:w-[50%] min-h-[250px] bg-white shadow-lg'></div>
      <div className='w-full lg:w-[25%] min-h-[250px] bg-white shadow-lg'></div>
    </div>
  )
}

export default Home
