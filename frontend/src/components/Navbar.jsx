import { useState, useContext, useEffect } from 'react'
import workverse from '../assets/workverse.png'
import { CiSearch } from "react-icons/ci";
import { IoMdHome } from "react-icons/io";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import dp from '../assets/dp.png'
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  let [activeSearch, setActiveSearch] = useState(false);
  let [activeProfile, setActiveProfile] = useState(false);
  let { userData, setUserData, getProfile } = useContext(userDataContext);
  let { serverUrl } = useContext(authDataContext);
  let [searchInput, setSearchInput] = useState("");
  let [searchData, setSearchData] = useState([]);
  let navigate = useNavigate();

  const handleSignOut = () => {
    try {
      let res = axios.get(serverUrl + "/api/auth/signout", { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (err) {
      console.log("Error during logout:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
  }

  const handleSearch = async () => {
    try {
      let res = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, { withCredentials: true });
      setSearchData(res.data);
      console.log(res.data)
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    handleSearch();
  }, [searchInput])

  return (
    <div className="fixed top-0 left-0 w-full h-[80px] bg-white shadow-md flex justify-between md:justify-around items-center z-50">
      <div className="flex justify-center items-center gap-[10px] cursor-pointer">
        <img src={workverse} alt="logo" className='w-[40px] h-[40px]' onClick={() => { navigate("/") }} />
        {!activeSearch && (
          <div className="text-gray-700 text-[25px] lg:hidden" onClick={() => setActiveSearch(true)}>
            <CiSearch />
          </div>
        )}
        {searchInput && <div className="absolute top-[90px] min-h-[100px] left-[0px] lg:left-[20px]
            shadow-lg w-[100%] lg:w-[700px] bg-white flex flex-col gap-[20px] p-[20px]">
          {searchData.length === 0 && <div className="flex items-center justify-center 
          text-gray-700 text-[22px]">No accounts found !</div>}
          {searchData.map((sea) => (
            <div key={sea._id}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b-2 border-b-gray-300"
              onClick={()=>{getProfile(sea.username)
                  setSearchInput("");
              }}>
              <div className="w-[45px] h-[45px] rounded-full overflow-hidden">
                <img
                  src={sea.profilePic || dp}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-[19px] font-semibold text-gray-700">
                {sea.firstName} {sea.lastName}
              </div>

              <div className="text-[13px] font-semibold text-gray-700 hidden md:block">
                {sea.headline}
              </div>
            </div>
          ))}
        </div>}
        <form
          className={`lg:flex items-center gap-[10px] lg:w-[350px] h-[40px]
           rounded-md px-4 bg-[#f3f2ef]
           focus-within:border-blue-700 ${!activeSearch ? "hidden" : "flex"}`}>
          <div className="text-gray-700 text-[25px]" onClick={() => setActiveSearch(false)}>
            <CiSearch />
          </div>
          <input type="text" placeholder='Search...' className='w-[80%] h-full bg-transparent outline-none'
            onChange={(e) => { setSearchInput(e.target.value) }} value={searchInput} />
        </form>
      </div>

      <div className="flex justify-center items-center gap-[20px] text-gray-500 relative">

        {/* Home */}
        <div className="md:flex flex-col items-center cursor-pointer hover:text-black transition-colors duration-150 hidden"
          onClick={() => navigate("/")}>
          <IoMdHome className="text-[28px]" />
          <span className="text-[13px] font-semibold">Home</span>
        </div>

        {/* Network */}
        <div className="md:flex flex-col items-center cursor-pointer hover:text-black transition-colors duration-150 hidden"
          onClick={() => navigate("/network")}>
          <FaPeopleGroup className="text-[28px]" />
          <span className="text-[13px] font-semibold">Network</span>
        </div>

        {/* Notifications */}
        <div className="flex flex-col items-center cursor-pointer hover:text-black transition-colors duration-150">
          <IoIosNotifications className="text-[30px] md:text-[28px]" />
          <span className="md:inline text-[13px] font-semibold hidden">Notifications</span>
        </div>

        {/* Profile */}
        <div className="cursor-pointer" onClick={() => setActiveProfile(!activeProfile)}>
          <img
            src={userData.profilePic || dp}
            alt="Profile Pic"
            className="w-[60px] h-[60px] rounded-full border-2 border-transparent hover:border-blue-600 transition-all duration-150"
          />
        </div>

        {activeProfile && (
          <div className="h-[300px] w-[300px] absolute bg-white rounded-lg shadow-lg top-[87px] flex flex-col items-center justify-start gap-[15px] p-[15px]">
            <div className="cursor-pointer">
              <img
                src={userData.profilePic || dp}
                alt="Profile Pic"
                className="w-[80px] h-[80px] rounded-full border-2 border-transparent hover:border-blue-600 transition-all duration-150"
              />
            </div>
            <div>
              <span className='text-black font-bold text-[20px]'>
                {userData.firstName} {userData.lastName}
              </span>
            </div>
            <div>
              <button className='border border-blue-600 rounded-xl w-[200px] text-blue-600 hover:bg-blue-600
              hover:text-white transition-all duration-150' onClick={() => getProfile(userData.username)}>See Profile</button>
            </div>
            <div className='w-full h-[1px] bg-gray-300'></div>
            <div className='flex justify-start items-center w-full gap-[10px] hover:text-black cursor-pointer transition-colors duration-150'
              onClick={() => navigate("/network")}>
              <FaPeopleGroup className="text-[25px]" />
              <span className="text-[20px] font-semibold">My Network</span>
            </div>
            <div>
              <button
                className='border border-red-600 rounded-xl w-[200px] text-red-600 hover:bg-red-600 hover:text-white transition-all duration-150'
                onClick={() => {
                  handleSignOut();
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;

