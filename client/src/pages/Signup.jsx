import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Oauth from '../components/Oauth';
const SignUp = () => {
  const[formData,setFormData]=useState({});
  const [loading ,setLoading]=useState(null);
  const [error,setError]=useState();
  const navigate=useNavigate();
  
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
  });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/signin');

    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };
  
  return (
      <div className="p-3 max-w-lg mx-auto">
        <h1 className='text-3xl text-center font-semibold my-7'>Signup </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          
          <input type='text' placeholder='username' id='username'
          onChange={handleChange} className='rounded-sm border p-3'  />
          
          <input type='email' placeholder='email' id='email' 
          onChange={handleChange} className='rounded-sm border p-3'  />
          
          <input type='password' placeholder='password' id='password'
          onChange={handleChange} className='rounded-sm border p-3'   />
          
          <button className="bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95">
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        <Oauth/>
        </form>
        <div className="flex gap-2 mt-5" >
          <p>Have an account </p>
          <Link to={"/signin"}>
            <span className='text-blue-700'>signin</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
    ) 
  }
  
  export default SignUp;