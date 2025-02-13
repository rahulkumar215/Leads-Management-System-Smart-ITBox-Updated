import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Logo from '../images/logo/logo.png';
import sideImage from "../../assets/hero-shape-11.png";
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
    <div className="sign_in_page">
      <div className="">
        <div className="row">
          <div className="col-lg-7">
            <div className="sign_up_left">
              <div className="sign_up_left_content">
                <h3>Hello,</h3>
                <h3>Welcome Back 👋🏻</h3>
              </div>
              <div className="sign_up_bg_img">
                <img src={sideImage} alt="" />
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="sign_in_from_relative">
              <div className="sign_in_form">
                <div className="">
                  <h4 className="">Sign In</h4>
                  <p className="">Sign in to your account to continue.</p>

                  <form className="custom_form" onSubmit={handleSubmit}>
                    <div className="">
                      {/* <label
                  htmlFor="email"
                  className=""
                >
                  Email address
                </label> */}
                      <input
                        type="text"
                        id="email"
                        className="mb-3"
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="mb-6">
                      {/* <label
                  htmlFor="password"
                  className=""
                >
                  Password
                </label> */}
                      <input
                        type="password"
                        id="password"
                        className="mb-3"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="">
                      {/* <label className="">
                  <input
                    type="checkbox"
                    className="mr-2"
                  />
                  Remember me
                </label> */}
                      {/* <Link
                  to="/forgot-password"
                  className=""
                >
                  Forgot password?
                </Link> */}
                    </div>
                    {/* Error message */}
                    {error && (
                      <div className="text-red-600 text-sm mb-4">{error}</div>
                    )}
                    <div className="mb-6">
                      <button type="submit" className="global_btn">
                        Sign in
                      </button>
                    </div>

                    {/* sign up ----- */}
                    {/* <div className="">
                <p className="text-sm text-gray-500">
                  Don’t have an account?{' '}
                  <Link
                    to="/sign-up"
                    className="text-blue-600 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div> */}
                    {/* sign up end ----- */}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
