import React from 'react'
import { userDataContext } from '../context/UserContext.jsx'
import dp from '../assets/dp.png'
import { FaPlus } from "react-icons/fa";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext.jsx';

function EditProfile() {
    let { serverUrl } = React.useContext(authDataContext);
    // Logic update: Destructured profileData and setProfileData to fix the reload issue
    let { setEditProfileActive, userData, setUserData, profileData, setProfileData } = React.useContext(userDataContext);
    
    let [saving, setSaving] = React.useState(false);
    let [firstName, setFirstName] = React.useState(userData.firstName || "");
    let [lastName, setLastName] = React.useState(userData.lastName || "");
    let [headline, setHeadline] = React.useState(userData.headline || "");
    let [location, setLocation] = React.useState(userData.location || "");
    let [gender , setGender] = React.useState(userData.gender || "");
    let [skills, setSkills] = React.useState(userData.skills || []);
    let [newSkills, setNewSkills] = React.useState("");
    let [education, setEducation] = React.useState(userData.education || []);
    let [newEducation, setNewEducation] = React.useState({
        collegeName: "",
        degree: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
    });
    let [experience, setExperience] = React.useState(userData.experience || []);
    let [newExperience, setNewExperience] = React.useState({
        companyName: "",
        position: "",
    });

    const [frontendProfilePic, setFrontendProfilePic] = React.useState(userData.profilePic || dp);
    const [backendProfilePic, setBackendProfilePic] = React.useState(null);
    const [frontendCoverPic, setFrontendCoverPic] = React.useState(userData.coverPic || null);
    const [backendCoverPic, setBackendCoverPic] = React.useState(null);

    const profileImage = React.useRef();
    const coverImage = React.useRef();

    function addSkill(e){
        e.preventDefault();
        if(newSkills && !skills.includes(newSkills)){
            setSkills([...skills, newSkills]);
        }
        setNewSkills("");
    }

    function removeSkill(skill){
        if(skills.includes(skill)){
            setSkills(skills.filter((s)=>s!==skill));
        }
    }

    function addEducation(e){
        e.preventDefault();
        if(newEducation.collegeName && newEducation.degree && newEducation.fieldOfStudy && newEducation.startYear && newEducation.endYear){
            setEducation([...education, newEducation]);
            setNewEducation({
                collegeName: "",
                degree: "",
                fieldOfStudy: "",
                startYear: "",
                endYear: "",
            });
        }
    }

    function removeEducation(edu){
        setEducation(education.filter((e)=>e!==edu));
    }

    function addExperience(e){
        e.preventDefault();
        if(newExperience.companyName && newExperience.position){
            setExperience([...experience, newExperience]);
            setNewExperience({
                companyName: "",
                position: "",
            });
        }
    }

    function removeExperience(exp){
        if(experience.includes(exp)){
            setExperience(experience.filter((e)=>e!==exp));
        }
    }

    function handleProfileImage(e){
        const file = e.target.files[0];
        setBackendProfilePic(file);
        setFrontendProfilePic(URL.createObjectURL(file));
    }

    function handleCoverImage(e){
        const file = e.target.files[0];
        setBackendCoverPic(file);
        setFrontendCoverPic(URL.createObjectURL(file));
    }

    const handleProfileUpdate = async() =>{
        setSaving(true);
        try{
            let formData = new FormData();
            formData.append("firstName", firstName);
            formData.append("lastName", lastName);
            formData.append("headline", headline);
            formData.append("location", location);
            formData.append("gender", gender);
            formData.append("skills", JSON.stringify(skills));
            formData.append("education", JSON.stringify(education));
            formData.append("experience", JSON.stringify(experience));
            
            if(backendProfilePic){
                formData.append("profilePic", backendProfilePic);
            }
            if(backendCoverPic){
                formData.append("coverPic", backendCoverPic);
            }

            const result = await axios.put(`${serverUrl}/api/user/updateProfile`, formData, {withCredentials: true});
            
            // Logic Fix: Update both states so changes appear immediately
            setUserData(result.data);
            if (profileData?._id === result.data._id) {
                setProfileData(result.data);
            }
            
            setEditProfileActive(false);
            setSaving(false);
        } catch(err) {
            console.log("Error updating profile:", err);
            setSaving(false);  
        }
    }

  return (
    <div className="fixed w-[100%] h-[100vh] top-0 z-[100] flex justify-center items-center">
        <div className='bg-black opacity-[0.6] absolute w-[100%] h-full' onClick={()=>setEditProfileActive(false)}></div>
        <div className='bg-white h-[600px] w-[90%] max-w-[500px] rounded-lg shadow-lg z-[200] relative p-[20px] overflow-auto'>
            <div>
                <button className='absolute top-[10px] right-[10px] bg-white text-red-700 rounded-full
                            w-[25px] h-[25px] flex justify-center items-center hover:bg-red-600
                          hover:text-white border border-red-600' 
                            onClick={()=>setEditProfileActive(false)}>X
                </button>
            </div>
            <input type='file' accept='image/*' ref={profileImage} hidden onChange={handleProfileImage}/>
            <input type='file' accept='image/*' ref={coverImage} hidden onChange={handleCoverImage}/>

            <div className='w-[full] h-[150px] bg-gray-500 rounded-lg mt-[20px] overflow-hidden cursor-pointer' onClick={()=>coverImage.current.click()}>
                <img src={frontendCoverPic} alt="" className="w-full h-full object-cover"/>
            </div>

            <div className="absolute w-[90px] h-[90px] top-[130px] left-[30px] cursor-pointer" onClick={()=>profileImage.current.click()}>
                <img src={frontendProfilePic} alt="" className="w-full h-full rounded-full object-cover border-4 border-white"/>
            </div>

            <div className="w-[20px] h-[20px] bg-[#17c1ff] absolute top-[185px] left-[95px] rounded-full flex justify-center items-center">
                <FaPlus className="text-white text-[12px]" />
            </div>

            <div className='w-full flex flex-col items-center justify-center gap-[10px] mt-[50px]'>
                <label className='w-full font-semibold text-[20px]'>First Name:</label>
                <input type="text" placeholder='first name' value={firstName} onChange={(e)=>setFirstName(e.target.value)} className='w-full h-[50px] outline-none  border rounded-md  border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                <label className='w-full font-semibold text-[20px]'>Last Name:</label>
                <input type="text" placeholder='last name' value={lastName} onChange={(e)=>setLastName(e.target.value)} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                <label className='w-full font-semibold text-[20px]'>Headline:</label>
                <input type="text" placeholder='headline' value={headline} onChange={(e)=>setHeadline(e.target.value)} className='w-full h-[50px] outline-none border rounded-md  border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                <label className='w-full font-semibold text-[20px]'>Location:</label>
                <input type="text" placeholder='location' value={location} onChange={(e)=>setLocation(e.target.value)} className='w-full h-[50px] outline-none border rounded-md  border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                <label className="w-full font-semibold text-[20px]">Gender:</label>
                <input type="text" placeholder='gender' value={gender} onChange={(e)=>setGender(e.target.value)} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                
                <div className='w-full flex flex-col gap[10px] p-[10px] border-2 border-gray-500'>
                    <h1 className='w-full font-semibold text-[20px]'>Skills:</h1>
                    {skills && <div className="w-full flex flex-wrap gap-[10px] mb-[10px] font-medium text-[18px]"> 
                        {skills.map((skill,idx)=>(
                            <div key={idx} className="flex justify-center gap-[10px] bg-blue-100 border border-blue-300 p-[10px] rounded">{skill} <button onClick={()=>removeSkill(skill)} className="bg-red-600 rounded-full w-[25px] h-[25px] text-white">X</button></div>
                        ))}
                        </div>}
                    <div className='w-full flex flex-col gap-[10px]'>
                        <input type="text" placeholder='Add Skills' value={newSkills} onChange={(e)=>setNewSkills(e.target.value)} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                        <button onClick={addSkill} className='w-full bg-white text-blue-600 p-[10px] rounded-md mt-[10px] font-semibold border-2 border-blue-600'>Add Skill</button>
                    </div>
                </div>

                <div className='w-full flex flex-col gap[10px] p-[10px] border-2 border-gray-500'>
                    <h1 className='w-full font-semibold text-[20px]'>Education:</h1>
                    {education && <div className="w-full flex flex-col gap-[10px] mb-[10px] font-medium text-[18px]"> 
                        {education.map((edu,idx)=>(
                            <div key={idx} className="w-full flex justify-between bg-blue-100 border border-blue-300 p-[10px] rounded">
                                <div className="flex flex-col">
                                    <div><span className="font-bold text-[22px]">{edu.collegeName}</span> - <span className="font-semibold text-[16px]">{edu.degree}</span> </div>
                                    <div className="text-[18px] font-semibold">{edu.fieldOfStudy}</div>
                                    <div className="text-[16px] font-medium">{edu.startYear} - {edu.endYear}</div>
                                </div>
                                <div className='flex flex-col justify-center items-center'><button onClick={()=>removeEducation(edu)} className="bg-red-600 rounded-full w-[25px] h-[25px] text-white text-[14px]">X</button></div>
                            </div>
                        ))}
                        </div>}
                    <div className='w-full flex flex-col gap-[10px] '>
                        <input type="text" placeholder='College Name' value={newEducation.collegeName} onChange={(e)=>setNewEducation({...newEducation, collegeName: e.target.value})} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                        <input type="text" placeholder='degree' value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation, degree: e.target.value})} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                        <input type="text" placeholder='field' value={newEducation.fieldOfStudy} onChange={(e)=>setNewEducation({...newEducation, fieldOfStudy: e.target.value})} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                        <input type="number" placeholder='start year' value={newEducation.startYear} onChange={(e)=>setNewEducation({...newEducation, startYear: e.target.value})} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                        <input type="number" placeholder='end year' value={newEducation.endYear} onChange={(e)=>setNewEducation({...newEducation, endYear: e.target.value})} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                        <button onClick={addEducation} className='w-full bg-white text-blue-600 p-[10px] rounded-md mt-[10px] font-semibold border-2 border-blue-600'>Add +</button>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-[10px] p-[10px] border-2 border-gray-500">
                    <h1 className="font-semibold text-[20px]">Experience:</h1>
                    {experience && <div className="w-full flex flex-col gap-[10px] mb-[10px] font-medium text-[18px]">
                        {experience.map((exp,idx)=>(
                            <div key={idx} className="w-full flex justify-between bg-blue-100 border border-blue-300 p-[10px] rounded">
                                <div className="flex flex-col">
                                    <div><span className="font-bold text-[22px]">{exp.companyName}</span></div>
                                    <div className="text-[18px] font-normal">{exp.position}</div>
                                </div>
                                <div className='flex flex-col justify-center items-center'><button onClick={()=>removeExperience(exp)} className="bg-red-600 rounded-full w-[25px] h-[25px] text-white text-[14px]">X</button></div>
                            </div>
                        ))}
                        </div>}
                    <div className="w-full flex flex-col gap-[10px] ">
                        <input type="text" placeholder='company name' value={newExperience.companyName} onChange={(e)=>setNewExperience({...newExperience, companyName: e.target.value})} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                        <input type="text" placeholder='position' value={newExperience.position} onChange={(e)=>setNewExperience({...newExperience, position: e.target.value})} className='w-full h-[50px] outline-none  border rounded-md border-gray-500 px-[10px] py-[10px] text-[18px]'/>
                        <button onClick={addExperience} className='w-full bg-white text-blue-600 p-[10px] rounded-md mt-[10px] font-semibold border-2 border-blue-600'>Add +</button>
                    </div>
                </div>
            </div>
            <button className='w-full rounded-md text-white text-[18px] bg-blue-600 h-[40px] mt-[10px] flex justify-center items-center hover:bg-white hover:text-blue-600 border border-blue-600' disabled={saving} onClick={handleProfileUpdate}>{saving ? "Saving..." : "Save changes"}</button>
        </div>
    </div>
  )
}

export default EditProfile;