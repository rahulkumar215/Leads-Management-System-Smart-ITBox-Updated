import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import { BiSolidErrorAlt } from "react-icons/bi";

const AdminDashboard = () => {
  const { backendUrl } = useContext(ThemeContext);
  // console.log(backendUrl);
  const token = localStorage.getItem("token");

  const [alerts, setAlerts] = useState([]);
  const [adminAlerts, setAdminAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/lead/check-tat-alerts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAlerts(response.data.alerts);
      } catch (error) {
        console.error("Error fetching TAT alerts:", error);
      }
    };

    fetchAlerts();
  }, [backendUrl]);

  useEffect(() => {
    fetchAdminAlerts();
  }, [backendUrl]);

  const fetchAdminAlerts = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/all-tat-alerts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAdminAlerts(response.data.alerts);
    } catch (error) {
      console.error("❌ Error fetching Admin TAT Alerts:", error);
    }
  };

  console.log(adminAlerts);

  return (
    <div>
      <Layout>
        <div className="tat-alert-container">
          <h3 style={{ marginBottom: "20px" }}>TAT Alerts</h3>
          <div className="tat_alert_scroll_container">
            {adminAlerts.length > 0 ? (
              <div>
                {adminAlerts.map((alert, index) => (
                  <div key={index} className="admin-tat-alert-item">
                    <BiSolidErrorAlt className="error_icon" />
                    <div>
                      <strong>{alert.type}</strong>: {alert.message} <br />
                      Assigned To: <strong>{alert.assignedTo}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No pending alerts.</p>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AdminDashboard;
