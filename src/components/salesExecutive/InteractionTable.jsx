import { useState, useMemo } from "react";
import ReactPaginate from "react-paginate";

export const InteractionsTable = ({ interactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterContactName, setFilterContactName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const uniqueContacts = useMemo(
    () => [...new Set(interactions.map((i) => i.contactName))],
    [interactions]
  );

  const filteredInteractions = useMemo(() => {
    return interactions
      .filter((interaction) => {
        const matchesSearch = Object.values(interaction).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesType = filterType
          ? interaction.interactionType === filterType
          : true;
        const matchesContact = filterContactName
          ? interaction.contactName === filterContactName
          : true;
        let matchesDate = true;
        if (filterStartDate) {
          matchesDate = new Date(interaction.date) >= new Date(filterStartDate);
        }
        if (filterEndDate) {
          matchesDate =
            matchesDate &&
            new Date(interaction.date) <= new Date(filterEndDate);
        }
        return matchesSearch && matchesType && matchesContact && matchesDate;
      })
      .slice() // create a shallow copy
      .reverse(); // show newest interactions first
  }, [
    interactions,
    searchTerm,
    filterType,
    filterContactName,
    filterStartDate,
    filterEndDate,
  ]);

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredInteractions.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredInteractions.length / itemsPerPage);

  return (
    <div className="">
      <h3 className="text-xl font-semibold text-gray-600 mb-2">
        Interactions Record
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-[2fr_repeat(4,_1fr)] gap-2 sm:gap-4 items-center mb-4">
        <div className="flex flex-col w-full col-start-1 col-span-2 sm:col-span-1 order-1 sm:order-[0]">
          <label
            htmlFor="searchbar"
            className="text-sm sm:mb-1 hidden sm:block"
          >
            &nbsp;
          </label>
          <input
            type="text"
            placeholder="Search interactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="comapnyname">Select Contact Person</label>
          <select
            value={filterContactName}
            onChange={(e) => {
              setFilterContactName(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md"
          >
            <option value="">All Contacts</option>
            {uniqueContacts.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="">Select Interaction Type</label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md"
          >
            <option value="">All Types</option>
            <option value="call">Call</option>
            <option value="mail">Mail</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="comapnyname">From Date</label>
          <input
            type="date"
            value={filterStartDate}
            onChange={(e) => {
              setFilterStartDate(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="comapnyname">To Date</label>
          <input
            type="date"
            value={filterEndDate}
            onChange={(e) => {
              setFilterEndDate(e.target.value);
              setCurrentPage(0);
            }}
            className="px-2 py-1 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-800 text-white text-left">
            <tr>
              <th className="px-2 py-1 font-semibold text-sm">S. No.</th>
              <th className="px-2 py-1 font-semibold text-sm">Date</th>
              <th className="px-2 py-1 font-semibold text-sm">Contact Name</th>
              <th className="px-2 py-1 font-semibold text-sm">
                Interaction Type
              </th>
              <th className="px-2 py-1 font-semibold text-sm">Status</th>
              <th className="px-2 py-1 font-semibold text-sm">Interested</th>
              <th className="px-2 py-1 font-semibold text-sm min-w-28">
                Next Follow Up
              </th>
              <th className="px-2 py-1 font-semibold text-sm min-w-52">
                Remark
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((interaction, index) => (
              <tr
                key={interaction._id}
                className="border-b border-gray-200 divide-x divide-gray-200"
              >
                <td className="px-2 py-1">{offset + index + 1}</td>
                <td className="px-2 py-1">
                  {new Date(interaction.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
                <td className="px-2 py-1">{interaction.contactName}</td>
                <td className="px-2 py-1 capitalize">
                  {interaction.interactionType}
                </td>
                <td className="px-2 py-1">
                  {interaction.interactionType === "mail"
                    ? interaction.mailStatus
                    : interaction.interactionType === "call"
                    ? interaction.callStatus
                    : interaction.interactionType === "linkedin"
                    ? interaction.linkedInStatus
                    : ""}
                </td>
                <td className="px-2 py-1">
                  {interaction.interestStatus || ""}
                </td>
                <td className="px-2 py-1">
                  {interaction.followUpDate ? (
                    <>
                      {new Date(interaction.followUpDate).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        }
                      )}{" "}
                      at{" "}
                      {new Date(
                        `1970-01-01T${interaction.followUpTime}`
                      ).toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </>
                  ) : (
                    ""
                  )}
                </td>
                <td className="px-2 py-1">{interaction.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center mt-4">
        <div className="text-sm text-gray-700 order-1 sm:order-[0]">
          Showing {filteredInteractions.length === 0 ? 0 : offset + 1} to{" "}
          {offset + currentPageData.length} of {filteredInteractions.length}{" "}
          entries
        </div>
        <ReactPaginate
          previousLabel={"Prev"}
          nextLabel={"Next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={({ selected }) => setCurrentPage(selected)}
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

      {/* Pagination
      <div className="flex justify-center items-center mt-4">
        <ReactPaginate
          previousLabel={"← Prev"}
          nextLabel={"Next →"}
          pageCount={pageCount}
          onPageChange={({ selected }) => setCurrentPage(selected)}
          containerClassName="flex space-x-2"
          previousClassName="px-3 py-1 border rounded-md bg-gray-200"
          nextClassName="px-3 py-1 border rounded-md bg-gray-200"
          activeClassName="bg-blue-500 text-white px-3 py-1 rounded-md"
          pageClassName="px-3 py-1 border rounded-md cursor-pointer"
          disabledClassName="opacity-50 cursor-not-allowed"
        />
      </div> */}
    </div>
  );
};
