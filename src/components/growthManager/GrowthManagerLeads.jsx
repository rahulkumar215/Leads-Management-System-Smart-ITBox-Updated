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
  const itemsPerPage = 30;

  const getAllGrowthLeads = async () => {
    setLoading(true);

    try {
      console.log("Fetching Growth Manager Leads...");

      const response = await axios.get(
        backendUrl + `/api/lead/get-all-growth-manager-lead`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Full API Response:", response); // Check the full API response

      if (response?.data?.success) {
        const sortedLeads = response.data.leads.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt) // Sort by latest date
        );
        console.log("Growth Manager Leads:", response.data.leads);
        setLeads(sortedLeads || []); // Ensure state is updated
        setFilteredLeads(sortedLeads || []);
      } else {
        console.log("API call did not return success:", response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching Growth Manager Leads:",
        error?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllGrowthLeads();
  }, []);

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

  const getStatusStyles = (status) => {
    switch (status) {
      case "open":
        return "border-blue-300 bg-blue-100 text-blue-600";
      case "closed":
        return "border-red-300 bg-red-100 text-red-700";
      case "lost":
        return "border-red-300 bg-red-100 text-red-700";
      case "win":
        return "border-green-300 bg-green-100 text-green-700";
      case "draft":
        return "border-gray-300 bg-gray-100 text-gray-700";
      default:
        return "border-gray-300 bg-gray-100 text-gray-700";
    }
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
            className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-md shadow-sm w-full  focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>

        <div
          className="overflow-x-auto shadow-md rounded-lg border border-gray-300 max-h-[30rem]"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-[#173B45] text-[#F8EDED] sticky top-0 z-10">
              <tr>
                <th className="py-2 text-sm font-semibold">S. No.</th>
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
                {/* <th className="px-4 py-2 text-sm font-semibold">
                  Data Analyst
                </th>
                <th className="px-4 py-2 text-sm font-semibold">
                  Sales Executive
                </th> */}
                <th className="px-4 py-2 text-center text-sm font-semibold">
                  Manage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan="9">
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
                currentPageData.map((lead, i) => (
                  <React.Fragment key={lead._id}>
                    <tr
                      onClick={() => toggleRowExpansion(lead._id)}
                      className="border-b divide-x divide-gray-200 border-gray-200 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-2 py-1 text-center font-semibold">
                        {offset + i + 1}
                      </td>
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
                      <td className="px-2 py-1 capitalize font-medium">
                        <span
                          className={`px-2 border rounded-lg ${getStatusStyles(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      {/* <td
                        className={`px-2 py-1 text-center capitalize ${
                          !lead.createdBy ? "text-red-500 font-semibold" : ""
                        }`}
                      >
                        {lead.createdBy.slice(-5) || "Not Assigned"}
                      </td>
                      <td
                        className={`px-2 py-1 text-center capitalize ${
                          !lead.assignedToSalesExecutive
                            ? "text-red-500 font-semibold"
                            : ""
                        }`}
                      >
                        {lead.assignedToSalesExecutive.slice(-5) ||
                          "Not Assigned"}
                      </td> */}
                      <td className="px-2 py-1 text-center">
                        <button
                          className="px-3 py-1 text-green-600 cursor-pointer rounded hover:text-green-700 focus:outline-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/growth-manager-leads/${lead._id}`);
                          }}
                        >
                          <MdOutlineOpenInNew size={20} />
                        </button>
                      </td>
                    </tr>
                    {/* Expanded Section */}
                    {expandedRows.includes(lead._id) && (
                      <tr className="bg-gray-50">
                        <td
                          colSpan="9"
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

// import React, { useContext, useEffect, useState } from "react";
// import Layout from "../common/Layout";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import { ThemeContext } from "../../context/ThemeContext";
// import axios from "axios";

// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData("Eclair", 262, 16.0, 24, 6.0),
//   createData("Cupcake", 305, 3.7, 67, 4.3),
//   createData("Gingerbread", 356, 16.0, 49, 3.9),
// ];

// const GrowthManagerLeads = () => {
//   const { backendUrl, navigate } = useContext(ThemeContext);

//   const [growthLead, setGrowthLead] = useState([]);
//   const token = localStorage.getItem("token");

//   const getAllGrowthLeads = async () => {
//     try {
//       console.log("Fetching Growth Manager Leads...");

//       const response = await axios.get(
//         backendUrl + `/api/lead/get-all-growth-manager-lead`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("Full API Response:", response); // Check the full API response

//       if (response?.data?.success) {
//         console.log("Growth Manager Leads:", response.data.leads);
//         setGrowthLead(response.data.leads || []); // Ensure state is updated
//       } else {
//         console.log("API call did not return success:", response.data);
//       }
//     } catch (error) {
//       console.error(
//         "Error fetching Growth Manager Leads:",
//         error?.response?.data || error
//       );
//     }
//   };

//   useEffect(() => {
//     getAllGrowthLeads();
//   }, []);

//   return (
//     <div>
//       <Layout>
//         <h3>Leads list</h3>
//         <div className="custom_table">
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 650 }} aria-label="simple table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Company Name</TableCell>
//                   <TableCell align="right">industry</TableCell>
//                   <TableCell align="right">status</TableCell>
//                   {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell> */}
//                   <TableCell align="right">Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {growthLead.map((row) => (
//                   <TableRow
//                     key={row._id}
//                     sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                   >
//                     <TableCell component="th" scope="row">
//                       {row.companyName}
//                     </TableCell>
//                     <TableCell align="right">{row.industry}</TableCell>
//                     <TableCell align="right">{row.status}</TableCell>
//                     <TableCell align="right">
//                       <button
//                         onClick={() =>
//                           navigate(`/growth-manager-leads/${row._id}`)
//                         }
//                         className="global_btn"
//                       >
//                         Manage
//                       </button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>
//       </Layout>
//     </div>
//   );
// };

// export default GrowthManagerLeads;
