import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Layout from "../../common/Layout";
import { ThemeContext } from "../../../context/ThemeContext";

const AdminReports = () => {
  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  const [userType, setUserType] = useState("data_analyst");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [userType]);

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
      <div className="admin-report-container">
        <h2>📊 Admin Report - User Wise</h2>

        {/* User Type Selection */}
        <label>Select User Type:</label>
        <select
          className="select-box"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <option value="data_analyst">Data Analyst</option>
          <option value="sales_executive">Sales Executive</option>
          <option value="growth_manager">Growth Manager</option>
        </select>

        {/* User Dropdown */}
        <label>Select {userType.replace("_", " ").toUpperCase()}:</label>
        <select
          className="select-box"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>

        {/* Date Range Selection */}
        <label>Select Date Range:</label>
        <div className="date-range">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Fetch Report Button */}
        <button className="global_btn" onClick={handleFetchReport}>
          Generate Report
        </button>

        {/* Display Report Data */}
        {reportData && (
          <div className="report-result">
            <h3>Report Summary</h3>
            <p>
              Total Leads Created: <strong>{reportData.totalLeads}</strong>
            </p>

            {/* Display Lead Details Based on Role */}
            <h4>Lead Details:</h4>
            <ul>
              {reportData.leads.map((lead) => (
                <li key={lead._id}>
                  <strong>{lead.companyName}</strong> - {lead.status} <br />
                  {/* Role-based Data Display */}
                  {userType === "data_analyst" && (
                    <>
                      <p>
                        Created On:{" "}
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        Assigned to Sales Executive:{" "}
                        {lead.assignedToSalesExecutive?.name || "Not Assigned"}
                      </p>
                      <p>
                        Assigned Date:{" "}
                        {new Date(lead.assignedDate).toLocaleDateString() ||
                          "Not Defined"}
                      </p>
                    </>
                  )}
                  {userType === "sales_executive" && (
                    <>
                      <p>Data Analyst: {lead.createdBy?.name || "Unknown"}</p>
                      <p>Contact Persons: {lead.contactPoints.length}</p>
                      <p>
                        Assigned Growth Manager:{" "}
                        {lead.contactPoints
                          .map((cp) => cp.assignedToGrowthManager?.name)
                          .join(", ") || "Not Assigned"}
                      </p>
                    </>
                  )}
                  {userType === "growth_manager" && (
                    <>
                      <p>Contact Persons: {lead.contactPoints.length}</p>
                      <p>Lead Interactions:</p>
                      <ul>
                        {lead.contactPoints.map((cp, index) => (
                          <li key={index}>
                            <strong>{cp.name}</strong> ({cp.email}) -{" "}
                            {cp.designation} <br />
                            {cp.interactions.map((interaction, idx) => (
                              <span key={idx}>
                                🕒 {interaction.interactionType} -{" "}
                                {interaction.date}
                                {interaction.remark &&
                                  ` (Remark: ${interaction.remark})`}
                                <br />
                              </span>
                            ))}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminReports;
