import { useEffect, useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import dp from '../assets/dp.png'
import { userDataContext } from '../context/UserContext.jsx'
import { FaPen } from "react-icons/fa";
import EditProfile from '../components/EditProfile.jsx'
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post';
import { FaArrowRight } from "react-icons/fa";
import ConnectionButton from '../components/ConnectionButton';

function Profile() {
    let { userData, setEditProfileActive, editProfileActive, profileData} = useContext(userDataContext);
    let navigate = useNavigate();
    let { postData } = useContext(userDataContext);
    let [userPosts, setUserPosts] = useState([])
    let [showPosts, setShowPosts] = useState(false);

    useEffect(() => {
        if (!profileData) return;
        setUserPosts(
            postData.filter((post) => post.author._id === profileData._id)
        )
    }, [postData, profileData])

    if (!profileData) return null;

    return (
        <div className="w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px]">
            {editProfileActive && <EditProfile />}
            <Navbar />

            <div className="w-[90%] max-w-[900px] min-h-[100vh] flex flex-col gap-[10px]">
                <div className="relative bg-white rounded pb-[40px] shadow-lg">
                    <div className="w-full h-[100px] md:h-[200px] bg-gray-600 rounded overflow-hidden">
                        <img
                            src={profileData.coverPic || null}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="absolute w-[80px] h-[80px] top-[55px] md:top-[140px] left-[10px] cursor-pointer">
                        <img
                            src={profileData.profilePic || dp}
                            alt=""
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>

                    <div className="mt-[30px] pl-[10px]">
                        <div className="font-semibold text-[22px]">
                            {profileData.firstName} {profileData.lastName}
                        </div>

                        <div className="font-semibold text-[18px]">
                            {profileData.headline || ""}
                        </div>

                        <div className="font-semibold text-[16px] text-gray-600">
                            {profileData.location}
                        </div>

                        <div
                            className="font-semibold text-[18px] text-blue-500 cursor-pointer hover:opacity-[0.8]"
                            onClick={() => navigate("/network")}
                        >
                            {profileData.connections.length} Connections
                        </div>

                        <div className="w-[100%] mt-[15px]">
                            {profileData._id === userData?._id ? (
                                <button
                                    className='flex justify-center items-center gap-[5px] p-[2px] border border-blue-600 rounded-xl min-w-[150px] text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-150'
                                    onClick={() => setEditProfileActive(true)}
                                >
                                    Edit Profile <FaPen />
                                </button>
                            ) : (
                               <div className="max-w-[100px]">  <ConnectionButton userId={profileData._id} /></div>
                            )}
                        </div>
                    </div>
                </div>

                {userPosts.length !== 0 && (
                    <div className="w-full h-[100px] flex items-center justify-between
                        p-[20px] text-[22px] text-gray-600 font-semibold
                        bg-white shadow-lg rounded-lg">
                        <div>Posts ({userPosts.length})</div>
                        <div
                            onClick={() => setShowPosts(!showPosts)}
                            className="hover:text-black cursor-pointer"
                        >
                            <FaArrowRight />
                        </div>
                    </div>
                )}

                {showPosts && (
                    userPosts.map((post, index) => (
                        <Post
                            key={index}
                            id={post._id}
                            content={post.content}
                            author={post.author}
                            like={post.like}
                            comments={post.comments}
                            createdAt={post.createdAt}
                            image={post.image}
                        />
                    ))
                )}

                <div className="w-full min-h-[100px] items-center
                    p-[20px] text-[22px] text-gray-600 font-semibold
                    bg-white shadow-lg rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-5">Skills</div>
                    <div className="h-[2px] w-full bg-gray-200 mb-6"></div>

                    <div className="flex flex-wrap gap-1">
                        {profileData.skills.map((skill, idx) => (
                            <div
                                key={idx}
                                className="px-3 py-[4px] text-[18px] font-medium rounded-full
                                bg-blue-100 text-blue-700 border border-blue-300"
                            >
                                {skill}
                            </div>
                        ))}

                        {profileData._id === userData?._id && (
                            <button
                                onClick={() => setEditProfileActive(true)}
                                className="px-3 py-[4px] text-[18px] font-medium rounded-full
                                bg-blue-500 text-white border border-blue-300"
                            >
                                Add Skills +
                            </button>
                        )}
                    </div>
                </div>

                {profileData.experience.length > 0 && (
                    <div className="w-full min-h-[100px] items-center
                    p-[20px] text-[22px] text-gray-600 font-semibold
                    bg-white shadow-lg rounded-lg">
                    <div className="text-2xl font-bold text-gray-900 mb-5">Experience</div>
                    <div className="h-[2px] w-full bg-gray-200 mb-6"></div>

                    <div className="space-y-4">
                        {profileData.experience.map((exp, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between px-6 py-5
                                rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <div className="text-xl font-semibold text-gray-900">
                                    {exp.companyName}
                                </div>

                                <div className="text-lg font-bold text-blue-600">
                                    {exp.position}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

                {profileData.education.length > 0 && (
                    <div className="w-full bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-2xl font-bold text-gray-900 mb-5">
                        Education
                    </div>

                    <div className="h-[2px] w-full bg-gray-200 mb-6"></div>

                    <div className="space-y-5">
                        {profileData.education.map((edu, idx) => (
                            <div
                                key={idx}
                                className="px-6 py-5 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                            >
                                <div className="text-xl font-semibold text-gray-900">
                                    {edu.collegeName}
                                </div>

                                <div className="text-lg font-medium text-blue-600 mt-1">
                                    {edu.degree} • {edu.fieldOfStudy}
                                </div>

                                <div className="text-sm font-semibold text-gray-500 mt-2">
                                    {edu.startYear} – {edu.endYear}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

            </div>
        </div>
    )
}

export default Profile