import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthSvg from "../assets/svg/AuthSvg";
import { useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const message = location.state?.message;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { access, user_id, name, refresh, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (access) {
      setSuccessMessage("Login Successful! Taking you to Dashboard...");
      setTimeout(() => {
        navigate("/");
      }, 2000); 
    }
  }, [access, navigate]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = () => {
    // Dispatch the login action
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex h-screen bg-gray-100 font-poppins">
      <div className="flex flex-col -translate-y-24 sm:translate-y-0 justify-center items-center sm:w-1/2">
        <div className="flex text-3xl sm:text-5xl font-bold space-x-4 mb-12">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 transition duration-300 ${
              isLogin
                ? "text-[#248C9A] border-b-2 border-[#248C9A]"
                : "text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 transition duration-300 ${
              !isLogin
                ? "text-[#248C9A] border-b-2 border-[#248C9A]"
                : "text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="flex flex-col min-h-[300px]">
          {isLogin ? (
            <div className="flex flex-col space-y-4 px-4">
              <div className="flex items-center bg-white border w-[400px] rounded-[15px] sm:rounded-[50px] py-4 sm:py-2 px-4">
                <FaEnvelope className="text-[#248C9A] mr-2" />
                <input
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex items-center bg-white border w-[400px] rounded-[15px] sm:rounded-[50px] py-4 sm:py-2 px-4">
                <FaLock className="text-[#248C9A] mr-2" />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Enter password"
                  className="flex-1 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none"
                >
                  {isPasswordVisible ? (
                    <FaEyeSlash className="text-[#248C9A]" />
                  ) : (
                    <FaEye className="text-[#248C9A]" />
                  )}
                </button>
              </div>

              <button>
                <p className="text-right font-bold text-[#2E4B54] hover:text-[#1a2f36] transition-colors duration-200">
                  Forgot Password?
                </p>
              </button>

              <button
                onClick={handleLogin}
                className="bg-[#248C9A] font-bold text-white py-2 rounded-lg hover:bg-[#1c6e7a] transition-colors duration-200"
              >
                Login
              </button>
              {message && (
                <div className="alert alert-warning text-red-500 text-sm mt-2">
                  {message}
                </div>
              )}
              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {typeof error === "string"
                    ? error
                    : "An error occurred. Please try again."}
                </p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mt-2">{successMessage}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-4 px-4">
              <div className="flex bg-white items-center border w-[400px] rounded-[15px] sm:rounded-[50px] py-4 sm:py-2 px-4">
                <FaEnvelope className="text-[#248C9A] mr-2" />
                <input
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 outline-none"
                />
              </div>
              <div className="flex items-center bg-white border w-[400px] rounded-[15px] sm:rounded-[50px] py-4 sm:py-2 px-4">
                <FaLock className="text-[#248C9A] mr-2" />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Enter password"
                  className="flex-1 outline-none"
                />
                <button
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none"
                >
                  {isPasswordVisible ? (
                    <FaEyeSlash className="text-[#248C9A]" />
                  ) : (
                    <FaEye className="text-[#248C9A]" />
                  )}
                </button>
              </div>
              <div className="flex bg-white items-center border w-[400px] rounded-[15px] sm:rounded-[50px] py-4 sm:py-2 px-4">
                <FaPhone className="text-[#248C9A] mr-2" />
                <input
                  type="tel"
                  placeholder="Enter phone no."
                  className="flex-1 outline-none"
                />
              </div>
              <button className="bg-[#248C9A] font-bold text-white py-2 rounded-lg hover:bg-[#1c6e7a] transition-colors duration-200">
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="hidden sm:flex">
        <AuthSvg className="sm:absolute bottom-0 right-0 max-w-full h-[80vh] overflow-hidden" />
      </div>
    </div>
  );
};

export default AuthPage;
