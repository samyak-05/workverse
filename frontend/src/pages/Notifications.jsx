import { useState, useEffect, useContext } from 'react'
import Navbar from "../components/Navbar"
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import dp from "../assets/dp.png"
import { MdDeleteOutline } from "react-icons/md"
import moment from 'moment'

function Notifications() {
    const { serverUrl } = useContext(authDataContext);
    const [notificationsData, setNotificationsData] = useState([]);

    const handleNotifications = async () => {
        try {
            const res = await axios.get(
                serverUrl + "/api/notification/",
                { withCredentials: true }
            );
            setNotificationsData(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`${serverUrl}/api/notification/delete/${id}`, { withCredentials: true });
            setNotificationsData(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.log(err);
        }
    }

    const clearAll = async () => {
        try {
            await axios.delete(serverUrl + "/api/notification", { withCredentials: true });
            setNotificationsData([]);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handleNotifications();
    }, []);

    const getNotificationText = (item) => {
        if (!item.relatedUser) return "You have a new notification";

        switch (item.type) {
            case "like":
                return `${item.relatedUser.firstName} liked your post`;
            case "comment":
                return `${item.relatedUser.firstName} commented on your post`;
            case "connectionAccepted":
                return `${item.relatedUser.firstName} accepted your connection request`;
            default:
                return "You have a new notification";
        }
    };

    return (
        <div className="w-screen min-h-screen bg-[#f0efe7] pt-[100px] px-[20px]">
            <Navbar />

            {notificationsData.length > 0 && (
                <div className="flex justify-end mb-[10px]">
                    <button
                        onClick={clearAll}
                        className="text-[14px] text-white w-[90px] rounded-lg h-[32px]
                            hover:text-red-600 hover:bg-white border border-red-600 
                            transition font-medium bg-red-600">Clear all
                    </button>
                </div>
            )}

            <div className="max-w-[720px] mx-auto flex flex-col gap-[18px]">

                {notificationsData.length === 0 ? (
                    <div className="text-center text-gray-500 mt-[80px] text-[16px]">
                        No notifications yet
                    </div>
                ) : (
                    notificationsData.map((item) => (
                        <div key={item._id} className="flex items-start justify-between
                            bg-white p-[16px] rounded-[16px] shadow-md hover:shadow-lg transition relative">
    
                            <div className="flex gap-[14px] flex-1">
                                <img 
                                    src={item.relatedUser?.profilePic || dp} 
                                    alt="user"
                                    className="w-[56px] h-[56px] rounded-full object-cover"
                                />

                                <div className="flex flex-col gap-[6px]">
                                    <p className="text-[16px] font-medium text-gray-900 leading-snug">
                                        {getNotificationText(item)}
                                    </p>
                                    <span className="text-[13px] text-gray-500">
                                        {moment(item.createdAt).fromNow()}
                                    </span>

                                    {item.relatedPost?.content && (
                                        <div className="mt-2 bg-gray-50 rounded-lg p-[10px] flex flex-col gap-2">
                                            {item.relatedPost.image && (
                                                <img
                                                    src={item.relatedPost.image}
                                                    alt="post"
                                                    className="w-[200px] h-[120px] object-cover rounded-md"
                                                />
                                            )}
                                            <p className="text-[14px] text-gray-700 truncate w-[200px] md:w-[600px]">
                                                {item.relatedPost.content}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delete Button */}
                            <MdDeleteOutline
                                onClick={() => deleteNotification(item._id)}
                                className="text-[22px] text-gray-400 hover:text-red-500 cursor-pointer absolute right-3 top-3"
                                title="Delete notification"
                            />
                        </div>
                    ))
                )}

            </div>
        </div>
    );
}

export default Notifications;
