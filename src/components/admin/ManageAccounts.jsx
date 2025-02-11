import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '../../context/ThemeContext';
import axios from 'axios';
import Layout from '../common/Layout';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { toast } from 'react-toastify';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const ManageAccounts = () => {


    const { backendUrl } = useContext(ThemeContext);
    const token = localStorage.getItem("token");

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); // For search filtering
    const [searchTerm, setSearchTerm] = useState(""); // Search state
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        mobileNo: "",
        username: "",
        pswd: "",
        role: "sales_executive"
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/users/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setFilteredUsers(response.data); // Set filtered users initially
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);

        if (!value) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value) ||
            user.role.toLowerCase().includes(value) ||
            user.accountStatus.toLowerCase().includes(value)
        );

        setFilteredUsers(filtered);
    };

    const handleCreateUser = async () => {
        try {
            await axios.post(`${backendUrl}/api/users/register`, newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewUser({ name: "", email: "", mobileNo: "", username: "", pswd: "", role: "sales_executive" });
            fetchUsers();
            toast.success("User Created Successfully")
        } catch (error) {
            console.error("Error creating user:", error);
            toast.error("Something Went Wrong")
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${backendUrl}/api/users/delete-user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
            toast.success("User Deleted Successfully")
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Something Went Wrong")
        }
    };

    const handleUpdateStatus = async (userId, currentStatus) => {
        try {
            await axios.put(`${backendUrl}/api/users/update-status`, {
                userId,
                accountStatus: currentStatus === "active" ? "blacklisted" : "active"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchUsers();
            toast.success("User Status Updated Successfully")
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Something Went Wrong")
        }
    };

    return (
        <div>
            <Layout>
                {/* <h2>Admin Dashboard - Manage Users</h2> */}

                <div className='row'>

                    <div className="col-lg-8">
                        {/* users list start */}

                        <div>
                            <div>
                            <h4 style={{marginBottom:"15px"}}>All Users <span style={{fontSize:"16px"}}>({users.length})</span></h4>

                            <div>
                                {/* ✅ Search Input for Filtering */}
                            <input className='search_input'
                                type="text"
                                placeholder="Search by name, email, role, or status..."
                                value={searchTerm}
                                onChange={handleSearch}
                                
                            />
                            </div>

                            </div>
                            {/* <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>{user.accountStatus}</td>
                                            <td>
                                                <button onClick={() => handleUpdateStatus(user._id, user.accountStatus)}>
                                                    {user.accountStatus === "active" ? "Deactivate" : "Activate"}
                                                </button>
                                                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}

                            <div className='leads_table custom_table admin_all_table'>

                            <TableContainer className='all_users_list' component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell align="right">Email</TableCell>
                                            <TableCell align="right">Role</TableCell>
                                            <TableCell align="right">Status</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers.map((user) => (
                                            <TableRow
                                                key={user._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell align="right">{user.email}</TableCell>
                                                <TableCell align="right">{user.role}</TableCell>
                                                <TableCell align="right">{user.accountStatus}</TableCell>
                                                <TableCell align="right">
                                                <button className='global_btn' onClick={() => handleUpdateStatus(user._id, user.accountStatus)}>
                                                    {user.accountStatus === "active" ? "Deactivate" : "Activate"}
                                                </button>
                                                <button className='icon_btn' onClick={() => handleDeleteUser(user._id)}><DeleteForeverIcon /></button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            </div>

                        </div>

                        {/* users list end */}
                    </div>

                    <div className="col-lg-4">
                        {/* create user start */}
                        <div>
                            <h4>Create New User</h4>
                            <div className="custom_form admin_account_creation_form">
                                <input type="text" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                                <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                                <input type="text" placeholder="Mobile No" value={newUser.mobileNo} onChange={(e) => setNewUser({ ...newUser, mobileNo: e.target.value })} />
                                <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
                                <input type="password" placeholder="Password" value={newUser.pswd} onChange={(e) => setNewUser({ ...newUser, pswd: e.target.value })} />
                                <select className='select_item_box' value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                                    <option value="sales_executive">Sales Executive</option>
                                    <option value="growth_manager">Growth Manager</option>
                                    <option value="data_analyst">Data Analyst</option>
                                </select>
                                <button className='global_btn' onClick={handleCreateUser}>Create User</button>
                            </div>
                        </div>
                        {/* create user end */}
                    </div>
                </div>
            </Layout>

        </div>
    )
}

export default ManageAccounts
