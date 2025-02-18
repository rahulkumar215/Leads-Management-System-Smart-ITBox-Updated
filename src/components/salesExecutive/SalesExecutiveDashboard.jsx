import { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import { FaHandshake, FaTable, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  TbPhoneCall,
  TbPhoneCalling,
  TbPhoneDone,
  TbPhoneEnd,
  TbPhoneOff,
  TbPhonePlus,
} from "react-icons/tb";
import {
  MdAssignment,
  MdMail,
  MdMessage,
  MdOutlineRefresh,
} from "react-icons/md";

const Card = ({
  title,
  count,
  icon,
  color = "text-red-600",
  classes = "",
  route,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`grid grid-cols-[1fr_min-content] gap-4 bg-white grid-rows-2 items-center border border-gray-100 
      p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${classes}`}
      onClick={() => navigate(route)}
    >
      <h3 className="text-lg font-semibold col-start-1 col-span-1 text-gray-600">
        {title}
      </h3>
      <div className="text-gray-400 transition-colors duration-300">{icon}</div>
      <p
        className={`text-[3rem] font-bold ${color} row-start-1 row-span-2 col-start-2 col-span-1`}
      >
        {count}
      </p>
    </div>
  );
};

const SalesExecutiveDashboard = () => {
  const { backendUrl } = useContext(ThemeContext);

  const [leads, setLeads] = useState([]);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [touchLeads, setTouchLeads] = useState(0);
  const [mailAndLinkedInCount, setMailAndLinkedInCount] = useState(0);
  const [callStatusData, setCallStatusData] = useState(0);

  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [tatAlerts, setTatAlerts] = useState([]);
  const [followUpAlerts, setFollowUpAlerts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const token = localStorage.getItem("token");

  // Get all leads linked with sales executive
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/lead/sales-executive/leads",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeads(response.data.leads);
        setFilteredLeads(response.data.leads);
        console.log("sales executive data", response.data.leads);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Error fetching leads");
      }
    };

    fetchLeads();
  }, [backendUrl, token]);

  // Handle Date Change
  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected);

    if (selected) {
      const filtered = leads.filter((lead) => {
        const assignedDate = new Date(lead.assignedDate)
          .toISOString()
          .split("T")[0];
        return assignedDate === selected;
      });
      setFilteredLeads(filtered);
    } else {
      setFilteredLeads(leads);
    }
  };

  // Handle Month and Year Change
  const handleMonthYearChange = () => {
    if (selectedMonth && selectedYear) {
      const filtered = leads.filter((lead) => {
        const assignedDate = new Date(lead.assignedDate);
        return (
          assignedDate.getMonth() + 1 === parseInt(selectedMonth) && // Month is 0-indexed
          assignedDate.getFullYear() === parseInt(selectedYear)
        );
      });
      setFilteredLeads(filtered);
    }
  };

  // Handle Date Range Change
  const handleDateRangeChange = () => {
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      const filtered = leads.filter((lead) => {
        const assignedDate = new Date(lead.assignedDate);
        return assignedDate >= startDate && assignedDate <= endDate;
      });
      setFilteredLeads(filtered);
    }
  };

  // get all contact interaction linked with sales executive
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/lead/total-contact-interactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Total Interactions", response.data.totalInteractions);
        setTotalInteractions(response.data.totalInteractions);
      } catch (error) {}
    };

    fetchInteractions();
  }, []);

  // Total Touched Leads
  useEffect(() => {
    const getTouchLeads = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/lead/leads/touched`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Touched Leads", response.data.touchedLeads);
        setTouchLeads(response.data.touchedLeads);
      } catch (error) {
        console.error("Error fetching Touched leads", error);
      }
    };
    getTouchLeads();
  }, []);

  // total counts of mail and linkedin
  useEffect(() => {
    const getMailAndLinkedInCount = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/lead/interactions/mail-linkedin-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Total mail and linkedin count", response.data);
        setMailAndLinkedInCount(response.data);
      } catch (error) {
        console.log(
          error,
          "Error while fetch count of mail done and linkedin done"
        );
      }
    };
    getMailAndLinkedInCount();
  }, []);

  // get call data accroding to today
  useEffect(() => {
    const todayCallStatus = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/lead/calls/status/today",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setCallStatusData(response.data);
      } catch (error) {
        console.log(error, "Error While fetching call data of today");
      }
    };
    todayCallStatus();
  }, []);

  const fetchTATAlerts = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/lead/sales-executive/getTATAlerts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTatAlerts(response.data.tatAlerts);
      setFollowUpAlerts(response.data.followUpAlerts);
      console.log("Tat Alerts", response.data);
      console.log("FollowUp Alerts", response.data);
    } catch (error) {
      console.error(
        "❌ Error fetching TAT alerts:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchTATAlerts();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

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
    }
  };

  const closeNotification = async (leadId, notification) => {
    if (!leadId || leadId === "undefined") {
      console.error("❌ leadId is undefined when trying to close notification");
      return;
    }

    console.log("✅ Closing notification for Lead ID:", leadId);

    try {
      await axios.put(
        `${backendUrl}/api/lead/sales-executive/notifications/${leadId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Remove closed notification from the UI
      setNotifications(
        notifications.filter((notif) => notif.leadId !== leadId)
      );
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
    }
  };

  return (
    <div>
      <Layout>
        <div className="p-2">
          {/* total data */}
          <div>
            <h1 className="text-2xl font-semibold tracking-wide mb-4">
              Reporting Dashboard
            </h1>
            <div className=" grid grid-cols-4 gap-4 mb-4">
              <Card
                title="Companies Assigned"
                count={leads.length || 0}
                icon={<MdAssignment size={25} />}
                color="text-gray-800"
                route=""
              />
              <Card
                title="Touched"
                count={touchLeads.length || 0}
                icon={<FaHandshake size={25} />}
                color="text-blue-600"
                route=""
              />
              <Card
                title="Interacted"
                count={totalInteractions || 0}
                icon={<TbPhoneCall size={25} />}
                color="text-green-600"
                route=""
              />
              <Card
                title="Contact Touched New"
                count={5}
                icon={<FaUserPlus size={25} />}
                color="text-teal-600"
                route=""
              />
              <Card
                title="Follow Up Taken"
                count={12}
                icon={<MdOutlineRefresh size={25} />}
                color="text-yellow-600"
                route=""
              />
              <Card
                title="Cold Mails"
                count={mailAndLinkedInCount.totalColdMailDone || 0}
                icon={<MdMail size={25} />}
                color="text-cyan-600"
                route=""
              />
              <Card
                title="LinkedIn Message"
                count={mailAndLinkedInCount.totalLinkedInMessageDone || 0}
                icon={<MdMessage size={25} />}
                color="text-indigo-600"
                route=""
              />
            </div>
          </div>

          {/* today data */}

          <div>
            <h1 className="text-2xl font-semibold tracking-wide mb-4">
              Today's Reporting
            </h1>

            {/* <span className="call_tried">
                Call Done:-{" "}
                {callStatusData.callConnected +
                  callStatusData.busy +
                  callStatusData.switchOff +
                  callStatusData.wrongNumber}
              </span> */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <Card
                title="Total Calls"
                count={
                  callStatusData.callConnected +
                    callStatusData.busy +
                    callStatusData.switchOff +
                    callStatusData.wrongNumber || 0
                }
                icon={<TbPhonePlus size={30} />}
                color="text-gray-700"
                route=""
              />

              <Card
                title="Connected"
                count={callStatusData.callConnected || 0}
                icon={<TbPhoneDone size={30} />}
                color="text-blue-600"
                route=""
              />

              <Card
                title="Busy"
                count={callStatusData.busy || 0}
                icon={<TbPhoneCalling size={30} />}
                color="text-cyan-600"
                route=""
              />

              <Card
                title="Switched Off"
                count={callStatusData.switchOff || 0}
                icon={<TbPhoneOff size={30} />}
                color="text-pink-600"
                route=""
              />

              <Card
                title="Wrong Number"
                count={callStatusData.wrongNumber || 0}
                icon={<TbPhoneEnd size={30} />}
                color="text-red-600"
                route=""
              />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default SalesExecutiveDashboard;

// import React, { useContext, useEffect, useState } from 'react'
// import Layout from '../common/Layout';
// import { ThemeContext } from '../../context/ThemeContext';
// import axios from 'axios';
// import TotalCompanyTouched from './filteredData/TotalCompanyTouched';
// import TotalCompaniesAssigned from './filteredData/TotalCompaniesAssigned';
// import { IoNotifications } from "react-icons/io5";
// import { BiSolidErrorAlt } from "react-icons/bi";
// import { FaCheck } from "react-icons/fa";
// import { PiWarningFill } from "react-icons/pi";

// const salesExecutiveDashboard = () => {

//     const { backendUrl } = useContext(ThemeContext)

//     const [leads, setLeads] = useState([]);
//     const [totalInteractions, setTotalInteractions] = useState(0)
//     const [touchLeads, setTouchLeads] = useState(0)
//     const [mailAndLinkedInCount, setMailAndLinkedInCount] = useState(0)
//     const [callStatusData, setCallStatusData] = useState(0)

//     const [filteredLeads, setFilteredLeads] = useState([]);
//     const [selectedDate, setSelectedDate] = useState('');
//     const [selectedMonth, setSelectedMonth] = useState('');
//     const [selectedYear, setSelectedYear] = useState('');
//     const [dateRange, setDateRange] = useState({ start: '', end: '' });
//     const [tatAlerts, setTatAlerts] = useState([]);
//     const [followUpAlerts, setFollowUpAlerts] = useState([]);
//     const [notifications, setNotifications] = useState([]);

//     const token = localStorage.getItem('token');

//     // Get all leads linked with sales executive
//     useEffect(() => {
//         const fetchLeads = async () => {
//             try {
//                 const response = await axios.get(backendUrl + '/api/lead/sales-executive/leads', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setLeads(response.data.leads);
//                 setFilteredLeads(response.data.leads);
//                 console.log('sales executive data', response.data.leads);
//             } catch (error) {
//                 console.error("Error fetching leads:", error);
//                 toast.error("Error fetching leads");
//             }
//         };

//         fetchLeads();
//     }, [backendUrl, token]);

//     // Handle Date Change
//     const handleDateChange = (event) => {
//         const selected = event.target.value;
//         setSelectedDate(selected);

//         if (selected) {
//             const filtered = leads.filter((lead) => {
//                 const assignedDate = new Date(lead.assignedDate).toISOString().split('T')[0];
//                 return assignedDate === selected;
//             });
//             setFilteredLeads(filtered);
//         } else {
//             setFilteredLeads(leads);
//         }
//     };

//     // Handle Month and Year Change
//     const handleMonthYearChange = () => {
//         if (selectedMonth && selectedYear) {
//             const filtered = leads.filter((lead) => {
//                 const assignedDate = new Date(lead.assignedDate);
//                 return (
//                     assignedDate.getMonth() + 1 === parseInt(selectedMonth) && // Month is 0-indexed
//                     assignedDate.getFullYear() === parseInt(selectedYear)
//                 );
//             });
//             setFilteredLeads(filtered);
//         }
//     };

//     // Handle Date Range Change
//     const handleDateRangeChange = () => {
//         if (dateRange.start && dateRange.end) {
//             const startDate = new Date(dateRange.start);
//             const endDate = new Date(dateRange.end);

//             const filtered = leads.filter((lead) => {
//                 const assignedDate = new Date(lead.assignedDate);
//                 return assignedDate >= startDate && assignedDate <= endDate;
//             });
//             setFilteredLeads(filtered);
//         }
//     };

//     // get all contact interaction linked with sales executive
//     useEffect(() => {
//         const fetchInteractions = async () => {
//             try {
//                 const response = await axios.get(backendUrl + `/api/lead/total-contact-interactions`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     }
//                 })
//                 console.log('Total Interactions', response.data.totalInteractions);
//                 setTotalInteractions(response.data.totalInteractions)
//             } catch (error) {

//             }
//         }

//         fetchInteractions()
//     }, [])

//     // Total Touched Leads
//     useEffect(() => {
//         const getTouchLeads = async () => {
//             try {
//                 const response = await axios.get(backendUrl + `/api/lead/leads/touched`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     }
//                 })
//                 console.log('Touched Leads', response.data.touchedLeads);
//                 setTouchLeads(response.data.touchedLeads)
//             } catch (error) {
//                 console.error("Error fetching Touched leads", error);
//             }
//         }
//         getTouchLeads()

//     }, [])

//     // total counts of mail and linkedin

//     useEffect(() => {
//         const getMailAndLinkedInCount = async () => {
//             try {
//                 const response = await axios.get(backendUrl + `/api/lead/interactions/mail-linkedin-count`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     }
//                 })
//                 console.log('Total mail and linkedin count', response.data);
//                 setMailAndLinkedInCount(response.data)
//             } catch (error) {
//                 console.log(error, 'Error while fetch count of mail done and linkedin done');
//             }
//         }
//         getMailAndLinkedInCount()
//     }, [])

//     // get call data accroding to today
//     useEffect(() => {
//         const todayCallStatus = async () => {
//             try {
//                 const response = await axios.get(backendUrl + '/api/lead/calls/status/today', {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     }
//                 })
//                 console.log(response.data);
//                 setCallStatusData(response.data)
//             } catch (error) {
//                 console.log(error, 'Error While fetching call data of today');
//             }
//         }
//         todayCallStatus()
//     }, [])

//     const fetchTATAlerts = async () => {
//         try {
//             const response = await axios.get(`${backendUrl}/api/lead/sales-executive/getTATAlerts`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             setTatAlerts(response.data.tatAlerts);
//             setFollowUpAlerts(response.data.followUpAlerts);
//             console.log('Tat Alerts', response.data);
//             console.log('FollowUp Alerts', response.data);
//         } catch (error) {
//             console.error("❌ Error fetching TAT alerts:", error.response?.data || error.message);
//         }
//     };

//     useEffect(() => {
//         fetchTATAlerts();
//     }, []);

//     useEffect(() => {
//         fetchNotifications();
//     }, []);

//     const fetchNotifications = async () => {
//         try {
//             console.log("📡 Fetching Sales Executive Notifications...");
//             const response = await axios.get(`${backendUrl}/api/lead/sales-executive-notifications`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             setNotifications(response.data.notifications);
//             console.log("Sales Executive Notifications:", response.data.notifications);
//         } catch (error) {
//             console.error("❌ Error fetching notifications:", error);
//         }
//     };

//     const closeNotification = async (leadId, notification) => {
//         if (!leadId || leadId === "undefined") {
//             console.error("❌ leadId is undefined when trying to close notification");
//             return;
//         }

//         console.log("✅ Closing notification for Lead ID:", leadId);

//         try {
//             await axios.put(`${backendUrl}/api/lead/sales-executive/notifications/${leadId}`, {}, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             // ✅ Remove closed notification from the UI
//             setNotifications(notifications.filter(notif => notif.leadId !== leadId));
//         } catch (error) {
//             console.error("❌ Error marking notification as read:", error);
//         }
//     };

//     return (
//         <div>
//             <Layout>

//                 <div className="sales-dashboard">
//                     {/* <h4>📢 Sales Executive Dashboard</h4> */}

//                     <div style={{ marginBottom: "25px" }}>
//                         <h5 className='alert_heading'>🔔 Notifications</h5>
//                         {notifications.length === 0 ? (
//                             <p>No new notifications.</p>
//                         ) : (
//                             <div className="notification-list">
//                                 {notifications.map((notification, index) => (
//                                     <div key={index} className="notification-item">
//                                         <IoNotifications className='notification_icon' />
//                                         <strong style={{ marginRight: "6px" }}>Company:- {notification.companyName} </strong>{notification.message}
//                                         <span className="notification-time">
//                                             {new Date(notification.createdAt).toLocaleString()}
//                                         </span>
//                                         <button style={{ marginLeft: "10px" }} className="close-btn global_btn global_success_btn" onClick={() => {
//                                             console.log("🔍 Notification Data Before Closing:", notification);
//                                             closeNotification(notification.leadId, notification);
//                                         }}>
//                                             <FaCheck style={{ marginRight: "8px" }} /> Mark as Done
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     {/* TAT Alerts Section */}
//                     <div style={{ marginBottom: "30px" }} className="tat-alert-section">
//                         <h5 className='alert_heading'>⏳ TAT Alerts</h5>
//                         {tatAlerts.length > 0 ? (
//                             <div>
//                                 {tatAlerts.map((alert, index) => (
//                                     <div key={index} className="sales-executive-tat-alert-item">
//                                         <BiSolidErrorAlt className='error_icon' />
//                                         <strong>{alert.companyName}</strong> - {alert.tatType}
//                                         <span>, Overdue by <strong>{alert.daysOverdue}</strong> days!</span>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <p>✅ No overdue TATs!</p>
//                         )}

//                         {/* 🔹 Follow-Up Alerts */}
//                         {followUpAlerts?.length > 0 && (
//                             <div className="follow-up-alerts">
//                                 <h5 style={{marginTop:"20px",marginBottom:"15px"}}>📅 Today's Follow-Ups</h5>
//                                 <div>
//                                     {followUpAlerts.map((alert, index) => (
//                                         <div key={index} className="follow-up-alert notification-item">
//                                         <PiWarningFill className='warning_icon'/> Follow-up with {alert.contactName} from {alert.companyName} at {alert.followUpTime} ({alert.followUpType})
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <div className='sale_executive_dashboard'>

//                     {/* total data */}
//                     <div className='row'>

//                         {/* filter start */}

//                         {/* Filters */}
//                         {/* <div className="filters">

//                             <label>
//                                 Select Date: <input type="date" value={selectedDate} onChange={handleDateChange} />
//                             </label>

//                             <div>
//                                 <label>
//                                     Select Month:
//                                     <select
//                                         value={selectedMonth}
//                                         onChange={(e) => setSelectedMonth(e.target.value)}
//                                     >
//                                         <option value="">--Select Month--</option>
//                                         {Array.from({ length: 12 }, (_, index) => (
//                                             <option key={index + 1} value={index + 1}>
//                                                 {new Date(0, index).toLocaleString('default', { month: 'long' })}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </label>
//                                 <label>
//                                     Select Year:
//                                     <select
//                                         value={selectedYear}
//                                         onChange={(e) => setSelectedYear(e.target.value)}
//                                     >
//                                         <option value="">--Select Year--</option>
//                                         {[2023, 2024, 2025].map((year) => (
//                                             <option key={year} value={year}>
//                                                 {year}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </label>
//                                 <button onClick={handleMonthYearChange}>Filter by Month/Year</button>
//                             </div>

//                             <div>
//                                 <label>
//                                     Start Date: <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
//                                 </label>
//                                 <label>
//                                     End Date: <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
//                                 </label>
//                                 <button onClick={handleDateRangeChange}>Filter by Date Range</button>
//                             </div>
//                         </div> */}

//                         {/* filter end */}

//                         <div className='dashboard_heading'>
//                             <p>Sales Executive Reporting Dashboard</p>
//                         </div>
//                         <div className='col-lg-3'>
//                             <TotalCompaniesAssigned />
//                         </div>

//                         <div className='col-lg-3'>
//                             <TotalCompanyTouched />
//                         </div>

//                         <div className='col-lg-3'>
//                             <div className='dashboard_card'>
//                                 <p className='number_heading'>Total Interactions Done</p>
//                                 <p className='number_text'>{totalInteractions}</p>
//                             </div>
//                         </div>

//                         <div className='col-lg-3'>
//                             <div className='dashboard_card'>
//                                 <p className='number_heading'>Total Contact Touched New</p>
//                                 <p className='number_text'>12</p>
//                             </div>
//                         </div>

//                         <div className='col-lg-3'>
//                             <div className='dashboard_card'>
//                                 <p className='number_heading'>Total Follow Up Taken</p>
//                                 <p className='number_text'>12</p>
//                             </div>
//                         </div>

//                         <div className='col-lg-3'>
//                             <div className='dashboard_card'>
//                                 <p className='number_heading'>Total Cold Mails</p>
//                                 <p className='number_text'>{mailAndLinkedInCount.totalColdMailDone}</p>
//                             </div>
//                         </div>

//                         <div className='col-lg-3'>
//                             <div className='dashboard_card'>
//                                 <p className='number_heading'>Total Cold LinkedIn Message</p>
//                                 <p className='number_text'>{mailAndLinkedInCount.totalLinkedInMessageDone}</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* today data */}
//                     <div className='row'>

//                         <div className='dashboard_heading'>
//                             <p>Today Reporting <span className='call_tried'>Call Done:- {callStatusData.callConnected + callStatusData.busy + callStatusData.switchOff + callStatusData.wrongNumber}</span></p>

//                         </div>
//                         <div className='col-lg-3'>
//                             <div className='dashboard_card'>
//                                 <p className='number_heading'>Call Connected</p>
//                                 <p className='number_text'>{callStatusData.callConnected}</p>
//                             </div>
//                         </div>

//                         <div className='col-lg-3'>
//                             <div className='dashboard_card'>
//                                 <p className='number_heading'>Call Busy</p>
//                                 <p className='number_text'>{callStatusData.busy}</p>
//                             </div>
//                         </div>

//                         <div className='col-lg-3'>
//                             <div className='dashboard_card'>
//                                 <p className='number_heading'>Switched Off</p>
//                                 <p className='number_text'>{callStatusData.switchOff}</p>
//                             </div>
//                         </div>

//                         <div className='col-lg-3'>
//                             <div className='dashboard_card'>
//                                 <p className='number_heading'>Wrong Number</p>
//                                 <p className='number_text'>{callStatusData.wrongNumber}</p>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </Layout>
//         </div>
//     )
// }

// export default salesExecutiveDashboard
