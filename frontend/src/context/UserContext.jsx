import { useState, createContext, useContext, useEffect } from 'react'
import { authDataContext } from './AuthContext.jsx'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const userDataContext = createContext();
function UserContext({ children }) {
  let [userData, setUserData] = useState(null);
  let { serverUrl } = useContext(authDataContext);
  let [editProfileActive, setEditProfileActive] = useState(false);
  let [createPost, setCreatePost] = useState(false);
  let [postData, setPostData] = useState([]);
  let [profileData, setProfileData] = useState([]);
  let [postAdded, setPostAdded] = useState(0);
  let navigate = useNavigate();

  const currentUserData = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
      setUserData(result.data);
    } catch (err) {
      console.log("Error in fetching user data", err);
      setUserData(null);
    }
  }

  const getPost = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/post/getpost", { withCredentials: true });
      console.log(result);
      setPostData(result.data);
    } catch (err) {
      console.log(err);
    }
  }

  const getProfile = async (username) =>{
    try {
      let res = await axios.get(`${serverUrl}/api/user/profile/${username}`, {withCredentials :true});
      setProfileData(res.data);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    currentUserData();
  }, []);

  useEffect(() => {
    if (userData?._id) {
      getPost();
    }
  }, [userData]);


  return (
    <div>
      <userDataContext.Provider value={{
        userData, setUserData, editProfileActive, setEditProfileActive,
        createPost, setCreatePost, postData, setPostData, getPost , profileData, setProfileData,
        getProfile, postAdded, setPostAdded
      }}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
