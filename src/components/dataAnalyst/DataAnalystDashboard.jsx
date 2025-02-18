import { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import { DNA } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { MdDashboard, MdDrafts } from "react-icons/md";
import { FaBell } from "react-icons/fa";

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
      className={`grid grid-cols-[1fr_min-content] gap-4 bg-white grid-rows-2 items-center border border-gray-100 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${classes}`}
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

// Main Admin Dashboard Component
const DataAnalystDashboard = () => {
  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  // State declarations
  const [wrongNumberAlerts, setWrongNumberAlerts] = useState([]);
  const [leads, setLeads] = useState([]);

  const draftLeads = leads.filter((lead) => lead.isDraft === true).length;

  const [loading, setLoading] = useState({
    alerts: true,
    leads: true,
  });

  const isDataLoading = Object.values(loading).some((val) => val);

  useEffect(() => {
    fetchWrongNumberAlerts();
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/lead/get-all-leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedLeads = response.data.allLeads.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Sort by latest date
      );

      setLeads(sortedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading((prev) => ({ ...prev, leads: false }));
    }
  };

  const fetchWrongNumberAlerts = async () => {
    try {
      console.log("📡 Fetching Wrong Number Alerts...");
      console.log("🔑 Token being sent:", token);
      const response = await axios.get(
        `${backendUrl}/api/lead/wrong-number-alerts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Wrong number alerts", response.data);
      setWrongNumberAlerts(response.data.wrongNumberAlerts);
    } catch (error) {
      console.error("❌ Error fetching Wrong Number Alerts:", error);
    } finally {
      setLoading((prev) => ({ ...prev, alerts: false }));
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
      <div className="p-2 grid grid-cols-3 w-2/3 gap-4">
        <Card
          title="Total Leads"
          count={leads.length || 0}
          icon={<MdDashboard size={30} />}
          color="text-blue-600"
          route="/analyst-lead"
        />
        <Card
          title="Draft"
          count={draftLeads || 0}
          icon={<MdDrafts size={30} />}
          color="text-yellow-600"
          route="/analyst-lead"
        />
        <Card
          title="Alerts"
          count={wrongNumberAlerts.length || 0}
          icon={<FaBell size={30} />}
          color="text-red-600"
          route="/analyst-alerts"
        />
      </div>
    </Layout>
  );
};

export default DataAnalystDashboard;
