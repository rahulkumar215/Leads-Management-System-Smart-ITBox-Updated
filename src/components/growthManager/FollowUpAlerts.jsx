import React, { useContext, useEffect, useState } from 'react';
import Layout from '../common/Layout';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';

const FollowUpAlerts = () => {
    const { backendUrl } = useContext(ThemeContext);
    const token = localStorage.getItem('token');

    const [followUpNotifications, setFollowUpNotifications] = useState([]);

    useEffect(() => {
        fetchFollowUpNotifications();
    }, [backendUrl]);

    const fetchFollowUpNotifications = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/lead/get-growth-manager-stages`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("🔹 Follow-Up Notifications API Response:", response.data); // ✅ Debugging

            // ✅ Extract Follow-Up Notifications
            setFollowUpNotifications(response.data.followUpNotifications || []);

        } catch (error) {
            console.error("❌ Error fetching follow-up notifications:", error);
        }
    };

    return (
        <div>
            <Layout>
                <div className="follow-up-alerts-container">
                    <h3>📌 Follow-Up Reminders</h3>
                    {followUpNotifications.length > 0 ? (
                        <ul>
                            {followUpNotifications.map((notification, index) => (
                                <li key={index} className="follow-up-item alert-blue">
                                    <strong>🏢 {notification.companyName || "Unknown Company"}</strong> - {notification.stage}
                                    <p>📅 <strong>Follow-Up Date:</strong> {new Date(notification.followUpDate).toLocaleDateString()}</p>
                                    <p>📞 Reminder: Follow-up scheduled for today! ⏳</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No follow-ups scheduled for today. ✅</p>
                    )}
                </div>
            </Layout>
        </div>
    );
}


export default FollowUpAlerts
