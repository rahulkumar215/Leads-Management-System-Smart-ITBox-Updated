import React, { useContext, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PiWarningFill } from "react-icons/pi";
import { BiSolidErrorAlt } from "react-icons/bi";


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];



const GrowthManagerDashboard = () => {

    const { backendUrl, navigate } = useContext(ThemeContext)
    const token = localStorage.getItem('token');
    // console.log(backendUrl);

    const [alerts, setAlerts] = useState([]);
    const [stages, setStages] = useState([]);
    const [todayStages, setTodayStages] = useState([]); // ✅ Store today's deadline stages

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
            const alertResponse = await axios.get(`${backendUrl}/api/lead/check-tat-alerts`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // ✅ Fetch Growth Manager Stages specific to the logged-in user
            const stagesResponse = await axios.get(`${backendUrl}/api/lead/get-growth-manager-stages`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // ✅ Filter only "In Progress" stages
            const filteredStages = stagesResponse.data.allStages.filter(stage => !stage.completed);
    
            // ✅ Filter stages with TAT deadlines **due today**
            const todayDeadlineStages = filteredStages.filter(stage =>
                new Date(stage.tatDeadline).toDateString() === new Date().toDateString()
            );
    
            // ✅ Update state with filtered data
            setAlerts(alertResponse.data.alerts);
            setStages(filteredStages);
            setTodayStages(todayDeadlineStages);
    
            console.log("🔹 Alerts:", alertResponse.data);
            console.log("🔹 Stages:", stagesResponse.data);
        } catch (error) {
            console.error("❌ Error fetching data:", error);
        }
    };
    

    const markStageAsCompleted = async (stageId) => {
        if (!stageId) {
            console.error("❌ Error: Stage ID is undefined");
            return;
        }

        try {
            console.log(`✅ Marking Stage Completed for Stage ID: ${stageId}`);

            const response = await axios.put(`${backendUrl}/api/lead/mark-stage-completed/${stageId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.updatedPipeline) {
                console.log("🎯 Updated Pipeline after Completion:", response.data.updatedPipeline);
                // setStages(response.data.updatedPipeline); // ✅ Update frontend state with new pipeline
                fetchAlertsAndStages();
            } else {
                console.error("❌ Error: No updated pipeline received");
            }
        } catch (error) {
            console.error("❌ Error marking stage as completed:", error);
        }
    };



    return (
        <div>
            <Layout>


                {/* ✅ Add Button to Navigate to Follow-Ups Page */}
                <div className="follow-up-navigation">
                    <button className="global_btn" onClick={() => navigate('/follow-ups')}>
                        📅 View Follow-Up Alerts
                    </button>
                </div>


                {/* 📢 TAT Alerts Section */}
                <div className="tat-alert-container">
                    <h4>TAT Alerts</h4>
                    {alerts.length > 0 ? (
                        <div>
                            {alerts.map((alert, index) => (
                                <div key={index} className="tat_due_alert_item">
                                <BiSolidErrorAlt className='error_icon'/> {alert.message}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No pending alerts. ✅</p>
                    )}
                </div>

                {/* 🚨 "Today's Deadline Stages" Section */}
                <div className="today-deadline-stages">
                    <h4>Today's Deadline Stages</h4>
                    {todayStages.length > 0 ? (
                        <div>
                            {todayStages.map((stage, index) => (
                                <div key={index} className="deadline_item alert-red">
                                
                                    <strong><PiWarningFill className='warning_icon'/> {stage.companyName || "Unknown Company"}</strong>{stage.stage}
                                    <span><strong>Deadline:</strong> {stage.tatDeadline ? new Date(stage.tatDeadline).toLocaleDateString() : "Not Set"}</span>
                                    <span>Remark: {stage.remark || "No Remark"}</span>
                                    <span>Action Required TODAY!</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No stages expiring today. ✅</p>
                    )}
                </div>

                {/* 📌 Growth Manager Stages Section */}
                <div className="growth-manager-stages custom_table">
                    <h4>In Progress Stages</h4>

                    {/* stage list start
                    <ul>
                        {stages
                            .slice() 
                            .reverse() 
                            .map((stage, index) => (
                                <li key={stage._id || index} className={`stage-item ${stage.completed ? 'completed' : ''}`}>
                                   
                                    <strong>🏢 {stage.companyName || "Unknown Company"}</strong> - {stage.stage}

                                    
                                    <p>📅 <strong>Deadline:</strong> {stage.tatDeadline ? new Date(stage.tatDeadline).toLocaleDateString() : "Not Set"}</p>

                                    
                                    {stage.daysLeftForNextStage > 0 ? (
                                        <p>⏳ You have <strong>{stage.daysLeftForNextStage}</strong> days left to complete this stage!</p>
                                    ) : (
                                        <p className="overdue-alert">🚨 Overdue by <strong>{stage.delayDays}</strong> days!</p>
                                    )}

                                    
                                    <p>📌 Follow-up Date: {stage.followUpDate ? new Date(stage.followUpDate).toLocaleDateString() : "Not Set"}</p>
                                    <p>📝 Remark: {stage.remark || "No Remark"}</p>

                                    
                                    {!stage.completed && stage._id && (
                                        <button
                                            className="mark-completed-btn global_btn"
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to mark "${stage.stage}" as completed?`)) {
                                                    markStageAsCompleted(stage._id);
                                                }
                                            }}
                                        >
                                            ✅ Mark as Completed
                                        </button>
                                    )}

                                    
                                    {stage.completed && (
                                        <p className="completed-message">✔️ Stage Completed</p>
                                    )}
                                </li>
                            ))}
                    </ul>
                    stage list end */}


                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Company</TableCell>
                                    <TableCell align="left">Stage</TableCell>
                                    <TableCell align="right">Deadline</TableCell>
                                    <TableCell align="right">Overdue</TableCell>
                                    <TableCell align="right">Follow-up Date</TableCell>
                                    <TableCell align="right">Remark</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stages.slice().reverse().map((stage, index) => (
                                    <TableRow
                                        key={stage._id || index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                        {stage.companyName || "Unknown Company"}
                                        </TableCell>
                                        <TableCell align="left">{stage.stage}</TableCell>
                                        <TableCell align="right"><strong>{stage.tatDeadline ? new Date(stage.tatDeadline).toLocaleDateString() : "Not Set"}</strong></TableCell>
                                        <TableCell align="right">{stage.daysLeftForNextStage > 0 ? (
                                        <span>⏳ You have <strong>{stage.daysLeftForNextStage}</strong> days left to complete this stage!</span>
                                    ) : (
                                        <span className="overdue-alert"><strong>{stage.delayDays}</strong> Days</span>
                                    )}</TableCell>
                                        <TableCell align="right">{stage.followUpDate ? new Date(stage.followUpDate).toLocaleDateString() : "Not Set"}</TableCell>
                                        <TableCell align="right">{stage.remark || "No Remark"}</TableCell>
                                        <TableCell align="right">
                                        {!stage.completed && stage._id && (
                                        <button
                                            className="mark-completed-btn global_btn global_success_btn"
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to mark "${stage.stage}" as completed?`)) {
                                                    markStageAsCompleted(stage._id);
                                                }
                                            }}
                                        >
                                            ✔ Mark as Completed
                                        </button>
                                    )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>


                </div>


            </Layout>
        </div>
    )
}

export default GrowthManagerDashboard
