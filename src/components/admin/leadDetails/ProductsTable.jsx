import { useState } from "react";
import ReactPaginate from "react-paginate";

// Products Table for a Stage with Pagination
export function ProductsTable({ stage }) {
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(stage.products.length / itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentData = stage.products.slice(offset, offset + itemsPerPage);

  return (
    <div className="mb-8">
      <h4 className="text-lg font-semibold mb-2">
        {stage.stage || ""} Products
      </h4>
      <div
        className="overflow-x-auto shadow-md rounded-lg border border-gray-200"
        style={{ scrollbarWidth: "thin" }}
      >
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-[#173B45] text-[#F8EDED] sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 text-sm  text-left font-semibold">
                Product Name
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-right">
                Quantity
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-right">
                Price Per Unit
              </th>
              <th className="px-4 py-2 text-sm font-semibold text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentData.map((product, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 divide-x divide-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-2 text-sm">{product.name || "N/A"}</td>
                <td className="px-4 py-2 text-sm text-right">
                  {product.quantity || 0}
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  ₹{product.pricePerUnit || 0}
                </td>
                <td className="px-4 py-2 text-sm text-right">
                  ₹{product.totalAmount || 0}
                </td>
              </tr>
            ))}
            <tr className="border-t border-gray-500">
              <td
                className="px-4 py-2 text-sm text-right border-t font-semibold border-gray-500"
                colSpan="3"
              >
                Total Revenue
              </td>
              <td className="px-4 py-2 text-sm text-right border-t border-gray-500">
                ₹
                {stage.products.reduce(
                  (sum, p) => sum + (p.totalAmount || 0),
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            Showing {offset + 1} to {offset + currentData.length} of{" "}
            {stage.products.length} entries
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
      )}
    </div>
  );
}
