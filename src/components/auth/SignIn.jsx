import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Logo from '../images/logo/logo.png';
import sideImage from "../../assets/hero-shape-11.png";
import logo from "../../assets/logo.jpeg";
import { toast } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { backendUrl } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Request body for login API
    const loginData = {
      login: email, // or whatever field matches the login field
      pswd: password,
    };

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
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden md:flex md:w-1/2 h-screen relative items-center justify-center bg-gradient-to-br from-[#FF9E4F] to-[#FF8E31] overflow-hidden">
        <div className="text-center px-8">
          <h3 className="text-4xl font-bold text-white mb-4">Welcome Back!</h3>
          <p className="text-lg text-white">
            Log in to continue your journey with us.
          </p>
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
      <div className="w-full md:w-1/2 h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg transform transition duration-500 hover:shadow-2xl">
          <img src={logo} alt="Logo" className="w-24 mb-4 mx-auto" />
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 transition duration-300"
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
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-400 transition duration-300"
              />
            </div>

            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-slate-600 cursor-pointer dark:bg-gray-700 text-white py-2 rounded-md hover:bg-slate-700 dark:hover:bg-indigo-800 transition duration-300"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
