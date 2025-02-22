import { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import { DNA } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { MdDashboard, MdDrafts } from "react-icons/md";
import { FaBell, FaChartPie } from "react-icons/fa";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { GrOverview } from "react-icons/gr";

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
      className={`grid grid-cols-[1fr_min-content] gap-4 bg-white grid-rows-2 items-center border border-gray-100 p-2 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer ${classes}`}
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
  // const [wrongNumberAlerts, setWrongNumberAlerts] = useState([]);
  const [leads, setLeads] = useState([]);

  const draftLeads = leads.filter((lead) => lead.isDraft === true).length;
  const wonLeads = leads.filter((lead) => lead.status === "win").length;
  const lostLeads = leads.filter((lead) => lead.status === "lost").length;
  const closedLeads = leads.filter((lead) => lead.status === "closed").length;
  const openLeads = leads.filter((lead) => lead.status === "open").length;

  // Build the data array
  const data = [
    { name: "Open", value: openLeads },
    { name: "Draft", value: draftLeads },
    { name: "Won", value: wonLeads },
    { name: "Lost", value: lostLeads },
    { name: "Closed", value: closedLeads },
  ];

  const [loading, setLoading] = useState({
    // alerts: true,
    leads: true,
  });

  const isDataLoading = Object.values(loading).some((val) => val);

  useEffect(() => {
    // fetchWrongNumberAlerts();
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

  // const fetchWrongNumberAlerts = async () => {
  //   try {
  //     console.log("📡 Fetching Wrong Number Alerts...");
  //     console.log("🔑 Token being sent:", token);
  //     const response = await axios.get(
  //       `${backendUrl}/api/lead/wrong-number-alerts`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     console.log("Wrong number alerts", response.data);
  //     setWrongNumberAlerts(response.data.wrongNumberAlerts);
  //   } catch (error) {
  //     console.error("❌ Error fetching Wrong Number Alerts:", error);
  //   } finally {
  //     setLoading((prev) => ({ ...prev, alerts: false }));
  //   }
  // };

  // Custom label renderer to display percentages on each slice with white text
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
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

  // Define colors for each lead category using HEX values
  const COLORS = {
    Open: "#2563eb", // text-blue-600
    Draft: "#4b5563", // text-gray-600
    Won: "#16a34a", // text-green-600
    Lost: "#dc2626", // text-red-600
    Closed: "#ea580c", // text-red-600
  };

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
      <div className=" grid sm:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg p-2 font-semibold grid grid-cols-[min-content_max-content] items-center gap-2">
            <GrOverview />
            Leads Overview
          </h2>
          <div className="p-2 grid grid-cols-2 sm:grid-cols-2 gap-2">
            <Card
              title="Total"
              count={leads.length || 0}
              icon={<MdDashboard size={25} />}
              color="text-gray-600"
              route="/analyst-lead"
            />
            <Card
              title="Open"
              count={openLeads || 0}
              icon={<MdDashboard size={25} />}
              color="text-blue-600"
              route="/analyst-lead"
            />
            <Card
              title="Draft"
              count={draftLeads || 0}
              icon={<MdDrafts size={25} />}
              color="text-gray-600"
              route="/analyst-lead"
            />
            <Card
              title="Won"
              count={wonLeads || 0}
              icon={<MdDrafts size={25} />}
              color="text-green-600"
              route="/analyst-lead"
            />
            <Card
              title="Lost"
              count={lostLeads || 0}
              icon={<MdDrafts size={25} />}
              color="text-red-600"
              route="/analyst-lead"
            />
            <Card
              title="Closed"
              count={closedLeads || 0}
              icon={<MdDrafts size={25} />}
              color="text-orange-600"
              route="/analyst-lead"
            />
          </div>
        </div>
        <div className=" shadow-md rounded-md">
          <h2 className="text-lg p-2 font-semibold grid grid-cols-[min-content_max-content] items-center gap-2">
            <FaChartPie />
            Leads Overview (%)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
                fill="#8884d8"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* <div className="p-2 grid sm:grid-cols-6 gap-2">
        <Card
          title="Alerts"
          count={wrongNumberAlerts.length || 0}
          icon={<FaBell size={30} />}
          color="text-red-600"
          route="/analyst-alerts"
        />
      </div> */}
    </Layout>
  );
};

export default DataAnalystDashboard;
