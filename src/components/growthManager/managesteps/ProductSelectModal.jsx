import axios from "axios";
import { useEffect, useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { DNA } from "react-loader-spinner";
import { toast } from "react-toastify";

export function ProductSelectModal({
  setShowProductModal,
  setNewStage,
  backendUrl,
  token,
  selectedProducts,
  setSelectedProducts,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const handleSaveProducts = () => {
    const totalPrice = selectedProducts.reduce(
      (sum, prod) => sum + prod.totalAmount,
      0
    );

    setNewStage((prev) => ({
      ...prev,
      products: [...selectedProducts],
      totalPrice: totalPrice,
    }));

    setShowProductModal(false);
  };

  const handleProductChange = (productId, field, value) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? {
              ...p,
              [field]: Number(value),
              totalAmount:
                field === "pricePerUnit"
                  ? p.quantity * Number(value)
                  : Number(value) * p.pricePerUnit,
            }
          : p
      )
    );
  };

  const handleProductSelection = (product, isChecked) => {
    if (isChecked) {
      setSelectedProducts((prev) => [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          quantity: 1,
          pricePerUnit: 0,
          totalAmount: 0,
        },
      ]);
    } else {
      setSelectedProducts((prev) =>
        prev.filter((p) => p.productId !== product._id)
      );
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${backendUrl}/api/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error fetching products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [backendUrl, token]);

  return (
    <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-8/12 transform transition-all mt-24 sm:mt-0 duration-300">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-2xl text-slate-800 font-semibold">
            Select Products
          </h4>
          <button
            onClick={() => setShowProductModal(false)}
            className="text-gray-600 hover:text-gray-800"
          >
            <HiOutlineX size={25} />
          </button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center">
            <DNA
              visible={true}
              height="60"
              width="60"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
            />
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col sm:flex-row items-start justify-between sm:items-center gap-2 mb-4 p-2 sm:p-0 border border-gray-200 sm:border-0 sm:mb-2 rounded-md"
            >
              <div className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleProductSelection(product, e.target.checked)
                  }
                  className="form-checkbox size-4 cursor-pointer"
                />
                <label className="flex-1 uppercase">{product.name}</label>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Quantity"
                  onChange={(e) =>
                    handleProductChange(product._id, "quantity", e.target.value)
                  }
                  className=" border border-gray-300 w-full sm:w-fit rounded-md px-2 py-1"
                />
                <input
                  type="number"
                  placeholder="Price"
                  defaultValue={product.originalPrice}
                  onChange={(e) =>
                    handleProductChange(
                      product._id,
                      "pricePerUnit",
                      e.target.value
                    )
                  }
                  className=" border border-gray-300 w-full sm:w-fit rounded-md px-2 py-1"
                />
              </div>
            </div>
          ))
        )}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowProductModal(false)}
            className="bg-gray-300 hover:bg-gray-400 cursor-pointer text-gray-800 px-4 py-2 rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProducts}
            className="bg-red-600 hover:bg-red-700 cursor-pointer  text-white px-4 py-2 rounded-md transition"
          >
            Save Products
          </button>
        </div>
      </div>
    </div>
  );
}
