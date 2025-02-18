import React from "react";
import { FaTimes } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi";
import { Bars } from "react-loader-spinner";

function AddNewStage({
  setShowStageModal,
  newStage,
  handleStageChange,
  tatMapping,
  setNewStage,
  handleAddStage,
  isLoading,
}) {
  return (
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
            {Object.keys(tatMapping).map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
        {newStage.stage && (
          <>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Follow-up Date:</label>
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
              <label className="block mb-1 font-medium">Follow-up Time:</label>
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
  );
}

export default AddNewStage;
