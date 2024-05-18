import Lottie from "lottie-react";
import regsanimation from '../../../public/animations/registration_animation_2.json';
import { Button_v_1 } from "../../components/Button";
import { useState } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Blocks } from 'react-loader-spinner';
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getDatabase();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const nameRegex = /^([\w]{3,})+\s+([\w\s]{3,})+$/i;

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rePasswordError, setRePasswordError] = useState("");
  const [loader, setLoader] = useState(false);

  const handleFullName = (e) => {
    setFullName(e.target.value);
    setFullNameError("");
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };
  const handleRePassword = (e) => {
    setRePassword(e.target.value);
    setRePasswordError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName) {
      setFullNameError("Name is required");
    } else if (!nameRegex.test(fullName)) {
      setFullNameError("Please enter a valid name");
    } else if (!email) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email");
    } else if (!password) {
      setPasswordError("Please enter a password");
    } else if (!rePassword) {
      setRePasswordError("Please retype the password");
    } else if (password !== rePassword) {
      setRePasswordError("Passwords don't match");
    } else if (fullName && nameRegex.test(fullName) && email && emailRegex.test(email) && password && rePassword && password === rePassword) {
      setLoader(true);
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnEquqKx_4BB68GJN8C8aUfZu6wBaBeQeqMQ&usqp=CAU",
          }).then(() => {
            const user = userCredential.user;
            console.log(user);
            toast.success("Registration successful");
            navigate("/login");
            setLoader(false);
          })
            .then(() => {
              set(ref(db, "users/" + auth.currentUser.uid), {
                username: fullName,
                email: email,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log(errorCode);
          const errorMessage = error.message;
          if (errorMessage.includes("auth/email-already-in-use")) {
            setEmailError("Email is already in use");
            toast.error("Email is already in use");
          }
          console.log(errorMessage);
          setLoader(false);
        });
    }
  };

  return (
    <div className="min-h-screen bg-primary flex justify-center items-center">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        <div className="w-full lg:w-1/2 px-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center lg:text-left">Registration</h2>
          </div>
          <form onSubmit={handleSubmit} className="inputs">
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
              onChange={handleFullName}
              value={fullName}
              type="text"
              placeholder="Full name"
            />
            <p className="error_message">{fullNameError}</p>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:outline-none focus:border-blue-500"
              onChange={handleEmail}
              value={email}
              type="email"
              placeholder="Email"
            />
            <p className="error_message">{emailError}</p>
            <div className="relative">
              <FaEyeSlash
                onClick={handleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
              />
              <input
                className="w-full border border-gray-300 rounded px-10 py-2 mb-3 focus:outline-none focus:border-blue-500"
                onChange={handlePassword}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
              />
              <p className="error_message">{passwordError}</p>
            </div>
            <div className="relative">
              <FaEyeSlash
                onClick={handleShowPassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-blue-500"
              />
              <input
                className="w-full border border-gray-300 rounded px-10 py-2 mb-3 focus:outline-none focus:border-blue-500"
                onChange={handleRePassword}
                value={rePassword}
                type={showPassword ? "text" : "password"}
                placeholder="Repassword"
              />
              <p className="error_message">{rePasswordError}</p>
            </div>
            {loader ? (
              <div className="flex justify-center mb-3">
                <Blocks />
              </div>
            ) : (
              <Button_v_1 type="submit">Submit</Button_v_1>
            )}
            <div className="text-center lg:text-left">
              <p>
                Already have an account ?{" "}
                <Link className="font-bold text-blue-600" to="/login">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
        <div className="w-full lg:w-1/2 px-4">
          <h1 className="text-4xl font-bold text-center lg:text-left mb-4">Welcome to Chatter</h1>
          <Lottie animationData={regsanimation} />
        </div>
      </div>
    </div>
  );
};

export default Registration;
