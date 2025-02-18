import { HiOutlineX } from "react-icons/hi";
import { Bars } from "react-loader-spinner";

export function MarkCompanyAsLostModal({
  setShowLostModal,
  companyLostReason,
  setCompanyLostReason,
  handleMarkCompanyLost,
  isLoading,
}) {
  return (
    <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 transform transition-all mt-24 sm:mt-0 duration-300">
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
          <h3 className="text-2xl text-slate-800 font-semibold">
            Mark Company as Lost
          </h3>
          <button
            onClick={() => setShowLostModal(false)}
            className=" cursor-pointer text-gray-600 hover:text-gray-800"
          >
            <HiOutlineX size={25} />
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Reason:</label>
          <select
            value={companyLostReason}
            onChange={(e) => setCompanyLostReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="">Select Reason</option>
            <option value="Commercial">Commercial</option>
            <option value="Credential">Credential</option>
            <option value="Features">Features</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowLostModal(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            onClick={handleMarkCompanyLost}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md cursor-pointer transition"
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
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
