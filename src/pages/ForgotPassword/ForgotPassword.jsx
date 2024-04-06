import { useState } from "react";
import { Button_v_1 } from "../../components/Button";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";


const ForgotPassword = () => {
  const auth = getAuth()
  const [email,setEmail] = useState("")
  const [emailError,setEmailError] = useState("")

  const handleEmail =(e)=>{
    setEmail(e.target.value)
  }
  const handleSubmit = (e)=>{
    e.preventDefault()
    if(!email){
      setEmailError("Email required")
    }
    // this porson is not working
    else{
      sendPasswordResetEmail(auth,email)
      .then(() => {
        toast.success("Email sent")
      })
      .catch((error) => {
        if(error.message === "Firebase : Error (auth/user-not-found)."){
          setEmailError("User not found")
          toast.error("user not found")
        }
        
        
      })
    }
   
    

  }
  return (
    <div id="forgot_password" className="h-screen flex justify-center items-center bg-secondary">
      <form onSubmit={handleSubmit} className="w-[450px] p-10 rounded-lg bg-white">
          <h1>Forgot Password</h1>
          <input onChange={handleEmail} type="email"  placeholder="Email"/>
          <p className="error_message">{emailError}</p>
          <div className="flex justify-between gap-5">
            <Button_v_1 type='submit'>Send</Button_v_1>
            <Button_v_1 >
              <Link to='/login'>Login</Link>
            </Button_v_1>
          </div>
      </form>
    </div>
  );
};

export default ForgotPassword;