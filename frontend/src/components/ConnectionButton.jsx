import { useEffect, useContext, useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import { userDataContext } from '../context/UserContext'
import axios from 'axios'
import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom'

const socket = io("http://localhost:4000");
function ConnectionButton({ userId }) {
    const { serverUrl } = useContext(authDataContext)
    const { userData } = useContext(userDataContext)
    let [status, setStatus] = useState("connect");
    let navigate = useNavigate();

    const labelMap = {
        connect: "Connect",
        pending: "Pending",
        received: "Respond",
        disconnect: "Disconnect"
    };

    const handleSendRequest = async () => {
        try {
            let res = await axios.post(`${serverUrl}/api/connections/send/${userId}`, {}, { withCredentials: true })
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    const handleRemoveRequest = async () => {
        try {
            let res = await axios.delete(`${serverUrl}/api/connections/remove/${userId}`, { withCredentials: true })
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    const handleGetRequest = async () => {
        try {
            let res = await axios.get(`${serverUrl}/api/connections/getStatus/${userId}`, { withCredentials: true })
            setStatus(res.data.status);
        } catch (err) {
            console.log(err);
        }
    }

    const handleClick = async () => {
        if (status === "disconnect") {
            await handleRemoveRequest();
        } else if (status === "received") {
            navigate("/network");
        } else {
            await handleSendRequest();
        }
    }

    useEffect(() => {
        if (!userData?._id) return;
        socket.emit("register", userData._id);
        handleGetRequest();
        socket.on("newConnectionRequest", ({ updatedUserId, newStatus }) => {
            if (String(updatedUserId) === String(userId)) {
                setStatus(newStatus);
            }
        });
        return () => socket.off("newConnectionRequest");
    }, [userData, userId]);

    return (
        <button className='flex justify-center items-center gap-[5px] pl-[10px] pr-[10px] border border-blue-600 
            rounded-xl w-[100%] text-blue-600 hover:bg-blue-600 hover:text-white min-w-[100px] h-[30px]
            transition-all duration-150' onClick={handleClick} disabled={status==="pending"}> {labelMap[status]}
        </button>
    )
}

export default ConnectionButton
