import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../common/Layout";
import { ThemeContext } from "../../../context/ThemeContext";
import { GrOverview } from "react-icons/gr";
import { IoIosAlert, IoIosCloseCircle, IoMdAlert } from "react-icons/io";
import { GrServices } from "react-icons/gr";
import { TbAlertSquareFilled } from "react-icons/tb";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  FaUser,
  FaChartBar,
  FaIndustry,
  FaChartPie,
  FaHourglassStart,
  FaCheck,
  FaDashcube,
  FaCheckCircle,
  FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SiGoogleanalytics } from "react-icons/si";
import { MdDashboard } from "react-icons/md";
import { RenderLeads } from "./RenderLeads";

// Custom Card Component
// const CardOld = ({ title, value, icon: Icon }) => (
//   <div className="bg-white shadow rounded p-4 flex items-center">
//     {Icon && <Icon className="text-2xl mr-4" />}
//     <div>
//       <h3 className="text-lg font-semibold">{title}</h3>
//       <p className="text-2xl">{value}</p>
//     </div>
//   </div>
// );

export const Card = ({
  divClass,
  title,
  titleClass = "",
  count,
  countClass = "text-red-600",
  icon,
  iconClass = "",
  route,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`grid grid-cols-[1fr_min-content] bg-white grid-rows-2 items-center border border-gray-100 p-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${divClass}`}
      onClick={() => navigate(route)}
    >
      <h3
        className={`text-lg font-semibold col-start-1 col-span-2 text-gray-600 ${titleClass}`}
      >
        {title}
      </h3>
      <div
        className={`text-gray-400 transition-colors duration-300 ${iconClass}`}
      >
        {icon}
      </div>
      <p className={`text-3xl font-bold ${countClass}`}>{count}</p>
    </div>
  );
};
const AdminReports = () => {
  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  const [userType, setUserType] = useState("data_analyst");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2025-02-20");
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredUsers = response.data.filter(
          (user) => user.role === userType
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [userType, backendUrl, token]);

  const handleFetchReport = async () => {
    if (!userType || !selectedUser || !startDate || !endDate) {
      toast.error("Please select all fields.");
      return;
    }

    console.log({
      params: { userType, userId: selectedUser, startDate, endDate },
      headers: { Authorization: `Bearer ${token}` },
    });

    try {
      const response = await axios.get(`${backendUrl}/api/admin/user-report`, {
        params: { userType, userId: selectedUser, startDate, endDate },
        headers: { Authorization: `Bearer ${token}` },
      });

      setReportData(response.data);
      console.log("report data", response.data);
      toast.success("Report fetched successfully!");
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Error fetching report");
    }
  };

  return (
    <Layout>
      <div className="p-2 space-y-4">
        <h2 className="font-semibold text-2xl grid grid-cols-[min-content_max-content_1fr] grid-rows-1 gap-2 items-center">
          <SiGoogleanalytics />
          Admin Reports
          <div className=" h-[1px] w-[90%] justify-self-center border-t border-black"></div>
        </h2>

        <div className="grid md:grid-cols-[repeat(3,_1fr)_max-content] gap-2 items-end p-2 shadow-md rounded-md">
          {/* User Type Selection */}
          <div className="flex flex-col w-full">
            <label htmlFor="">Select User Type</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="">Select User Type</option>
              <option value="data_analyst">Data Analyst</option>
              <option value="sales_executive">Sales Executive</option>
              <option value="growth_manager">Growth Manager</option>
            </select>
          </div>

          {/* User Dropdown */}

          <div className="flex flex-col w-full">
            <label htmlFor="" className=" capitalize">
              Select {userType.replace("_", " ")}
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Selection */}

          <div className="flex w-full gap-2">
            <div>
              <label htmlFor="">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                title="From Date"
              />
            </div>
            <div>
              <label htmlFor="">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                title="To Date"
              />
            </div>
          </div>

          {/* Fetch Report Button */}
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-800 cursor-pointer"
            onClick={handleFetchReport}
          >
            Generate Report
          </button>
        </div>

        {reportData && <Dashboard data={reportData} userType={userType} />}

        {reportData && (
          <RenderLeads
            leads={reportData.leads}
            userType={userType}
            selectedUser={selectedUser}
          />
        )}
        {/* {reportData && <Dashboard2 data={reportData} />} */}
      </div>
    </Layout>
  );
};

export default AdminReports;

