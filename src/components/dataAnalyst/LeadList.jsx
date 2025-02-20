import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { MdOutlineOpenInNew } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { DNA } from "react-loader-spinner";
import { FaEdit } from "react-icons/fa";

const LeadList = () => {
  const { backendUrl, navigate } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/lead/get-all-leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedLeads = response.data.allLeads.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Sort by latest date
      );

      setLeads(sortedLeads);
      setFilteredLeads(sortedLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);
    setFilteredLeads(
      leads.filter((lead) =>
        Object.values(lead).some(
          (field) => field && field.toString().toLowerCase().includes(value)
        )
      )
    );
    setCurrentPage(0);
  };

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredLeads.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredLeads.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const [expandedRows, setExpandedRows] = useState([]);
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => (prev.includes(id) ? [] : [id]));
  };

  return (
    <Layout>
      <div className="p-2 min-h-screen">
        <h3 className="text-lg font-semibold flex items-center gap-1 mb-2">
          Leads List <span className="text-sm">({leads.length})</span>{" "}
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between mb-4">
          <input
            type="text"
            placeholder="Search by anything..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-md shadow-sm w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <button
            className="px-4 py-2 flex justify-center  items-center gap-2 bg-red-600 text-white w-full sm:w-fit cursor-pointer rounded-md hover:bg-red-700 focus:outline-none"
            onClick={() => navigate("/create-lead")}
          >
            <FiPlus size={20} />
            Add Lead
          </button>
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
                  Sales Executive
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
                    <div className="flex justify-center py-4">
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
                          !lead.assignedToSalesExecutive?.name
                            ? "text-red-500 font-semibold"
                            : ""
                        }`}
                      >
                        {lead.assignedToSalesExecutive?.name || "Not Assigned"}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <button
                          className="px-3 py-1 text-green-600 cursor-pointer rounded hover:text-green-700 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/edit-lead/${lead._id}`);
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
};

export default LeadList;

// <div className="overflow-x-auto border border-gray-300 rounded-md shadow">
//   <table className="min-w-full">
//     <thead className="bg-gray-800 text-white text-left ">
//       <tr>
//         <th className="p-2 font-semibold text-sm">Company</th>
//         <th className="p-2 font-semibold text-sm">Industry</th>
//         <th className="p-2 font-semibold text-sm">Sales Executive</th>
//         <th className="p-2 font-semibold text-sm">Contacts</th>
//         <th className="p-2 font-semibold text-sm">Status</th>
//         <th className="p-2 font-semibold text-sm">Action</th>
//       </tr>
//     </thead>
//     <tbody>
//       {loading ? (
//         <tr>
//           <td colSpan="6">
//             <div className="flex justify-center py-4">
//               <DNA
//                 visible={true}
//                 height="40"
//                 width="40"
//                 ariaLabel="dna-loading"
//                 wrapperClass="dna-wrapper"
//               />
//             </div>
//           </td>
//         </tr>
//       ) : (
//         currentPageData.map((lead) => (
//           <React.Fragment key={lead._id}>
//             <tr
//               onClick={() => toggleRowExpansion(lead._id)}
//               className=" cursor-pointer hover:bg-gray-100 border-b border-gray-200 divide-x divide-gray-200   "
//             >
//               <td className="px-2 py-1">{lead.companyName}</td>
//               <td className="px-2 py-1">{lead.industry}</td>
//               <td className="px-2 py-1">
//                 {lead.assignedToSalesExecutive?.name || "N/A"}
//               </td>
//               <td className="px-2 py-1">
//                 {lead.contactPoints?.length || 0}
//               </td>
//               <td className="px-2 py-1">{lead.status}</td>
//               <td className="px-2 py-1 text-left">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/edit-lead/${lead._id}`);
//                   }}
//                   className="text-green-600 cursor-pointer hover:text-green-800"
//                 >
//                   <MdOutlineOpenInNew size={20} />
//                 </button>
//               </td>
//             </tr>
//           </React.Fragment>
//         ))
//       )}
//     </tbody>
//   </table>
// </div>;

// import React, { useContext, useEffect } from "react";
// import Layout from "../common/Layout";
// import { FiPlus } from "react-icons/fi";
// import { MdEditSquare } from "react-icons/md";
// import { Navigate, useNavigate } from "react-router-dom";

// import Paper from "@mui/material/Paper";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TablePagination from "@mui/material/TablePagination";
// import TableRow from "@mui/material/TableRow";
// import { ThemeContext } from "../../context/ThemeContext";
// import axios from "axios";

