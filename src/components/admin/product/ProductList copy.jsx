import React, { useContext, useEffect, useState } from 'react'
import Layout from '../../common/Layout'
import { ThemeContext } from '../../../context/ThemeContext'
import axios from 'axios'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { MdEditSquare } from "react-icons/md";
import EditIcon from '@mui/icons-material/Edit';


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


const ProductList = () => {

    const { backendUrl } = useContext(ThemeContext)
    const token = localStorage.getItem('token');

    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState('');
    const [editProduct, setEditProduct] = useState({ productId: '', name: '' });


    // ✅ Fetch Products
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/admin/products`);
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // ✅ Create Product (Admin)
    const handleCreateProduct = async () => {
        try {
            await axios.post(`${backendUrl}/api/admin/products`, { name: newProduct }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewProduct('');
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error creating product:', error);
        }
    };


    // ✅ Edit Product (Admin)
    const handleEditProduct = async () => {
        try {
            await axios.put(`${backendUrl}/api/admin/products/${editProduct.productId}`, { name: editProduct.name }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditProduct({ productId: '', name: '' });
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };


    // ✅ Delete Product (Admin)
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product?")) {
            return;
        }
        try {
            await axios.delete(`${backendUrl}/api/admin/delete/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProducts(); // Refresh product list
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };


    return (
        <div>
            <Layout>
                <div>
                    <h2>Admin: Manage Products</h2>

                    <div className='row'>

                        <div className='col-lg-8'>
                            <div className='admin_product_list custom_table'>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell align="right">Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {products.map((product) => (
                                                <TableRow
                                                    key={product._id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {product.name}
                                                    </TableCell>
                                                    <TableCell align="right"><button className='icon_btn icon_btn_edit' onClick={() => setEditProduct({ productId: product._id, name: product.name })}><EditIcon /></button> <button className='icon_btn' onClick={() => handleDeleteProduct(product._id)}><DeleteForeverIcon /></button></TableCell>
                                                    
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>

                        <div className='col-lg-4'>
                            {/* Create Product */}
                            <div className='custom_form admin_create_product'>
                                <input type="text" placeholder="New Product Name" value={newProduct} onChange={(e) => setNewProduct(e.target.value)} />
                                <button className='global_btn' onClick={handleCreateProduct}>Create Product</button>
                            </div>

                            {/* Edit Product */}
                            {editProduct.productId && (
                                <div className='custom_form admin_edit_product'>
                                    <input type="text" placeholder="Edit Product Name" value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} />
                                    <button className='global_btn' onClick={handleEditProduct}>Update Product</button>
                                </div>
                            )}
                        </div>

                    </div>



                    {/* Product List */}
                    {/* <ul>
                        {products.map(product => (
                            <li key={product._id}>
                                {product.name}
                                <button onClick={() => setEditProduct({ productId: product._id, name: product.name })}>Edit</button>
                            </li>
                        ))}
                    </ul> */}


                </div>
            </Layout>
        </div>
    )
}

export default ProductList
