import React, { useContext, useEffect } from 'react'
import Layout from '../common/Layout'
import { FiPlus } from "react-icons/fi";
import { MdEditSquare } from "react-icons/md";
import { Navigate, useNavigate } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { ThemeContext } from '../../context/ThemeContext';
import axios from 'axios';


const columns = [
  { id: 'companyName', label: 'Company', minWidth: 170 },
  { id: 'industry', label: 'Industry', minWidth: 100 },
  { id: 'assignedToSalesExecutive', label: 'Sales Executive', minWidth: 170, align: 'right' },
  { id: 'contactPoints', label: 'Total Contacts', minWidth: 170, align: 'right' },
  { id: 'status', label: 'Status', minWidth: 170, align: 'right' },
  { id: "actions", label: "Action", minWidth: 100, align: 'center' },
];


// function createData(name, code, population, size) {
//   const density = population / size;
//   return { name, code, population, size, density };
// }





const LeadList = () => {

  const { backendUrl, navigate, leadData, setLeadData } = useContext(ThemeContext)

  console.log(backendUrl);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const token = localStorage.getItem('token'); // Retrieve the token

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(()=>{
    const getAllLeads = async () => {
      try {
          const response = await axios.get(backendUrl+`/api/lead/get-all-leads`,{
            headers: { Authorization: `Bearer ${token}` } // ✅ Pass token in headers
        })
          if(response.data.success){
              console.log(response.data.allLeads);
              setLeadData(response.data.allLeads)
          }
      } catch (error) {
          console.log(error,"Error:- While getting all leads");
      }
  }

  getAllLeads()
  },[backendUrl,setLeadData])

  const reversedLeadData = [...leadData].reverse()

  return (
    <div>
      <Layout>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='heading_btn'>
              <h3>Leads list</h3>
              <button onClick={() => navigate('/create-lead')} className='global_btn'>Add Lead <FiPlus /></button>
            </div>

            <div>
              <div className='leads_table'>
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                  <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reversedLeadData
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            return (
                              <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                {columns.map((column) => {
                                  if (column.id === 'actions') {
                                    return (
                                      <TableCell key={column.id} align={column.align}>
                                        <button className='icon_btn' onClick={() => navigate(`edit-lead/${row._id}`)}><MdEditSquare /></button>
                                      </TableCell>
                                    )
                                  }

                                  let value = row[column.id];

                                  // Handle specific cases for fields that are objects or arrays
                                  if (column.id === 'assignedToSalesExecutive' && value) {
                                    value = value.name || 'N/A'; // Extract the `name` property from the object
                                  }

                                  if (column?.id === 'contactPoints' && Array.isArray(value)) {
                                    value = value?.length; // Show the count of contact points
                                  }
                                  {/* const value = column.id === 'contactPoints' 
                              ? row.contactPoints.length 
                              : row[column.id]; */}
                                  return (

                                    <TableCell key={column.id} align={column.align}>
                                      {/* {value} */}
                                      {typeof value === 'object' && value !== null
                                        ? JSON.stringify(value) // Convert objects to string for debug visibility
                                        : value || '0'}
                                    </TableCell>

                                  );

                                })}

                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={leadData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default LeadList
