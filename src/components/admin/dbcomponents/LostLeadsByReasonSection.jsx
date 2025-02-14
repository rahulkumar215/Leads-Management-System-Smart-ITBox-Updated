import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card2 } from "./Cards";
import { LoadingSpinner } from "./Spinner";

// Lost Leads by Reason Section Component
const LostLeadsByReasonSection = ({
  lostLeadsByReason,
  lostLeadsPieData,
  lostLeadsColors,
  reasonStyles,
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
    const fillColor = lostLeadsColors[index % lostLeadsColors.length];

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-2">
      <div>
        <h3 className="text-xl font-semibold mb-2">Leads Lost by Reason</h3>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
          {lostLeadsByReason ? (
            Object.entries(lostLeadsByReason).map(([reason, count]) => {
              const { color, textColor, icon } = reasonStyles[reason];
              return (
                <Card2
                  key={reason}
                  title={reason}
                  count={count}
                  icon={icon}
                  color={color}
                  textColor={textColor}
                  route="/lost-leads"
                />
              );
            })
          ) : (
            <LoadingSpinner message="Loading lost lead data..." />
          )}
        </div>
      </div>
      {lostLeadsPieData && lostLeadsPieData.length > 0 && (
        <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out rounded-lg">
          <h3 className="text-xl font-semibold mb-2 ">Reasons (%)</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={lostLeadsPieData}
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
                {lostLeadsPieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={lostLeadsColors[index % lostLeadsColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default LostLeadsByReasonSection;
