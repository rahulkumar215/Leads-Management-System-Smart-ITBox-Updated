import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import axios from "axios";
import Layout from "../common/Layout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ReactPaginate from "react-paginate";
import AddUserModal from "./AddUserModal"; // Adjust the import path as needed
import { HiOutlineTrash, HiTrash } from "react-icons/hi";
import { LuUserX, LuUserCheck } from "react-icons/lu";

const ManageAccounts = () => {
  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  // Users & search state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
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
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
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

  return (
    <Layout>
      <div className="p-4" style={{ minHeight: "100vh" }}>
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-lg font-semibold mb-2">
              All Users <span className="text-sm">({users.length})</span>
            </h4>
            <div className="flex items-center justify-between">
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
                className="px-4 py-2 bg-[#B43F3F] text-white rounded-md hover:bg-[#FF8225] focus:outline-none"
              >
                Add New User
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto rounded-lg overflow-hidden shadow-md border-collapse">
              <thead style={{ backgroundColor: "#173B45", color: "#F8EDED" }}>
                <tr>
                  <th className="px-2 py-2 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-2 py-2 text-left text-sm font-semibold">
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
                {currentPageData.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200">
                    <td className="px-2 py-1">{user.name}</td>
                    <td className="px-2 py-1">{user.email}</td>
                    <td className="px-2 py-1">{user.role}</td>
                    <td className="px-2 py-1">{user.accountStatus}</td>
                    <td className="px-2 py-1 flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdateStatus(user._id, user.accountStatus)
                        }
                        className="px-2 py-1 rounded focus:outline-none cursor-pointer"
                      >
                        {user.accountStatus === "active" ? (
                          <LuUserCheck size={20} className="text-green-600" />
                        ) : (
                          <LuUserX size={20} className="text-red-600" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-2 py-1 text-red-500 hover:text-red-700 cursor-pointer focus:outline-none"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
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
                "px-2  border border-gray-500 rounded-md cursor-pointer"
              }
              activeClassName={"bg-gray-300 text-black"}
              previousClassName={
                "px-2  border border-gray-5 00 rounded-md cursor-pointer"
              }
              nextClassName={
                "px-2  border border-gray-500 rounded-md cursor-pointer"
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
          onClose={() => setIsAddUserModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default ManageAccounts;
