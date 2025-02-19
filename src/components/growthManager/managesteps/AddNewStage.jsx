import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import { Bars } from "react-loader-spinner";
import { ProductSelectModal } from "./ProductSelectModal";
import axios from "axios";
import { toast } from "react-toastify";

function AddNewStage({
  setShowStageModal,
  tatMapping,
  stages,
  backendUrl,
  token,
  setStages,
  leadId,
  fetchLeadStages,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

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

  const handleAddStage = async () => {
    setIsLoading(true);
    try {
      // 1. Add the new stage
      const response = await axios.post(
        `${backendUrl}/api/lead/update-lead-stage/${leadId}`,
        newStage,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.lead) {
        const updatedPipeline = response.data.lead.growthManagerPipeline;
        setStages(updatedPipeline);
        toast.success("Stage added successfully!");

        // 2. Find the newly added stage by its name.
        // Assumes newStage.stage is unique enough to identify the newly added stage.
        const newlyAddedStage = updatedPipeline.find(
          (stageItem) => stageItem.stage === newStage.stage
        );

        if (newlyAddedStage) {
          try {
            // 3. Mark the found stage as completed.
            const markResponse = await axios.put(
              `${backendUrl}/api/lead/mark-stage-completed/${newlyAddedStage._id}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("✅ API Response:", markResponse.data);

            if (markResponse.data) {
              toast.success("Stage marked as completed successfully!");
              setStages((prevStages) =>
                prevStages.map((stage) =>
                  stage._id === newlyAddedStage._id
                    ? { ...stage, completed: true }
                    : stage
                )
              );
              setTimeout(() => {
                console.log("🔄 Fetching latest stages...");
                fetchLeadStages();
              }, 500);
            } else {
              toast.error("Failed to update stage status.");
            }
          } catch (markError) {
            console.error("❌ Error marking stage as completed:", markError);
            if (markError.response?.data?.message) {
              toast.error(markError.response.data.message);
            } else {
              toast.error("Something went wrong. Try again.");
            }
          }
        } else {
          // If stage is not found, you might want to log or handle it accordingly.
          console.warn("Newly added stage not found in pipeline.");
        }

        // 4. Reset the form and close the modal.
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
      setIsLoading(false);
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

  const [showProductModal, setShowProductModal] = useState(false);

  const stagesOrder = Object.keys(tatMapping);
  const completedStages = stages.filter((s) => s.completed).map((s) => s.stage);
  const lastCompletedIndex =
    completedStages.length > 0
      ? Math.max(...completedStages.map((stage) => stagesOrder.indexOf(stage)))
      : -1;
  const nextStage = stagesOrder[lastCompletedIndex + 1] || "";

  return (
    <>
      <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/30 z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2 transform transition-all mt-24 sm:mt-0 duration-300">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center h-full items-center bg-white/30 z-10">
              <Bars
                height="40"
                width="40"
                color="#B43F3F"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            </div>
          )}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-slate-800">
              Add New Stage
            </h3>
            <button
              onClick={() => setShowStageModal(false)}
              className=" cursor-pointer text-gray-600 hover:text-gray-700"
            >
              <HiOutlineX size={25} />
            </button>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Select Stage:</label>
            <select
              value={newStage.stage}
              onChange={handleStageChange}
              className="w-full border border-gray-300 rounded-md px-2 py-2"
            >
              <option value="">Select Stage</option>
              {nextStage && (
                <option key={nextStage} value={nextStage}>
                  {nextStage}
                </option>
              )}
            </select>
          </div>
          {newStage.stage && (
            <>
              <div className="mb-4">
                <label className="block mb-1 font-medium">
                  Follow-up Date:
                </label>
                <input
                  type="date"
                  value={newStage.followUpDate}
                  onChange={(e) =>
                    setNewStage({
                      ...newStage,
                      followUpDate: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">
                  Follow-up Time:
                </label>
                <input
                  type="time"
                  value={newStage.followUpTime}
                  onChange={(e) =>
                    setNewStage({
                      ...newStage,
                      followUpTime: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Remark:</label>
                <input
                  type="text"
                  value={newStage.remark}
                  onChange={(e) =>
                    setNewStage({ ...newStage, remark: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </>
          )}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowStageModal(false)}
              className="bg-gray-300 hover:bg-gray-400 cursor-pointer text-gray-800 px-4 py-2 rounded-md transition"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStage}
              className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded-md transition"
            >
              {isLoading ? (
                <Bars
                  height="20"
                  width="20"
                  color="#ffffff"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              ) : (
                "Save Stage"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {showProductModal && (
        <ProductSelectModal
          setShowProductModal={setShowProductModal}
          setNewStage={setNewStage}
          backendUrl={backendUrl}
          token={token}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      )}
    </>
  );
}

export default AddNewStage;
