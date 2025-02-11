import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { IoIosCheckbox } from "react-icons/io";
import { AiFillCloseSquare } from "react-icons/ai";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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




const LeadDetails = () => {
    const { backendUrl } = useContext(ThemeContext);
    const { leadId } = useParams();
    const token = localStorage.getItem("token");

    const [lead, setLead] = useState(null);

    useEffect(() => {
        fetchLeadDetails();
    }, []);

    const fetchLeadDetails = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/admin/getLeadDetailsForAdmin/${leadId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setLead(response.data.lead);
            console.log('Single lead data', response.data.lead);
        } catch (error) {
            console.error("❌ Error fetching lead details:", error);
        }
    };

    if (!lead) return <p>Loading...</p>;

    return (
        <div>
            <Layout>
                <div className="row">
                    <div className="col-lg-6">
                        <h4 style={{ textTransform: "capitalize", marginBottom: "30px" }}>Company: {lead.companyName || "Unknown"}</h4>
                        <p style={{ textTransform: "capitalize" }}><strong>Status:</strong> {lead.status || "Draft"}</p>
                        <p style={{ textTransform: "capitalize" }}><strong>Data Analyst:</strong> {lead.createdBy || "N/A"}</p>
                        <p style={{ textTransform: "capitalize" }}><strong>Sales Executive:</strong> {lead?.assignedToSalesExecutive || "Not Assigned"}</p>
                        <p style={{ textTransform: "capitalize" }}><strong>Company Lost:</strong> {lead.isCompanyLost ? "Yes" : "No"}</p>
                        <p style={{ textTransform: "capitalize" }}><strong>Company Lost Reason:</strong> {lead.companyLostReason}</p>

                        <div className="product_details custom_table">
                            {/* 🛒 Products */}
                            <h4 style={{ marginBottom: "15px" }}>Products</h4>
                    
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product Name</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {lead?.growthManagerPipeline?.flatMap(stage => stage.products)?.map((product, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {product.name || "N/A"}
                                                </TableCell>
                                                <TableCell align="right">{product.quantity || 0}</TableCell>
                                                <TableCell align="right">₹{product.pricePerUnit || 0}</TableCell>
                                                <TableCell align="right">₹{product.totalAmount || 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <p style={{marginTop:"15px",fontSize:"18px"}}>
                                <strong>Total Revenue:</strong> ₹{lead?.growthManagerPipeline?.reduce((sum, stage) => sum + (stage.totalPrice || 0), 0)}
                            </p>

                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div>
                            <h4 style={{ marginBottom: "15px" }}>Completed Stages</h4>
                            <div className="admin_completed_stage_showcase">
                                {/* ✅ Completed Stages */}
                                <div>
                                    {lead?.growthManagerPipeline?.filter(stage => stage.completed)?.map((stage, index) => (
                                        <div className="stage_name_complete" key={index} style={{ alignItems: 'center', display: "flex" }}>
                                            <IoIosCheckbox style={{ fontSize: "20px" }} /> <span style={{ marginLeft: "5px" }}>{stage.stage}</span>
                                        </div>
                                    )) || <p>No completed stages.</p>}
                                </div>
                            </div>

                            {/* 🚨 Due Date Alerts */}
                            <h4 style={{ margin: "25px 0px 15px" }}>Due Date Alerts</h4>
                            <div className="admin_completed_stage_showcase">
                                {lead?.growthManagerPipeline?.filter(stage => !stage.completed && new Date(stage.tatDeadline) < new Date())?.map((stage, index) => (
                                    <div key={index} className="overdue-alert admin_showcase_alert" style={{ display: "flex", alignItems: "center" }}>
                                        <AiFillCloseSquare style={{ fontSize: "20px", marginRight: "5px" }} />
                                        {stage.stage} - Overdue by {Math.ceil((new Date() - new Date(stage.tatDeadline)) / (1000 * 60 * 60 * 24))} days!
                                    </div>
                                )) || <p>No overdue alerts.</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="admin-lead-details">


                    {/* 📞 Contact Persons */}
                    <h4 style={{ marginBottom: "15px" }}>Contact Persons</h4>
                    <div className="admin_contact_person_card_main">
                        {lead?.contactPoints?.map((person, index) => (
                            <div className="admin_contact_person_card" key={index}>
                                <span style={{ display: "block", padding: "5px 0px" }}><strong>Name:</strong> {person.name}</span>
                                <span style={{ display: "block", padding: "5px 0px" }}><strong>Designation: </strong> {person.designation || "Unknown"}</span>
                                <span style={{ display: "block", padding: "5px 0px" }}><strong>Email:</strong> {person.email || "N/A"} / <strong>Alt: </strong> {person.alternateEmail || "N/A"}</span>
                                <span style={{ display: "block", padding: "5px 0px" }}><strong>Phone:</strong> {person.phone} / <strong>Alt: </strong> {person.alternatePhone}</span>
                                <span style={{ display: "block", padding: "5px 0px" }}><strong>Whatsapp:</strong> {person.whatsappNumber}</span>
                                <span style={{ display: "block", padding: "5px 0px" }}><strong>Growth Manager:</strong> {person.assignedToGrowthManager}</span>
                            </div>
                        )) || <p>No contacts available.</p>}
                    </div>



                </div>
            </Layout>
        </div>
    )
}

export default LeadDetails;
