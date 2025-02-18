import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import { DNA } from "react-loader-spinner";
import {
  MdAssessment,
  MdAssignment,
  MdDashboard,
  MdTimeline,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaHandshake } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

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

const GrowthManagerDashboard = () => {
  const { backendUrl } = useContext(ThemeContext);
  const [dashboardOne, setDashboardOne] = useState(null);
  const [dashboardTwo, setDashboardTwo] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchGrowthManagerAnalytics();
  }, [backendUrl]);

  const fetchGrowthManagerAnalytics = async () => {
    setIsDataLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/lead/growth-manager-analytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDashboardOne(response.data.dashboardOne || {}); // Ensure safe data
        setDashboardTwo(response.data.dashboardTwo || {}); // Ensure safe data
      }
    } catch (error) {
      console.error("❌ Error fetching Growth Manager Analytics:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  if (isDataLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <DNA
            visible={true}
            height="100"
            width="100"
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
      <div className="p-2 space-y-4">
        <h3 className="mb-2 text-2xl font-semibold">
          Growth Manager Analytics
        </h3>

        {/* Dashboard One */}
        <div>
          {/* <h3>YTD & MTD - Overall Numbers</h3> */}

          {dashboardOne ? (
            <div className=" w-full sm:w-2/3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Card
                title="Companies Assigned"
                count={dashboardOne.interestedCompaniesAssigned || 0}
                icon={<MdAssignment size={30} />}
                color="text-gray-800"
                route=""
                classes=" col-start-1 col-span-2 sm:col-span-1"
              />
              <Card
                title=" Touched"
                count={dashboardOne.companiesTouched || 0}
                icon={<FaHandshake size={30} />}
                color="text-blue-500"
                route=""
              />
              <Card
                title=" Lost"
                count={dashboardOne.companiesLost || 0}
                icon={<IoMdCloseCircle size={30} />}
                color="text-red-500"
                route=""
              />
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </div>

        {/* Dashboard Two */}
        <div>
          <h3 className="mb-2 text-2xl font-semibold">Companies in Stages</h3>
          <div className=" grid sm:grid-cols-3 gap-2">
            {dashboardTwo ? (
              Object.entries(dashboardTwo).map(([stage, count]) => (
                <Card
                  key={stage}
                  title={stage}
                  count={count}
                  icon={<MdTimeline size={30} />}
                  color="text-teal-600"
                  route=""
                  classes=" !gap-0 sm:!gap-4"
                />
              ))
            ) : (
              <p>Loading stage data...</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GrowthManagerDashboard;

// import React, { useContext, useEffect, useState } from "react";
// import Layout from "../common/Layout";
// import axios from "axios";
// import { ThemeContext } from "../../context/ThemeContext";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { PiWarningFill } from "react-icons/pi";
// import { BiSolidErrorAlt } from "react-icons/bi";

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
// ];

// const GrowthManagerDashboard = () => {
//   const { backendUrl, navigate } = useContext(ThemeContext);
//   const token = localStorage.getItem("token");
//   // console.log(backendUrl);

//   const [alerts, setAlerts] = useState([]);
//   const [stages, setStages] = useState([]);
//   const [todayStages, setTodayStages] = useState([]); // ✅ Store today's deadline stages

//   useEffect(() => {
//     fetchAlertsAndStages();
//   }, [backendUrl]);

//   const fetchAlertsAndStages = async () => {
//     try {
//       if (!token) {
//         console.error("❌ No auth token found!");
//         return;
//       }

//       // ✅ Fetch TAT Alerts specific to logged-in Growth Manager
//       const alertResponse = await axios.get(
//         `${backendUrl}/api/lead/check-tat-alerts`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // ✅ Fetch Growth Manager Stages specific to the logged-in user
//       const stagesResponse = await axios.get(
//         `${backendUrl}/api/lead/get-growth-manager-stages`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // ✅ Filter only "In Progress" stages
//       const filteredStages = stagesResponse.data.allStages.filter(
//         (stage) => !stage.completed
//       );

//       // ✅ Filter stages with TAT deadlines **due today**
//       // const todayDeadlineStages = filteredStages.filter(stage =>
//       //     new Date(stage.tatDeadline).toDateString() === new Date().toDateString()
//       // );

//       const todayDeadlineStages = filteredStages;

//       // ✅ Update state with filtered data
//       setAlerts(alertResponse.data.alerts);
//       setStages(filteredStages);
//       setTodayStages(todayDeadlineStages);

//       console.log("🔹 Alerts:", alertResponse.data);
//       console.log("🔹 Stages:", stagesResponse.data);
//     } catch (error) {
//       console.error("❌ Error fetching data:", error);
//     }
//   };

//   const markStageAsCompleted = async (stageId) => {
//     if (!stageId) {
//       console.error("❌ Error: Stage ID is undefined");
//       return;
//     }

//     try {
//       console.log(`✅ Marking Stage Completed for Stage ID: ${stageId}`);

//       const response = await axios.put(
//         `${backendUrl}/api/lead/mark-stage-completed/${stageId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.data.updatedPipeline) {
//         console.log(
//           "🎯 Updated Pipeline after Completion:",
//           response.data.updatedPipeline
//         );
//         // setStages(response.data.updatedPipeline); // ✅ Update frontend state with new pipeline
//         fetchAlertsAndStages();
//       } else {
//         console.error("❌ Error: No updated pipeline received");
//       }
//     } catch (error) {
//       console.error("❌ Error marking stage as completed:", error);
//     }
//   };

//   return (
//     <div>
//       <Layout>
//         {/* ✅ Add Button to Navigate to Follow-Ups Page */}
//         <div className="follow-up-navigation">
//           <button
//             className="global_btn"
//             onClick={() => navigate("/follow-ups")}
//           >
//             📅 View Follow-Up Alerts
//           </button>
//         </div>

//         {/* 📢 TAT Alerts Section */}
//         <div className="tat-alert-container">
//           <h4>TAT Alerts</h4>
//           {alerts.length > 0 ? (
//             <div>
//               {alerts.map((alert, index) => (
//                 <div key={index} className="tat_due_alert_item">
//                   <BiSolidErrorAlt className="error_icon" /> {alert.message}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No pending alerts. ✅</p>
//           )}
//         </div>

//         {/* 🚨 "Today's Deadline Stages" Section */}
//         <div className="today-deadline-stages">
//           <h4>Today's Deadline Stages</h4>
//           {todayStages.length > 0 ? (
//             <div>
//               {todayStages.map((stage, index) => (
//                 <div key={index} className="deadline_item alert-red">
//                   <strong>
//                     <PiWarningFill className="warning_icon" />{" "}
//                     {stage.companyName || "Unknown Company"}
//                   </strong>
//                   {stage.stage}
//                   <span>
//                     <strong>Deadline:</strong>{" "}
//                     {stage.tatDeadline
//                       ? new Date(stage.tatDeadline).toLocaleDateString()
//                       : "Not Set"}
//                   </span>
//                   <span>Remark: {stage.remark || "No Remark"}</span>
//                   <span>Action Required TODAY!</span>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p>No stages expiring today. ✅</p>
//           )}
//         </div>

//         {/* 📌 Growth Manager Stages Section */}
//         <div className="growth-manager-stages custom_table">
//           <h4>In Progress Stages</h4>

//           {/* stage list start
//                     <ul>
//                         {stages
//                             .slice()
//                             .reverse()
//                             .map((stage, index) => (
//                                 <li key={stage._id || index} className={`stage-item ${stage.completed ? 'completed' : ''}`}>

//                                     <strong>🏢 {stage.companyName || "Unknown Company"}</strong> - {stage.stage}

//                                     <p>📅 <strong>Deadline:</strong> {stage.tatDeadline ? new Date(stage.tatDeadline).toLocaleDateString() : "Not Set"}</p>

//                                     {stage.daysLeftForNextStage > 0 ? (
//                                         <p>⏳ You have <strong>{stage.daysLeftForNextStage}</strong> days left to complete this stage!</p>
//                                     ) : (
//                                         <p className="overdue-alert">🚨 Overdue by <strong>{stage.delayDays}</strong> days!</p>
//                                     )}

//                                     <p>📌 Follow-up Date: {stage.followUpDate ? new Date(stage.followUpDate).toLocaleDateString() : "Not Set"}</p>
//                                     <p>📝 Remark: {stage.remark || "No Remark"}</p>

//                                     {!stage.completed && stage._id && (
//                                         <button
//                                             className="mark-completed-btn global_btn"
//                                             onClick={() => {
//                                                 if (window.confirm(`Are you sure you want to mark "${stage.stage}" as completed?`)) {
//                                                     markStageAsCompleted(stage._id);
//                                                 }
//                                             }}
//                                         >
//                                             ✅ Mark as Completed
//                                         </button>
//                                     )}

//                                     {stage.completed && (
//                                         <p className="completed-message">✔️ Stage Completed</p>
//                                     )}
//                                 </li>
//                             ))}
//                     </ul>
//                     stage list end */}

//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650 }} aria-label="simple table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Company</TableCell>
//                   <TableCell align="left">Stage</TableCell>
//                   <TableCell align="right">Deadline</TableCell>
//                   <TableCell align="right">Overdue</TableCell>
//                   <TableCell align="right">Follow-up Date</TableCell>
//                   <TableCell align="right">Remark</TableCell>
//                   <TableCell align="right">Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {stages
//                   .slice()
//                   .reverse()
//                   .map((stage, index) => (
//                     <TableRow
//                       key={stage._id || index}
//                       sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                     >
//                       <TableCell component="th" scope="row">
//                         {stage.companyName || "Unknown Company"}
//                       </TableCell>
//                       <TableCell align="left">{stage.stage}</TableCell>
//                       <TableCell align="right">
//                         <strong>
//                           {stage.tatDeadline
//                             ? new Date(stage.tatDeadline).toLocaleDateString()
//                             : "Not Set"}
//                         </strong>
//                       </TableCell>
//                       <TableCell align="right">
//                         {stage.daysLeftForNextStage > 0 ? (
//                           <span>
//                             ⏳ You have{" "}
//                             <strong>{stage.daysLeftForNextStage}</strong> days
//                             left to complete this stage!
//                           </span>
//                         ) : (
//                           <span className="overdue-alert">
//                             <strong>{stage.delayDays}</strong> Days
//                           </span>
//                         )}
//                       </TableCell>
//                       <TableCell align="right">
//                         {stage.followUpDate
//                           ? new Date(stage.followUpDate).toLocaleDateString()
//                           : "Not Set"}
//                       </TableCell>
//                       <TableCell align="right">
//                         {stage.remark || "No Remark"}
//                       </TableCell>
//                       <TableCell align="right">
//                         {!stage.completed && stage._id && (
//                           <button
//                             className="mark-completed-btn global_btn global_success_btn"
//                             onClick={() => {
//                               if (
//                                 window.confirm(
//                                   `Are you sure you want to mark "${stage.stage}" as completed?`
//                                 )
//                               ) {
//                                 markStageAsCompleted(stage._id);
//                               }
//                             }}
//                           >
//                             ✔ Mark as Completed
//                           </button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//       </Layout>
//     </div>
//   );
// };

// export default GrowthManagerDashboard;
