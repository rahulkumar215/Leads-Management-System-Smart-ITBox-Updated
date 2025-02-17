import React, { useEffect, useState, useContext, useMemo } from "react";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { toast, ToastContainer } from "react-toastify";
import Layout from "../common/Layout";
import ReactPaginate from "react-paginate";
import { FaCheck } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { DNA } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { MdOutlineOpenInNew } from "react-icons/md";

const Alerts = () => {
  const { backendUrl } = useContext(ThemeContext);
  const [wrongNumberAlerts, setWrongNumberAlerts] = useState([]);
  const token = localStorage.getItem("token");
  const [alertsLoading, setAlerstLoading] = useState(false);

  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterSalesEx, setFilterSalesEx] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchWrongNumberAlerts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWrongNumberAlerts = async () => {
    setAlerstLoading(true);
    try {
      console.log("📡 Fetching Wrong Number Alerts...");
      console.log("🔑 Token being sent:", token);
      const response = await axios.get(
        `${backendUrl}/api/lead/wrong-number-alerts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Wrong number alerts", response.data);
      setWrongNumberAlerts(response.data.wrongNumberAlerts);
    } catch (error) {
      console.error("❌ Error fetching Wrong Number Alerts:", error);
      toast.error("Failed to fetch wrong number alerts");
    } finally {
      setAlerstLoading(false);
    }
  };

  const resolveWrongNumber = async (leadId, phoneNumber) => {
    try {
      console.log("Resolving wrong number for lead:", leadId, phoneNumber);
      await axios.post(
        `${backendUrl}/api/lead/resolve-wrong-number`,
        { leadId, phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Wrong number resolved successfully!");
      fetchWrongNumberAlerts();
    } catch (error) {
      console.error("❌ Error resolving wrong number:", error);
      toast.error("Failed to resolve wrong number");
    }
  };

  // Build dropdown options from alerts data
  const uniqueCompanies = useMemo(() => {
    const companies = wrongNumberAlerts.map((alert) => alert.companyName);
    return [...new Set(companies)];
  }, [wrongNumberAlerts]);

  const uniqueSalesEx = useMemo(() => {
    const salesExList = wrongNumberAlerts.map((alert) => alert.reportedBy);
    return [...new Set(salesExList)];
  }, [wrongNumberAlerts]);

  // Filter the alerts based on user input
  const filteredAlerts = useMemo(() => {
    return wrongNumberAlerts
      .filter((alert) => {
        const alertDate = new Date(alert.dateReported);
        const fromDate = filterFromDate ? new Date(filterFromDate) : null;
        const toDate = filterToDate ? new Date(filterToDate) : null;

        if (filterCompany && alert.companyName !== filterCompany) {
          return false;
        }
        if (filterSalesEx && alert.reportedBy !== filterSalesEx) {
          return false;
        }

        // Compare dates in "YYYY-MM-DD" format (ignoring time)
        if (fromDate && toDate) {
          if (alertDate < fromDate || alertDate > toDate) return false;
        } else if (fromDate && alertDate < fromDate) {
          return false;
        } else if (toDate && alertDate > toDate) {
          return false;
        }

        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          if (
            !alert.companyName.toLowerCase().includes(search) &&
            !alert.contactPerson.toLowerCase().includes(search) &&
            !alert.contactPhone.toLowerCase().includes(search) &&
            !alert.reportedBy.toLowerCase().includes(search)
          ) {
            return false;
          }
        }
        return true;
      })
      .slice() // Create a shallow copy
      .reverse(); // Show newest alerts first
  }, [
    wrongNumberAlerts,
    filterCompany,
    filterSalesEx,
    filterFromDate,
    filterToDate,
    searchTerm,
  ]);

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredAlerts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredAlerts.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Track a single expanded row id
  const [expandedRowId, setExpandedRowId] = useState(null);

  const toggleRowExpansion = (id) => {
    setExpandedRowId((prevId) => (prevId === id ? null : id));
  };

  return (
    <Layout>
      <div className="p-2">
        <h4 className="text-xl font-semibold mb-4">🚨 Wrong Number Alerts</h4>

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

          {/* Company Select */}
          <div className="flex flex-col w-full">
            <label htmlFor="comapnyname">Select Company</label>
            <select
              value={filterCompany}
              onChange={(e) => {
                setFilterCompany(e.target.value);
                setCurrentPage(0);
              }}
              id="comapnyname"
              className="px-2 py-1 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="">All Companies</option>
              {uniqueCompanies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          {/* Sales Executive Select */}
          <div className="flex flex-col w-full">
            <label htmlFor="selectsalesex">Select Sales Executive</label>
            <select
              value={filterSalesEx}
              onChange={(e) => {
                setFilterSalesEx(e.target.value);
                setCurrentPage(0);
              }}
              id="selectsalesex"
              className="px-2 py-1 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <option value="">All Sales Ex</option>
              {uniqueSalesEx.map((sales) => (
                <option key={sales} value={sales}>
                  {sales}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filters */}
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
                className="px-2 py-1 border border-gray-300 rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
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
                className="px-2 py-1 border border-gray-300 rounded-md w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                title="To Date"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                {/* S.No. hidden on mobile */}
                <th className="px-2 py-1 font-semibold text-sm text-left hidden sm:table-cell">
                  S.No.
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Company Name
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Contact Person
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Contact Phone
                </th>
                {/* Sales Ex hidden on mobile */}
                <th className="px-2 py-1 font-semibold text-sm text-left hidden sm:table-cell">
                  Sales Ex
                </th>
                {/* Reported Date hidden on mobile */}
                <th className="px-2 py-1 font-semibold text-sm text-left hidden sm:table-cell">
                  Reported Date
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Jump
                </th>
                <th className="px-2 py-1 font-semibold text-sm text-left">
                  Mark As Resolved
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {alertsLoading ? (
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
                  <td colSpan="7" className="text-center py-4">
                    No wrong number alerts found.
                  </td>
                </tr>
              ) : (
                currentPageData.map((alert, index) => (
                  <React.Fragment key={index}>
                    <tr
                      onClick={() => toggleRowExpansion(index)}
                      className="cursor-pointer divide-x divide-gray-200 border-b border-gray-200"
                    >
                      {/* S.No. visible on desktop */}
                      <td className="px-2 py-1 hidden sm:table-cell">
                        {offset + index + 1}
                      </td>
                      <td className="px-2 py-1">{alert.companyName}</td>
                      <td className="px-2 py-1">{alert.contactPerson}</td>
                      <td className="px-2 py-1">{alert.contactPhone}</td>
                      {/* Sales Ex visible on desktop */}
                      <td className="px-2 py-1 hidden sm:table-cell">
                        {alert.reportedBy}
                      </td>
                      {/* Reported Date visible on desktop */}
                      <td className="px-2 py-1 hidden sm:table-cell">
                        {new Date(alert.dateReported).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-2 py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent toggling row expansion
                            navigate(`/edit-lead/${alert.leadId}`);
                          }}
                          className="flex cursor-pointer items-center text-red-600 px-2 py-1 rounded hover:text-red-700"
                        >
                          <MdOutlineOpenInNew size={20} />
                        </button>
                      </td>
                      <td className="px-2 py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent toggling row expansion
                            resolveWrongNumber(
                              alert.leadId,
                              alert.contactPhone
                            );
                          }}
                          className="flex cursor-pointer items-center text-green-600 px-2 py-1 rounded hover:text-green-700"
                        >
                          <FaCheck size={16} />
                        </button>
                      </td>
                    </tr>
                    {/* Expanded section for mobile view */}
                    {expandedRowId === index && (
                      <tr className="sm:hidden">
                        <td colSpan="7" className="px-2 py-2 bg-gray-50">
                          <div className="flex flex-col gap-1">
                            <div>
                              <strong>Sales Ex:</strong> {alert.reportedBy}
                            </div>
                            <div>
                              <strong>Reported Date:</strong>{" "}
                              {new Date(alert.dateReported).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
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
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
          <div className="text-sm text-gray-700 order-1 sm:order-[0]">
            Showing {filteredAlerts.length === 0 ? 0 : offset + 1} to{" "}
            {offset + currentPageData.length} of {filteredAlerts.length} entries
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

export default Alerts;
