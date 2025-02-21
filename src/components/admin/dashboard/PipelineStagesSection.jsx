import { MdTimeline } from "react-icons/md";
import { Card3 } from "./Cards";
import { LoadingSpinner } from "./Spinner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Pipeline Stages Section Component
const PipelineStagesSection = ({
  dashboardTwo,
  pipelineBarData,
  pipelinePieData,
  pipelinePieColors,
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
    const fillColor = pipelinePieColors[index % pipelinePieColors.length];

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
        <h3 className="text-xl font-semibold mb-2">Process Pipeline Stages</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {dashboardTwo ? (
            Object.entries(dashboardTwo).map(([stage, count]) => (
              <Card3
                key={stage}
                title={stage}
                count={count}
                icon={<MdTimeline size={20} />}
                color="text-teal-600"
                route="/admin/all-leads"
              />
            ))
          ) : (
            <LoadingSpinner message="Loading pipeline data..." />
          )}
        </div>
      </div>
      {/* Pipeline Bar Chart */}
      <div className="rounded-lg shadow-lg h-full  ">
        <h3 className="text-xl font-semibold mb-2 ">Stages (Count)</h3>
        <div className="flex items-center h-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={pipelineBarData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#82ca9d"
                name="Pipeline Count"
                isAnimationActive={true}
                animationBegin={200}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Pipeline Pie Chart */}
      {pipelinePieData && pipelinePieData.length > 0 && (
        <div className="rounded-lg shadow-lg h-full">
          <h3 className="text-xl font-semibold mb-2 ">Stages (%)</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pipelinePieData}
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
                  {pipelinePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pipelinePieColors[index % pipelinePieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default PipelineStagesSection;
