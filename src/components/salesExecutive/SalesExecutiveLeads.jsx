import { toast } from 'react-toastify'
import { ThemeContext } from '../../context/ThemeContext'
import Layout from '../common/Layout'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { MdEditSquare } from "react-icons/md";


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

const SalesExecutiveLeads = () => {

    const { backendUrl,navigate } = useContext(ThemeContext)
    const [leads, setLeads] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/lead/sales-executive/leads', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLeads(response.data.leads);
                console.log('sales executive data',response.data.leads);
            } catch (error) {
                console.error("Error fetching leads:", error);
                toast.error("Error fetching leads");
            }
        };

        fetchLeads();
    }, [backendUrl, token]);

    return (
        <div>
            <Layout>
            <h4 style={{marginBottom:"20px"}}>Total Leads ({leads.length})</h4>
                <div className='custom_table'>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Company Name</TableCell>
                                <TableCell align="right">Industry</TableCell>
                                <TableCell align="right">Contact Persons</TableCell>
                                <TableCell align="right">Status</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leads.reverse().map((row) => (
                                <TableRow
                                    key={row._id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.companyName}
                                    </TableCell>
                                    <TableCell align="right">{row.industry}</TableCell>
                                    <TableCell align="right">{row.contactPoints.length}</TableCell>
                                    <TableCell align="right">{row.status}</TableCell>
                                    <TableCell align="right"><button onClick={()=>navigate(`/manage/contact/${row._id}`)} className='icon_btn'>Manage <MdEditSquare /></button></TableCell>
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

export default SalesExecutiveLeads
