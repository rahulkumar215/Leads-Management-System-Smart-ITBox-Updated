import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast } from "react-toastify";
import Layout from '../common/Layout'
import { MdOutlineDone } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { BiSolidErrorAlt } from "react-icons/bi";





const DataAnalystDashboard = () => {

    const { backendUrl } = useContext(ThemeContext);
    const [wrongNumberAlerts, setWrongNumberAlerts] = useState([]);
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchWrongNumberAlerts();
    }, []);

    // ✅ Fetch Wrong Number Alerts
    const fetchWrongNumberAlerts = async () => {
        try {
            console.log("📡 Fetching Wrong Number Alerts...");
            console.log("🔑 Token being sent:", token); // ✅ Log token
            const response = await axios.get(`${backendUrl}/api/lead/wrong-number-alerts`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Wrong number alerts', response.data);
            setWrongNumberAlerts(response.data.wrongNumberAlerts);
        } catch (error) {
            console.error("❌ Error fetching Wrong Number Alerts:", error);
        }
    };

    // ✅ Resolve Wrong Number
    const resolveWrongNumber = async (leadId, phoneNumber) => {
        try {
            console.log('lead id', leadId, phoneNumber);
            await axios.post(`${backendUrl}/api/lead/resolve-wrong-number`, { leadId, phoneNumber }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Wrong number resolved successfully!");
            fetchWrongNumberAlerts(); // Refresh list
        } catch (error) {
            console.error("❌ Error resolving Wrong Number:", error);
            toast.error("Failed to resolve wrong number");
        }
    };

    return (
        <div>
            <Layout>
                <div>
                    <h4>🚨 Wrong Number Alerts</h4>
                    {wrongNumberAlerts.length === 0 ? (
                        <p>No wrong number alerts found.</p>
                    ) : (


                        <div>
                            {wrongNumberAlerts.reverse().map((alert, index) => (

                                <div className="wrong_number_alert" key={index}>
                                    <BiSolidErrorAlt className='error_icon' />
                                    <span>{alert.companyName}</span>
                                    <span>{alert.contactPerson}</span> {/* ✅ Show Contact Person */}
                                    <span>{alert.contactPhone}</span>
                                    <span><strong>Sales Ex:- </strong>{alert.reportedBy}</span>
                                    <span><strong>Reported Date:- </strong>{new Date(alert.dateReported).toLocaleDateString()}</span>

                                    <button className="mark-completed-btn global_btn global_success_btn" onClick={() => resolveWrongNumber(alert.leadId, alert.contactPhone)}>
                                        <FaCheck style={{ marginRight: "5px" }} /> Mark as Resolved
                                    </button>

                                </div>

                            ))}
                        </div>

                    )}
                </div>
            </Layout>
        </div>
    )
}

export default DataAnalystDashboard
