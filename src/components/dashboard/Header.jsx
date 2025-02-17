import { FaBars, FaUserCircle } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";

const Header = ({ toggleSidebar, sidebarOpen }) => {
  const renderRole = (role) => {
    let formatted = "";
    if (role === "growth_manager") {
      formatted = "Growth Manager";
    } else if (role === "sales_executive") {
      formatted = "Sales Executive";
    } else if (role === "data_analyst") {
      formatted = "Data Analyst";
    } else {
      formatted = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }
    return formatted;
  };

  const role = renderRole(localStorage.getItem("role"));

  return (
    <nav className="grid grid-cols-[min-content_1fr_min-content] rounded-md items-center p-2 m-2 bg-[#2C2E30] shadow-lg">
      {/* Left Section: Hamburger Menu */}
      <button
        className="p-2 rounded-md text-white hover:bg-white cursor-pointer hover:text-yellow-600 transition-colors duration-300"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <FaBars className="text-2xl" />
        )}
      </button>

      {/* Center Section: Company Name (and optional Logo) */}
      <div className="flex items-center justify-center space-x-4">
        <div className="text-xl sm:text-2xl font-bold tracking-normal text-white">
          Leads Management System
        </div>
      </div>

      {/* Right Section: Welcome Message & User Icon */}
      <div className="hidden sm:grid grid-cols-[max-content_min-content] items-center justify-center grid-rows-2 gap-x-2 gap-y-3 ">
        <span className="text-white col-start-1 font-semibold col-span-1 leading-0">
          Rahul
        </span>
        <span className="text-white col-start-1 text-sm col-span-1 leading-0">
          {role}
        </span>
        <FaUserCircle
          className="text-white col-start-2 col-span-1 row-start-1 row-span-2"
          size={25}
        />
      </div>
    </nav>
  );
};

export default Header;
