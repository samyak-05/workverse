import { useContext, useState, useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import dp from '../assets/dp.png'
import { userDataContext } from '../context/UserContext.jsx'
import { FaPen } from "react-icons/fa";
import EditProfile from '../components/EditProfile.jsx'
import CreatePost from '../components/CreatePost.jsx';
import Post from '../components/Post.jsx'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext.jsx'
import ConnectionButton from '../components/ConnectionButton.jsx';

function Home() {
  const {
    userData,
    editProfileActive,
    setEditProfileActive,
    createPost,
    setCreatePost,
    postData,
    setPostData,
    getProfile,
    postAdded 
  } = useContext(userDataContext);

  const { serverUrl } = useContext(authDataContext);
  const [suggested, setSuggested] = useState([]);

  const handleSuggestedUsers = async () => {
    if (!serverUrl) return;
    try {
      const res = await axios.get(
        serverUrl + '/api/user/suggesteduser',
        { withCredentials: true }
      );
      setSuggested(res.data);
    } catch (err) {
      console.log("Error fetching suggested users:", err);
    }
  };

  const fetchPosts = async () => {
    if (!serverUrl) return;
    try {
      const res = await axios.get(
        serverUrl + '/api/post/getpost',
        { withCredentials: true }
      );
      setPostData(res.data);
    } catch (err) {
      console.log("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    if (serverUrl && userData?._id) {
      handleSuggestedUsers();
      fetchPosts();
    }
  }, [serverUrl, postAdded, userData?._id]); 

  // Guard clause for loading state
  if (!userData?._id) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-[20px] font-semibold">Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className='w-full min-h-[100vh] bg-[#f2f3ef] flex justify-center items-start md:flex-row pt-[90px] p-[20px] gap-[20px] flex-col'>

      {editProfileActive && <EditProfile />}
      {createPost && <CreatePost />}
      <Navbar />

      {/* LEFT PROFILE CARD */}
      <div className='w-full lg:w-[20%] min-h-[250px] bg-white shadow-lg rounded-lg p-[10px] relative hidden lg:flex flex-col'>
        <div className="w-full h-[100px] bg-gray-600 rounded overflow-hidden">
          <img
            src={userData.coverPic || null}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute w-[80px] h-[80px] top-[55px] left-[10px] cursor-pointer">
          <img
            src={userData.profilePic || dp}
            alt=""
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div className="mt-[30px] pl-[10px]">
          <div className="font-semibold text-[20px]">
            {userData.firstName} {userData.lastName}
          </div>
          <div className="font-semibold text-[15px]">
            {userData.headline || ""}
          </div>
          <div className="font-semibold text-[13px] text-gray-600">
            {userData.location}
          </div>

          <div className="w-[100%] mt-[15px]">
            <button
              className='flex justify-center items-center gap-[5px] p-[2px] border border-blue-600 rounded-xl w-[100%] text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-150'
              onClick={() => setEditProfileActive(true)}
            >
              Edit Profile <FaPen />
            </button>
          </div>
        </div>
      </div>

      {/* CENTER POSTS */}
      <div className="w-full lg:w-[50%] flex flex-col gap-[10px]">
        <div className='lg:h-[70px] bg-white shadow-lg md:flex justify-center items-center hidden'>
          <img
            src={userData.profilePic || dp}
            alt=""
            className="w-[75px] h-[75px] rounded-full p-[7px] hidden md:inline object-cover"
          />
          <div
            onClick={() => setCreatePost(true)}
            className="border border-gray-500 text-gray-500 p-[15px] rounded-3xl w-[600px] cursor-pointer hover:border-blue-500 hover:text-blue-500"
          >
            what do you want to talk about....
          </div>
        </div>

        {postData.map((post) => (
          <Post
            key={post._id}
            id={post._id}
            content={post.content}
            author={post.author}
            like={post.like}
            comments={post.comments}
            createdAt={post.createdAt}
            image={post.image}
          />
        ))}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-[25%] min-h-[250px] bg-white shadow-lg rounded-lg hidden lg:flex flex-col p-[15px]">
        <h2 className="text-[18px] font-semibold mb-[12px]">
          Suggested Users
        </h2>

        <div className="flex flex-col gap-[16px]">
          {suggested.map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <div 
                className="flex items-center gap-[10px] w-[220px] min-w-0 cursor-pointer" 
                onClick={() => getProfile(user.username)}
              >
                <img
                  src={user.profilePic || dp}
                  alt=""
                  className="w-[45px] h-[45px] rounded-full object-cover flex-shrink-0"
                />

                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-semibold truncate">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[12px] text-gray-600 truncate">
                    {user.headline}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <ConnectionButton userId={user._id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;