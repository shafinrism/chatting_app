import { useState } from "react";
import { Button_v_1 } from "../../components/Button";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailError(""); // Clear email error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    } else {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          toast.success("Email sent");
        })
        .catch((error) => {
          if (error.message === "Firebase: Error (auth/user-not-found).") {
            setEmailError("User not found");
            toast.error("User not found");
          }
        });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-secondary">
      <form onSubmit={handleSubmit} className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>
        <input
          onChange={handleEmail}
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 rounded-lg mb-4 border focus:outline-none focus:border-primary"
        />
        <p className="text-red-500 mb-4">{emailError}</p>
        <div className="flex justify-between">
          <Button_v_1 type="submit">Send</Button_v_1>
          <Button_v_1>
            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
          </Button_v_1>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
