import { useEffect, useState, useContext, useMemo } from "react";
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
import { FaUserGroup } from "react-icons/fa6";
import { IoNotifications } from "react-icons/io5";
import { GrRefresh } from "react-icons/gr";
import { LuCalendarClock, LuRefreshCw } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("");
  const [openMenus, setOpenMenus] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Get role and token from localStorage
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const { backendUrl } = useContext(ThemeContext);

  // Helper function for authenticated GET requests
  const authGet = (url) =>
    axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

  // Toggle submenu while closing any other open menus
  const toggleMenu = (menu) => {
    setOpenMenus((prev) => {
      const newOpenMenus = { ...prev, [menu]: !prev[menu] };
      Object.keys(newOpenMenus).forEach((key) => {
        if (key !== menu) newOpenMenus[key] = false;
      });
      return newOpenMenus;
    });
  };

  // Logout handler: clears local storage and navigates to login
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
      toast.success("Logout Successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Navigation handler (closes sidebar on mobile devices)
  const handleNavigate = (route, isChildRoute = false) => {
    if (isMobile) toggleSidebar();
    setActiveRoute(route);
    if (!isChildRoute) setOpenMenus({});
    navigate(route);
  };

  // Update mobile state on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // ---------------------------
  // API Calls Based on User Role
  // ---------------------------

  // For Admin
  const [adminAlerts, setAdminAlerts] = useState([]);
  useEffect(() => {
    if (role === "admin" && token) {
      authGet(`${backendUrl}/api/admin/all-tat-alerts`)
        .then((response) => setAdminAlerts(response.data.alerts))
        .catch((error) =>
          console.error("Error fetching Admin TAT Alerts:", error)
        );
    }
  }, [backendUrl, token, role]);

  // For Data Analyst
  const [wrongNumberAlerts, setWrongNumberAlerts] = useState([]);
  useEffect(() => {
    if (role === "data_analyst" && token) {
      authGet(`${backendUrl}/api/lead/wrong-number-alerts`)
        .then((response) => {
          console.log("Wrong number alerts", response.data);
          setWrongNumberAlerts(response.data.wrongNumberAlerts);
        })
        .catch((error) => {
          console.error("Error fetching Wrong Number Alerts:", error);
          toast.error("Failed to fetch wrong number alerts");
        });
    }
  }, [backendUrl, token, role]);

  // For Growth Manager
  const [followUpNotifications, setFollowUpNotifications] = useState([]);
  const [stages, setStages] = useState([]);
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    if (role === "growth_manager" && token) {
      const fetchGrowthData = async () => {
        try {
          const response = await authGet(
            `${backendUrl}/api/lead/get-growth-manager-stages`
          );
          const data = response.data;
          setFollowUpNotifications(data.followUpNotifications || []);
          const inProgressStages = data.allStages.filter(
            (stage) => !stage.completed
          );
          const todayDeadlineStages = inProgressStages.filter(
            (stage) =>
              new Date(stage.tatDeadline).toDateString() ===
              new Date().toDateString()
          );
          setStages(todayDeadlineStages);
          console.log("Fetched Growth Manager Data:", {
            followUpNotifications: data.followUpNotifications,
            stages: todayDeadlineStages,
          });
        } catch (error) {
          console.error("Error fetching Growth Manager data:", error);
          toast.error("Failed to fetch growth manager data");
        }
      };
      fetchGrowthData();
    }
  }, [backendUrl, token, role]);

  useEffect(() => {
    if (role === "growth_manager" && token) {
      authGet(`${backendUrl}/api/lead/check-tat-alerts`)
        .then((response) => {
          setAlerts(response.data.alerts);
          console.log("Growth Manager Alerts:", response.data.alerts);
        })
        .catch((error) =>
          console.error("Error fetching Growth Manager TAT Alerts:", error)
        );
    }
  }, [backendUrl, token, role]);

  // For Sales Executive
  const [notifications, setNotifications] = useState([]);
  const [tatAlerts, setTatAlerts] = useState([]);
  const [followUpAlerts, setFollowUpAlerts] = useState([]);
  useEffect(() => {
    if (role === "sales_executive" && token) {
      authGet(`${backendUrl}/api/lead/sales-executive-notifications`)
        .then((response) => {
          setNotifications(response.data.notifications);
          console.log(
            "Sales Executive Notifications:",
            response.data.notifications
          );
        })
        .catch((error) => {
          console.error("Error fetching Sales Executive Notifications:", error);
          toast.error("Failed to fetch notifications");
        });
    }
  }, [backendUrl, token, role]);

  useEffect(() => {
    if (role === "sales_executive" && token) {
      authGet(`${backendUrl}/api/lead/sales-executive/getTATAlerts`)
        .then((response) => {
          setTatAlerts(response.data.tatAlerts);
          setFollowUpAlerts(response.data.followUpAlerts);
          console.log("Sales Executive Alerts:", {
            tatAlerts: response.data.tatAlerts,
            followUpAlerts: response.data.followUpAlerts,
          });
        })
        .catch((error) => {
          console.error(
            "Error fetching Sales Executive Alerts:",
            error.response?.data || error.message
          );
          toast.error("Failed to fetch sales executive alerts");
        });
    }
  }, [backendUrl, token, role]);

  // ---------------------------
  // Memoized Menu Items Based on Role
  // ---------------------------
  const menuItems = useMemo(() => {
    switch (role) {
      case "admin":
        return [
          {
            route: "/admin-dashboard",
            icon: <RiDashboardHorizontalFill />,
            label: "Dashboard",
          },
          {
            route: "/admin/notification",
            icon: <IoNotifications />,
            label: "Notifications",
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
      case "data_analyst":
        return [
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
      case "sales_executive":
        return [
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
      case "growth_manager":
        return [
          {
            route: "/growth-dashboard",
            icon: <MdDashboard />,
            label: "Dashboard",
          },
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
      default:
        return [];
    }
  }, [
    role,
    adminAlerts,
    wrongNumberAlerts,
    notifications,
    tatAlerts,
    followUpAlerts,
    alerts,
    stages,
    followUpNotifications,
  ]);

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full bg-gray-100 shadow-lg py-2 pl-2 transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} w-60 overflow-y-auto`}
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="bg-[#212529] rounded-md h-full">
        <div className="w-full grid sm:hidden grid-cols-2 items-center justify-center grid-rows-2 gap-x-2 gap-y-3 px-3 pt-4 pb-2">
          <span className="text-white col-start-1 font-semibold">Rahul</span>
          <span className="text-white col-start-1 text-sm">Admin</span>
          <FaUserCircle
            className="text-white col-start-2 row-span-2 justify-self-end"
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
                  className={`w-full grid cursor-pointer grid-cols-[min-content_max-content_1fr] items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-md duration-200 ${
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
        <div className="p-2">
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