const Dashboard = ({ data, userType }) => {
  const leads = data.leads;

  // --- Lead Overview KPIs ---
  const totalLeads = leads.length;
  const openLeads = leads.filter((lead) => lead.status === "open").length;
  const lostLeads = leads.filter((lead) => lead.status === "lost").length;
  const closedLeads = leads.filter((lead) => lead.status === "closed").length;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    // Calculate label position
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const statusData = [
    { name: "Open", value: openLeads },
    { name: "Lost", value: lostLeads },
    { name: "Closed", value: closedLeads },
  ];

  const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

  // --- Industry Analysis ---
  const industryCount = leads.reduce((acc, lead) => {
    const industry = lead.industry.toLowerCase();
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {});
  const industryData = Object.keys(industryCount).map((key) => ({
    industry: key,
    count: industryCount[key],
  }));

  // --- Pipeline & Stage Analysis ---
  const pipelineStages = {};
  leads.forEach((lead) => {
    lead.growthManagerPipeline.forEach((stage) => {
      if (!pipelineStages[stage.stage]) {
        pipelineStages[stage.stage] = { completed: 0, pending: 0 };
      }
      stage.completed
        ? pipelineStages[stage.stage].completed++
        : pipelineStages[stage.stage].pending++;
    });
  });
  const pipelineData = Object.keys(pipelineStages).map((key) => ({
    stage: key,
    completed: pipelineStages[key].completed,
    pending: pipelineStages[key].pending,
  }));

  // --- Interaction & Follow-Up Trends ---
  let interactions = [];
  leads.forEach((lead) => {
    lead.contactPoints.forEach((contact) => {
      if (contact.interactions && contact.interactions.length > 0) {
        interactions = interactions.concat(contact.interactions);
      }
    });
  });

  // --- Lost Leads Analysis ---
  const lostLeadsData = leads
    .filter((lead) => lead.status === "lost")
    .reduce((acc, lead) => {
      const reason = lead.companyLostReason || "Unknown";
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});
  const lostLeadsChartData = Object.keys(lostLeadsData).map((key) => ({
    reason: key,
    count: lostLeadsData[key],
  }));

  // --- Wrong Number Alerts ---
  let totalWrongAlerts = 0;
  let resolvedWrongAlerts = 0;
  leads.forEach((lead) => {
    if (lead.wrongNumberAlerts && lead.wrongNumberAlerts.length > 0) {
      totalWrongAlerts += lead.wrongNumberAlerts.length;
      resolvedWrongAlerts += lead.wrongNumberAlerts.filter(
        (alert) => alert.isResolved
      ).length;
    }
  });

  return (
    <div className="p-2 space-y-8 shadow-md rounded-md">
      <div className=" grid sm:grid-cols-2 gap-4">
        {/* Lead Overview Section */}
        <section className=" grid grid-cols-1 gap-4 ">
          <div>
            <h2 className="text-lg font-semibold grid grid-cols-[min-content_max-content] items-center gap-2">
              <GrOverview />
              Lead Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Card
                title="Total Leads"
                count={totalLeads}
                countClass="text-gray-700"
                icon={<MdDashboard size={20} />}
              />
              <Card
                title="Open"
                count={openLeads}
                countClass="text-green-600"
                icon={<FaHourglassStart size={20} />}
              />
              <Card
                title="Lost"
                count={lostLeads}
                countClass="text-red-600"
                icon={<IoIosCloseCircle size={20} />}
              />
              <Card
                title="Closed"
                count={closedLeads}
                countClass="text-blue-600"
                icon={<FaCheck size={20} />}
              />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold grid grid-cols-[min-content_max-content] items-center gap-2">
              <FaChartPie />
              Leads Overview (%)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Industry & Company Analysis */}
        <section className="">
          <div className="">
            <h2 className="text-lg font-semibold grid grid-cols-[min-content_max-content] items-center gap-2">
              <FaIndustry />
              Lead Overview
            </h2>
            <ResponsiveContainer width="100%" height={325}>
              <BarChart data={industryData}>
                <XAxis dataKey="industry" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Pipeline & Stage Analysis */}
      <section>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold grid grid-cols-[min-content_max-content] items-center gap-2">
            <GrServices />
            Pipeline Stages
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#16a34a" name="Completed" />
              <Bar dataKey="pending" fill="#fb923c" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className=" grid sm:grid-cols-2 gap-4">
        {/* Lost Leads Analysis */}
        <section>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold grid grid-cols-[min-content_max-content] items-center gap-2">
              <FaBars size={20} />
              Leads Lost by Reason
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lostLeadsChartData}>
                <XAxis dataKey="reason" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#d88484" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Wrong Number Alerts */}
        <section>
          <h2 className="text-lg font-semibold grid grid-cols-[min-content_max-content] items-center gap-2">
            <IoMdAlert size={20} />
            Wrong Number Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              title="Total Alerts"
              count={totalWrongAlerts}
              countClass="text-gray-600"
              icon={<TbAlertSquareFilled size={20} />}
            />
            <Card
              title="Resolved"
              count={resolvedWrongAlerts}
              countClass="text-green-600"
              icon={<FaCheckCircle size={20} />}
            />
            <Card
              title="Not Resolved"
              count={totalWrongAlerts - resolvedWrongAlerts}
              countClass="text-red-600"
              icon={<IoIosCloseCircle size={25} />}
            />
          </div>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Resolved", value: resolvedWrongAlerts },
                    {
                      name: "Unresolved",
                      value: totalWrongAlerts - resolvedWrongAlerts,
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  <Cell fill="#00C49F" />
                  <Cell fill="#FF8042" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

// const Dashboard2 = ({ data }) => {
//   console.log(data);
//   const leads = data.leads;

//   // --- Lead Overview KPIs ---
//   const totalLeads = leads.length;
//   const openLeads = leads.filter((lead) => lead.status === "open").length;
//   const lostLeads = leads.filter((lead) => lead.status === "lost").length;
//   const closedLeads = leads.filter((lead) => lead.status === "closed").length;

//   const statusData = [
//     { name: "Open", value: openLeads },
//     { name: "Lost", value: lostLeads },
//     { name: "Closed", value: closedLeads },
//   ];
//   const COLORS = ["#0088FE", "#FF8042", "#00C49F"];

//   // --- Industry Analysis ---
//   const industryCount = leads.reduce((acc, lead) => {
//     const industry = lead.industry.toLowerCase();
//     acc[industry] = (acc[industry] || 0) + 1;
//     return acc;
//   }, {});
//   const industryData = Object.keys(industryCount).map((key) => ({
//     industry: key,
//     count: industryCount[key],
//   }));

//   // --- Sales Executive Performance ---
//   const salesExecCount = leads.reduce((acc, lead) => {
//     const name = lead?.assignedToSalesExecutive?.name;
//     acc[name] = (acc[name] || 0) + 1;
//     return acc;
//   }, {});
//   const salesExecData = Object.keys(salesExecCount).map((key) => ({
//     name: key,
//     leads: salesExecCount[key],
//   }));

//   // --- Growth Manager Performance ---
//   const growthManagerCount = leads.reduce((acc, lead) => {
//     lead.contactPoints.forEach((contact) => {
//       if (contact.assignedToGrowthManager) {
//         const gm = contact.assignedToGrowthManager.name;
//         acc[gm] = (acc[gm] || 0) + 1;
//       }
//     });
//     return acc;
//   }, {});
//   const growthManagerData = Object.keys(growthManagerCount).map((key) => ({
//     name: key,
//     leads: growthManagerCount[key],
//   }));

//   // --- Pipeline & Stage Analysis ---
//   const pipelineStages = {};
//   leads.forEach((lead) => {
//     lead.growthManagerPipeline.forEach((stage) => {
//       if (!pipelineStages[stage.stage]) {
//         pipelineStages[stage.stage] = { completed: 0, pending: 0 };
//       }
//       stage.completed
//         ? pipelineStages[stage.stage].completed++
//         : pipelineStages[stage.stage].pending++;
//     });
//   });
//   const pipelineData = Object.keys(pipelineStages).map((key) => ({
//     stage: key,
//     completed: pipelineStages[key].completed,
//     pending: pipelineStages[key].pending,
//   }));

//   // --- Interaction & Follow-Up Trends ---
//   let interactions = [];
//   leads.forEach((lead) => {
//     lead.contactPoints.forEach((contact) => {
//       if (contact.interactions && contact.interactions.length > 0) {
//         interactions = interactions.concat(contact.interactions);
//       }
//     });
//   });
//   // Group interactions by date (using the date portion)
//   const interactionByDate = interactions.reduce((acc, interaction) => {
//     const date = interaction.date.split("T")[0];
//     acc[date] = (acc[date] || 0) + 1;
//     return acc;
//   }, {});
//   const interactionData = Object.keys(interactionByDate).map((date) => ({
//     date,
//     interactions: interactionByDate[date],
//   }));

//   // --- Lost Leads Analysis ---
//   const lostLeadsData = leads
//     .filter((lead) => lead.status === "lost")
//     .reduce((acc, lead) => {
//       const reason = lead.companyLostReason || "Unknown";
//       acc[reason] = (acc[reason] || 0) + 1;
//       return acc;
//     }, {});
//   const lostLeadsChartData = Object.keys(lostLeadsData).map((key) => ({
//     reason: key,
//     count: lostLeadsData[key],
//   }));

//   // --- Wrong Number Alerts ---
//   let totalWrongAlerts = 0;
//   let resolvedWrongAlerts = 0;
//   leads.forEach((lead) => {
//     if (lead.wrongNumberAlerts && lead.wrongNumberAlerts.length > 0) {
//       totalWrongAlerts += lead.wrongNumberAlerts.length;
//       resolvedWrongAlerts += lead.wrongNumberAlerts.filter(
//         (alert) => alert.isResolved
//       ).length;
//     }
//   });

//   // --- TAT & Follow-Up Efficiency ---
//   let totalDelayDays = 0;
//   let countDelay = 0;
//   leads.forEach((lead) => {
//     lead.growthManagerPipeline.forEach((stage) => {
//       totalDelayDays += stage.delayDays || 0;
//       countDelay++;
//     });
//   });
//   const averageDelayDays = countDelay
//     ? (totalDelayDays / countDelay).toFixed(2)
//     : 0;

//   return (
//     <div className="p-4 space-y-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold">Admin Analytics Dashboard</h1>

//       {/* Lead Overview Section */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">Lead Overview</h2>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <CardOld title="Total Leads" value={totalLeads} icon={FaUser} />
//           <CardOld title="Open Leads" value={openLeads} icon={FaChartBar} />
//           <CardOld title="Lost Leads" value={lostLeads} icon={FaChartBar} />
//           <CardOld title="Closed Leads" value={closedLeads} icon={FaChartBar} />
//         </div>
//         <div className="mt-8">
//           <h3 className="text-xl font-semibold mb-2">Leads by Status</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={statusData}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 label
//               >
//                 {statusData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       {/* Industry & Company Analysis */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">
//           Industry & Company Analysis
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-xl font-semibold mb-2">Leads by Industry</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={industryData}>
//                 <XAxis dataKey="industry" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="count" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-xl font-semibold mb-2">Top Companies</h3>
//             <ul>
//               {leads.slice(0, 5).map((lead) => (
//                 <li key={lead._id} className="py-1 border-b">
//                   {lead.companyName} - {lead.status}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </section>

//       {/* Sales & Growth Manager Performance */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">
//           Sales & Growth Manager Performance
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-xl font-semibold mb-2">
//               Sales Executive Leads
//             </h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={salesExecData}>
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="leads" fill="#82ca9d" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="bg-white p-4 rounded shadow">
//             <h3 className="text-xl font-semibold mb-2">Growth Manager Leads</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={growthManagerData}>
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="leads" fill="#ffc658" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </section>

//       {/* Pipeline & Stage Analysis */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">
//           Pipeline & Stage Analysis
//         </h2>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-xl font-semibold mb-2">Pipeline Stages</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={pipelineData}>
//               <XAxis dataKey="stage" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="completed" fill="#0088FE" name="Completed" />
//               <Bar dataKey="pending" fill="#FF8042" name="Pending" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       {/* Interaction & Follow-Up Trends */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">
//           Interaction & Follow-Up Trends
//         </h2>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-xl font-semibold mb-2">Interactions Over Time</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={interactionData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="interactions" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//         <div className="mt-4">
//           <CardOld
//             title="Avg Interactions per Lead"
//             value={(interactions.length / totalLeads).toFixed(2)}
//             icon={FaChartBar}
//           />
//         </div>
//       </section>

//       {/* Lost Leads Analysis */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">Lost Leads Analysis</h2>
//         <div className="bg-white p-4 rounded shadow">
//           <h3 className="text-xl font-semibold mb-2">Lost Leads by Reason</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={lostLeadsChartData}>
//               <XAxis dataKey="reason" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#d88484" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       {/* Wrong Number Alerts */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">Wrong Number Alerts</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <CardOld
//             title="Total Alerts"
//             value={totalWrongAlerts}
//             icon={FaChartBar}
//           />
//           <CardOld
//             title="Resolved Alerts"
//             value={resolvedWrongAlerts}
//             icon={FaChartBar}
//           />
//         </div>
//         <div className="mt-4">
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={[
//                   { name: "Resolved", value: resolvedWrongAlerts },
//                   {
//                     name: "Unresolved",
//                     value: totalWrongAlerts - resolvedWrongAlerts,
//                   },
//                 ]}
//                 dataKey="value"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 label
//               >
//                 <Cell fill="#00C49F" />
//                 <Cell fill="#FF8042" />
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </section>

//       {/* TAT & Follow-Up Efficiency */}
//       <section>
//         <h2 className="text-2xl font-semibold mb-4">
//           TAT & Follow-Up Efficiency
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <CardOld
//             title="Avg Delay (Days)"
//             value={averageDelayDays}
//             icon={FaChartBar}
//           />
//           <CardOld
//             title="Overdue Follow-Ups"
//             value={0 /* customize logic if needed */}
//             icon={FaChartBar}
//           />
//         </div>
//       </section>
//     </div>
//   );
// };
