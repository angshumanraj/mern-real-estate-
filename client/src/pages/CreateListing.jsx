import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export const CreateListing = () => {
  const {currentUser}=useSelector(state =>state.user);
  const navigate=useNavigate()
  const[files,setFiles]=useState([]);
  const [error,setError]=useState(false);
  const[loading,setLoading]=useState(false)
  const [formData,setFormData]=useState({
    imgUrls:[],
    name:'',
    description:'',
    type:'rent',
    address:'',
    regularPrice:0,
    bathrooms:1,
    discountPrice:0,
    bedrooms:1,
    furnished:false,
    offer:false,
    parking:false,
    latitude: 0,
    longitude: 0,
    
  });
  const [imageUploadError,setImageUploaderror]=useState(false)
  const[uploading,setUploading]=useState(false)
 


  const handleImageSubmit=()=>{
    
    if(files.length >0 && files.length<7 + formData.imgUrls.length < 7){
      setUploading(true);
      setImageUploaderror(false);
      const promises=[];

      for(let i=0;i<files.length;i++){
        
        promises.push(storeImage(files[i]))
      }
      Promise.all(promises).then((urls)=>{
        setFormData({
          ...formData,
          imgUrls:formData.imgUrls.concat(urls)
        });
        setImageUploaderror(false);
        setUploading(false)   

      }).catch(() =>{
        setImageUploaderror('image upload is failed (10 mb max)')
      });
    }else{
     setImageUploaderror('You can only upload  6 images per Listing')
     setUploading(false)   
    } 
  };
  const storeImage=async(file)=>{
    return new Promise((resolve,reject)=>{
      const storage= getStorage(app);
      const fileName=new Date().getTime()+file.name;
      const storageRef=ref(storage,fileName);
      const uploadTask=uploadBytesResumable(storageRef,file) 
      uploadTask.on(
        "state_changed",
        (snapshot) => {      
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload Progress${progress}% done`)
        },
        (error)=>{
          reject(error);

        },
        ()=>{
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
            resolve(downloadUrl)
          })
        });
    });
  }
  const handleDeleteImage=(index)=>{
    setFormData({
      ...formData,
      imgUrls:formData.imgUrls.filter((_,i)=> i!== index),
    })
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit=async(e)=>{
    e.preventDefault();
    const response=  await fetch(`https://geocode.maps.co/search?q=${formData.address}&api_key=66111c6d62c79603413361wol5ae8e4`);

    const data1=await response.json();
    console.log("map data",data1);
    //extracting latitude and longitude
    const latitude = parseFloat(data1[0].lat);
    const longitude = parseFloat(data1[0].lon);
    console.log("the longitudes and latitudes are ",latitude,  longitude)
    console.log(formData)
    
    try {
      if(formData.imgUrls.length <1) return setError('you must upload atleast 1 image')
      if(formData.regularPrice< formData.discountPrice) return setError('Discount price must be less than regular price')
      setLoading(true);
      setError(false);
      const res=await fetch('/api/listing/create',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          ...formData,
          userRef:currentUser._id,
          latitude:latitude,
          longitude:longitude
        }),
      });
      const data=await res.json();
      setLoading(false)
      if(data.success=== false){
        setError(data.message)
      }
      navigate(`/listing/${data._id}`,{
        state: { ...formData, latitude, longitude }
      });
    } catch (error) {
      setError(error.message);
      setLoading(false)
    }
  }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type='text'
            placeholder='Name'
            className='border p-3 rounded-lg'
            id='name'
            maxLength='62'
            minLength='5'
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type='text'
            placeholder='Description'
            className='border p-3 rounded-lg'
            id='description'
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type='text'
            placeholder='Address'
            className='border p-3 rounded-lg'
            id='address'
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' 
                id='sale' 
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
               />
              <span>Sell</span>

            </div>
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='rent' 
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
                />
              <span>Rent</span>
            </div>

            <div className='flex gap-2'>
              <input 
                type='checkbox' id='parking' 
                className='w-5' 
                onChange={handleChange}
                checked={formData.parking}
                />
              <span>Parking spot</span>
            </div>
          
            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='furnished' 
                className='w-5' 
                onChange={handleChange}
                checked={formData.furnished}  
                />
              <span>Furnished</span>
            </div>

            <div className='flex gap-2'>
              <input 
                type='checkbox' 
                id='offer' 
                className='w-5'
                onChange={handleChange}
                checked={formData.offer} />
              <span>Offer</span>
            </div> 
          </div>
        

          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='regularPrice'
                min='1'
                max='10000000000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
          </div>
          {formData.offer && (
            <div className='flex items-center gap-2'>
              <input
                type='number'
                id='discountPrice'
                min='0'
                max='1000000'
                required
                className='p-3 border border-gray-300 rounded-lg'
                onChange={handleChange}
                value={formData.discountPrice}
              />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                <span className='text-xs'>($ / month)</span>
              </div>
            </div>
          )}
            
          
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input 
              onChange={(e)=>setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full' 
              type="file" id='images' 
              accept='image/*' 
              multiple />

            <button 
              type="button"
              onClick={handleImageSubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading?'uploading...':'upload'}</button>
          </div>
        <div >
          {<p className="text-red-700 text-sm"> {imageUploadError && imageUploadError}</p>}
          {
            formData.imgUrls.length >  0 && formData.imgUrls.map((url,index)=>(
              <div key={url} className="flex justify-between p-3 border items-center">
                <img src={url} alt="listing image" className="w-40 h-40 object-cover rounded-lg"/>
                <button onClick={()=>handleDeleteImage(index)} type="button" className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">delete</button>
              </div>
            ))
          }
        </div>
        <button disabled={loading || uploading}  className='p-3 bg-orange-400 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading? 'Createing...': 'Create Listing'}
        </button>
        {error && <p  className="text-red-700 text-sm">{error}</p>}
        </div>
        
      </form>
    </main>
  );
}