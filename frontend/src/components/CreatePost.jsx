import React, {useRef} from 'react'
import { FaFileImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { userDataContext } from "../context/UserContext"
import {authDataContext} from '../context/AuthContext'
import axios from 'axios';

function CreatePost() {
    let { createPost, setCreatePost, userData, setUserData } = React.useContext(userDataContext);
    let {serverUrl} = React.useContext(authDataContext);
    let [content, setContent] = React.useState("");
    let [frontendPostImage, setFrontendPostImage] = React.useState("");
    let [backendPostImage, setBackendPostImage] = React.useState(null);
    let [loading, setLoading] = React.useState(false);
    let image = useRef();

    const handlePostImage = (e) =>{
        let file = e.target.files[0];
        setBackendPostImage(file);
        setFrontendPostImage(URL.createObjectURL(file));
    }

    async function handleUpload() {
        try{
            setLoading(true);
            let formData = new FormData();
            formData.append("content",content);
            if(backendPostImage){
                formData.append("image",backendPostImage);
            }

            let res = await axios.post(serverUrl+"/api/post/create",formData,{withCredentials : true});
            setLoading(false);
            setCreatePost(false);

        } catch (err) {
            console.log(err);
            setLoading(false);
            setCreatePost(false);
        }
    }

    return (
        <div className="w-[100%] h-[100vh] fixed top-0 z-[100] flex justify-center items-center">
            <div className="fixed inset-0 z-[100] flex justify-center items-center">

                {/* Overlay */}
                <div className="fixed inset-0 bg-black opacity-60" />

                {/* Modal */}
                <div className="bg-white h-[550px] w-[90%] max-w-[500px] rounded-lg shadow-lg z-[200] relative p-[20px]">
                    <button className="absolute top-[10px] right-[10px] bg-red-600 text-white hover:bg-white hover:text-red-600
                            border border-red-600 w-[40px] h-[40px] rounded-full
                            font-semibold flex items-center justify-center"
                            onClick={() => setCreatePost(false)}>✕
                    </button>

                    <div className="mt-[25px] flex">
                        <div><img src={userData.profilePic} alt="" className="rounded-full h-[60px] w-[60px]"/></div>
                        <div className="font-bold text-[20px] ml-[10px] mt-[12px]">{userData.firstName} {userData.lastName}</div>
                    </div>

                    <div className="mt-[20px]">
                        <form>
                            <textarea className={`bg-[#f2f3ef] p-[7px] outline-none resize-none w-[100%] ${frontendPostImage?'h-[150px]':'h-[300px]'}`} 
                            value={content} onChange={(e)=>setContent(e.target.value)}
                            placeholder='what you want to say...'/>

                            <input type='file' accept='image/*' ref={image} onChange={handlePostImage} hidden/>
                            <div className={`w-[100%] flex justify-center items-center ${frontendPostImage?'h-[160px]':'h-[0px]'} overflow-hidden`}>
                                <img src={frontendPostImage} alt="" className="h-full"/>
                            </div>
                            <div className="mt-[15px] text-[20px] cursor-pointer w-[20px]" onClick={()=>image.current.click()}>
                               <FaFileImage />
                            </div>

                            
                            <hr className="bg-[#858585c1] w-[100%] h-[5px] mt-[10px] "></hr>
                            <button className="absolute right-[10px] bg-blue-600 text-white hover:bg-white hover:text-blue-600
                                    border border-blue-600 w-[70px] h-[40px] rounded-md mt-[8px] 
                                    font-semibold flex items-center justify-center" disabled={loading} type="button"
                                    onClick={handleUpload}>Post <IoMdSend />
                            </button>
                        </form>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default CreatePost
