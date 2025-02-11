import React, { useContext, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ThemeContext } from '../../context/ThemeContext';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

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

const AllLeads = () => {


    const { backendUrl , navigate } = useContext(ThemeContext);
    const token = localStorage.getItem("token");

    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/admin/getAllLeadsForAdmin`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLeads(response.data.leads);
            setFilteredLeads(response.data.leads);
            console.log('All leads',response.data.leads);
        } catch (error) {
            console.error("❌ Error fetching leads:", error);
        }
    };

    const isNewLead = (createdAt) => {
        if (!createdAt) return false;
        const leadDate = new Date(createdAt).setHours(0, 0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        return leadDate === today;
    };

    const filterLeads = (status) => {
        setStatusFilter(status);
        if (status === "All") {
            setFilteredLeads(leads);
        } else {
            setFilteredLeads(leads.filter((lead) => lead.status === status));
        }
    };

    // ✅ Function to filter leads by search input
    const applySearch = (data) => {
        if (!searchQuery.trim()) {
            setFilteredLeads(data);
            return;
        }

        const filtered = data.filter((lead) =>
            lead._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.createdBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.assignedToSalesExecutive?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.assignedToGrowthManager?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredLeads(filtered);
    };

    // ✅ Function to handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        applySearch(leads);
    };

    return (
        <div>
            <Layout>
                <div className="admin-leads-container">
                    <h4 style={{marginBottom:"20px"}}>All Leads <span style={{fontSize:"16px"}}>({leads.length})</span></h4>

                    {/* 🔍 Search Bar */}
                    <input className='search_input'
                        type="text"
                        placeholder="Search by company Id, name, status, analyst, sales executive, growth manager..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        
                    />

                    {/* Filters */}
                    {/* <div className="lead-filters">
                        <button onClick={() => filterLeads("All")}>All</button>
                        <button onClick={() => filterLeads("Open")}>Open</button>
                        <button onClick={() => filterLeads("Draft")}>Draft</button>
                        <button onClick={() => filterLeads("Closed")}>Closed</button>
                    </div> */}

                    {/* table start */}

                    <div className='custom_table admin_all_table'>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Company Name</TableCell>
                                    <TableCell align="left">Status</TableCell>
                                    <TableCell align="right">Data Analyst</TableCell>
                                    <TableCell align="right">Sales Executive</TableCell>
                                    <TableCell align="right">Growth Manager</TableCell>
                                    <TableCell align="right">Contact Points	</TableCell>
                                    <TableCell align="right">Company Lost</TableCell>
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredLeads.map((lead) => (
                                    <TableRow
                                        key={lead._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left" style={{textTransform:"capitalize"}}>{lead._id.slice(-5)}</TableCell>
                                        <TableCell align="left" style={{textTransform:"capitalize"}}>{lead.companyName} {isNewLead(lead.createdAt) && <span className="new_badge">New</span>}</TableCell>
                                        <TableCell align="left" style={{textTransform:"capitalize"}}>{lead.status}</TableCell>

                                        <TableCell align="right" style={{textTransform:"capitalize"}}>{lead.createdBy || "N/A"}</TableCell>
                                        <TableCell align="right" style={{textTransform:"capitalize"}}>{lead.assignedToSalesExecutive || "Not Assigned"}</TableCell>
                                        <TableCell align="right" style={{textTransform:"capitalize"}}>{lead.assignedToGrowthManager || "Not Assigned"}</TableCell>
                                        <TableCell align="right">{lead?.contactPointsCount ? lead?.contactPointsCount : "0"}</TableCell>
                                        <TableCell align="right" style={{textTransform:"capitalize"}}>{lead.isCompanyLost ? "Yes" : "No"}</TableCell>
                                        <TableCell align="right">
                                            <button className='global_btn' onClick={()=>navigate(`/admin/lead-details/${lead._id}`)}>View</button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default AllLeads
