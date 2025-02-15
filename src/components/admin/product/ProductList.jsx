import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Bars, DNA } from "react-loader-spinner";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import Layout from "../../common/Layout";
import { ThemeContext } from "../../../context/ThemeContext";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";

const ProductList = () => {
  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/admin/products`);
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredProducts.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${backendUrl}/api/admin/delete/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Error deleting product");
      }
    }
  };

  return (
    <Layout>
      <div className="p-2" style={{ minHeight: "100vh" }}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-lg font-semibold">
            All Products <span className="text-sm">({products.length})</span>
          </h4>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="px-2 py-1 border border-gray-300 bg-gray-100 rounded-md shadow-sm w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <button
            className="px-4 py-2 bg-red-600 text-white w-full sm:w-fit cursor-pointer rounded-md hover:bg-red-700 focus:outline-none"
            onClick={() => setShowAddModal(true)}
          >
            Add Product
          </button>
        </div>

        <div
          className="overflow-x-auto shadow-md max-h-[30rem] rounded-lg border border-gray-200"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-[#173B45] text-[#F8EDED] sticky top-0 z-10">
              <tr>
                <th className="py-2 text-sm min-w-16 font-semibold">S. No.</th>
                <th className="px-2 py-2 text-sm text-left font-semibold">
                  Product Name
                </th>
                <th className="px-2 py-2 text-sm text-left font-semibold">
                  Rate
                </th>
                <th className="px-4 py-2 text-center text-sm font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="4">
                    <div className="flex justify-center py-4">
                      <DNA
                        height="40"
                        width="40"
                        color="#4fa94d"
                        ariaLabel="bars-loading"
                      />
                    </div>
                  </td>
                </tr>
              ) : currentPageData.length > 0 ? (
                currentPageData.map((product, index) => (
                  <tr
                    key={product._id}
                    className=" divide-x divide-gray-200 text-sm hover:bg-gray-50"
                  >
                    <td className="px-2 py-1 text-center">
                      {offset + index + 1}
                    </td>
                    <td className="px-2 py-1 capitalize font-semibold text-gray-800">
                      {product.name}
                    </td>
                    <td className="px-2 py-1">{product.rate || "-"}</td>
                    <td className="px-2 py-1 text-center space-x-2">
                      <button
                        className="text-green-700 cursor-pointer rounded hover:text-green-800"
                        onClick={() => {
                          setEditData(product);
                          setShowEditModal(true);
                        }}
                      >
                        <HiOutlinePencil size={20} />
                      </button>
                      <button
                        className="text-red-500 cursor-pointer rounded hover:text-red-700"
                        onClick={() => handleDeleteProduct(product._id)}
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing {filteredProducts.length === 0 ? 0 : offset + 1} to{" "}
            {offset + currentPageData.length} of {filteredProducts.length}{" "}
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

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSubmit={() => {
            setShowAddModal(false);
            fetchProducts();
          }}
        />
      )}
      {showEditModal && editData && (
        <EditProductModal
          onClose={() => setShowEditModal(false)}
          initialData={editData}
          onSubmit={() => {
            setShowEditModal(false);
            fetchProducts();
          }}
        />
      )}
    </Layout>
  );
};

export default ProductList;
