import React, { useContext, useEffect, useState, useMemo } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import { IoNotifications } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DNA } from "react-loader-spinner";
import Layout from "../common/Layout";
import { MdOutlineOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function SalesExecutiveNotifications() {
  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  // Notifications and loading state
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setNotificationsLoading(true);
      try {
        console.log("📡 Fetching Sales Executive Notifications...");
        const response = await axios.get(
          `${backendUrl}/api/lead/sales-executive-notifications`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(response.data.notifications);
        console.log(
          "Sales Executive Notifications:",
          response.data.notifications
        );
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        toast.error("Failed to fetch notifications");
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();
  }, [backendUrl, token]);

  // Close (mark as done) a notification
  const closeNotification = async (leadId) => {
    if (!leadId) {
      console.error("❌ leadId is undefined when trying to close notification");
      return;
    }

    console.log("✅ Closing notification for Lead ID:", leadId);

    try {
      await axios.put(
        `${backendUrl}/api/lead/sales-executive/notifications/${leadId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Notification marked as done!");
      // Remove the closed notification from the UI
      setNotifications((prev) =>
        prev.filter((notif) => notif.leadId !== leadId)
      );
    } catch (error) {
      console.error("❌ Error marking notification as read:", error);
      toast.error("Failed to mark notification as done");
    }
  };

  // Build dropdown options for Company filter
  const uniqueCompanies = useMemo(() => {
    const companies = notifications.map((notif) => notif.companyName);
    return [...new Set(companies)];
  }, [notifications]);

  // Filter notifications based on search, company, and date range
  const filteredNotifications = useMemo(() => {
    return notifications
      .filter((notif) => {
        const notifDate = new Date(notif.createdAt);
        const fromDate = filterFromDate ? new Date(filterFromDate) : null;
        const toDate = filterToDate ? new Date(filterToDate) : null;

        if (filterCompany && notif.companyName !== filterCompany) {
          return false;
        }
        if (fromDate && notifDate < fromDate) return false;
        if (toDate && notifDate > toDate) return false;

        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          if (
            !notif.companyName.toLowerCase().includes(search) &&
            !notif.message.toLowerCase().includes(search)
          ) {
            return false;
          }
        }
        return true;
      })
      .slice() // create a shallow copy
      .reverse(); // show newest notifications first
  }, [notifications, filterCompany, filterFromDate, filterToDate, searchTerm]);

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredNotifications.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredNotifications.length / itemsPerPage);
  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  const [expandedRow, setExpandedRow] = useState(null);

  const handleRowClick = (leadId) => {
    // Toggle expanded row; only one row expanded at a time
    setExpandedRow((prev) => (prev === leadId ? null : leadId));
  };

  return (
    <Layout>
      <div className="p-2">
        <h4 className="text-xl font-semibold mb-4">🔔 Notifications</h4>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-[2fr_repeat(2,_1fr)_min-content] gap-2 sm:gap-4 items-center mb-4">
          <div className="flex flex-col w-full col-start-1 col-span-2 sm:col-span-1 order-1 sm:order-[0]">
            <label
              htmlFor="searchbar"
              className="text-sm sm:mb-1 hidden sm:block"
            >
              &nbsp;
            </label>
            <input
              type="text"
              placeholder="Search by company or message..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="comapnyname">Select Company</label>
            <select
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

          <div className="flex w-full gap-2 order-[-1] sm:order-[0] col-start-1 col-span-2 sm:col-span-1">
            <div>
              <label htmlFor="">From</label>
              <input
                type="date"
                value={filterFromDate}
                onChange={(e) => {
                  setFilterFromDate(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-2 py-1 border border-gray-300 rounded-md"
                title="From Date"
              />
            </div>

            <div>
              <label htmlFor="">To</label>
              <input
                type="date"
                value={filterToDate}
                onChange={(e) => {
                  setFilterToDate(e.target.value);
                  setCurrentPage(0);
                }}
                className="px-2 py-1 border border-gray-300 rounded-md"
                title="To Date"
              />
            </div>
          </div>
        </div>

        {/* Table of Notifications */}
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-800 text-white text-left">
              <tr>
                <th className="px-2 py-1 font-semibold text-sm">S.No.</th>
                <th className="px-2 py-1 font-semibold text-sm">Time</th>
                <th className="px-2 py-1 font-semibold text-sm">Lead Id</th>
                <th className="px-2 py-1 font-semibold text-sm">Company</th>
                {/* Hide remarks on mobile */}
                <th className="hidden md:table-cell px-2 py-1 font-semibold text-sm">
                  Message
                </th>
                <th className="px-2 py-1 font-semibold text-sm">Jump</th>
                <th className="px-2 py-1 font-semibold text-sm">
                  Mark as Done
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {notificationsLoading ? (
                <tr>
                  <td colSpan={7}>
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
                  <td colSpan="7" className="text-center">
                    No notifications found.
                  </td>
                </tr>
              ) : (
                currentPageData.map((notif, index) => (
                  // Using React.Fragment because we are conditionally adding an extra row
                  <React.Fragment key={notif.leadId || index}>
                    <tr
                      onClick={() => handleRowClick(index)}
                      className={`border-b border-gray-200 divide-x divide-gray-200 cursor-pointer ${
                        expandedRow === index ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="px-2 py-1">{offset + index + 1}</td>
                      <td className="px-2 py-1">
                        {new Date(notif.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-2 py-1 font-semibold text-green-700">
                        {notif.leadId.slice(-5).toUpperCase()}
                      </td>
                      <td className="px-2 py-1 flex items-center gap-1 font-semibold text-gray-700">
                        {notif.companyName}
                      </td>
                      {/* Hidden on mobile */}
                      <td className="hidden md:table-cell px-2 py-1">
                        {notif.message}
                      </td>
                      <td className="px-2 py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/manage/contact/${notif.leadId}`);
                          }}
                          className="flex cursor-pointer items-center text-red-600 px-2 py-1 rounded hover:text-red-700"
                        >
                          <MdOutlineOpenInNew size={20} />
                        </button>
                      </td>
                      <td className="px-2 py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeNotification(notif.leadId);
                          }}
                          className="flex items-center text-green-600 cursor-pointer px-2 py-1 rounded hover:text-green-700"
                        >
                          <FaCheck size={20} />
                        </button>
                      </td>
                    </tr>
                    {/* Expanded section: visible only on mobile */}
                    {expandedRow === index && (
                      <tr className="md:hidden bg-gray-100">
                        <td colSpan="7" className="px-2 py-1">
                          <strong>Remarks: </strong>
                          {notif.message}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center mt-4">
          <div className="text-sm text-gray-700 order-1 sm:order-[0]">
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
}

export default SalesExecutiveNotifications;
