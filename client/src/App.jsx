import {BrowserRouter,Routes,Route} from 'react-router-dom';
import  About  from "./pages/About";
import  Home  from "./pages/Home";
import  Profile  from "./pages/Profile";
import  Signin  from "./pages/Signin";
import  Signup  from "./pages/Signup";
import { Header } from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';



export default function App() {
  return (
    <BrowserRouter>
    <Header/>

    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signin' element={<Signin/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/about' element={<About/>}/>
      <Route element={<PrivateRoute/>}>
        <Route path='/profile' element={<Profile/>}/> 
      </Route>  
    </Routes>
    </BrowserRouter>
  )
}