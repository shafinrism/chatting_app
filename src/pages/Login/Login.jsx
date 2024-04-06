


import { Button_v_1 } from "../../components/Button"
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Blocks } from 'react-loader-spinner'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";

const Login = () => {
  // redux dispatch start 
  const dispatch = useDispatch()
  // redux dispatch end
  const navigate = useNavigate()
  const auth = getAuth()
    // input validation start
   
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    // input validation end

    // email & name regex start
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    
    // email regex end

    // show password start
    const [showPassword,setShowPassword] = useState(false)
    const handleShowPassword = ()=>{
      setShowPassword(!showPassword)
    }
    // show password end

    // input field error start
    
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    
    // input field error end

    // loader start
    const [loader, setLoader] = useState(false)
    // loader end

    // get input value start
    
    const handleEmail = (e)=>{
      setEmail(e.target.value)
      setEmailError("")
    }
    const handlePassword = (e) =>{
      setPassword(e.target.value)
      setPasswordError("")
    }
    
    // get input value end

    // Login start
    const handleSubmit = (e)=>{
      e.preventDefault()
        if (!email) {
        setEmailError("Email is required");
      } else if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email");
      } else if (!password) {
        setPasswordError("Please enter a password");
      } else{
        setLoader(true)
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          toast.success("Login Successful");
          setLoader(false);
          dispatch(userLoginInfo(user))
          localStorage.setItem("user",JSON.stringify(user))
          navigate("/home");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          
// if porshon is not working
          if (errorCode === "auth/wrong-password") {
            setPasswordError("Wrong password");
            toast.error("Wrong Password");
          }
          else if (errorCode === "auth/invalid-credential") {
            setEmailError("User not found");
            toast.error("User not found");
          } 
          setLoader(false);
        });
      }

     


    }
    // login end



  return (
    <div className=" h-screen registration  bg-primary ">
      
      <div className="container mx-auto flex justify-center items-center h-screen">

          <div className="w-[40%] login_registration_form">

            <div>
              <h2>Login</h2>
            </div>

            <form onSubmit={handleSubmit}  className="inputs">

              
              <input onChange={handleEmail} value={email} type="email" placeholder="Email" />
              <p className="error_message">{emailError}</p>

              <div className="relative">

              <input onChange={handlePassword} value={password} type={showPassword ? "text" : "password"} placeholder="Password" />
              <p className="error_message">{passwordError}</p>
              {
                showPassword ?
                <FaEye onClick={handleShowPassword} className="absolute right-[16px] top-[18px] cursor-pointer text-[#5CD2E6]" />
                
                :
                <FaEyeSlash onClick={handleShowPassword} className="absolute right-[16px] top-[18px] cursor-pointer text-[#5CD2E6]" />
              }
              
              </div>

              
              {
                loader ?
                <div className="flex justify-center"><Blocks></Blocks></div>
                :
                <Button_v_1 type='submit'>Login</Button_v_1>
              }
              <div className="text-[18px] mt-4 text-center">
              <p>
                Dont have an account ? <Link className="font-bold text-blue-600 " to='/'>Registration here</Link>
                
                </p>
                <p><Link className="font-bold text-blue-600 " to='/forgotPassword'>Forgot password</Link></p>
              </div>
              
              
              
            </form> 

          </div>

      </div>

    </div>
  );
};

export default Login;