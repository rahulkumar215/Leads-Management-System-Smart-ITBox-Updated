import React, { useState } from "react";
import ReactPaginate from "react-paginate";

// Contact Persons Table with Pagination and Mobile Expandable Rows
export function ContactPersonsTable({ contactPoints, className = "" }) {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  // Track the index of the expanded row (only used on mobile)
  const [expandedRowIndex, setExpandedRowIndex] = useState(null);

  const pageCount = Math.ceil(contactPoints?.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    // Collapse any expanded row when changing pages
    setExpandedRowIndex(null);
  };

  const offset = currentPage * itemsPerPage;
  const currentData = contactPoints?.slice(offset, offset + itemsPerPage);

  // Toggle expanded state (only one row open at a time)
  const handleRowClick = (idx) => {
    setExpandedRowIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className={`contact-points sm:mt-10 ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Contact Persons</h3>
      <div
        className="overflow-x-auto shadow-md rounded-lg border border-gray-200"
        style={{ scrollbarWidth: "thin" }}
      >
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-[#173B45] text-[#F8EDED] sticky top-0 z-10">
            <tr>
              <th className="px-2 py-1 text-sm font-semibold">Name</th>
              <th className="px-2 py-1 text-sm font-semibold">Designation</th>
              {/* These columns are hidden on mobile */}
              <th className="px-2 py-1 text-sm font-semibold hidden sm:table-cell">
                Email / Alt Email
              </th>
              <th className="px-2 py-1 text-sm font-semibold hidden sm:table-cell">
                Phone / Alt Phone
              </th>
              <th className="px-2 py-1 text-sm font-semibold hidden sm:table-cell">
                Whatsapp
              </th>
              <th className="px-2 py-1 text-sm font-semibold">
                Growth Manager
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentData?.map((person, idx) => (
              // Use a Fragment so we can return the main row and an optional expanded row
              <React.Fragment key={offset + idx}>
                <tr
                  onClick={() => handleRowClick(idx)}
                  className="border-b border-gray-200 divide-x divide-gray-200 hover:bg-gray-50 cursor-pointer sm:cursor-default"
                >
                  <td className="px-2 py-1 text-sm">{person.name}</td>
                  <td className="px-2 py-1 text-sm">
                    {person.designation || "Unknown"}
                  </td>
                  {/* Hidden on mobile */}
                  <td className="px-2 py-1 text-sm hidden sm:table-cell">
                    {person.email || "N/A"} / {person.alternateEmail || "N/A"}
                  </td>
                  <td className="px-2 py-1 text-sm hidden sm:table-cell">
                    {person.phone || "N/A"} / {person.alternatePhone || "N/A"}
                  </td>
                  <td className="px-2 py-1 text-sm hidden sm:table-cell">
                    {person.whatsappNumber || "N/A"}
                  </td>
                  <td
                    className={`px-2 py-1 text-sm ${
                      person.assignedToGrowthManager === "Not Assigned"
                        ? "text-red-500 font-semibold"
                        : ""
                    }`}
                  >
                    {person.assignedToGrowthManager}
                  </td>
                </tr>

                {/* Expanded row: visible only on mobile */}
                {expandedRowIndex === idx && (
                  <tr className="sm:hidden bg-gray-50">
                    <td colSpan="6" className="px-2 py-2">
                      <div className="flex flex-col space-y-1 text-sm">
                        <div>
                          <span className="font-semibold">Email:</span>{" "}
                          {person.email || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">
                            Alternate Email:
                          </span>{" "}
                          {person.alternateEmail || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">Phone:</span>{" "}
                          {person.phone || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">
                            Alternate Phone:
                          </span>{" "}
                          {person.alternatePhone || "N/A"}
                        </div>
                        <div>
                          <span className="font-semibold">Whatsapp:</span>{" "}
                          {person.whatsappNumber || "N/A"}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing {offset + 1} to {offset + currentData.length} of{" "}
            {contactPoints.length} entries
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
      )}
    </div>
  );
}
