import { Layout } from "antd";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

export function RenderLeads({ leads, userType, selectedUser }) {
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (leads) {
      setFilteredLeads(leads);
    }
  }, [leads, userType, selectedUser]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Updated global search: uses the passed query value directly
  const applySearch = (data, query) => {
    if (!query.trim()) {
      setFilteredLeads(data);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = data.filter((lead) =>
      Object.values(lead)
        .filter((value) => value !== null && value !== undefined)
        .some((value) => value.toString().toLowerCase().includes(lowerQuery))
    );
    setFilteredLeads(filtered);
  };

  const handleSearchChange = (event) => {
    const newValue = event.target.value;
    setSearchQuery(newValue);
    applySearch(leads, newValue);
    setCurrentPage(0);
  };

  // Helper function to mark new leads (created today)
  const isNewLead = (createdAt) => {
    if (!createdAt) return false;

    const leadDate = new Date(createdAt);
    const today = new Date();

    if (isNaN(leadDate)) return false; // Check if createdAt is a valid date

    // Convert both dates to UTC midnight for comparison
    const leadMidnight = Date.UTC(
      leadDate.getFullYear(),
      leadDate.getMonth(),
      leadDate.getDate()
    );

    const todayMidnight = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return leadMidnight === todayMidnight;
  };

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredLeads.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredLeads.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // const [expandedRows, setExpandedRows] = useState([]);
  // const toggleRowExpansion = (id) => {
  //   setExpandedRows((prev) => (prev.includes(id) ? [] : [id]));
  // };

  return (
    <Layout>
      <div className="p-2" style={{ minHeight: "100vh" }}>
        <h4 className="text-lg font-semibold mb-2">
          All Leads <span className="text-sm">({leads.length})</span>
        </h4>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search by anything..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-2 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-slate-500"
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
                <th className="px-2 py-2 text-sm text-left font-semibold">
                  Status
                </th>
                {(userType === "growth_manager" ||
                  userType === "sales_executive") && (
                  <th className="px-4 py-2 text-sm font-semibold hidden md:table-cell">
                    Data Analyst
                  </th>
                )}

                {(userType === "growth_manager" ||
                  userType === "data_analyst") && (
                  <th className="px-4 py-2 text-sm font-semibold">
                    Sales Executive
                  </th>
                )}

                {(userType === "sales_executive" ||
                  userType === "data_analyst") && (
                  <th className="px-4 py-2 text-right text-sm font-semibold hidden md:table-cell">
                    Growth Manager
                  </th>
                )}
                {/* <th className="px-4 py-2 text-center text-sm font-semibold">
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white">
              {currentPageData.length > 0 ? (
                currentPageData.map((lead) => (
                  <React.Fragment key={lead._id}>
                    <tr
                      // onClick={() => toggleRowExpansion(lead._id)}
                      className="border-b divide-x divide-gray-200 border-gray-200 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-2 py-1 text-center uppercase text-gray-800 font-semibold">
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
                        {isNewLead(lead.createdAt) && (
                          <span className="bg-green-600 text-white text-xs px-1 rounded ml-2">
                            New
                          </span>
                        )}
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
                            "px-1 border border-gray-400 rounded-lg bg-gray-200 text-gray-700"
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>

                      {(userType === "growth_manager" ||
                        userType === "sales_executive") && (
                        <td
                          className={`px-2 py-1 text-center hidden md:table-cell capitalize ${
                            lead.createdBy.name === "N/A"
                              ? "text-red-500 font-semibold"
                              : ""
                          }`}
                        >
                          {lead.createdBy.name ||
                            lead.createdBy?.slice(-5).toUpperCase() ||
                            "N/A"}
                        </td>
                      )}

                      {(userType === "growth_manager" ||
                        userType === "data_analyst") && (
                        <td
                          className={`px-2 py-1 text-center capitalize ${
                            lead.assignedToSalesExecutive?.name ===
                            "Not Assigned"
                              ? "text-red-500 font-semibold"
                              : ""
                          }`}
                        >
                          {lead.assignedToSalesExecutive?.name ||
                            lead.assignedToSalesExecutive
                              ?.slice(-5)
                              .toUpperCase() ||
                            "Not Assigned"}
                        </td>
                      )}

                      {(userType === "sales_executive" ||
                        userType === "data_analyst") && (
                        <td
                          className={`px-2 py-1 text-right hidden md:table-cell capitalize ${
                            lead.contactPoints[0]?.assignedToGrowthManager
                              ?.name === "Not Assigned"
                              ? "text-red-500 font-semibold"
                              : ""
                          }`}
                        >
                          {lead?.contactPoints[0]?.assignedToGrowthManager
                            ?.name || "Not Assigned"}
                        </td>
                      )}

                      {/* <td className="px-2 py-1 text-center">
                        <button
                          className="px-3 py-1 text-green-600 cursor-pointer rounded hover:text-green-700 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/lead-details/${lead._id}`);
                          }}
                        >
                          <MdOutlineOpenInNew size={20} />
                        </button>
                      </td> */}
                    </tr>
                    {/* Expanded Section */}
                    {/* {expandedRows.includes(lead._id) && (
                      <tr className="bg-gray-50">
                        <td colSpan="8" className="px-4 py-2">
                          <div className="hidden md:flex justify-start gap-8">
                            <div>
                              <strong>Industry:</strong> {lead.industry}
                            </div>
                            <div>
                              <strong>Contact Points:</strong>{" "}
                              {lead?.contactPoints.length || 0}
                            </div>
                            <div>
                              <strong>Company Lost:</strong>{" "}
                              {lead.isCompanyLost ? "Yes" : "No"}
                            </div>
                            {lead.isCompanyLost && (
                              <div>
                                <strong>Lost Reason:</strong>{" "}
                                {lead.companyLostReason || "-"}
                              </div>
                            )}
                          </div>
                          <div className="block md:hidden">
                            <div className="mb-1">
                              <strong>Industry:</strong> {lead.industry}
                            </div>
                            <div className="mb-1">
                              <strong>Data Analyst:</strong>{" "}
                              {lead.createdBy || "N/A"}
                            </div>
                            <div className="mb-1">
                              <strong>Growth Manager:</strong>{" "}
                              {lead.assignedToGrowthManager || "Not Assigned"}
                            </div>
                            <div className="mb-1">
                              <strong>Contact Points:</strong>{" "}
                              {lead?.contactPointsCount || 0}
                            </div>
                            <div className="mb-1">
                              <strong>Company Lost:</strong>{" "}
                              {lead.isCompanyLost ? "Yes" : "No"}
                            </div>
                            {lead.isCompanyLost && (
                              <div className="mb-1">
                                <strong>Lost Reason:</strong>{" "}
                                {lead.companyLostReason || "-"}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )} */}
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
          <div className="text-sm text-gray-700">
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
}
