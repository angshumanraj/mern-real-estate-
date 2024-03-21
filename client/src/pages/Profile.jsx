import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import {Link} from "react-router-dom"
import { deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess,  
  signInSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess } from "../redux/user/userSlice";

const Profile = () => {
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const { currentUser,loading, } = useSelector((state) => state.user);
  const fileRef=useRef(null);
  const [file,setFile]=useState(undefined);
  const[filePercentage,setFilePercentage]=useState(0);
  const [fileUploadError,setFileUploadErrro]=useState(false)
  const[formData,setFormData]=useState({});
  const [showListingError,setShowListingError]=useState(false)
  const[userListings,setUserListings]=useState({});
 
  console.log(formData)
  //firebase storage
  // allow read; 
  // allow write: if 
  // request.resource.size<2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/*')
 
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    
    }
  },[file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '_' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Bytes transferred:', snapshot.bytesTransferred);
        console.log('Total bytes:', snapshot.totalBytes);
        console.log('Progress:', progress);
        setFilePercentage(Math.round(progress));
        
      },
      (error) => {
        // Handle errors here
        setFileUploadErrro(true);
        console.error('Upload error:', error);
      },
      () => {
        
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
          dispatch(signInSuccess({ ...currentUser, avatar: downloadUrl }));
          console.log('file available at ', downloadUrl);
        });
      }
    );
  };
  
  const handleChange=(event)=>{
    setFormData({...formData,[event.target.id]:event.target.value})
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res=await fetch(`/api/user/update/${currentUser._id}`,
      
      { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data=await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
      
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }   
  };

    const handleDeleteUser=async()=>{
      try {
        dispatch(deleteUserStart());
        const res= await fetch(`api/user/delete/${currentUser._id}`,{
          method: 'DELETE',
        });
        const data= await res.json();
        if(data.success === false){
          dispatch(deleteUserFailure(data.message))
          return
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        console.log(error)
        dispatch(deleteUserFailure(error.message))
      }
    }
    const handleSignOut=async()=>{
      try {
        dispatch(signOutUserStart())
        const res=await fetch('/api/auth/signout');
        const data=await res.json();
        if(data.success===false){
          dispatch(signOutUserFailure(data.message))
          return
        }
        dispatch(signOutUserSuccess(data))
          return
      } catch (error) {
        dispatch(signOutUserFailure(error.message))
      }
    }

    const handleShowListing=async()=>{
      try {
        setShowListingError(false);
        const res= await fetch(`/api/user/listings/${currentUser._id}`);
        const data=await res.json();
        if(data.success===false){
          setShowListingError(true);
          return;
        }
        setUserListings(data)
      } catch (error) {
        setShowListingError(true)
      }
    }
    const handleDeleteListing=async(listingId)=>{
      try {
        const res =await fetch(`api/listing/delete/${listingId}`,{
          method:'DELETE',
        });
        const data=res.json()
        if(data.success===false){
          console.log(data.message)
          return;
        }


        setUserListings((prev)=> prev.filter((listing)=>listing._id !== listingId));
      } catch (error) {
        console.log(error.message)    
      }
    } 
    
    
  return (
    <div>
      <h1 className="text-3xl font-semibold my-7 text-center ">Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-3 items-center">
        <input onChange={(e)=>setFile(e.target.files[0])} 
                type="file" ref={fileRef} 
                hidden accept="image/*" >  
        </input>
        <img
          onClick={()=>fileRef.current.click()}
          src={formData.avatar|| currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        ></img>
        <p className='text-sm self-center'>
        {fileUploadError ? (
          <span className='text-red-700'>
            Error Image upload (image must be less than 2 mb)
          </span>
        ) : filePercentage > 0 && filePercentage < 100 ? (
          <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
        ) : filePercentage === 100 ? (
          <span className='text-green-700'>Image successfully uploaded!</span>
        ) : (
          ''
        )}
      </p>

        {/* progress bar */}
        <div  className="w-full bg-gray-200 rounded-lg h-4 relative">
        <div className="bg-green-500 absolute top-0 left-0 h-full" 
             style={{ width: `${filePercentage}%` }}>
        </div>
      </div>

        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-2 rounded-lg w-full"
          defaultValue={currentUser.username}
          onChange={handleChange}
        ></input>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-2 rounded-lg w-full"
          defaultValue={currentUser.email}
          onChange={handleChange}
        ></input>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-2 rounded-lg w-full"
          onChange={handleChange}
        ></input>
        <button
          disabled={loading}
          className="bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:hover:opacity-80 w-full"
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <div className="flex flex-col align-center w-full"></div>
          <Link className="bg-orange-500 text-white p-3 rounded-lg uppercase
            text-center hover:opacity-95 w-full" to={"/create-listing"}>Create Listing
          </Link>
        <div className="flex justify-between mt-5 w-full">
          <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
          <span onClick={handleSignOut} className="text-green-500 cursor-pointer">Sign Out</span>
        </div>
        <p className="text-green-500 mt-5 text-center">{updateSuccess ? 'User is updated Successfully': ''}</p>
         
      </form>
      <button  onClick={handleShowListing} className='text-green-700 w-full mb-5'>
        Show Listings
      </button>
      <p className="text-red-700 mt-5 ">{showListingError ?showListingError :'' }</p>
      
    
      {userListings && userListings.length> 0 &&
      <div className="flex flex-col  gap-4 ">
        <h1 className="text-center mt-7 text-2xl"> Your Listings</h1>
          {userListings.map((listings)=>(
            <div key={listings._id} className="border rounded-lg p-3 flex justify-content items-center gap-4">
              <Link to={`/listings/${listings._id}`}>
              <img src={listings.imgUrls} alt="listings" className="h-16 w-16 object-contain rounded-lg"/>
              </Link>
              <Link className="flex-1 text-green-800 font-semibold  hover:underline truncate" to={`/listings/${listings._id}`}>
                <p>{listings.name}</p>
              </Link>
              <div className="flex flex-col item-center">
                <button onClick={()=>handleDeleteListing(listings._id)} className="text-red-700">Delete</button>
                <button  className="text-green-700">Edit</button>
              </div>
            </div>
          ))}
      </div>
      }
    </div>
  );
};

export default Profile;
