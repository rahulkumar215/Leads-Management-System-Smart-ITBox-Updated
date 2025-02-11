import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaList, FaPlus, FaEdit  } from "react-icons/fa";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { AiFillProduct } from "react-icons/ai";
import { BsBoxSeamFill } from "react-icons/bs";
import { MdSupervisorAccount } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { IoLogOut } from "react-icons/io5";







const Sidebar = () => {

  const { backendUrl } = useContext(ThemeContext);
    const navigate = useNavigate();

    const token = localStorage.getItem('token')

    const handleLogout = async () => {
        try {
            // await axios.post(`${backendUrl}/api/users/logout`, {
            //     headers: { Authorization: `Bearer ${token}` },
            // });

            // ✅ Clear Token from Local Storage
            localStorage.removeItem("token");
            localStorage.removeItem("role");

            // ✅ Redirect to Login Page
            navigate("/");
            toast.success("Logout Successfully")
        } catch (error) {
            console.error("❌ Error logging out:", error);
        }
    };

  const role = localStorage.getItem("role")

  return (
    <div className="bg-dark sidebar_box text-white" >
      <h3 style={{ textAlign: "center" }}>Dashboard</h3>
      <ul className="nav flex-column">


      {role === 'admin' && (
          <>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h5>Admin</h5>
            </div>

            <li className="nav-item">
              <Link to="/admin-dashboard" className="nav-link text-white">
                <RiDashboardHorizontalFill className="me-2" /> Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin/analytics" className="nav-link text-white">
                <SiGoogleanalytics className="me-2" /> Analytics
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin/manager-accounts" className="nav-link text-white">
                <FaUserGroup className="me-2" /> Accounts
              </Link>
            </li>

            {/* <li className="nav-item">
              <Link to="/create-lead" className="nav-link text-white">
                <FaPlus className="me-2" /> Create Data
              </Link>
            </li> */}

            <li className="nav-item">
              <Link to="/admin/all-leads" className="nav-link text-white">
                <FaList className="me-2" /> All Leads
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/admin/product-list" className="nav-link text-white">
                <BsBoxSeamFill className="me-2" /> Products
              </Link>
            </li>
          </>
        )}


        {role === 'data_analyst' && (
          <>
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h5>Data Analyst</h5>
            </div>

            <li className="nav-item">
              <Link to="/analyst-dashboard" className="nav-link text-white">
                <FaHome className="me-2" /> Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/analyst-lead" className="nav-link text-white">
                <FaHome className="me-2" /> Leads
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/create-lead" className="nav-link text-white">
                <FaPlus className="me-2" /> Create Data
              </Link>
            </li>
          </>
        )}

        {role === "sales_executive" && (
          <>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h5>Sale Executive</h5>
            </div>
            <li className="nav-item">
              <Link to="/sales-dashboard" className="nav-link text-white">
                <FaHome className="me-2" /> Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/sales-executive-leads" className="nav-link text-white">
                <FaHome className="me-2" /> Leads
              </Link>
            </li>
          </>
        )}

        {role === 'growth_manager' && (
          <>
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <h5>Growth Manager</h5>
            </div>
            <li className="nav-item">
              <Link to="/growth-dashboard" className="nav-link text-white">
                <FaHome className="me-2" /> Dashboard
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/growth-manager-analytics" className="nav-link text-white">
                <FaHome className="me-2" /> Analytics
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/growth-manager-leads" className="nav-link text-white">
                <FaHome className="me-2" /> Leads
              </Link>
            </li>
          </>
        )}



        {/* <li className="nav-item">
          <Link to="/list" className="nav-link text-white">
            <FaList className="me-2" /> List Data
          </Link>
        </li> */}


        <button className="global_btn" onClick={handleLogout} style={{ padding: "10px", cursor: "pointer" , position:"absolute",bottom:'30px',display:"flex",alignItems:"center"}}>
        <IoLogOut style={{fontSize:"20px", marginRight:"5px"}}/> <span>Logout</span>
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;
