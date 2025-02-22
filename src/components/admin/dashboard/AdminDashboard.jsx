import { useContext, useEffect, useState } from "react";
import Layout from "../../common/Layout";
import { ThemeContext } from "../../../context/ThemeContext";
import axios from "axios";
import { BiSolidInfoCircle } from "react-icons/bi";
import { DNA } from "react-loader-spinner";
import PipelineStagesSection from "./PipelineStagesSection";
import LostLeadsByReasonSection from "./LostLeadsByReasonSection";
import OverallLeadAnalyticsSection from "./OverallLeadAnalyticsSection";
import UserSection from "./UserSection";

// Main Admin Dashboard Component
const AdminDashboardCombined = () => {
  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  // State declarations
  const [dashboardOne, setDashboardOne] = useState(null);
  const [dashboardTwo, setDashboardTwo] = useState(null);
  const [lostLeadsByReason, setLostLeadsByReason] = useState(null);
  const [userCounts, setUserCounts] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [lostLeadsDoughnutData, setLostLeadsDoughnutData] = useState(null);
  const [loading, setLoading] = useState({
    adminAnalytics: true,
    pieChartAnalytics: true,
    leadLostReasonDoughnut: true,
  });

  // Reason styles for Lost Leads
  const reasonStyles = {
    Commercial: {
      color: "text-[#ff6384]",
      textColor: "text-pink-600",
      icon: <BiSolidInfoCircle size={30} />,
    },
    Credential: {
      color: "text-[#36a2eb]",
      textColor: "text-blue-600",
      icon: <BiSolidInfoCircle size={30} />,
    },
    Features: {
      color: "text-[#ffce56]",
      textColor: "text-yellow-500",
      icon: <BiSolidInfoCircle size={30} />,
    },
  };

  // Fetch Admin Analytics data (only one useEffect now)
  useEffect(() => {
    const fetchAdminAnalytics = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/admin-analytics`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setDashboardOne(response.data.dashboardOne || {});
          setDashboardTwo(response.data.dashboardTwo || {});
          setLostLeadsByReason(response.data.lostLeadsByReason || {});
          setUserCounts(response.data.userCounts || {});
        }
      } catch (error) {
        console.error("Error fetching Admin Analytics:", error);
      } finally {
        setLoading((prev) => ({ ...prev, adminAnalytics: false }));
      }
    };
    fetchAdminAnalytics();
  }, [backendUrl, token]);

  // Fetch Overall Lead Analytics Pie Chart Data
  useEffect(() => {
    const fetchPieChartAnalytics = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/admin-pie-chart-analytics`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response?.data?.success) {
          const {
            totalLeads,
            totalLostLeads,
            totalInterestedLeads,
            totalLeadsInPipeline,
            totalOpenLeads,
          } = response.data.pieChartData;
          setChartData({
            labels: [
              "Total Leads",
              "Lost Leads",
              "Interested Leads",
              "Leads in Pipeline",
              "Open Leads",
            ],
            datasets: [
              {
                data: [
                  totalLeads,
                  totalLostLeads,
                  totalInterestedLeads,
                  totalLeadsInPipeline,
                  totalOpenLeads,
                ],
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error fetching Pie Chart Analytics:", error);
      } finally {
        setLoading((prev) => ({ ...prev, pieChartAnalytics: false }));
      }
    };
    fetchPieChartAnalytics();
  }, [backendUrl, token]);

  // Fetch Lost Leads Doughnut Data
  useEffect(() => {
    const fetchLeadLostReasonDoughnut = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/lead-lost-reason-doughnut`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          setLostLeadsDoughnutData(response.data.lostLeadsDoughnutData);
        }
      } catch (error) {
        console.error("Error fetching Lead Lost Doughnut Data:", error);
      } finally {
        setLoading((prev) => ({ ...prev, leadLostReasonDoughnut: false }));
      }
    };
    fetchLeadLostReasonDoughnut();
  }, [backendUrl, token]);

  // Prepare data for charts

  // Overall Lead Analytics Pie Data
  const overallPieData = chartData
    ? chartData.labels.map((label, index) => ({
        name: label,
        value: chartData.datasets[0].data[index],
      }))
    : [];

  const overallPieColors = [
    "#4CAF50",
    "#F44336",
    "#FF9800",
    "#2196F3",
    "#9C27B0",
  ];

  const overallData = chartData
    ? chartData.labels.map((label, index) => ({
        name: label,
        value: chartData.datasets[0].data[index],
      }))
    : [];

  // Pipeline Pie Data (from dashboardTwo)
  const pipelinePieData = dashboardTwo
    ? Object.keys(dashboardTwo).map((key) => ({
        name: key,
        value: dashboardTwo[key],
      }))
    : [];

  const pipelinePieColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
  ];

  const pipelineBarData = dashboardTwo
    ? Object.keys(dashboardTwo).map((key) => ({
        name: key,
        value: dashboardTwo[key],
      }))
    : [];

  const isDataLoading = Object.values(loading).some((val) => val);

  if (isDataLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <DNA
            visible={true}
            height="150"
            width="150"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* users section */}
        <UserSection userCounts={userCounts} />

        {/* Overall Lead Analytics */}
        <OverallLeadAnalyticsSection
          dashboardOne={dashboardOne}
          overallPieData={overallPieData}
          overallPieColors={overallPieColors}
          overallData={overallData}
        />

        {/* Lost leads by reason section */}
        <LostLeadsByReasonSection
          lostLeadsByReason={lostLeadsByReason}
          lostLeadsPieData={
            lostLeadsDoughnutData
              ? ["Commercial", "Credential", "Features"].map((key) => ({
                  name: key,
                  value: lostLeadsDoughnutData[key] || 0,
                }))
              : []
          }
          lostLeadsColors={["#ff6384", "#36a2eb", "#ffce56"]}
          reasonStyles={reasonStyles}
        />

        {/* pipelin stages section */}
        <PipelineStagesSection
          dashboardTwo={dashboardTwo}
          pipelineBarData={pipelineBarData}
          pipelinePieData={pipelinePieData}
          pipelinePieColors={pipelinePieColors}
        />

        {/* TAT Alerts section */}
        {/* <TatAlertsSection adminAlerts={adminAlerts} mapRole={mapRole} /> */}
      </div>
    </Layout>
  );
};

export default AdminDashboardCombined;

// import React, { useContext, useEffect, useState } from "react";
// import Layout from "../common/Layout";
// import { ThemeContext } from "../../context/ThemeContext";
// import axios from "axios";
// import {
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   BarChart,
//   CartesianGrid,
//   XAxis,
//   Bar,
//   YAxis,
// } from "recharts";
// import {
//   BiSolidErrorAlt,
//   BiSolidInfoCircle,
//   BiSolidXCircle,
// } from "react-icons/bi";
// import { useNavigate } from "react-router-dom";
// import { FiUserPlus } from "react-icons/fi";
// import {
//   MdCancel,
//   MdCheckCircle,
//   MdDashboard,
//   MdDrafts,
//   MdNotInterested,
//   MdOpenInNew,
//   MdThumbUp,
//   MdTimeline,
// } from "react-icons/md";
// import { DNA } from "react-loader-spinner";

// const Card = ({
//   title,
//   count,
//   icon,
//   color = "text-red-600 ",
//   classes = "",
//   route,
// }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       className={`grid grid-cols-[1fr_min-content] bg-white grid-rows-2 items-center border border-gray-100 p-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${classes}`}
//       onClick={() => navigate(route)}
//     >
//       <h3 className="text-lg font-semibold col-start-1 col-span-2 text-gray-600 ">
//         {title}
//       </h3>
//       {/* col-start-2 col-span-1 row-start-2 row-span-1 */}
//       <div className=" text-gray-400 transition-colors duration-300">
//         {icon}
//       </div>
//       <p className={`text-3xl font-bold ${color}`}>{count}</p>
//     </div>
//   );
// };

// const Card2 = ({
//   title,
//   count,
//   icon,
//   color = "text-red-600 ",
//   classes = "",
//   route,
//   textColor = "text-gray-600",
// }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       className={`grid grid-cols-[3fr_1fr_1fr] bg-white items-center border border-gray-100 p-4 rounded-lg shadow-lg gap-x-4 transition-all duration-300 hover:shadow-xl cursor-pointer ${classes}`}
//       onClick={() => navigate(route)}
//     >
//       <h3 className={`text-3xl font-bold col-start-1  col-span-1 ${textColor}`}>
//         {title}
//       </h3>
//       <div className=" text-gray-400 col-start-2 col-span-1 transition-colors duration-300">
//         {icon}
//       </div>
//       <p
//         className={`text-4xl font-bold col-start-3 col-span-1 justify-self-end ${color}`}
//       >
//         {count}
//       </p>
//     </div>
//   );
// };

// const Card3 = ({
//   title,
//   count,
//   icon,
//   color = "text-red-600 ",
//   classes = "",
//   route,
//   textColor = "text-gray-600",
// }) => {
//   const navigate = useNavigate();

//   return (
//     <div
//       className={`grid grid-cols-[min-content_1fr_min-content] bg-white items-center border border-gray-100 p-2 rounded-lg shadow-lg gap-x-4 transition-all duration-300 hover:shadow-xl cursor-pointer ${classes}`}
//       onClick={() => navigate(route)}
//     >
//       <div className=" text-gray-400 transition-colors duration-300">
//         {icon}
//       </div>
//       <h3 className={`text-md font-bold  ${textColor}`}>{title}</h3>
//       <p className={`text-4xl font-bold  justify-self-end ${color}`}>{count}</p>
//     </div>
//   );
// };

// const AdminDashboardCombined = () => {
//   const { backendUrl } = useContext(ThemeContext);
//   const token = localStorage.getItem("token");

//   // States for analytics & alerts
//   const [adminAlerts, setAdminAlerts] = useState([]);
//   const [dashboardOne, setDashboardOne] = useState(null);
//   const [dashboardTwo, setDashboardTwo] = useState(null);
//   const [lostLeadsByReason, setLostLeadsByReason] = useState(null);
//   const [userCounts, setUserCounts] = useState(null);
//   const [chartData, setChartData] = useState(null);
//   const [lostLeadsDoughnutData, setLostLeadsDoughnutData] = useState(null);
//   const [loading, setLoading] = useState({
//     adminAnalytics: true,
//     pieChartAnalytics: true,
//     leadLostReasonDoughnut: true,
//     adminAlerts: true,
//   });

//   console.log(lostLeadsByReason);

//   // Fetch Admin Analytics data
//   useEffect(() => {
//     const fetchAdminAnalytics = async () => {
//       try {
//         const response = await axios.get(
//           `${backendUrl}/api/admin/admin-analytics`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (response.data.success) {
//           setDashboardOne(response.data.dashboardOne || {});
//           setDashboardTwo(response.data.dashboardTwo || {});
//           setLostLeadsByReason(response.data.lostLeadsByReason || {});
//           setUserCounts(response.data.userCounts || {});
//         }
//       } catch (error) {
//         console.error("Error fetching Admin Analytics:", error);
//       }
//     };
//     fetchAdminAnalytics();
//   }, [backendUrl, token]);

//   // Fetch Admin Analytics data
//   useEffect(() => {
//     const fetchAdminAnalytics = async () => {
//       try {
//         const response = await axios.get(
//           `${backendUrl}/api/admin/admin-analytics`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (response.data.success) {
//           setDashboardOne(response.data.dashboardOne || {});
//           setDashboardTwo(response.data.dashboardTwo || {});
//           setLostLeadsByReason(response.data.lostLeadsByReason || {});
//           setUserCounts(response.data.userCounts || {});
//         }
//       } catch (error) {
//         console.error("Error fetching Admin Analytics:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, adminAnalytics: false }));
//       }
//     };
//     fetchAdminAnalytics();
//   }, [backendUrl, token]);

//   // Fetch Overall Lead Analytics Pie Chart Data
//   useEffect(() => {
//     const fetchPieChartAnalytics = async () => {
//       try {
//         const response = await axios.get(
//           `${backendUrl}/api/admin/admin-pie-chart-analytics`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (response?.data?.success) {
//           const {
//             totalLeads,
//             totalLostLeads,
//             totalInterestedLeads,
//             totalLeadsInPipeline,
//             totalOpenLeads,
//           } = response.data.pieChartData;
//           setChartData({
//             labels: [
//               "Total Leads",
//               "Lost Leads",
//               "Interested Leads",
//               "Leads in Pipeline",
//               "Open Leads",
//             ],
//             datasets: [
//               {
//                 data: [
//                   totalLeads,
//                   totalLostLeads,
//                   totalInterestedLeads,
//                   totalLeadsInPipeline,
//                   totalOpenLeads,
//                 ],
//               },
//             ],
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching Pie Chart Analytics:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, pieChartAnalytics: false }));
//       }
//     };
//     fetchPieChartAnalytics();
//   }, [backendUrl, token]);

//   // Fetch Lost Leads Doughnut Data (for pie chart)
//   useEffect(() => {
//     const fetchLeadLostReasonDoughnut = async () => {
//       try {
//         const response = await axios.get(
//           `${backendUrl}/api/admin/lead-lost-reason-doughnut`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         if (response.data.success) {
//           setLostLeadsDoughnutData(response.data.lostLeadsDoughnutData);
//         }
//       } catch (error) {
//         console.error("Error fetching Lead Lost Doughnut Data:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, leadLostReasonDoughnut: false }));
//       }
//     };
//     fetchLeadLostReasonDoughnut();
//   }, [backendUrl, token]);

//   // Fetch TAT Alerts (Admin)
//   useEffect(() => {
//     const fetchAdminAlerts = async () => {
//       try {
//         const response = await axios.get(
//           `${backendUrl}/api/admin/all-tat-alerts`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setAdminAlerts(response.data.alerts);
//       } catch (error) {
//         console.error("Error fetching Admin TAT Alerts:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, adminAlerts: false }));
//       }
//     };
//     fetchAdminAlerts();
//   }, [backendUrl, token]);

//   // Prepare data for Recharts

//   // Overall Lead Analytics Pie Data
//   const overallPieData = chartData
//     ? chartData.labels.map((label, index) => ({
//         name: label,
//         value: chartData.datasets[0].data[index],
//       }))
//     : [];

//   const overallPieColors = [
//     "#4CAF50",
//     "#F44336",
//     "#FF9800",
//     "#2196F3",
//     "#9C27B0",
//   ];

//   // Pipeline Status Pie Data
//   const pipelinePieData = dashboardTwo
//     ? Object.keys(dashboardTwo).map((key) => ({
//         name: key,
//         value: dashboardTwo[key],
//       }))
//     : [];

//   const pipelinePieColors = [
//     "#FF6384",
//     "#36A2EB",
//     "#FFCE56",
//     "#4BC0C0",
//     "#9966FF",
//     "#FF9F40",
//   ];

//   // Lost Leads Pie Data
//   const lostLeadsPieData = lostLeadsDoughnutData
//     ? ["Commercial", "Credential", "Features"].map((key) => ({
//         name: key,
//         value: lostLeadsDoughnutData[key] || 0,
//       }))
//     : [];

//   const lostLeadsColors = ["#ff6384", "#36a2eb", "#ffce56"];

//   // Helper to map role names for chip display
//   const mapRole = (role) => {
//     if (role === "data_analyst") return "Data Analyst";
//     if (role === "sales_executive") return "Sales Executive";
//     if (role === "growth_manager") return "Growth Manager";
//     return role;
//   };

//   const overallData = [
//     { name: "Total Leads", value: 100 },
//     { name: "Lost Leads", value: 20 },
//     { name: "Interested Leads", value: 30 },
//     { name: "Leads in Pipeline", value: 25 },
//     { name: "Open Leads", value: 15 },
//   ];

//   const pipelineData = {
//     "Initial Contact": 10,
//     Qualification: 15,
//     Proposal: 8,
//     Negotiation: 5,
//     Closed: 3,
//   };

//   const data = pipelineData
//     ? Object.entries(pipelineData).map(([stage, count]) => ({
//         name: stage,
//         value: count,
//       }))
//     : [];

//   const reasonStyles = {
//     Commercial: {
//       color: "text-[#ff6384]",
//       textColor: "text-pink-600",
//       icon: <BiSolidInfoCircle size={30} />,
//     },
//     Credential: {
//       color: "text-[#36a2eb]",
//       textColor: "text-blue-600",
//       icon: <BiSolidInfoCircle size={30} />,
//     },
//     Features: {
//       color: "text-[#ffce56]",
//       textColor: "text-yellow-500",
//       icon: <BiSolidInfoCircle size={30} />,
//     },
//   };

//   const isDataLoading = Object.values(loading).some((val) => val);

//   if (isDataLoading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center min-h-screen">
//           <DNA
//             visible={true}
//             height="100"
//             width="100"
//             ariaLabel="dna-loading"
//             wrapperStyle={{}}
//             wrapperClass="dna-wrapper"
//           />
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="p-4 space-y-6">
//         <div className="grid grid-cols-2 items-center gap-2">
//           <div className=" col-start-1 col-span-2">
//             <h3 className="text-xl tracking-wide font-semibold mb-2">
//               Overall Lead Analytics
//             </h3>
//             <div className="grid grid-cols-8 gap-2">
//               {dashboardOne ? (
//                 <>
//                   <Card
//                     title="Total Leads"
//                     count={dashboardOne.totalLeads || 0}
//                     icon={<MdDashboard size={20} />}
//                     color="text-blue-600"
//                     route="/total-leads"
//                   />
//                   <Card
//                     title="Not Interested"
//                     count={dashboardOne.totalNotInterestedLeads || 0}
//                     icon={<MdNotInterested size={20} />}
//                     color="text-red-600"
//                     route="/not-interested"
//                   />
//                   <Card
//                     title="Interested"
//                     count={dashboardOne.totalInterestedLeads || 0}
//                     icon={<MdThumbUp size={20} />}
//                     color="text-green-600"
//                     route="/interested"
//                   />
//                   <Card
//                     title="Draft"
//                     count={dashboardOne.totalDraftLeads || 0}
//                     icon={<MdDrafts size={20} />}
//                     color="text-yellow-600"
//                     route="/draft-leads"
//                   />
//                   <Card
//                     title="Open"
//                     count={dashboardOne.totalOpenLeads || 0}
//                     icon={<MdOpenInNew size={20} />}
//                     color="text-indigo-600"
//                     route="/open-leads"
//                   />
//                   <Card
//                     title="Closed"
//                     count={dashboardOne.totalClosedLeads || 0}
//                     icon={<MdCheckCircle size={20} />}
//                     color="text-purple-600"
//                     route="/closed-leads"
//                   />
//                   <Card
//                     title="Lost"
//                     count={dashboardOne.totalLostLeads || 0}
//                     icon={<MdCancel size={20} />}
//                     color="text-pink-600"
//                     route="/lost-leads"
//                   />
//                   <Card
//                     title="In Pipeline"
//                     count={dashboardOne.totalLeadsInPipeline || 0}
//                     icon={<MdTimeline size={20} />}
//                     color="text-teal-600"
//                     route="/leads-pipeline"
//                   />
//                 </>
//               ) : (
//                 <p className="flex items-center transition-all duration-300">
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-gray-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                     ></path>
//                   </svg>
//                   Loading overall lead analytics...
//                 </p>
//               )}
//             </div>
//           </div>
//           {/* Overall Analytics Pie Chart */}
//           <div className=" shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg">
//             {overallPieData.length > 0 ? (
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={overallPieData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     isAnimationActive={true}
//                     animationBegin={0}
//                     animationDuration={1500}
//                   >
//                     {overallPieData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={overallPieColors[index % overallPieColors.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             ) : (
//               <p className="flex items-center transition-all duration-300">
//                 <svg
//                   className="animate-spin h-5 w-5 mr-2 text-gray-600"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                   ></path>
//                 </svg>
//                 Loading chart...
//               </p>
//             )}
//           </div>
//           <div className=" shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart
//                 data={overallData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar
//                   dataKey="value"
//                   fill="#8884d8"
//                   name="Leads"
//                   isAnimationActive={true}
//                   animationBegin={200}
//                   animationDuration={1500}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-2">
//           {/* Lost Leads by Reason Cards */}
//           <div>
//             <h3 className="text-xl tracking-wide font-semibold mb-2">
//               Lost Leads by Reason
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
//               {lostLeadsByReason ? (
//                 Object.entries(lostLeadsByReason).map(([reason, count]) => {
//                   const { color, textColor, icon } = reasonStyles[reason];
//                   return (
//                     <Card2
//                       key={reason}
//                       title={reason}
//                       count={count}
//                       icon={icon}
//                       color={color}
//                       textColor={textColor}
//                       route="/lost-leads"
//                     />
//                   );
//                 })
//               ) : (
//                 <p className="flex items-center transition-all duration-300">
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-gray-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                     ></path>
//                   </svg>
//                   Loading lost lead data...
//                 </p>
//               )}
//             </div>
//           </div>
//           {/* Lost Leads Pie Chart */}
//           {lostLeadsPieData && lostLeadsPieData.length > 0 && (
//             <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg">
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={lostLeadsPieData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     isAnimationActive={true}
//                     animationBegin={0}
//                     animationDuration={1500}
//                   >
//                     {lostLeadsPieData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={lostLeadsColors[index % lostLeadsColors.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-2 items-center gap-2">
//           {/* Pipeline Stage Cards */}
//           <div className=" col-start-1 col-span-2">
//             <h3 className="text-xl tracking-wide font-semibold mb-2">
//               Process Pipeline Stages
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
//               {dashboardTwo ? (
//                 Object.entries(dashboardTwo).map(([stage, count]) => (
//                   <Card3
//                     key={stage}
//                     title={stage}
//                     count={count}
//                     icon={<MdTimeline size={20} />}
//                     color="text-teal-600"
//                     route="/pipeline" // Update the route as needed
//                   />
//                 ))
//               ) : (
//                 <p className="flex items-center transition-all duration-300">
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-gray-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                     ></path>
//                   </svg>
//                   Loading pipeline data...
//                 </p>
//               )}
//             </div>
//           </div>

//           <div>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart
//                 data={data}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar
//                   dataKey="value"
//                   fill="#82ca9d"
//                   name="Pipeline Count"
//                   isAnimationActive={true}
//                   animationBegin={200}
//                   animationDuration={1500}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//           {/* Pipeline Stage Pie Chart */}
//           {pipelinePieData.length > 0 && (
//             <div className="bg-white p-4  w-full">
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={pipelinePieData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     isAnimationActive={true}
//                     animationBegin={0}
//                     animationDuration={1500}
//                   >
//                     {pipelinePieData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={
//                           pipelinePieColors[index % pipelinePieColors.length]
//                         }
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </div>

//         {/* Top: User Counts Cards */}
//         <div className=" col-start-2 col-span-1 row-start-1 row-span-1">
//           <h2 className="text-xl tracking-wide font-semibold mb-4">
//             User Counts
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {userCounts ? (
//               Object.entries(userCounts).map(([role, count]) => (
//                 <Card3
//                   key={role}
//                   title={role}
//                   count={count}
//                   icon={<FiUserPlus size={30} />}
//                   color="#173B45"
//                 />
//               ))
//             ) : (
//               <p>Loading user data...</p>
//             )}
//           </div>
//         </div>

//         <div className=" col-start-2 col-span-1">
//           <h3 className="text-xl tracking-wide font-semibold mb-2">
//             TAT Alerts
//           </h3>
//           <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-500">
//             <table className="min-w-full">
//               <thead className="bg-gray-500">
//                 <tr>
//                   <th className="px-4 py-2 text-left text-white text-sm font-medium">
//                     Role
//                   </th>
//                   <th className="px-4 py-2 text-left text-white text-sm font-medium">
//                     Message
//                   </th>
//                   <th className="px-4 py-2 text-left text-white text-sm font-medium">
//                     Assigned To
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {adminAlerts && adminAlerts.length > 0 ? (
//                   adminAlerts.map((alert, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-4 py-2">
//                         <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
//                           {mapRole(alert.type)}
//                         </span>
//                       </td>
//                       <td className="px-4 py-2">{alert.message}</td>
//                       <td className="px-4 py-2 font-semibold">
//                         {alert.assignedTo}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td className="px-4 py-2" colSpan="3">
//                       No pending alerts.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AdminDashboardCombined;
