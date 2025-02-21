import React, { useContext, useEffect, useState, useMemo } from "react";
import Layout from "../common/Layout";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DNA } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { MdOutlineOpenInNew } from "react-icons/md";

const FollowUpAlerts = () => {
  const { backendUrl, navigate } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  const [followUpNotifications, setFollowUpNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filterCompany, setFilterCompany] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterFollowUpFrom, setFilterFollowUpFrom] = useState("");
  const [filterFollowUpTo, setFilterFollowUpTo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 30;

  useEffect(() => {
    fetchFollowUpNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl]);

  const fetchFollowUpNotifications = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.error("❌ No auth token found!");
        toast.error("No auth token found!");
        return;
      }
      const response = await axios.get(
        `${backendUrl}/api/lead/get-growth-manager-stages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("🔹 Follow-Up Notifications API Response:", response.data);
      // Extract notifications from response (adjust key if needed)
      setFollowUpNotifications(response.data.followUpNotifications || []);
    } catch (error) {
      console.error("❌ Error fetching follow-up notifications:", error);
      toast.error("Error fetching follow-up notifications");
    } finally {
      setLoading(false);
    }
  };

  // Build unique dropdown options based on notifications data
  const uniqueCompanies = useMemo(() => {
    return [
      ...new Set(
        followUpNotifications
          .map((notification) => notification.companyName)
          .filter(Boolean)
      ),
    ];
  }, [followUpNotifications]);

  const uniqueStages = useMemo(() => {
    return [
      ...new Set(
        followUpNotifications
          .map((notification) => notification.stage)
          .filter(Boolean)
      ),
    ];
  }, [followUpNotifications]);

  // Filter the notifications based on user input
  const filteredNotifications = useMemo(() => {
    return followUpNotifications.filter((notification) => {
      if (filterCompany && notification.companyName !== filterCompany)
        return false;
      if (filterStage && notification.stage !== filterStage) return false;
      if (filterFollowUpFrom) {
        if (!notification.followUpDate) return false;
        const followUpDate = new Date(notification.followUpDate);
        const fromDate = new Date(filterFollowUpFrom);
        if (followUpDate < fromDate) return false;
      }
      if (filterFollowUpTo) {
        if (!notification.followUpDate) return false;
        const followUpDate = new Date(notification.followUpDate);
        const toDate = new Date(filterFollowUpTo);
        if (followUpDate > toDate) return false;
      }
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matches = Object.values(notification).some((val) => {
          return typeof val === "string" && val.toLowerCase().includes(search);
        });

        if (!matches) {
          return false;
        }
      }
      return true;
    });
  }, [
    followUpNotifications,
    filterCompany,
    filterStage,
    filterFollowUpFrom,
    filterFollowUpTo,
    searchTerm,
  ]);

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredNotifications.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredNotifications.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <Layout>
      <div className="follow-up-alerts p-4">
        <h3 className="text-xl font-semibold mb-4">📌 Follow-Up Reminders</h3>

        {/* Filters Section */}
        <div className="filters grid grid-cols-1 sm:grid-cols-5 gap-2 mb-4">
          <div className="flex flex-col w-full col-start-1 col-span-2 sm:col-span-1 order-1 sm:order-[0]">
            <label
              htmlFor="searchbar"
              className="text-sm sm:mb-1 hidden sm:block"
            >
              &nbsp;
            </label>
            <input
              type="text"
              placeholder="Search by anything..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              id="searchbar"
              className="px-2 py-1 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>
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

          {/* Follow-Up From Filter */}
          <div className="flex flex-col">
            <label htmlFor="followUpFrom" className="mb-1 text-sm">
              Follow-Up From
            </label>
            <input
              type="date"
              id="followUpFrom"
              value={filterFollowUpFrom}
              onChange={(e) => {
                setFilterFollowUpFrom(e.target.value);
                setCurrentPage(0);
              }}
              className="px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>

          {/* Follow-Up To Filter */}
          <div className="flex flex-col">
            <label htmlFor="followUpTo" className="mb-1 text-sm">
              Follow-Up To
            </label>
            <input
              type="date"
              id="followUpTo"
              value={filterFollowUpTo}
              onChange={(e) => {
                setFilterFollowUpTo(e.target.value);
                setCurrentPage(0);
              }}
              className="px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300 max-h-[30rem]">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-800 text-white text-left">
              <tr>
                <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                  S. No.
                </th>
                <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                  Lead Id
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
                  Follow-Up Date
                </th>
                <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                  Remarks
                </th>
                <th className="px-2 py-1 font-semibold text-sm tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
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
                  <td colSpan={8} className="text-center py-2">
                    No follow-up notifications found.
                  </td>
                </tr>
              ) : (
                currentPageData.map((notification, index) => (
                  <tr
                    key={notification._id || index}
                    className="border-b border-gray-200 divide-x divide-gray-200"
                  >
                    <td className="px-2 py-1">{offset + index + 1}</td>
                    <td className="px-2 py-1 uppercase text-green-700 font-semibold">
                      {notification.leadId.slice(-5)}
                    </td>
                    <td className="px-2 py-1 text-gray-800 font-semibold">
                      {notification.companyName || "Unknown Company"}
                    </td>
                    <td className="px-2 py-1">{notification.stage}</td>
                    <td className="px-2 py-1 text-red-600">
                      {notification.tatDeadline
                        ? new Date(notification.tatDeadline).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Not Set"}
                    </td>
                    <td className="px-2 py-1">
                      {notification.followUpDate
                        ? new Date(
                            notification.followUpDate
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not Set"}
                    </td>
                    <td className="px-2 py-1">{notification.remark}</td>
                    <td className="px-2 py-1">
                      {notification._id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(
                              `/growth-manager-leads/${notification._id}`
                            );
                          }}
                          className="flex items-center cursor-pointer text-green-600 px-2 py-1 rounded hover:text-green-700"
                        >
                          <MdOutlineOpenInNew size={20} />
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
            Showing {filteredNotifications.length === 0 ? 0 : offset + 1} to{" "}
            {offset + currentPageData.length} of {filteredNotifications.length}{" "}
            entries
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
    </Layout>
  );
};

export default FollowUpAlerts;
