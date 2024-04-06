import './App.css'
import Registration from './pages/Registration/Registration'
import firebaseConfig from './firebase.config'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import { ToastContainer } from 'react-toastify'
import Home from './pages/Home/Home'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import Chat from './pages/Chat/Chat'


function App() {
  

  return (
   <>
   <ToastContainer position="top-center" />
   <Routes>
    <Route path='/' element ={<Registration></Registration>}></Route>
    <Route path='/forgotPassword' element={<ForgotPassword></ForgotPassword>}></Route>
    <Route path='/home' element={<Home></Home>}></Route>
    <Route path='/login' element={<Login></Login>}></Route>
    <Route path='/chat' element={<Chat></Chat>}></Route>
   </Routes>
    
   </>
  )
}

export default App
