import React, { useContext, useEffect, useState } from "react";
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
import { ProductSelectModal } from "./ProductSelectModal";
import { ProductsTable } from "./ProductsTable";
import { ContactPersonsTable } from "./ContactPersonTable";

const ManageSteps = () => {
  const { backendUrl } = useContext(ThemeContext);
  const { leadId } = useParams();
  const token = localStorage.getItem("token");

  const [stages, setStages] = useState([]);
  const [newStage, setNewStage] = useState({
    stage: "",
    callDate: new Date().toISOString().split("T")[0],
    followUpDate: "",
    followUpTime: "",
    remark: "",
    uselessLead: false,
    products: [],
    totalPrice: 0,
    tatDeadline: "",
    delayDays: 0,
  });
  const [tatAlert, setTatAlert] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savingStage, setSavingStage] = useState(false);

  // Modal states
  const [showStageModal, setShowStageModal] = useState(false);
  const [showLostModal, setShowLostModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  // const [lead, setLead] = useState({});

  // State for Company Lost modal
  const [companyLostReason, setCompanyLostReason] = useState("");

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

  // const getAllGrowthLeads = async () => {
  //   try {
  //     console.log("Fetching Growth Manager Leads...");

  //     const response = await axios.get(
  //       backendUrl + `/api/lead/get-all-growth-manager-lead`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log("Full API Response:", response); // Check the full API response

  //     if (response?.data?.success) {
  //       const lead = response.data.leads.filter(
  //         (lead) => lead._id === leadId
  //       )[0];
  //       console.log(lead);
  //       setLead(lead); // Ensure state is updated
  //     } else {
  //       console.log("API call did not return success:", response.data);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Error fetching Growth Manager Leads:",
  //       error?.response?.data || error
  //     );
  //   }
  // };

  // useEffect(() => {
  //   getAllGrowthLeads();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchLeadStages(), fetchProducts()]);
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchLeadStages = async () => {
    try {
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
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    }
  };

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

  const handleStageChange = (e) => {
    const stage = e.target.value;
    const tatDays = tatMapping[stage] || 0;
    const tatDeadline = new Date(
      new Date().setDate(new Date().getDate() + tatDays)
    )
      .toISOString()
      .split("T")[0];

    setNewStage((prev) => ({
      ...prev,
      stage,
      callDate: new Date().toISOString().split("T")[0],
      tatDeadline,
      delayDays: 0,
      followUpDate: "",
      followUpTime: "",
      remark: "",
      products: [],
      totalPrice: 0,
    }));

    // Open the product selection modal if needed
    if (stage === "Solution Deck Creation") {
      setShowProductModal(true);
    }
  };

  const handleProductSelection = (product, isChecked) => {
    if (isChecked) {
      setSelectedProducts((prev) => [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          quantity: 1,
          pricePerUnit: 0,
          totalAmount: 0,
        },
      ]);
    } else {
      setSelectedProducts((prev) =>
        prev.filter((p) => p.productId !== product._id)
      );
    }
  };

  const handleProductChange = (productId, field, value) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? {
              ...p,
              [field]: Number(value),
              totalAmount:
                field === "pricePerUnit"
                  ? p.quantity * Number(value)
                  : Number(value) * p.pricePerUnit,
            }
          : p
      )
    );
  };

  const handleSaveProducts = () => {
    const totalPrice = selectedProducts.reduce(
      (sum, prod) => sum + prod.totalAmount,
      0
    );

    setNewStage((prev) => ({
      ...prev,
      products: [...selectedProducts],
      totalPrice: totalPrice,
    }));

    setShowProductModal(false);
  };

  const handleAddStage = async () => {
    setSavingStage(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/lead/update-lead-stage/${leadId}`,
        newStage,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.lead) {
        setStages(response.data.lead.growthManagerPipeline);
        toast.success("Stage added successfully!");
        // Reset form
        setNewStage({
          stage: "",
          callDate: new Date().toISOString().split("T")[0],
          tatDeadline: "",
          delayDays: 0,
          followUpDate: "",
          followUpTime: "",
          remark: "",
          uselessLead: false,
          products: [],
          totalPrice: 0,
        });
        setSelectedProducts([]);
        setShowStageModal(false);
      }
    } catch (error) {
      console.error(
        "API Error:",
        error.response ? error.response.data : error.message
      );
      toast.error(
        `Error: ${
          error.response
            ? error.response.data.message
            : "Server Error. Try again."
        }`
      );
    } finally {
      setSavingStage(false);
    }
  };

  const handleMarkCompanyLost = async () => {
    if (!companyLostReason) {
      toast.error("Please select a reason for company lost.");
      return;
    }

    setSavingStage(true);
    try {
      const response = await axios.put(
        `${backendUrl}/api/lead/mark-company-lost/${leadId}`,
        { isCompanyLost: true, companyLostReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      fetchLeadStages();
      setShowLostModal(false);
    } catch (error) {
      console.error("Error marking company as lost:", error);
      toast.error("Error marking company as lost");
    } finally {
      setSavingStage(false);
    }
  };

  const renderStageIcon = (stage) => {
    const today = new Date();
    if (stage.completed) {
      return <FaCheckCircle className="text-green-500 w-6 h-6" />;
    } else if (stage.tatDeadline && new Date(stage.tatDeadline) < today) {
      return <FaExclamationTriangle className="text-red-500 w-6 h-6" />;
    } else {
      return <FaHourglassHalf className="text-yellow-500 w-6 h-6" />;
    }
  };

  return (
    <Layout>
      <div className="p-2">
        <ToastContainer />
        {isLoading ? (
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
        ) : (
          <div>
            {tatAlert && (
              <div className="bg-red-100 text-red-700 p-2 mb-2 border border-red-300 rounded text-center">
                TAT Alert: Stage <strong>{tatAlert}</strong> is overdue!
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
              <h2 className="text-2xl font-bold">Lead Stages</h2>
              <div className=" flex flex-col md:flex-row gap-2">
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
            </div>
            <ul className="space-y-4 sm:p-2 sm:bg-gray-100 rounded-md shadow-md broder border-gray-200">
              {stages.map((stage, index) => (
                <li
                  key={index}
                  className="p-2 sm:p-4 bg-white rounded-lg shadow-md border border-gray-100 flex items-start sm:space-x-4"
                >
                  <div className="mt-1 hidden sm:block">
                    {renderStageIcon(stage)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">{stage.stage}</h3>
                      <p
                        className={`text-sm font-semibold ${
                          stage.completed ? "text-green-600" : "text-yellow-500"
                        }`}
                      >
                        {stage.completed ? "Completed" : "In Progress"}
                      </p>
                    </div>
                    {!stage.completed && (
                      <span className="text-sm text-red-500 font-semibold">
                        TAT Deadline:{" "}
                        {stage.tatDeadline
                          ? new Date(stage.tatDeadline).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Not Set"}
                      </span>
                    )}
                    {stage.followUpDate && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-600">
                          Follow-up -{" "}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {new Date(stage.followUpDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}{" "}
                          at{" "}
                          {stage.followUpTime
                            ? new Date(
                                `1970-01-01T${stage.followUpTime}`
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true, // ✅ Converts to 12-hour format
                              })
                            : "Not Set"}
                        </span>
                      </p>
                    )}
                    {stage.remark && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-600">
                          Remark -{" "}
                        </span>
                        <span className="font-semibold text-blue-800">
                          {stage.remark}
                        </span>
                      </p>
                    )}
                    {stage.products && stage.products.length > 0 && (
                      <ProductsTable stage={stage} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add New Stage Modal */}
        {showStageModal && (
          <AddNewStage
            setShowStageModal={setShowStageModal}
            newStage={newStage}
            handleStageChange={handleStageChange}
            tatMapping={tatMapping}
            setNewStage={setNewStage}
            handleAddStage={handleAddStage}
            isLoading={savingStage}
          />
        )}

        {/* Mark Company as Lost Modal */}
        {showLostModal && (
          <MarkCompanyAsLostModal
            setShowLostModal={setShowLostModal}
            companyLostReason={companyLostReason}
            setCompanyLostReason={setCompanyLostReason}
            handleMarkCompanyLost={handleMarkCompanyLost}
            isLoading={savingStage}
          />
        )}

        {/* Product Selection Modal */}
        {showProductModal && (
          <ProductSelectModal
            setShowProductModal={setShowProductModal}
            products={products}
            handleProductSelection={handleProductSelection}
            handleProductChange={handleProductChange}
            handleSaveProducts={handleSaveProducts}
          />
        )}
      </div>
    </Layout>
  );
};

export default ManageSteps;

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
