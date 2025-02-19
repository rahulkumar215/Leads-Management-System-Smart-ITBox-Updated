import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { MdEditSquare } from "react-icons/md";
import { DNA } from "react-loader-spinner";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

const SalesExecutiveLeads = () => {
  const { backendUrl, navigate } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  // States for leads, search, pagination & expanded rows
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedRows, setExpandedRows] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/lead/sales-executive/leads`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // If leads have a createdAt field, sort descending (latest first)
      const sortedLeads = response.data.leads.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setLeads(sortedLeads);
      setFilteredLeads(sortedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Error fetching leads");
    } finally {
      setLoading(false);
    }
  };

  // Search handler – filters by company name, industry, or status
  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);
    const filtered = leads.filter(
      (lead) =>
        (lead.companyName && lead.companyName.toLowerCase().includes(value)) ||
        (lead.industry && lead.industry.toLowerCase().includes(value)) ||
        (lead.status && lead.status.toLowerCase().includes(value))
    );
    setFilteredLeads(filtered);
    setCurrentPage(0);
  };

  // Pagination calculation
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredLeads.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredLeads.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Toggle expanded row (to show contact details)
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="p-2 min-h-screen">
        <h3 className="text-lg font-semibold flex items-center gap-1 mb-2">
          Leads List <span className="text-sm">({leads.length})</span>{" "}
        </h3>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search by anything..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <div
          className="overflow-x-auto shadow-md rounded-lg border border-gray-300"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-[#173B45] text-[#F8EDED] sticky top-0 z-10">
              <tr>
                <th className="py-2 text-sm min-w-16 font-semibold">Lead Id</th>
                <th className="px-2 py-2 text-sm text-left font-semibold hidden md:table-cell">
                  Created At
                </th>
                <th className="px-2 py-2 min-w-30 text-left text-sm font-semibold">
                  Company Name
                </th>
                <th className="px-2 py-2 min-w-30 text-left text-sm font-semibold hidden md:table-cell">
                  Industry
                </th>
                <th className="px-2 py-2 text-left text-sm font-semibold hidden md:table-cell">
                  Contacts
                </th>
                <th className="px-2 py-2 text-sm text-left font-semibold">
                  Status
                </th>
                <th className="px-4 py-2 text-sm font-semibold">
                  Data Analyst
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan="8">
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
              ) : currentPageData.length > 0 ? (
                currentPageData.map((lead) => (
                  <React.Fragment key={lead._id}>
                    <tr
                      onClick={() => toggleRowExpansion(lead._id)}
                      className="border-b divide-x divide-gray-200 border-gray-200 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <td
                        className={`px-2 py-1 uppercase font-semibold ${
                          lead.status === "open"
                            ? "text-blue-600"
                            : "text-red-600"
                        }`}
                      >
                        {lead._id.slice(-5)}
                      </td>
                      <td className="px-2 py-1 hidden md:table-cell">
                        {new Date(lead.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="px-2 py-1 capitalize font-semibold text-gray-800">
                        {lead.companyName}{" "}
                      </td>
                      <td className="px-2 py-1 capitalize font-semibold text-gray-800 hidden md:table-cell">
                        {lead.industry}
                      </td>
                      <td className="px-2 py-1 capitalize font-semibold text-gray-800 hidden md:table-cell">
                        {lead.contactPoints?.length || 0}
                      </td>
                      <td
                        className={`px-2 py-1 capitalize font-semibold ${
                          lead.status === "open"
                            ? "text-blue-600"
                            : "text-red-600"
                        }`}
                      >
                        <span
                          className={`${
                            lead.status === "draft" &&
                            "px-2 border border-gray-400 rounded-lg bg-gray-200 text-gray-700"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td
                        className={`px-2 py-1 text-center capitalize ${
                          !lead.createdBy.slice(-5).toUpperCase()
                            ? "text-red-500 font-semibold"
                            : ""
                        }`}
                      >
                        {lead.createdBy.slice(-5).toUpperCase() ||
                          "Not Assigned"}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <button
                          className="px-3 py-1 text-green-600 cursor-pointer rounded hover:text-green-700 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/manage/contact/${lead._id}`);
                          }}
                        >
                          <FaEdit size={20} />
                        </button>
                      </td>
                    </tr>
                    {/* Expanded Section */}
                    {expandedRows.includes(lead._id) && (
                      <tr className="bg-gray-50">
                        <td
                          colSpan="8"
                          className="px-4 py-2 text-sm text-gray-700"
                        >
                          {lead.contactPoints.length > 0 ? (
                            <table className="w-full border-collapse border border-gray-300">
                              <thead className="bg-gray-200">
                                <tr>
                                  <th className="border border-gray-300 px-2 py-1 text-left text-xs font-semibold">
                                    S. No.
                                  </th>
                                  <th className="border border-gray-300 px-2 py-1 text-left text-xs font-semibold">
                                    Client Name
                                  </th>
                                  <th className="border border-gray-300 px-2 py-1 text-left text-xs font-semibold">
                                    Email
                                  </th>
                                  <th className="border border-gray-300 px-2 py-1 text-left text-xs font-semibold">
                                    Mobile No
                                  </th>
                                  <th className="border border-gray-300 px-2 py-1 text-left text-xs font-semibold">
                                    Address
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {lead.contactPoints.map((contact, index) => (
                                  <tr
                                    key={contact.email || index}
                                    className="border-b border-gray-200 divide-x divide-gray-200 hover:bg-gray-50 cursor-pointer sm:cursor-default"
                                  >
                                    <td className="px-2 py-1 text-sm">
                                      {index + 1}
                                    </td>
                                    <td className="px-2 py-1 text-sm">
                                      {contact.name || "N/A"}
                                    </td>
                                    <td className="px-2 py-1 text-sm">
                                      {contact.email || "N/A"} /{" "}
                                      {contact.alternateEmail || "N/A"}
                                    </td>
                                    <td className="px-2 py-1 text-sm">
                                      {contact.phone || "N/A"} /{" "}
                                      {contact.alternatePhone || "N/A"}
                                    </td>
                                    <td className="px-2 py-1 text-sm">
                                      {contact.address || "N/A"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : null}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
          <div className="text-sm text-gray-700 order-1 sm:order-[0]">
            Showing {filteredLeads.length === 0 ? 0 : offset + 1} to{" "}
            {offset + currentPageData.length} of {filteredLeads.length} entries
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
    </Layout>
  );
};

export default SalesExecutiveLeads;
