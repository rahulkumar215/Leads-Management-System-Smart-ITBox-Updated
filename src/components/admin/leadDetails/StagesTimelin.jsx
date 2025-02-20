import { useState } from "react";
import { motion } from "framer-motion";
import { HiOutlineCheck, HiOutlineX } from "react-icons/hi";

const ICON_SIZE = 20;
const STAGE_GAP = 20; // gap between each stage container
const VERTICAL_SEPARATION = ICON_SIZE + STAGE_GAP; // fixed height for each stage container

const StagesTimeline = ({ lead, openModal }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Top padding of the container
  const containerPaddingTop = 20;

  // Master list of all processes
  const masterStages = [
    "Discovery Call",
    "Process Understanding",
    "Solution Deck Creation",
    "Solution Presentation",
    "Requirement Finalization",
    "Commercial Submission",
    "Commercial Clarity",
    "Negotiation",
    "Commercial Finalization",
    "Kick-off & Handover",
  ];

  // Create a unified list: if lead.growthManagerPipeline contains data for a stage, use it; otherwise, mark as not completed.
  const stages = masterStages.map((name) => {
    const stageData = lead?.growthManagerPipeline?.find(
      (s) => s.stage === name
    );
    return stageData
      ? stageData
      : { stage: name, completed: false, tatDeadline: null };
  });

  // Find the first incomplete stage index (assuming sequential progress)
  const firstIncompleteIndex = stages.findIndex((stage) => !stage.completed);

  // Use the first incomplete stage as the target if any exist; otherwise, use the last stage.
  const targetIndex =
    firstIncompleteIndex === -1 ? stages.length - 1 : firstIncompleteIndex;

  // Calculate the Y position for the center of a stage container:
  // Each stage container has a fixed height (VERTICAL_SEPARATION) so its center is at (VERTICAL_SEPARATION / 2)
  const lineStartY = containerPaddingTop + VERTICAL_SEPARATION / 2;
  const lineEndY =
    containerPaddingTop +
    targetIndex * VERTICAL_SEPARATION +
    VERTICAL_SEPARATION / 2;
  const targetLineHeight = lineEndY - lineStartY;
  // const targetLineHeight = Math.max(targetIndex * VERTICAL_SEPARATION, 20);

  return (
    <div
      style={{
        position: "relative",
        paddingLeft: 20, // room for icons and the vertical line
        paddingTop: containerPaddingTop,
        paddingBottom: 20,
        paddingRight: 20,
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Animated Vertical Line */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: targetLineHeight }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: 28, // adjust so the line is behind the icons
          top: lineStartY, // start at the center of the first icon
          width: 4,
          backgroundColor: "green",
        }}
      />

      {/* Render all stages */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {stages.map((item, index) => {
          // For completed stages, animate the icon with a slight delay.
          const iconDelay = item.completed ? index * 0.3 : 0;

          // Check overdue status if tatDeadline exists.
          const isOverdue =
            !item.completed &&
            item.tatDeadline &&
            new Date(item.tatDeadline) < new Date();
          const overdueDays = isOverdue
            ? Math.ceil(
                (new Date() - new Date(item.tatDeadline)) /
                  (1000 * 60 * 60 * 24)
              )
            : 0;

          return (
            <div
              key={index}
              onClick={() => openModal(item)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                display: "flex",
                alignItems: "center",
                height: VERTICAL_SEPARATION, // fixed height container for each stage
                cursor: "pointer",
                position: "relative", // for tooltip positioning
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: iconDelay, duration: 0.5 }}
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  borderRadius: "50%",
                  backgroundColor: item.completed ? "green" : "red",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                  flexShrink: 0,
                }}
              >
                {item.completed ? (
                  <HiOutlineCheck style={{ color: "#fff", fontSize: 15 }} />
                ) : (
                  <HiOutlineX style={{ color: "#fff", fontSize: 15 }} />
                )}
              </motion.div>
              <div>
                <span className=" hover:font-semibold">{item.stage}</span>
                {isOverdue && (
                  <span style={{ fontSize: 14, color: "red", marginLeft: 10 }}>
                    Overdue by {overdueDays} day{overdueDays > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {hoveredIndex === index && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 50,
                    backgroundColor: "rgba(0, 0, 0, 1)",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    marginTop: "4px",
                    whiteSpace: "nowrap",
                    zIndex: 1,
                  }}
                >
                  Click to know more
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StagesTimeline;
