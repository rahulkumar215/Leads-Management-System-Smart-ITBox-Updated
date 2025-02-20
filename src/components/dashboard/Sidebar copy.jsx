import { useEffect, useState, useContext } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaList,
  FaPlus,
  FaBell,
} from "react-icons/fa";
import { MdDashboard, MdLeaderboard } from "react-icons/md";
import { RiDashboardHorizontalFill } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaBellConcierge, FaUserGroup } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoNotifications } from "react-icons/io5";
import { GrRefresh } from "react-icons/gr";
import { LuCalendarClock, LuRefreshCw } from "react-icons/lu";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = useState("");
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Get role from localStorage to determine which menu items to display
  const role = localStorage.getItem("role");

  // Toggle submenu visibility while closing any other open menus
  const toggleMenu = (menu) => {
    setOpenMenus((prev) => {
      const newOpenMenus = { ...prev, [menu]: !prev[menu] };
      Object.keys(newOpenMenus).forEach((key) => {
        if (key !== menu) newOpenMenus[key] = false;
      });
      return newOpenMenus;
    });
  };

  // Logout: remove tokens/role and navigate to login
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
      toast.success("Logout Successfully");
    } catch (error) {
      console.error("❌ Error logging out:", error);
    }
  };

  // Navigation handler (closes sidebar on mobile devices)
  const handleNavigate = (route, isChildRoute = false) => {
    if (isMobile) {
      toggleSidebar();
    }
    setActiveRoute(route);
    if (!isChildRoute) {
      setOpenMenus({});
    }
    navigate(route);
  };

  // Update mobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update active route and open menus based on current location
  useEffect(() => {
    setActiveRoute(location.pathname);
    menuItems.forEach((item) => {
      if (item.children) {
        const isActiveChild = item.children.some(
          (child) => child.route === location.pathname
        );
        if (isActiveChild) {
          setOpenMenus((prev) => ({ ...prev, [item.tMenuName]: true }));
        }
      }
    });
  }, [location.pathname]);

  const [adminAlerts, setAdminAlerts] = useState([]);

  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  // Fetch TAT Alerts (Admin)
  useEffect(() => {
    const fetchAdminAlerts = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/all-tat-alerts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdminAlerts(response.data.alerts);
      } catch (error) {
        console.error("Error fetching Admin TAT Alerts:", error);
      }
    };
    fetchAdminAlerts();
  }, [backendUrl, token]);

  const [wrongNumberAlerts, setWrongNumberAlerts] = useState([]);

  useEffect(() => {
    fetchWrongNumberAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWrongNumberAlerts = async () => {
    try {
      console.log("📡 Fetching Wrong Number Alerts...");
      console.log("🔑 Token being sent:", token);
      const response = await axios.get(
        `${backendUrl}/api/lead/wrong-number-alerts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Wrong number alerts", response.data);
      setWrongNumberAlerts(response.data.wrongNumberAlerts);
    } catch (error) {
      console.error("❌ Error fetching Wrong Number Alerts:", error);
      toast.error("Failed to fetch wrong number alerts");
    }
  };

  const [followUpNotifications, setFollowUpNotifications] = useState([]);

  useEffect(() => {
    fetchFollowUpNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl]);

  const fetchFollowUpNotifications = async () => {
    try {
      if (!token) {
        console.error("❌ No auth token found!");
        toast.error("No auth token found!");
        return;
      }
      const response = await axios.get(
        `${backendUrl}/api/lead/get-growth-manager-stages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("🔹 Follow-Up Notifications API Response:", response.data);
      // Extract notifications from response (adjust key if needed)
      setFollowUpNotifications(response.data.followUpNotifications || []);
    } catch (error) {
      console.error("❌ Error fetching follow-up notifications:", error);
      toast.error("Error fetching follow-up notifications");
    }
  };

  const [stages, setStages] = useState([]);

  // Fetch stages on mount (and when backendUrl changes)
  useEffect(() => {
    fetchStages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl]);

  const fetchStages = async () => {
    try {
      if (!token) {
        console.error("❌ No auth token found!");
        toast.error("No auth token found!");
        return;
      }

      const response = await axios.get(
        `${backendUrl}/api/lead/get-growth-manager-stages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Only keep "in progress" stages (i.e. not completed)
      const inProgressStages = response.data.allStages.filter(
        (stage) => !stage.completed
      );

      // ✅ Filter stages with TAT deadlines **due today**
      const todayDeadlineStages = inProgressStages.filter(
        (stage) =>
          new Date(stage.tatDeadline).toDateString() ===
          new Date().toDateString()
      );

      setStages(todayDeadlineStages);
      console.log("🔹 Fetched stages:", todayDeadlineStages);
    } catch (error) {
      console.error("❌ Error fetching stages:", error);
      toast.error("Failed to fetch deadline stages");
    }
  };

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlertsAndStages();
  }, [backendUrl]);

  const fetchAlertsAndStages = async () => {
    try {
      if (!token) {
        console.error("❌ No auth token found!");
        return;
      }

      // ✅ Fetch TAT Alerts specific to logged-in Growth Manager
      const alertResponse = await axios.get(
        `${backendUrl}/api/lead/check-tat-alerts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Update state with filtered data
      setAlerts(alertResponse.data.alerts);

      console.log("🔹 Alerts:", alertResponse.data);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  const [notifications, setNotifications] = useState([]);
  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("📡 Fetching Sales Executive Notifications...");
        const response = await axios.get(
          `${backendUrl}/api/lead/sales-executive-notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(response.data.notifications);
        console.log(
          "Sales Executive Notifications:",
          response.data.notifications
        );
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        toast.error("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [backendUrl, token]);

  const [tatAlerts, setTatAlerts] = useState([]);

  useEffect(() => {
    const fetchTATAlerts = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/lead/sales-executive/getTATAlerts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTatAlerts(response.data.tatAlerts);
        console.log("TAT Alerts", response.data.tatAlerts);
      } catch (error) {
        console.error(
          "❌ Error fetching TAT alerts:",
          error.response?.data || error.message
        );
        toast.error("Failed to fetch TAT alerts");
      }
    };
    fetchTATAlerts();
  }, [backendUrl, token]);

  // State for follow-up alerts and loading indicator
  const [followUpAlerts, setFollowUpAlerts] = useState([]);
  useEffect(() => {
    const fetchFollowUpAlerts = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/lead/sales-executive/getTATAlerts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // We assume that the API returns followUpAlerts in the response
        setFollowUpAlerts(response.data.followUpAlerts);
        console.log("Follow-Up Alerts", response.data.followUpAlerts);
      } catch (error) {
        console.error(
          "❌ Error fetching follow-up alerts:",
          error.response?.data || error.message
        );
        toast.error("Failed to fetch follow-up alerts");
      }
    };

    fetchFollowUpAlerts();
  }, [backendUrl, token]);

  // Build the menuItems array based on the user's role
  let menuItems = [];
  if (role === "admin") {
    menuItems = [
      {
        route: "/admin-dashboard",
        icon: <RiDashboardHorizontalFill />,
        label: "Dashboard",
      },
      // {
      //   route: "/admin/analytics",
      //   icon: <SiGoogleanalytics />,
      //   label: "Analytics",
      // },
      {
        route: "/admin/notification",
        icon: <IoNotifications />,
        label: `Notifications`,
        value: adminAlerts.length,
      },
      {
        route: "/admin/manager-accounts",
        icon: <FaUserGroup />,
        label: "Accounts",
      },
      {
        route: "/admin/all-leads",
        icon: <FaList />,
        label: "All Leads",
      },
      {
        route: "/admin/product-list",
        icon: <BsBoxSeamFill />,
        label: "Products",
      },
      {
        route: "/admin-reports",
        icon: <SiGoogleanalytics />,
        label: "Reports",
      },
    ];
  } else if (role === "data_analyst") {
    menuItems = [
      {
        route: "/analyst-dashboard",
        icon: <RiDashboardHorizontalFill />,
        label: "Dashboard",
      },
      {
        route: "/analyst-alerts",
        icon: <FaBell />,
        label: "Alerts",
        value: wrongNumberAlerts.length,
      },
      {
        route: "/analyst-lead",
        icon: <MdLeaderboard />,
        label: "Leads",
      },
      {
        route: "/create-lead",
        icon: <FaPlus />,
        label: "Create Data",
      },
    ];
  } else if (role === "sales_executive") {
    menuItems = [
      {
        route: "/sales-dashboard",
        icon: <FaHome />,
        label: "Dashboard",
      },
      {
        route: "/sales-executive-notifications",
        icon: <FaBell />,
        label: "Notifications",
        value: notifications.length,
      },
      {
        route: "/sales-executive-alerts",
        icon: <FaBell />,
        label: "Alerts",
        value: tatAlerts.length,
      },
      {
        route: "/sales-executive-followups",
        icon: <LuRefreshCw />,
        label: "Follow Up",
        value: followUpAlerts.length,
      },
      {
        route: "/sales-executive-leads",
        icon: <FaHome />,
        label: "Leads",
      },
    ];
  } else if (role === "growth_manager") {
    menuItems = [
      {
        route: "/growth-dashboard",
        icon: <MdDashboard />,
        label: "Dashboard",
      },
      // {
      //   route: "/growth-manager-analytics",
      //   icon: <FaHome />,
      //   label: "Analytics",
      // },
      {
        route: "/growth-notifications",
        icon: <FaBell />,
        label: "Notifications",
        value: alerts.length,
      },
      {
        route: "/growth-lead-deadlines",
        icon: <LuCalendarClock />,
        label: "Deadlines",
        value: stages.length,
      },
      {
        route: "/growth-lead-inprogess",
        icon: <GrRefresh />,
        label: "In-Progress",
      },
      {
        route: "/follow-ups",
        icon: <LuRefreshCw />,
        label: "Follow Ups",
        value: followUpNotifications.length,
      },
      {
        route: "/growth-manager-leads",
        icon: <MdLeaderboard />,
        label: "Leads",
      },
    ];
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-gray-100 shadow-lg py-2 pl-2 transform transition-all duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full"} w-60 overflow-y-auto`}
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="bg-[#212529]  rounded-md h-full">
        {/* <div className="flex items-center justify-center p-2">
          <img src={logo} alt="Logo" className="h-16 object-contain" />
          <button
            className="text-gray-600 hover:text-yellow-600 transition-transform duration-300"
            onClick={toggleSidebar}
          >
            <FaCaretDown
              className={`transform ${isOpen ? "rotate-0" : "rotate-180"}`}
              size={20}
            />
          </button>
        </div> */}

        <div className="w-full grid sm:hidden grid-cols-2 items-center justify-center grid-rows-2 gap-x-2 gap-y-3 px-3 pt-4 pb-2">
          <span className="text-white col-start-1 font-semibold col-span-1 leading-0">
            Rahul
          </span>
          <span className="text-white col-start-1 text-sm col-span-1  leading-0">
            Admin
          </span>
          <FaUserCircle
            className="text-white col-start-2 col-span-1 row-start-1 row-span-2 justify-self-end"
            size={25}
          />
        </div>

        {/* Sidebar Menu */}
        <nav className="p-2">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.route}>
                <button
                  onClick={() =>
                    item.children
                      ? toggleMenu(item.tMenuName)
                      : handleNavigate(item.route, false)
                  }
                  className={`w-full grid  cursor-pointer grid-cols-[min-content_max-content_1fr] items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-md duration-200 ${
                    activeRoute === item.route
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-100 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <span className="text-lg text-yellow-500">{item.icon}</span>
                  {item.label}
                  {item.value ? (
                    <span className="justify-self-start px-1 rounded-4xl text-white bg-red-600">
                      {item.value}
                    </span>
                  ) : (
                    ""
                  )}
                  {item.children &&
                    (openMenus[item.tMenuName] ? (
                      <FaChevronDown />
                    ) : (
                      <FaChevronRight />
                    ))}
                </button>
                {item.children && (
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      openMenus[item.tMenuName] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="pl-6 space-y-2">
                      {item.children.map((child) => (
                        <li key={child.route}>
                          <button
                            onClick={() => handleNavigate(child.route, true)}
                            className={`w-full flex items-center gap-4 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                              activeRoute === child.route
                                ? "bg-gray-300 text-gray-900"
                                : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                            }`}
                          >
                            <span className="text-lg text-yellow-600">
                              {child.icon}
                            </span>
                            {child.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="p-2 ">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 bg-white hover:bg-yellow-200 text-red-600"
          >
            <FaSignOutAlt size={18} />
            <span className="text-sm tracking-wide font-medium">Log out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
