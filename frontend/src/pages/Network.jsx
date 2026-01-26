import { useState, useEffect, useContext } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import { RxCrossCircled } from "react-icons/rx";
import { CiCircleCheck } from "react-icons/ci";

function Network() {
  let { serverUrl } = useContext(authDataContext);
  let [requests, setRequests] = useState([]);
  let [refresh, setRefresh] = useState(0);

  const handleRefresh = () => {setRefresh((prev)=>prev+1)};

  const getRequests = async () => {
    try {
      let res = await axios.get(`${serverUrl}/api/connections/requests`, { withCredentials: true });
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const rejectReq = async (requestId) =>{
    try {
      let res = await axios.put(`${serverUrl}/api/connections/reject/${requestId}`,{},{withCredentials : true});
      setRequests(requests.filter((req)=>req._id==requestId))
      handleRefresh();
    } catch (err) {
      console.log(err);
    }
  }

  const acceptReq = async (requestId) =>{
    try {
      let res = await axios.put(`${serverUrl}/api/connections/accept/${requestId}`,{},{withCredentials : true});
      setRequests(requests.filter((req)=>req._id==requestId))
      handleRefresh();
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getRequests();
  }, [handleRefresh]);

  return (
    <div className="w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]">
      <Navbar />
      <div className="w-full h-[100px] bg-white shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600">
        Invitations {requests.length}
      </div>

      {requests.length > 0 && (
        <div className="w-[100%] max-w-[900px] shadow-lg rounded-lg flex flex-col gap-[20px] min-h-[100px] mt-[20px] bg-white">
          {requests.map((request, index) => (
            <div key={request._id || index} className="w-full min-h-[100px] p-[20px] 
              flex justify-between items-center border-b last:border-b-0">
              <div className="flex justify-center items-center gap-[10px]">
                <img src={request.sender.profilePic || "/default-avatar.png"}
                  className="w-[50px] h-[50px] rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-gray-800">
                    {request.sender.firstName} {request.sender.lastName}
                  </span>
                  <span className="text-[13px] text-gray-500">
                    {request.sender.headline || ""}
                  </span>
                </div>
              </div>

              <div className="flex justify-center items-center gap-[10px]">
                <button className="text-[#1891c5] border border-[#1891c5] px-[15px] 
                  h-[40px] rounded-lg hover:bg-[#1891c5] hover:text-white transition-all text-[30px]"
                  onClick={()=>acceptReq(request._id)}>
                    <CiCircleCheck />
                </button>

                <button className="text-red-500 border border-red-500 px-[15px] 
                  h-[40px] rounded-lg hover:bg-red-500 hover:text-white transition-all text-[30px]"
                  onClick={()=>rejectReq(request._id)}>
                    <RxCrossCircled />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default Network
