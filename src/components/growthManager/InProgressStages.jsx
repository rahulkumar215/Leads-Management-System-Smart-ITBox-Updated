import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DNA } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { FaCheck } from "react-icons/fa";
import { MdOutlineOpenInNew } from "react-icons/md";

function InProgressStages() {
  const { backendUrl, navigate } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [filterCompany, setFilterCompany] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterDeadlineFrom, setFilterDeadlineFrom] = useState("");
  const [filterDeadlineTo, setFilterDeadlineTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl]);

  const fetchStages = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.error("❌ No auth token found!");
        toast.error("No auth token found!");
        return;
      }

      const stagesResponse = await axios.get(
        `${backendUrl}/api/lead/get-growth-manager-stages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter only "in progress" stages (i.e. not completed)
      const inProgressStages = stagesResponse.data.allStages.filter(
        (stage) => !stage.completed
      );
      setStages(inProgressStages);
      console.log("Fetched stages:", inProgressStages);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch stages");
    } finally {
      setLoading(false);
    }
  };

  // Build dropdown options from stages data
  const uniqueCompanies = useMemo(() => {
    return [
      ...new Set(stages.map((stage) => stage.companyName).filter(Boolean)),
    ];
  }, [stages]);

  const uniqueStages = useMemo(() => {
    return [...new Set(stages.map((stage) => stage.stage).filter(Boolean))];
  }, [stages]);

  // Filter the stages based on user input
  const filteredStages = useMemo(() => {
    return stages.filter((stage) => {
      // Filter by company name
      if (filterCompany && stage.companyName !== filterCompany) return false;
      // Filter by stage name
      if (filterStage && stage.stage !== filterStage) return false;
      // Filter by deadline from date
      if (filterDeadlineFrom) {
        if (!stage.tatDeadline) return false;
        const deadlineDate = new Date(stage.tatDeadline);
        const fromDate = new Date(filterDeadlineFrom);
        if (deadlineDate < fromDate) return false;
      }
      // Filter by deadline to date
      if (filterDeadlineTo) {
        if (!stage.tatDeadline) return false;
        const deadlineDate = new Date(stage.tatDeadline);
        const toDate = new Date(filterDeadlineTo);
        if (deadlineDate > toDate) return false;
      }
      return true;
    });
  }, [
    stages,
    filterCompany,
    filterStage,
    filterDeadlineFrom,
    filterDeadlineTo,
  ]);

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredStages.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredStages.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const markStageAsCompleted = async (stageId, stageName) => {
    if (!stageId) {
      console.error("Stage ID is undefined");
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/lead/mark-stage-completed/${stageId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.updatedPipeline) {
        toast.success(`Stage "${stageName}" marked as completed!`);
        fetchStages();
      } else {
        toast.error("No updated pipeline received");
      }
    } catch (error) {
      console.error("Error marking stage as completed:", error);
      toast.error("Failed to mark stage as completed");
    }
  };

  return (
    <div className="in-progress-stages p-4">
      <h4 className="text-xl font-semibold mb-4">In Progress Stages</h4>

      {/* Filters Section */}
      <div className="filters grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        {/* Company Filter */}
        <div className="flex flex-col">
          <label htmlFor="companyFilter" className="mb-1 text-sm">
            Select Company
          </label>
          <select
            id="companyFilter"
            value={filterCompany}
            onChange={(e) => {
              setFilterCompany(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md"
          >
            <option value="">All Companies</option>
            {uniqueCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        {/* Stage Filter */}
        <div className="flex flex-col">
          <label htmlFor="stageFilter" className="mb-1 text-sm">
            Select Stage
          </label>
          <select
            id="stageFilter"
            value={filterStage}
            onChange={(e) => {
              setFilterStage(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md"
          >
            <option value="">All Stages</option>
            {uniqueStages.map((stg) => (
              <option key={stg} value={stg}>
                {stg}
              </option>
            ))}
          </select>
        </div>

        {/* Deadline From Filter */}
        <div className="flex flex-col">
          <label htmlFor="deadlineFrom" className="mb-1 text-sm">
            Deadline From
          </label>
          <input
            type="date"
            id="deadlineFrom"
            value={filterDeadlineFrom}
            onChange={(e) => {
              setFilterDeadlineFrom(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>

        {/* Deadline To Filter */}
        <div className="flex flex-col">
          <label htmlFor="deadlineTo" className="mb-1 text-sm">
            Deadline To
          </label>
          <input
            type="date"
            id="deadlineTo"
            value={filterDeadlineTo}
            onChange={(e) => {
              setFilterDeadlineTo(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-800 text-white text-left ">
            <tr>
              <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                S. No.
              </th>
              <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                Company
              </th>
              <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                Stage
              </th>
              <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                Deadline
              </th>
              <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                Overdue
              </th>
              <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                Follow-up Date
              </th>
              <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                Remark
              </th>
              <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                Jump
              </th>
              <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                Mark As Completed
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9}>
                  <div className="flex justify-center">
                    <DNA
                      visible={true}
                      height="40"
                      width="40"
                      ariaLabel="dna-loading"
                      wrapperStyle={{}}
                      wrapperClass="dna-wrapper"
                    />
                  </div>
                </td>
              </tr>
            ) : currentPageData.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No in progress stages found.
                </td>
              </tr>
            ) : (
              currentPageData
                .slice()
                .reverse()
                .map((stage, index) => (
                  <tr
                    key={stage._id || index}
                    className="border-b border-gray-200 divide-x divide-gray-200"
                  >
                    <td className="px-2 py-1">{offset + index + 1}</td>
                    <td className="px-2 py-1 text-gray-800 font-semibold">
                      {stage.companyName || "Unknown Company"}
                    </td>
                    <td className="px-2 py-1">{stage.stage}</td>
                    <td className="px-2 py-1">
                      {stage.tatDeadline
                        ? new Date(stage.tatDeadline).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )
                        : "Not Set"}
                    </td>
                    <td className="px-2 py-1">
                      <span className="text-red-600">
                        <strong>{stage.delayDays}</strong> Days
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      {stage.followUpDate
                        ? new Date(stage.followUpDate).toLocaleDateString()
                        : "Not Set"}
                    </td>
                    <td className="px-2 py-1">{stage.remark || "No Remark"}</td>
                    <td className="px-2 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent toggling row expansion
                          navigate(`/growth-manager-leads/${stage._id}`);
                        }}
                        className="flex cursor-pointer items-center text-red-600 px-2 py-1 rounded hover:text-red-700"
                      >
                        <MdOutlineOpenInNew size={20} />
                      </button>
                    </td>
                    <td className="px-2 py-1">
                      {!stage.completed && stage._id && (
                        <button
                          className="px-3 py-1 text-green-500 rounded hover:text-green-600"
                          onClick={() =>
                            markStageAsCompleted(stage._id, stage.stage)
                          }
                        >
                          <FaCheck size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Showing {filteredStages.length === 0 ? 0 : offset + 1} to{" "}
          {offset + currentPageData.length} of {filteredStages.length} entries
        </div>
        <ReactPaginate
          previousLabel={"Prev"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageChange}
          containerClassName={"pagination flex space-x-2"}
          pageClassName={
            "px-2 border border-gray-500 rounded-md cursor-pointer"
          }
          activeClassName={"bg-gray-300 text-black"}
          previousClassName={
            "px-2 border border-gray-500 rounded-md cursor-pointer"
          }
          nextClassName={
            "px-2 border border-gray-500 rounded-md cursor-pointer"
          }
        />
      </div>

      <ToastContainer />
    </div>
  );
}

export default InProgressStages;
