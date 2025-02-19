import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { PiWarningFill } from "react-icons/pi";
import Layout from "../common/Layout";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DNA } from "react-loader-spinner";
import { MdOutlineOpenInNew } from "react-icons/md";

const DeadLineStages = () => {
  const { backendUrl, navigate } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states for company, stage, and deadline date range.
  const [filterCompany, setFilterCompany] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterDeadlineFrom, setFilterDeadlineFrom] = useState("");
  const [filterDeadlineTo, setFilterDeadlineTo] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Fetch stages on mount (and when backendUrl changes)
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

      const response = await axios.get(
        `${backendUrl}/api/lead/get-growth-manager-stages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Only keep "in progress" stages (i.e. not completed)
      const inProgressStages = response.data.allStages.filter(
        (stage) => !stage.completed
      );

      // ✅ Filter stages with TAT deadlines **due today**
      const todayDeadlineStages = inProgressStages.filter(
        (stage) =>
          new Date(stage.tatDeadline).toDateString() ===
          new Date().toDateString()
      );

      setStages(todayDeadlineStages);
      console.log("🔹 Fetched stages:", todayDeadlineStages);
    } catch (error) {
      console.error("❌ Error fetching stages:", error);
      toast.error("Failed to fetch deadline stages");
    } finally {
      setLoading(false);
    }
  };

  // Build dropdown options from the stages data
  const uniqueCompanies = useMemo(() => {
    return [
      ...new Set(stages.map((stage) => stage.companyName).filter(Boolean)),
    ];
  }, [stages]);

  const uniqueStages = useMemo(() => {
    return [...new Set(stages.map((stage) => stage.stage).filter(Boolean))];
  }, [stages]);

  // Filtering logic
  const filteredStages = useMemo(() => {
    return stages.filter((stage) => {
      // Filter by company name
      if (filterCompany && stage.companyName !== filterCompany) return false;
      // Filter by stage name
      if (filterStage && stage.stage !== filterStage) return false;
      // Filter by deadline "from" date
      if (filterDeadlineFrom) {
        if (!stage.tatDeadline) return false;
        const deadlineDate = new Date(stage.tatDeadline);
        const fromDate = new Date(filterDeadlineFrom);
        if (deadlineDate < fromDate) return false;
      }
      // Filter by deadline "to" date
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

  return (
    <Layout>
      <div className="p-4">
        <h4 className="text-xl flex gap-2 items-center font-semibold mb-4">
          <PiWarningFill className="text-yellow-500" size={25} />
          Today's Deadline Stages
        </h4>
        {/* Filters Section */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
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
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
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
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
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
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
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
              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
        </div>
        {/* Table Section */}
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-2 py-1 font-semibold text-sm text-left hidden sm:table-cell">
                  S.No.
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Lead Id
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Company Name
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Stage
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Follow Up Date
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Remark
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center">
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
                  <td colSpan={6} className="text-center py-4">
                    No deadline stages found.
                  </td>
                </tr>
              ) : (
                currentPageData.map((stage, index) => (
                  <tr
                    key={index}
                    className="divide-x divide-gray-200 border-b border-gray-200"
                  >
                    <td className="px-2 py-1  hidden sm:table-cell">
                      {offset + index + 1}
                    </td>
                    <td className="px-2 py-1 uppercase font-semibold text-green-800">
                      {stage.leadId.slice(-5)}
                    </td>
                    <td className="px-2 py-1 font-semibold text-gray-800">
                      {stage.companyName || "Unknown Company"}
                    </td>
                    <td className="px-2 py-1">{stage.stage}</td>
                    <td className="px-2 py-1">
                      {stage.tatDeadline
                        ? new Date(stage.followUpDate).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )
                        : "Not Set"}
                    </td>
                    <td className="px-2 py-1">{stage.remark || "No Remark"}</td>
                    <td className="px-2 py-1">
                      <button
                        onClick={() =>
                          navigate(`/growth-manager-leads/${stage.leadId}`)
                        }
                        className="text-green-600 cursor-pointer hover:text-green-800 underline"
                      >
                        <MdOutlineOpenInNew size={20} />
                      </button>
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
      </div>
      <ToastContainer />
    </Layout>
  );
};

export default DeadLineStages;