// const columns = [
//   { id: "companyName", label: "Company", minWidth: 170 },
//   { id: "industry", label: "Industry", minWidth: 100 },
//   {
//     id: "assignedToSalesExecutive",
//     label: "Sales Executive",
//     minWidth: 170,
//     align: "right",
//   },
//   {
//     id: "contactPoints",
//     label: "Total Contacts",
//     minWidth: 170,
//     align: "right",
//   },
//   { id: "status", label: "Status", minWidth: 170, align: "right" },
//   { id: "actions", label: "Action", minWidth: 100, align: "center" },
// ];

// // function createData(name, code, population, size) {
// //   const density = population / size;
// //   return { name, code, population, size, density };
// // }

// const LeadList = () => {
//   const { backendUrl, navigate, leadData, setLeadData } =
//     useContext(ThemeContext);

//   console.log(backendUrl);

//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   const token = localStorage.getItem("token"); // Retrieve the token

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   useEffect(() => {
//     const getAllLeads = async () => {
//       try {
//         const response = await axios.get(
//           backendUrl + `/api/lead/get-all-leads`,
//           {
//             headers: { Authorization: `Bearer ${token}` }, // ✅ Pass token in headers
//           }
//         );
//         if (response.data.success) {
//           console.log(response.data.allLeads);
//           setLeadData(response.data.allLeads);
//         }
//       } catch (error) {
//         console.log(error, "Error:- While getting all leads");
//       }
//     };

//     getAllLeads();
//   }, [backendUrl, setLeadData]);

//   const reversedLeadData = [...leadData].reverse();

//   return (
//     <div>
//       <Layout>
//         <div className="row">
//           <div className="col-lg-12">
//             <div className="heading_btn">
//               <h3>Leads list</h3>
//               <button
//                 onClick={() => navigate("/create-lead")}
//                 className="global_btn"
//               >
//                 Add Lead <FiPlus />
//               </button>
//             </div>

//             <div>
//               <div className="leads_table">
//                 <Paper sx={{ width: "100%", overflow: "hidden" }}>
//                   <TableContainer sx={{ maxHeight: 440 }}>
//                     <Table stickyHeader aria-label="sticky table">
//                       <TableHead>
//                         <TableRow>
//                           {columns.map((column) => (
//                             <TableCell
//                               key={column.id}
//                               align={column.align}
//                               style={{ minWidth: column.minWidth }}
//                             >
//                               {column.label}
//                             </TableCell>
//                           ))}
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {reversedLeadData
//                           .slice(
//                             page * rowsPerPage,
//                             page * rowsPerPage + rowsPerPage
//                           )
//                           .map((row) => {
//                             return (
//                               <TableRow
//                                 hover
//                                 role="checkbox"
//                                 tabIndex={-1}
//                                 key={row._id}
//                               >
//                                 {columns.map((column) => {
//                                   if (column.id === "actions") {
//                                     return (
//                                       <TableCell
//                                         key={column.id}
//                                         align={column.align}
//                                       >
//                                         <button
//                                           className="icon_btn"
//                                           onClick={() =>
//                                             navigate(`edit-lead/${row._id}`)
//                                           }
//                                         >
//                                           <MdEditSquare />
//                                         </button>
//                                       </TableCell>
//                                     );
//                                   }

//                                   let value = row[column.id];

//                                   // Handle specific cases for fields that are objects or arrays
//                                   if (
//                                     column.id === "assignedToSalesExecutive" &&
//                                     value
//                                   ) {
//                                     value = value.name || "N/A"; // Extract the `name` property from the object
//                                   }

//                                   if (
//                                     column?.id === "contactPoints" &&
//                                     Array.isArray(value)
//                                   ) {
//                                     value = value?.length; // Show the count of contact points
//                                   }
//                                   {
//                                     /* const value = column.id === 'contactPoints'
//                               ? row.contactPoints.length
//                               : row[column.id]; */
//                                   }
//                                   return (
//                                     <TableCell
//                                       key={column.id}
//                                       align={column.align}
//                                     >
//                                       {/* {value} */}
//                                       {typeof value === "object" &&
//                                       value !== null
//                                         ? JSON.stringify(value) // Convert objects to string for debug visibility
//                                         : value || "0"}
//                                     </TableCell>
//                                   );
//                                 })}
//                               </TableRow>
//                             );
//                           })}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   <TablePagination
//                     rowsPerPageOptions={[10, 25, 100]}
//                     component="div"
//                     count={leadData.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                   />
//                 </Paper>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     </div>
//   );
// };

// export default LeadList;
