import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef=useRef(null);
  const [file,setFile]=useState(undefined);
  const[filePercentage,setFilePercentage]=useState(0);
  const [fileUploadError,setFileUploadErrro]=useState(false)
  const[formData,setFormData]=useState({});
  
  
  
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
      
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFilePercentage(Math.round(progress))
            if (snapshot.state === 'success') {
                
              console.log('Upload complete');
            }
        },
        (error) => {
            // Handle errors here
            setFileUploadErrro(true)
            console.error('Upload error:', error);
        },
    
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then(
        (downloadUrl)=>{
          setFormData({...formData,avatar:downloadUrl})
          console.log("file available at ", downloadUrl)
        }
      )
    }
  );
};


  return (
    <div>
      <h1 className="text-3xl font-semibold my-7"></h1>
      <form className="max-w-md mx-auto flex flex-col gap-3 items-center">
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" ></input>
        <img
          onClick={()=>fileRef.current.click()}
          src={currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        ></img>
        <p>
          {fileUploadError ? (
            <span className="text-red-700">Error: Image Upload (image must be less than 2)</span>
          ) : (
            filePercentage > 0 && filePercentage < 100 ? (
              <span className="text-green-700">{`Uploading ${filePercentage}%`}</span>
            ) : (
              filePercentage === 100 ? (
                <span className="text-green-700">Image successfully uploaded</span>
              ) : ""
            )
          )}
        </p>


        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-2 rounded-lg w-full"
        ></input>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="border p-2 rounded-lg w-full"
        ></input>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-2 rounded-lg w-full"
        ></input>
        <button
          className="bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:hover:opacity-80 w-full"
        >
          Update
        </button>
        <div className="flex justify-between mt-5 w-full">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-green-500 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
