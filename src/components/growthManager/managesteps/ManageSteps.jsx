import { useContext, useEffect, useState } from "react";
import Layout from "../../common/Layout";
import { ThemeContext } from "../../../context/ThemeContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaExclamationTriangle,
  FaPlus,
} from "react-icons/fa";
import AddNewStage from "./AddNewStage";
import { DNA } from "react-loader-spinner";
import { MarkCompanyAsLostModal } from "./MarkCompanyAsLostModal";
import { ProductsTable } from "./ProductsTable";
import { ContactPersonsTable } from "./ContactPersonTable";
import StagesTimeline from "../../admin/leadDetails/StagesTimelin";
import StageDetailsModal from "../../admin/leadDetails/StageDetailsModal";

const ManageSteps = () => {
  const { backendUrl } = useContext(ThemeContext);
  const { leadId } = useParams();
  const token = localStorage.getItem("token");

  const [stages, setStages] = useState([]);

  const [tatAlert, setTatAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedStage, setSelectedStage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // Modal states
  const [showStageModal, setShowStageModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [lead, setLead] = useState(null);

  const solutionDeckStage = lead?.growthManagerPipeline?.find(
    (stage) => stage.stage === "Solution Deck Creation"
  );

  // Calculate the total revenue from the products in that stage
  const totalRevenue =
    solutionDeckStage?.products?.reduce(
      (acc, item) => acc + (item.totalAmount || 0),
      0
    ) || 0;

  console.log(totalRevenue);

  // TAT Mapping
  const tatMapping = {
    "Discovery Call": 2,
    "Process Understanding": 7,
    "Solution Deck Creation": 3,
    "Solution Presentation": 7,
    "Requirement Finalization": 14,
    "Commercial Submission": 7,
    "Commercial Clarity": 7,
    Negotiation: 15,
    "Commercial Finalization": 15,
    "Kick-off & Handover": 15,
  };

  const getAllGrowthLeads = async () => {
    try {
      console.log("Fetching Growth Manager Leads...");

      const response = await axios.get(
        backendUrl + `/api/lead/get-all-growth-manager-lead`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Full API Response:", response); // Check the full API response

      if (response?.data?.success) {
        const lead = response.data.leads.filter(
          (lead) => lead._id === leadId
        )[0];
        console.log(response.data.leads);
        console.log(lead);
        setLead(lead); // Ensure state is updated
      } else {
        console.log("API call did not return success:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching Growth Manager Leads:",
        error?.response?.data || error
      );
    }
  };

  useEffect(() => {
    getAllGrowthLeads();
  }, [backendUrl, leadId, token]);

  const fetchLeadStages = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${backendUrl}/api/lead/get-lead-stages/${leadId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.pipeline) {
        setStages(response.data.pipeline);
        checkTatAlert(response.data.pipeline);
      }
    } catch (error) {
      console.error("Error fetching lead stages:", error);
      toast.error("Error fetching lead stages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadStages();
    // eslint-disable-next-line
  }, []);

  function fetchUpdatedData() {
    fetchLeadStages();
    getAllGrowthLeads();
  }

  const checkTatAlert = (pipeline) => {
    const today = new Date();
    const overdueStage = pipeline.find(
      (stage) =>
        stage.tatDeadline &&
        new Date(stage.tatDeadline) < today &&
        !stage.completed
    );

    if (overdueStage) {
      setTatAlert(overdueStage.stage);
    } else {
      setTatAlert(null);
    }
  };

  // const renderStageIcon = (stage) => {
  //   const today = new Date();
  //   if (stage.completed) {
  //     return <FaCheckCircle className="text-green-500 w-6 h-6" />;
  //   } else if (stage.tatDeadline && new Date(stage.tatDeadline) < today) {
  //     return <FaExclamationTriangle className="text-red-500 w-6 h-6" />;
  //   } else {
  //     return <FaHourglassHalf className="text-yellow-500 w-6 h-6" />;
  //   }
  // };

  const stagesOrder = Object.keys(tatMapping);
  const completedStages = stages.filter((s) => s.completed).map((s) => s.stage);
  const lastCompletedIndex =
    completedStages.length > 0
      ? Math.max(...completedStages.map((stage) => stagesOrder.indexOf(stage)))
      : -1;
  const nextStage = stagesOrder[lastCompletedIndex + 1] || null;

  const openModal = (stage) => {
    setSelectedStage(stage);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedStage(null);
    setModalIsOpen(false);
  };

  if (!lead) {
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
      <div className="p-2">
        <ToastContainer />

        <div className="p-2 grid grid-cols-1 sm:grid-cols-[2fr_1fr]  gap-4 h-full">
          <div className=" grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-[repeat(3,_min-content)] gap-4 sm:gap-y-8 sm:items-start">
            <div className=" col-start-1 col-span-1 order-1 sm:order-[0]">
              <div className="mb-4">
                <span className="text-2xl font-semibold tracking-wide text-gray-600">
                  Lead ID:
                </span>{" "}
                <span
                  className={`text-2xl font-semibold uppercase tracking-wide px-2 py-1 text-white rounded-md ${
                    lead.status === "open" || lead.status === "win"
                      ? "bg-green-700"
                      : "bg-red-700"
                  }`}
                >
                  {lead._id?.slice(-5)}
                </span>
              </div>
              <div>
                <span className="text-md text-gray-700 font-semibold mr-2">
                  Company Name:
                </span>
                <span className="text-md font-semibold ">
                  {lead.companyName || "Unknown"}
                </span>
              </div>
              {/* <div>
                <span className="text-md text-gray-700 font-semibold mr-2">
                  Sales Executive:
                </span>
                <span className="text-md font-semibold ">
                  {lead.assignedToSalesExecutive || "Not Assigned"}
                </span>
              </div>
              <div>
                <span className="text-md text-gray-700 font-semibold mr-2">
                  Data Analyst:
                </span>
                <span className="text-md font-semibold ">
                  {lead.createdBy || "N/A"}
                </span>
              </div> */}
              {totalRevenue > 0 && (
                <div className="mt-1">
                  <span className="text-md text-gray-700 font-semibold mr-2 underline underline-offset-4">
                    Total Revenue:
                  </span>
                  <span className="text-md font-semibold px-2 rounded-md border border-red-300 bg-red-100 text-red-600">
                    {totalRevenue || "0"}
                  </span>
                </div>
              )}
              {lead.isCompanyLost && (
                <p className="bg-red-700 text-lg mt-4 text-white px-2 py-1 rounded-md text-left">
                  Lost Reason: {lead.companyLostReason}
                </p>
              )}
            </div>

            <div
              className={`w-full px-3 py-1 uppercase text-xl rounded-md text-white sm:size-fit justify-self-end  ${
                lead.status === "open" || lead.status === "win"
                  ? "bg-green-700"
                  : "bg-red-700"
              }`}
            >
              {lead.status}
            </div>

            {nextStage && !lead.isCompanyLost && (
              <div className=" flex flex-col md:flex-row gap-2 order-2 sm:order-[0]">
                <button
                  onClick={() => setShowStageModal(true)}
                  className="flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  <FaPlus /> Add New Stage
                </button>
                <button
                  onClick={() => setShowLostModal(true)}
                  className="flex items-center justify-center gap-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                >
                  <FaExclamationTriangle /> Mark Company as Lost
                </button>
              </div>
            )}

            {/* Contact Persons */}
            <ContactPersonsTable
              contactPoints={lead.contactPoints}
              className=" col-start-1 col-span-2 order-1 sm:order-[0] sm:!mt-0"
            />
          </div>

          <div className=" bg-gray-50 rounded-lg shadow-lg">
            <h3 className="px-5 text-2xl font-semibold text-gray-800">
              Process Pipeline Stages
            </h3>
            <StagesTimeline lead={lead} openModal={openModal} />
          </div>

          <StageDetailsModal
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            selectedStage={selectedStage}
          />
        </div>

        {/* Add New Stage Modal */}
        {showStageModal && (
          <AddNewStage
            setShowStageModal={setShowStageModal}
            tatMapping={tatMapping}
            stages={stages}
            backendUrl={backendUrl}
            token={token}
            setStages={setStages}
            leadId={leadId}
            fetchLeadStages={fetchUpdatedData}
          />
        )}

        {/* Mark Company as Lost Modal */}
        {showLostModal && (
          <MarkCompanyAsLostModal
            setShowLostModal={setShowLostModal}
            backendUrl={backendUrl}
            fetchLeadStages={fetchUpdatedData}
            token={token}
            leadId={leadId}
          />
        )}
      </div>
    </Layout>
  );
};

export default ManageSteps;

// {
//   isLoading ? (
//     <div className="flex justify-center items-center min-h-screen">
//       <DNA
//         visible={true}
//         height="100"
//         width="100"
//         ariaLabel="dna-loading"
//         wrapperStyle={{}}
//         wrapperClass="dna-wrapper"
//       />
//     </div>
//   ) : (
//     <div>
//       {tatAlert && (
//         <div className="bg-red-100 text-red-700 p-2 mb-2 border border-red-300 rounded text-center">
//           TAT Alert: Stage <strong>{tatAlert}</strong> is overdue!
//         </div>
//       )}

//       <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
//         <h2 className="text-2xl font-bold">Lead Stages</h2>
//         {nextStage && (
//           <div className=" flex flex-col md:flex-row gap-2">
//             <button
//               onClick={() => setShowStageModal(true)}
//               className="flex items-center justify-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
//             >
//               <FaPlus /> Add New Stage
//             </button>
//             <button
//               onClick={() => setShowLostModal(true)}
//               className="flex items-center justify-center gap-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
//             >
//               <FaExclamationTriangle /> Mark Company as Lost
//             </button>
//           </div>
//         )}
//       </div>
//       <ul className="space-y-4 sm:p-2 sm:bg-gray-100 rounded-md shadow-md broder border-gray-200">
//         {stages.map((stage, index) => (
//           <li
//             key={index}
//             className="p-2 sm:p-4 bg-white rounded-lg shadow-md border border-gray-100 flex items-start sm:space-x-4"
//           >
//             <div className="mt-1 hidden sm:block">{renderStageIcon(stage)}</div>
//             <div className="flex-1">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">{stage.stage}</h3>
//                 <p
//                   className={`text-sm font-semibold ${
//                     stage.completed ? "text-green-600" : "text-yellow-500"
//                   }`}
//                 >
//                   {stage.completed ? "Completed" : "In Progress"}
//                 </p>
//               </div>
//               {!stage.completed && (
//                 <span className="text-sm text-red-500 font-semibold">
//                   TAT Deadline:{" "}
//                   {stage.tatDeadline
//                     ? new Date(stage.tatDeadline).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })
//                     : "Not Set"}
//                 </span>
//               )}
//               {stage.followUpDate && (
//                 <p className="text-sm text-gray-600">
//                   <span className="font-semibold text-gray-600">
//                     Follow-up -{" "}
//                   </span>
//                   <span className="font-semibold text-gray-800">
//                     {new Date(stage.followUpDate).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}{" "}
//                     at{" "}
//                     {stage.followUpTime
//                       ? new Date(
//                           `1970-01-01T${stage.followUpTime}`
//                         ).toLocaleTimeString("en-US", {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                           hour12: true, // ✅ Converts to 12-hour format
//                         })
//                       : "Not Set"}
//                   </span>
//                 </p>
//               )}
//               {stage.remark && (
//                 <p className="text-sm text-gray-600">
//                   <span className="font-semibold text-gray-600">Remark - </span>
//                   <span className="font-semibold text-blue-800">
//                     {stage.remark}
//                   </span>
//                 </p>
//               )}
//               {stage.products && stage.products.length > 0 && (
//                 <ProductsTable stage={stage} />
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// <div className="grid grid-cols-[1fr_1fr] gap-2">
//   <div className=" grid grid-cols-1  sm:grid-cols-2 gap-y-4">
//     <div className=" col-start-1 col-span-1 order-1 sm:order-[0]">
//       <div className="mb-4">
//         <span className="text-2xl font-semibold tracking-wide text-gray-600">
//           Lead ID:
//         </span>{" "}
//         <span
//           className={`text-2xl font-semibold tracking-wide px-2 py-1 text-white rounded-md ${
//             lead.status === "open" ? "bg-green-700" : "bg-red-700"
//           }`}
//         >
//           {lead?._id?.slice(-5)?.toUpperCase()}
//         </span>
//       </div>
//       <div>
//         <span className="text-md text-gray-700 font-semibold mr-2">
//           Company Name:
//         </span>
//         <span className="text-md font-semibold ">
//           {lead.companyName || "Unknown"}
//         </span>
//       </div>
//       <div>
//         <span className="text-md text-gray-700 font-semibold mr-2">
//           Sales Executive:
//         </span>
//         <span className="text-md font-semibold ">
//           {lead.assignedToSalesExecutive || "Not Assigned"}
//         </span>
//       </div>
//       <div>
//         <span className="text-md text-gray-700 font-semibold mr-2">
//           Data Analyst:
//         </span>
//         <span className="text-md font-semibold ">
//           {lead.createdBy || "N/A"}
//         </span>
//       </div>
//       {lead.isCompanyLost && (
//         <p className="bg-red-700 text-lg mt-4 text-white px-2 py-1 rounded-md text-left">
//           Lost Reason: {lead.companyLostReason}
//         </p>
//       )}
//     </div>

//     <div
//       className={`w-full px-3 py-1 text-xl rounded-md text-white sm:size-fit justify-self-end  ${
//         lead.status === "open" ? "bg-green-700" : "bg-red-700"
//       }`}
//     >
//       {lead?.status?.toUpperCase()}
//     </div>

//     {/* Contact Persons */}
//     <ContactPersonsTable
//       contactPoints={lead?.contactPoints}
//       className=" col-start-1 col-span-2 order-1 sm:order-[0]"
//     />
//   </div>
//   <ul className="space-y-4 p-2 bg-gray-100 rounded-md shadow-md broder border-gray-200">
//     {stages.map((stage, index) => (
//       <li
//         key={index}
//         className="p-4 bg-white rounded-lg shadow-md border border-gray-100 flex items-start space-x-4"
//       >
//         <div className="mt-1">{renderStageIcon(stage)}</div>
//         <div className="flex-1">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-semibold">{stage.stage}</h3>
//             <p
//               className={`text-sm font-semibold ${
//                 stage.completed
//                   ? "text-green-600"
//                   : "text-yellow-500"
//               }`}
//             >
//               {stage.completed ? "Completed" : "In Progress"}
//             </p>
//           </div>
//           {!stage.completed && (
//             <span className="text-sm text-red-500 font-semibold">
//               TAT Deadline:{" "}
//               {stage.tatDeadline
//                 ? new Date(stage.tatDeadline).toLocaleDateString(
//                     "en-IN",
//                     {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     }
//                   )
//                 : "Not Set"}
//             </span>
//           )}
//           {stage.followUpDate && (
//             <p className="text-sm text-gray-600">
//               <span className="font-semibold text-gray-600">
//                 Follow-up -{" "}
//               </span>
//               <span className="font-semibold text-gray-800">
//                 {new Date(stage.followUpDate).toLocaleDateString(
//                   "en-IN",
//                   {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   }
//                 )}{" "}
//                 at{" "}
//                 {stage.followUpTime
//                   ? new Date(
//                       `1970-01-01T${stage.followUpTime}`
//                     ).toLocaleTimeString("en-US", {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                       hour12: true, // ✅ Converts to 12-hour format
//                     })
//                   : "Not Set"}
//               </span>
//             </p>
//           )}
//           {stage.remark && (
//             <p className="text-sm text-gray-600">
//               <span className="font-semibold text-gray-600">
//                 Remark -{" "}
//               </span>
//               <span className="font-semibold text-blue-800">
//                 {stage.remark}
//               </span>
//             </p>
//           )}
//           {stage.products && stage.products.length > 0 && (
//             <ProductsTable stage={stage} />
//           )}
//         </div>
//       </li>
//     ))}
//   </ul>
// </div>;
