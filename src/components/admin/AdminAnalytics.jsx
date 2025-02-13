import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
// import Chart from "chart.js/auto";

Chart.register(ArcElement, Tooltip, Legend);

const AdminAnalytics = () => {
  const { backendUrl } = useContext(ThemeContext);
  const [dashboardOne, setDashboardOne] = useState(null);
  const [dashboardTwo, setDashboardTwo] = useState(null);
  const [lostLeadsByReason, setLostLeadsByReason] = useState(null);
  const [userCounts, setUserCounts] = useState(null);
  const token = localStorage.getItem("token");

  const [chartData, setChartData] = useState(null);
  const [lostLeadsDoughnutData, setLostLeadsDoughnutData] = useState({});

  useEffect(() => {
    fetchAdminAnalytics();
    fetchPieChartAnalytics();
  }, [backendUrl]);

  const fetchAdminAnalytics = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/admin-analytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setDashboardOne(response.data.dashboardOne || {});
        setDashboardTwo(response.data.dashboardTwo || {});
        setLostLeadsByReason(response.data.lostLeadsByReason || {});
        setUserCounts(response.data.userCounts || {});
      }
    } catch (error) {
      console.error("❌ Error fetching Admin Analytics:", error);
    }
  };

  const fetchPieChartAnalytics = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/admin-pie-chart-analytics`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.success) {
        console.log("✅ Pie Chart Data:", response.data.pieChartData);
        const {
          totalLeads,
          totalLostLeads,
          totalInterestedLeads,
          totalLeadsInPipeline,
          totalOpenLeads,
        } = response?.data?.pieChartData;

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
              label: "Lead Analytics",
              data: [
                totalLeads,
                totalLostLeads,
                totalInterestedLeads,
                totalLeadsInPipeline,
                totalOpenLeads,
              ],
              backgroundColor: [
                "#4CAF50",
                "#F44336",
                "#FF9800",
                "#2196F3",
                "#9C27B0",
              ],
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error("❌ Error fetching Pie Chart Analytics:", error);
    }
  };

  useEffect(() => {
    fetchLeadLostReasonDoughnut();
  }, [backendUrl]);

  const fetchLeadLostReasonDoughnut = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/lead-lost-reason-doughnut`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setLostLeadsDoughnutData(response.data.lostLeadsDoughnutData);
      }
    } catch (error) {
      console.error("❌ Error fetching Lead Lost Doughnut Data:", error);
    }
  };

  // Prepare Data for Doughnut Chart
  const doughnutData = {
    labels: ["Commercial", "Credential", "Features"],
    datasets: [
      {
        data: [
          lostLeadsDoughnutData["Commercial"] || 0,
          lostLeadsDoughnutData["Credential"] || 0,
          lostLeadsDoughnutData["Features"] || 0,
        ],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56"],
        hoverBackgroundColor: ["#ff4365", "#268beb", "#e4b800"],
      },
    ],
  };

  return (
    <div>
      <Layout>
        <h2>Admin Dashboard Analytics</h2>

        <div className="row">
          <div className="col-lg-4">
            {chartData ? (
              <div style={{ width: "100%", margin: "auto" }}>
                <Pie data={chartData} />
              </div>
            ) : (
              <p>Loading analytics...</p>
            )}
          </div>

          <div className="col-lg-4">
            {doughnutData ? (
              <div style={{ width: "100%", margin: "auto" }}>
                <Doughnut data={doughnutData} />
              </div>
            ) : (
              <p>Loading analytics...</p>
            )}
          </div>
        </div>

        {/* Dashboard One */}
        <div style={{ margin: "40px 0px 20px" }} className="dashboard-one">
          <h3 style={{ marginBottom: "15px" }}>Overall Lead Analytics</h3>
          {dashboardOne ? (
            <div className="row">
              <div className="col-lg-3">
                <div className="dashboard_card">
                  <p className="number_heading">Total Leads</p>
                  <p className="number_text">{dashboardOne.totalLeads || 0}</p>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dashboard_card">
                  <p className="number_heading">Not Interested Leads</p>
                  <p className="number_text">
                    {dashboardOne.totalNotInterestedLeads || 0}
                  </p>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dashboard_card">
                  <p className="number_heading">Interested Leads</p>
                  <p className="number_text">
                    {dashboardOne.totalInterestedLeads || 0}
                  </p>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dashboard_card">
                  <p className="number_heading">Draft Leads</p>
                  <p className="number_text">
                    {dashboardOne.totalDraftLeads || 0}
                  </p>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dashboard_card">
                  <p className="number_heading">Open Leads</p>
                  <p className="number_text">
                    {dashboardOne.totalOpenLeads || 0}
                  </p>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dashboard_card">
                  <p className="number_heading">Closed Leads</p>
                  <p className="number_text">
                    {dashboardOne.totalClosedLeads || 0}
                  </p>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dashboard_card">
                  <p className="number_heading">Lost Leads</p>
                  <p className="number_text">
                    {dashboardOne.totalLostLeads || 0}
                  </p>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="dashboard_card">
                  <p className="number_heading">Leads in Pipeline</p>
                  <p className="number_text">
                    {dashboardOne.totalLeadsInPipeline || 0}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading data...</p>
          )}
        </div>

        {/* Dashboard Two */}
        <div style={{ margin: "20px 0px" }} className="dashboard-two">
          <h3 style={{ marginBottom: "15px" }}>Pipeline Stages</h3>
          <div className="row">
            {dashboardTwo ? (
              Object.entries(dashboardTwo).map(([stage, count]) => (
                <div key={stage} className="col-lg-3">
                  {/* <p key={stage}>📍 {stage}: {count} leads</p> */}
                  <div className="dashboard_card">
                    <p className="number_heading">{stage}</p>
                    <p className="number_text">{count}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading stage data...</p>
            )}
          </div>
        </div>

        {/* Leads Lost By Reason */}
        <div style={{ margin: "20px 0px" }} className="lost-leads">
          <h3 style={{ marginBottom: "15px" }}>Lost Leads by Reason</h3>
          <div className="row">
            {lostLeadsByReason ? (
              Object.entries(lostLeadsByReason).map(([reason, count]) => (
                <div key={reason} className="col-lg-3">
                  {/* <p key={reason}>🚨 {reason}: {count} leads</p> */}
                  <div className="dashboard_card">
                    <p className="number_heading">{reason}</p>
                    <p className="number_text">{count}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading lost lead data...</p>
            )}
          </div>
        </div>

        {/* User Counts */}
        <div style={{ margin: "20px 0px" }} className="user-counts">
          <h3 style={{ marginBottom: "15px" }}>User Counts</h3>
          <div className="row">
            {userCounts ? (
              Object.entries(userCounts).map(([role, count]) => (
                <div key={role} className="col-lg-3">
                  {/* <p key={role}>👤 {role}: {count} users</p> */}
                  <div className="dashboard_card">
                    <p className="number_heading">{role}</p>
                    <p className="number_text">{count}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AdminAnalytics;
