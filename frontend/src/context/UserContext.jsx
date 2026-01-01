import {useState,createContext, useContext, useEffect} from 'react'
import {authDataContext} from './AuthContext.jsx'
import axios from 'axios';
export const userDataContext = createContext();
function UserContext({children}) {
    let [userData, setUserData] = useState(null);
    let {serverUrl} = useContext(authDataContext);
    let [editProfileActive, setEditProfileActive] = useState(false);

    const currentUserData = async () =>{
        try {
            let result = await axios.get(serverUrl+"/api/user/currentuser",{withCredentials:true} );
            setUserData(result.data);
            console.log("Current User Data:", result.data);
        } catch(err) {
            console.log("Error in fetching user data", err);
            setUserData(null);
        }
    }

    useEffect(() => { 
        currentUserData();
    }, []);

  return (
    <div>
        <userDataContext.Provider value={{userData, setUserData, editProfileActive, setEditProfileActive}}>
      {children}
        </userDataContext.Provider>
    </div>
  )
}

export default UserContext
