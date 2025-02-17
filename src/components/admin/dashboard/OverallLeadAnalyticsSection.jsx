import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  PieChart,
  ResponsiveContainer,
  XAxis,
  Legend,
  YAxis,
  Tooltip,
  Pie,
} from "recharts";
import { Card } from "./Cards";
import { LoadingSpinner } from "./Spinner";
import {
  MdCancel,
  MdCheckCircle,
  MdDashboard,
  MdDrafts,
  MdNotInterested,
  MdOpenInNew,
  MdThumbUp,
  MdTimeline,
} from "react-icons/md";

// Overall Lead Analytics Section Component
const OverallLeadAnalyticsSection = ({
  dashboardOne,
  overallPieData,
  overallPieColors,
  overallData,
}) => {
  // Inside your OverallLeadAnalyticsSection component
  const renderCustomizedLabelOutside = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    // Increase the radius to position the label outside of the pie
    const labelRadius = outerRadius + 25; // adjust offset as needed
    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

    // Get the fill color for this slice from overallPieColors array
    const fillColor = overallPieColors[index % overallPieColors.length];

    return (
      <text
        x={x}
        y={y}
        fill={fillColor}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "12px", fontWeight: "bold" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="sm:grid grid-cols-2 items-center space-y-4 sm:gap-2">
      <div className="col-start-1 col-span-2">
        <h3 className="text-xl font-semibold mb-2 ">Overall Lead Analytics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-8 gap-2">
          {dashboardOne ? (
            <>
              <Card
                title="Total Leads"
                count={dashboardOne.totalLeads || 0}
                icon={<MdDashboard size={20} />}
                color="text-blue-600"
                route="/total-leads"
              />
              <Card
                title="Not Interested"
                count={dashboardOne.totalNotInterestedLeads || 0}
                icon={<MdNotInterested size={20} />}
                color="text-red-600"
                route="/not-interested"
              />
              <Card
                title="Interested"
                count={dashboardOne.totalInterestedLeads || 0}
                icon={<MdThumbUp size={20} />}
                color="text-green-600"
                route="/interested"
              />
              <Card
                title="Draft"
                count={dashboardOne.totalDraftLeads || 0}
                icon={<MdDrafts size={20} />}
                color="text-yellow-600"
                route="/draft-leads"
              />
              <Card
                title="Open"
                count={dashboardOne.totalOpenLeads || 0}
                icon={<MdOpenInNew size={20} />}
                color="text-indigo-600"
                route="/open-leads"
              />
              <Card
                title="Closed"
                count={dashboardOne.totalClosedLeads || 0}
                icon={<MdCheckCircle size={20} />}
                color="text-purple-600"
                route="/closed-leads"
              />
              <Card
                title="Lost"
                count={dashboardOne.totalLostLeads || 0}
                icon={<MdCancel size={20} />}
                color="text-pink-600"
                route="/lost-leads"
              />
              <Card
                title="In Pipeline"
                count={dashboardOne.totalLeadsInPipeline || 0}
                icon={<MdTimeline size={20} />}
                color="text-teal-600"
                route="/leads-pipeline"
              />
            </>
          ) : (
            <LoadingSpinner message="Loading overall lead analytics..." />
          )}
        </div>
      </div>
      {/* Overall Analytics Pie Chart */}
      <div className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg">
        <h3 className="text-xl font-semibold mb-2 ">Leads Lying (%)</h3>
        {overallPieData && overallPieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overallPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1500}
                label={renderCustomizedLabelOutside}
              >
                {overallPieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={overallPieColors[index % overallPieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <LoadingSpinner message="Loading chart..." />
        )}
      </div>
      {/* Overall Analytics Bar Chart */}
      <div className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg">
        <h3 className="text-xl font-semibold mb-2 ">Leads Lying (Count)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={overallData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill="#8884d8"
              name="Leads"
              isAnimationActive={true}
              animationBegin={200}
              animationDuration={1500}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OverallLeadAnalyticsSection;
