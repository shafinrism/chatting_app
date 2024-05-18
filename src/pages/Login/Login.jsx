import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Blocks } from 'react-loader-spinner'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/userSlice";
import { Button_v_1 } from "../../components/Button";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
    } else if (!password) {
      setPasswordError("Please enter a password");
    } else {
      setLoader(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("Login Successful");
          setLoader(false);
          dispatch(userLoginInfo(user));
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/home");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
          if (errorCode === "auth/wrong-password") {
            setPasswordError("Wrong password");
            toast.error("Wrong Password");
          } else if (errorCode === "auth/invalid-credential") {
            setEmailError("User not found");
            toast.error("User not found");
          }
          setLoader(false);
        });
    }
  }

  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="w-full max-w-md px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmail}
          />
          {emailError && <p className="text-red-500 mb-3">{emailError}</p>}
          <div className="relative">
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePassword}
            />
            {showPassword ? (
              <FaEyeSlash
                onClick={handleShowPassword}
                className="absolute right-3 top-3 cursor-pointer text-blue-500"
              />
            ) : (
              <FaEye
                onClick={handleShowPassword}
                className="absolute right-3 top-3 cursor-pointer text-blue-500"
              />
            )}
          </div>
          {passwordError && <p className="text-red-500 mb-3">{passwordError}</p>}
          {loader ? (
            <div className="flex justify-center mb-3">
              <Blocks />
            </div>
          ) : (
            <Button_v_1 type="submit">Login</Button_v_1>
          )}
          <div className="text-center">
            <p>
              Dont have an account ?{" "}
              <Link to="/" className="font-bold text-blue-600">
                Registration here
              </Link>
            </p>
            <p>
              <Link to="/forgotPassword" className="font-bold text-blue-600">
                Forgot password
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
