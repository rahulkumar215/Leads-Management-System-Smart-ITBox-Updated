import { useContext, useEffect, useState, useMemo } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DNA } from "react-loader-spinner";
import Layout from "../common/Layout";
import { useNavigate } from "react-router-dom";
import { MdOutlineOpenInNew } from "react-icons/md";

function SalesExecutiveFollowUps() {
  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  // State for follow-up alerts and loading indicator
  const [followUpAlerts, setFollowUpAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterFollowUpType, setFilterFollowUpType] = useState("");

  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 30;

  useEffect(() => {
    const fetchFollowUpAlerts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/lead/sales-executive/getTATAlerts`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // We assume that the API returns followUpAlerts in the response
        setFollowUpAlerts(response.data.followUpAlerts);
        console.log("Follow-Up Alerts", response.data.followUpAlerts);
      } catch (error) {
        console.error(
          "❌ Error fetching follow-up alerts:",
          error.response?.data || error.message
        );
        toast.error("Failed to fetch follow-up alerts");
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUpAlerts();
  }, [backendUrl, token]);

  // Build dropdown options for company filter
  const uniqueCompanies = useMemo(() => {
    const companies = followUpAlerts.map((alert) => alert.companyName);
    return [...new Set(companies)];
  }, [followUpAlerts]);

  const uniqueAlertTypes = useMemo(() => {
    const companies = followUpAlerts.map((alert) => alert.followUpType);
    return [...new Set(companies)];
  }, [followUpAlerts]);

  // Filter follow-up alerts based on search, company, and date range
  const filteredAlerts = useMemo(() => {
    return followUpAlerts
      .filter((alert) => {
        if (filterCompany && alert.companyName !== filterCompany) {
          return false;
        }

        if (
          filterFollowUpType &&
          alert.followUpType &&
          alert.followUpType !== filterFollowUpType
        ) {
          return false;
        }

        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          if (
            !alert.contactName.toLowerCase().includes(search) &&
            !alert.companyName.toLowerCase().includes(search) &&
            !alert.followUpType.toLowerCase().includes(search) &&
            !(
              alert.followUpTime &&
              alert.followUpTime.toLowerCase().includes(search)
            )
          ) {
            return false;
          }
        }
        return true;
      })
      .slice() // create a shallow copy
      .reverse(); // Show newest alerts first
  }, [followUpAlerts, filterCompany, filterFollowUpType, searchTerm]);

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredAlerts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredAlerts.length / itemsPerPage);
  const handlePageChange = ({ selected }) => setCurrentPage(selected);

  return (
    <Layout>
      <div className="p-2">
        <h5 className="text-xl font-semibold mb-4">📅 Today's Follow-Ups</h5>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-[2fr_repeat(2,_1fr)] gap-2 sm:gap-4 items-center mb-4">
          <div className="flex flex-col w-full col-start-1 col-span-2 sm:col-span-1 order-1 sm:order-[0]">
            <label
              htmlFor="searchbar"
              className="text-sm sm:mb-1 hidden sm:block"
            >
              &nbsp;
            </label>
            <input
              type="text"
              placeholder="Search by name, company, or type..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="selectsalesex">Select Sales Executive</label>
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

          <div className="flex flex-col w-full">
            <label htmlFor="selectsalesex">Select Sales Executive</label>
            <select
              value={filterFollowUpType}
              onChange={(e) => {
                setFilterFollowUpType(e.target.value);
                setCurrentPage(0);
              }}
              className="px-2 py-1 border border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              {uniqueAlertTypes.map((alerrt) => (
                <option key={alerrt} value={alerrt}>
                  {alerrt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Follow-Up Alerts */}
        <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300 max-h-[30rem]">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-800 text-white text-left">
              <tr>
                <th className="px-2 py-1 text-sm font-semibold">S.No.</th>
                <th className="px-2 py-1 text-sm font-semibold min-w-22">
                  Time
                </th>
                <th className="px-2 py-1 text-sm font-semibold">Lead Id.</th>
                <th className="px-2 py-1 text-sm font-semibold min-w-36">
                  Company
                </th>
                <th className="px-2 py-1 text-sm font-semibold min-w-36">
                  Contact Name
                </th>
                <th className="px-2 py-1 text-sm font-semibold">Type</th>
                <th className="px-2 py-1 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
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
                  <td colSpan="7" className="text-center py-2">
                    No follow-up alerts found.
                  </td>
                </tr>
              ) : (
                currentPageData.map((alert, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 divide-x divide-gray-200"
                  >
                    <td className="px-2 py-1">{offset + index + 1}</td>
                    <td className="px-2 py-1">
                      {alert.followUpTime
                        ? new Date(
                            `1970-01-01T${alert.followUpTime}`
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true, // ✅ Converts to 12-hour format
                          })
                        : "Not Set"}
                    </td>
                    <td className="px-2 py-1 text-green-700 font-semibold">
                      {alert.leadId.slice(-5).toUpperCase()}
                    </td>
                    <td className="px-2 py-1 text-gray-700 font-semibold">
                      {alert.companyName}
                    </td>
                    <td className="px-2 py-1 ">{alert.contactName}</td>

                    <td className="px-2 py-1 capitalize">
                      {alert.followUpType}
                    </td>
                    <td className="px-2 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent toggling row expansion
                          navigate(`/manage/contact/${alert.leadId}`);
                        }}
                        className="flex cursor-pointer items-center text-green-600 px-2 py-1 rounded hover:text-green-700"
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
        <div className="flex flex-col md:flex-row justify-between gap-4 items-center mt-4">
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
        <ToastContainer />
      </div>
    </Layout>
  );
}

export default SalesExecutiveFollowUps;
