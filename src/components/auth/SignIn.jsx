import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
// import Logo from '../images/logo/logo.png';
import sideImage from "../../assets/hero-shape-11.png";
// import logo from "../../assets/logo.jpeg";
import logo from "/src/assets/mainlogo.png";

import { toast, ToastContainer } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import { Bars } from "react-loader-spinner";
import { motion } from "framer-motion";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { backendUrl } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Request body for login API
    const loginData = {
      login: email, // or whatever field matches the login field
      pswd: password,
    };
    setIsLoading(true);
    try {
      const response = await fetch(backendUrl + "/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store role and token in localStorage
        localStorage.setItem("token", data.token); // Save the token
        localStorage.setItem("role", data.role); // Save the role
        localStorage.setItem("username", data.name); // Save the username

        console.log(data);

        // Navigate to the dashboard or based on the role
        // if (data.role === 'admin') {
        //   navigate('/admin-dashboard');
        // } else if (data.role === 'sales_executive') {
        //   navigate('/sales-dashboard');
        // } else if (data.role === 'data_analyst') {
        //   navigate('/analyst-dashboard');
        // } else if (data.role === 'growth_manager') {
        //   navigate('/growth-dashboard');
        // }

        switch (data.role) {
          case "admin":
            navigate("/admin-dashboard");
            break;
          case "sales_executive":
            navigate("/sales-dashboard");
            break;
          case "data_analyst":
            navigate("/analyst-dashboard");
            break;
          case "growth_manager":
            navigate("/growth-dashboard");
            break;
          default:
            navigate("/");
        }
        toast.success("Login Successfully");
      } else {
        // Handle error
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center h-full items-center bg-white/30 z-10">
          <Bars
            height="40"
            width="40"
            color="#B43F3F"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      )}
      {/* Left Section */}
      <div className="hidden md:flex md:w-1/2 h-screen relative items-center justify-center bg-gradient-to-br from-[#FF9E4F] to-[#FF8E31] overflow-hidden">
        <div className="text-center px-8 relative z-10">
          <h3
            className="text-[4rem] font-bold text-white mb-4"
            style={{ fontFamily: "Borel, serif" }}
          >
            Welcome Back!
          </h3>
          <p
            className="text-xl text-white"
            style={{ fontFamily: "Open Sans, serif" }}
          >
            Sign in to continue.
          </p>
          {/* Animated background behind the text */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            style={{ zIndex: -1 }} // Lower z-index so it stays behind
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10 backdrop-blur-3xl"
                style={{
                  width: Math.random() * 300 + 50,
                  height: Math.random() * 300 + 50,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Optional decorative image */}
        {sideImage && (
          <img
            src={sideImage}
            alt="Decorative background"
            className="absolute bottom-[-70px] left-[-50px] opacity-40 transform -rotate-50"
          />
        )}
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 h-screen flex items-center justify-center  dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg transform transition duration-500 ">
          <img src={logo} alt="Logo" className="w-64 mb-4 mx-auto" />
          <h4 className="text-2xl font-bold text-gray-800 dark:text-indigo-300 mb-6 text-center">
            Sign In
          </h4>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 dark:text-gray-200 mb-2"
              >
                Email or Username
              </label>
              <input
                type="text"
                id="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-400 transition duration-300"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 dark:text-gray-200 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-400 transition duration-300"
              />
            </div>

            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-slate-600 cursor-pointer dark:bg-gray-700 text-white py-2 rounded-md hover:bg-slate-700 dark:hover:bg-indigo-800 flex items-center justify-center transition duration-300"
              >
                {isLoading ? (
                  <Bars
                    height="20"
                    width="20"
                    color="#ffffff"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />

      <div className="absolute w-full text-center sm:text-right right-0 bottom-0 p-2">
        <p className="text-sm font-semibold">
          Designed with ❤️ and crafted with care by Team{" "}
          <a
            href="https://www.youtube.com/@SHALENDERSINGH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 font-bold block sm:inline hover:text-orange-600"
          >
            SMART ITBOX
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
