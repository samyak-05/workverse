import React, { useRef } from 'react'
import { FaFileImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { userDataContext } from "../context/UserContext"
import { authDataContext } from '../context/AuthContext'
import dp from '../assets/dp.png'
import axios from 'axios';

function CreatePost() {
    // Destructure postAdded and setPostAdded from context
    let { setCreatePost, userData, setPostAdded } = React.useContext(userDataContext);
    let { serverUrl } = React.useContext(authDataContext);
    
    let [content, setContent] = React.useState("");
    let [frontendPostImage, setFrontendPostImage] = React.useState("");
    let [backendPostImage, setBackendPostImage] = React.useState(null);
    let [loading, setLoading] = React.useState(false);
    let image = useRef();

    const handlePostImage = (e) => {
        let file = e.target.files[0];
        if (file) {
            setBackendPostImage(file);
            setFrontendPostImage(URL.createObjectURL(file));
        }
    }

    async function handleUpload() {
        if (!content.trim() && !backendPostImage) return; // Don't post empty

        try {
            setLoading(true);
            let formData = new FormData();
            formData.append("content", content);
            if (backendPostImage) {
                formData.append("image", backendPostImage);
            }

            await axios.post(serverUrl + "/api/post/create", formData, { withCredentials: true });
            
            // 1. Trigger the refresh by incrementing the dependency variable
            setPostAdded((prev) => prev + 1);
            
            // 2. Clear local state
            setContent("");
            setBackendPostImage(null);
            setFrontendPostImage("");
            
            setLoading(false);
            setCreatePost(false);

        } catch (err) {
            console.error("Upload error:", err);
            setLoading(false);
        }
    }

    return (
        <div className="w-[100%] h-[100vh] fixed top-0 z-[100] flex justify-center items-center">
            <div className="fixed inset-0 z-[100] flex justify-center items-center">
                <div className="fixed inset-0 bg-black opacity-60" onClick={() => setCreatePost(false)} />
                <div className="bg-white h-[550px] w-[90%] max-w-[500px] rounded-lg shadow-lg z-[200] relative p-[20px]">
                    <button className="absolute top-[10px] right-[10px] bg-red-600 text-white hover:bg-white hover:text-red-600
                            border border-red-600 w-[40px] h-[40px] rounded-full
                            font-semibold flex items-center justify-center"
                        onClick={() => setCreatePost(false)}>✕
                    </button>

                    <div className="mt-[25px] flex">
                        <div><img src={userData?.profilePic || dp} alt="" className="rounded-full h-[60px] w-[60px] object-cover" /></div>
                        <div className="font-bold text-[20px] ml-[10px] mt-[12px]">{userData?.firstName} {userData?.lastName}</div>
                    </div>

                    <div className="mt-[20px]">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <textarea 
                                className={`bg-[#f2f3ef] p-[7px] outline-none resize-none w-[100%] ${frontendPostImage ? 'h-[150px]' : 'h-[300px]'}`}
                                value={content} 
                                onChange={(e) => setContent(e.target.value)}
                                placeholder='What do you want to talk about?' 
                            />

                            <input type='file' accept='image/*' ref={image} onChange={handlePostImage} hidden />
                            
                            {frontendPostImage && (
                                <div className="w-[100%] flex justify-center items-center h-[160px] overflow-hidden mt-2">
                                    <img src={frontendPostImage} alt="" className="h-full object-cover" />
                                </div>
                            )}

                            <div className="mt-[15px] text-[20px] cursor-pointer w-[20px]" onClick={() => image.current.click()}>
                                <FaFileImage className="text-gray-600 hover:text-blue-600" />
                            </div>

                            <hr className="bg-[#858585c1] w-[100%] h-[2px] mt-[10px] "></hr>
                            
                            <button 
                                className="absolute right-[10px] bg-blue-600 text-white hover:bg-blue-700 
                                    disabled:bg-gray-400 border border-blue-600 w-[80px] h-[40px] rounded-md mt-[8px] 
                                    font-semibold flex items-center justify-center gap-1" 
                                disabled={loading} 
                                type="button"
                                onClick={handleUpload}
                            >
                                {loading ? "..." : "Post"} <IoMdSend />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePost;