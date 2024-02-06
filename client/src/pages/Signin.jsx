import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {signInStart,signInFailure,signInSuccess} from '../redux/user/userSlice'
import Oauth from '../components/Oauth';

const SignIn = () => {
  const[formData,setFormData]=useState({});
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {loading,error}=useSelector((state)=>state.user)
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
  });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      dispatch(signInStart());
      
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
       
        dispatch(signInFailure(data.message));        
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');

    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  
  return (
      <div className="p-3 max-w-lg mx-auto">
        <h1 className='text-3xl text-center font-semibold my-7'>SignIn </h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          
          <input type='text' placeholder='username' id='username'
          onChange={handleChange} className='rounded-sm border p-3'  />
          
          
          <input type='password' placeholder='password' id='password'
          onChange={handleChange} className='rounded-sm border p-3'   />
          
          <button className="bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-95">
            {loading ? 'Loading...' : 'Sign In'}
          </button>

        <Oauth/>
        </form>
        <div className="flex gap-2 mt-5" >
          <p>Dont Have an account ??</p>
          <Link to={"/signup"}>
            <span className='text-blue-700'>signUp</span>
          </Link>
        </div>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
    ) 
  }
  
  export default SignIn;