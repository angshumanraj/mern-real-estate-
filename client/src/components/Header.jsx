import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
export const Header = () => {
    const {currentUser}= useSelector(state=>state.user)
  return (
    <header className='bg-lime-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-800'>Angshuman</span>
                    <span className='text-slate-400'>Estate</span>
                </h1>
                </Link>
            <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
                <input type="text" placeholder='Search..' 
                className='bg-transparent'/>
                <FaSearch className='text-slate-600'></FaSearch>
            </form>
            <ul className='flex gap-4'>
            <Link to='/'>
                <li className='hidden sm:inline text-slate-800  hover:underline'>Home</li>
            </Link>
            <Link to='/about'>    
                <li hidden className='sm:inline text-slate-800  hover:underline'>About</li>
            </Link>
            <Link to='/profile'>
                {currentUser ?(
                <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt=''></img> 
                ):(
                    
                    <li className='sm:inline text-slate-800  hover:underline'>Sign in</li>                
                )}
            </Link>
            
            </ul>
        </div>
    </header>
  )
}