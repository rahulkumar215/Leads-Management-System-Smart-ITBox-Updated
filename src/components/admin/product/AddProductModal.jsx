import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Bars } from "react-loader-spinner";
import { ThemeContext } from "./../../../context/ThemeContext";

const AddProductModal = ({ onClose, onSubmit }) => {
  const [product, setProduct] = useState({
    name: "",
    originalPrice: "",
  });
  const [loading, setLoading] = useState(false);

  const { backendUrl } = useContext(ThemeContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Send single product data to API
      await axios.post(`${backendUrl}/api/admin/products`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product added successfully!");
      onSubmit();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      {loading && (
        <div className="absolute inset-0 flex justify-center h-full items-center bg-white/30 z-10">
          <Bars
            height="40"
            width="40"
            color="#B43F3F"
            ariaLabel="bars-loading"
            visible={true}
          />
        </div>
      )}
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md overflow-y-auto max-h-[90vh]"
        style={{ scrollbarWidth: "thin" }}
      >
        <h2 className="text-2xl text-slate-800 font-semibold mb-4">
          Add Product
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              required
              disabled={loading}
              className="w-full px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Rate</label>
            <input
              type="number"
              name="originalPrice"
              value={product.originalPrice}
              onChange={handleInputChange}
              placeholder="Rate"
              required
              disabled={loading}
              className="w-full px-2 py-1 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-300 cursor-pointer rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-md hover:bg-red-700 flex items-center justify-center"
            >
              {loading ? (
                <Bars
                  height="20"
                  width="20"
                  color="#ffffff"
                  ariaLabel="loading"
                />
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
