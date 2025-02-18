export function ProductsTable({ stage }) {
  return (
    <div className="mt-2 w-fit">
      <div className="mb-8">
        <h4 className="text-md font-semibold mb-2">Products</h4>
        <div
          className="overflow-x-auto shadow-md rounded-lg border border-gray-200"
          style={{ scrollbarWidth: "thin" }}
        >
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-[#173B45] text-[#F8EDED] sticky top-0 z-10">
              <tr>
                <th className="px-2 py-1 text-sm  text-left font-semibold">
                  Product Name
                </th>
                <th className="px-2 py-1 text-sm font-semibold text-right">
                  Quantity
                </th>
                <th className="px-2 py-1 text-sm font-semibold text-right">
                  Price Per Unit
                </th>
                <th className="px-2 py-1 text-sm font-semibold text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {stage.products.map((product, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-200 divide-x divide-gray-200 hover:bg-gray-50"
                >
                  <td className="px-2 py-1 text-sm">{product.name || "N/A"}</td>
                  <td className="px-2 py-1 text-sm text-right">
                    {product.quantity || 0}
                  </td>
                  <td className="px-2 py-1 text-sm text-right">
                    ₹{product.pricePerUnit || 0}
                  </td>
                  <td className="px-2 py-1 text-sm text-right">
                    ₹{product.totalAmount || 0}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-500">
                <td
                  className="px-2 py-1 text-sm text-right border-t font-semibold border-gray-500"
                  colSpan="3"
                >
                  Total Revenue
                </td>
                <td className="px-2 py-1 text-sm text-right border-t border-gray-500">
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
      </div>
    </div>
  );
}
