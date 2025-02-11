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

const GrowthManagerLeads = () => {

    const {backendUrl,navigate} = useContext(ThemeContext)

    const [growthLead,setGrowthLead] = useState([])
    const token = localStorage.getItem('token');

    const getAllGrowthLeads = async () => {
        try {
            console.log("Fetching Growth Manager Leads...");
    
            const response = await axios.get(backendUrl + `/api/lead/get-all-growth-manager-lead`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
    
            console.log("Full API Response:", response);  // Check the full API response
    
            if (response?.data?.success) {
                console.log("Growth Manager Leads:", response.data.leads);
                setGrowthLead(response.data.leads || []);  // Ensure state is updated
            } else {
                console.log("API call did not return success:", response.data);
            }
        } catch (error) {
            console.error("Error fetching Growth Manager Leads:", error?.response?.data || error);
        }
    };
    
    useEffect(() => {
        getAllGrowthLeads();
    }, []);



    return (
        <div>
            <Layout>
                <h3>Leads list</h3>
                <div className='custom_table'>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Company Name</TableCell>
                                    <TableCell align="right">industry</TableCell>
                                    <TableCell align="right">status</TableCell>
                                    {/* <TableCell align="right">Carbs&nbsp;(g)</TableCell> */}
                                    <TableCell align="right">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {growthLead.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.companyName}
                                        </TableCell>
                                        <TableCell align="right">{row.industry}</TableCell>
                                        <TableCell align="right">{row.status}</TableCell>
                                        <TableCell align="right"><button onClick={()=>navigate(`/growth-manager-leads/${row._id}`)} className='global_btn'>Manage</button></TableCell>
                                        
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Layout>
        </div>
    )
}

export default GrowthManagerLeads
