import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import Layout from "../common/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import AddUserModal from "./AddUserModal";
import { HiOutlineTrash } from "react-icons/hi";
import { LuUserX, LuUserCheck } from "react-icons/lu";
import Swal from "sweetalert2";
import { DNA } from "react-loader-spinner";

const ManageAccounts = () => {
  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  // Users & search state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // New user state that will be passed to the modal
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    mobileNo: "",
    username: "",
    pswd: "",
    role: "sales_executive",
  });

  // Modal visibility state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/users/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setUsersLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.role.toLowerCase().includes(value) ||
        user.accountStatus.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
    setCurrentPage(0);
  };

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${backendUrl}/api/users/register`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User Created Successfully");
      setNewUser({
        name: "",
        email: "",
        mobileNo: "",
        username: "",
        pswd: "",
        role: "sales_executive",
      });
      fetchUsers();
      setIsAddUserModalOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Something Went Wrong");
    } finally {
      setIsLoading(true);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${backendUrl}/api/users/delete-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User Deleted Successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Something Went Wrong");
    }
  };

  const handleUpdateStatus = async (userId, currentStatus) => {
    try {
      await axios.put(
        `${backendUrl}/api/users/update-status`,
        {
          userId,
          accountStatus: currentStatus === "active" ? "blacklisted" : "active",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("User Status Updated Successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Something Went Wrong");
    }
  };

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredUsers.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  // 1. Add these helper functions inside the ManageAccounts component
  const renderStatus = (status) => {
    const formatted =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    let colorClass = "";
    if (status === "active") {
      colorClass = "text-green-600 font-semibold";
    } else if (status === "blacklisted") {
      colorClass = "text-red-600 font-semibold";
    }
    return <span className={colorClass}>{formatted}</span>;
  };

  const renderRole = (role) => {
    let formatted = "";
    let colorClass = "";
    if (role === "growth_manager") {
      formatted = "Growth Manager";
      colorClass = "text-blue-600 font-semibold";
    } else if (role === "sales_executive") {
      formatted = "Sales Executive";
      colorClass = "text-purple-600 font-semibold";
    } else if (role === "data_analyst") {
      formatted = "Data Analyst";
      colorClass = "text-orange-600 font-semibold";
    } else {
      formatted = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }
    return <span className={colorClass}>{formatted}</span>;
  };

  // Confirm Delete User with SweetAlert2
  const confirmDeleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this user? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteUser(userId);
      }
    });
  };

  // Confirm Update Status (Activate/Deactivate) with SweetAlert2
  const confirmUpdateStatus = (userId, currentStatus) => {
    const actionText = currentStatus === "active" ? "deactivate" : "activate";
    Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to ${actionText} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "custom-swal",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateStatus(userId, currentStatus);
      }
    });
  };

  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <Layout>
      <div className="p-4" style={{ minHeight: "100vh" }}>
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-lg font-semibold mb-2">
              All Users <span className="text-sm">({users.length})</span>
            </h4>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="Search by name, email, role, or status..."
                value={searchTerm}
                onChange={handleSearch}
                className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-md shadow-sm w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-[#B43F3F]"
              />
              {/* Button to open the modal */}
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="px-4 py-2 bg-red-600 text-white w-full sm:w-fit cursor-pointer rounded-md hover:bg-red-700 focus:outline-none"
              >
                Add New User
              </button>
            </div>
          </div>
          <div
            className="overflow-x-auto max-h-[50rem] shadow-md rounded-lg border border-gray-300"
            style={{ scrollbarWidth: "thin" }}
          >
            <table className="min-w-full table-auto border-collapse">
              <thead
                style={{ backgroundColor: "#173B45", color: "#F8EDED" }}
                className="sticky top-0 z-5"
              >
                <tr>
                  {/* Hide S. No. on mobile */}
                  <th className="px-2 py-2  text-left text-sm font-semibold hidden sm:table-cell">
                    S. No.
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-semibold">
                    Name
                  </th>
                  {/* Hide Email on mobile */}
                  <th className="px-2 py-2 text-left text-sm font-semibold hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-2 py-2 min-w-32 text-left text-sm font-semibold">
                    Role
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {usersLoading ? (
                  <tr>
                    <td colSpan={6}>
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
                ) : (
                  currentPageData.map((user, i) => (
                    <React.Fragment key={user._id}>
                      <tr
                        className="border-b border-gray-200 cursor-pointer"
                        onClick={() => toggleRowExpansion(user._id)}
                      >
                        {/* S. No. (hidden on mobile) */}
                        <td className="px-2 py-1 hidden sm:table-cell">
                          {offset + i + 1}
                        </td>
                        <td className="px-2 py-1">{user.name}</td>
                        {/* Email (hidden on mobile) */}
                        <td className="px-2 py-1 hidden sm:table-cell">
                          {user.email}
                        </td>
                        <td className="px-2 py-1 text-sm">
                          {renderRole(user.role)}
                        </td>
                        <td className="px-2 py-1 text-sm">
                          {renderStatus(user.accountStatus)}
                        </td>
                        <td
                          className="px-2 py-1 flex gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmUpdateStatus(user._id, user.accountStatus);
                            }}
                            className="rounded focus:outline-none cursor-pointer"
                          >
                            {user.accountStatus === "active" ? (
                              <LuUserCheck
                                size={20}
                                className="text-green-600"
                              />
                            ) : (
                              <LuUserX size={20} className="text-red-600" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDeleteUser(user._id);
                            }}
                            className="text-red-500 hover:text-red-700 cursor-pointer focus:outline-none"
                          >
                            <HiOutlineTrash size={20} />
                          </button>
                        </td>
                      </tr>
                      {/* Expanded section visible only on mobile */}
                      {expandedRows.includes(user._id) && (
                        <tr className="sm:hidden">
                          <td colSpan={6} className="px-2 py-2 bg-gray-50">
                            <div>
                              <strong>Email: </strong>
                              {user.email}
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
              Showing {filteredUsers.length === 0 ? 0 : offset + 1} to{" "}
              {offset + currentPageData.length} of {filteredUsers.length}{" "}
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
        </div>
      </div>

      <ToastContainer />

      {isAddUserModalOpen && (
        <AddUserModal
          newUser={newUser}
          setNewUser={setNewUser}
          handleCreateUser={handleCreateUser}
          isLoading={isLoading}
          onClose={() => setIsAddUserModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default ManageAccounts;
