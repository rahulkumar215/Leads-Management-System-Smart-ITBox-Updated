import { useState } from "react";
import * as XLSX from "xlsx";

const FileUploadProduct = ({ children, onFileData }) => {
  const [fileName, setFileName] = useState("No file chosen");
  const [error, setError] = useState("");

  const handleDownload = () => {
    // Sample data with headers for products
    const sampleData = [
      ["Product Name", "Rate"],
      ["Sample Product A", "100"],
      ["Sample Product B", "200"],
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample Data");
    XLSX.writeFile(workbook, "products_sample_data.xlsx");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setFileName("No file chosen");
      setError("");
      return;
    }

    const validMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];

    if (!validMimeTypes.includes(file.type)) {
      setFileName("Invalid file type");
      setError("Please upload a valid Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Validate header row
      if (
        jsonData[0] &&
        (jsonData[0][0] !== "Product Name" || jsonData[0][1] !== "Rate")
      ) {
        setError(
          "The uploaded Excel file must contain the columns in the order: Product Name, Rate."
        );
        setFileName(file.name);
        return;
      }

      // Process data (skip header row)
      const processedData = jsonData.slice(1).map((row) => ({
        productName: row[0] || "",
        rate: row[1] || "",
      }));

      // Optional: Validate each row’s data
      const invalidRows = processedData.some(
        (row) =>
          typeof row.productName !== "string" || typeof row.rate !== "string"
      );

      if (invalidRows) {
        setError(
          "Invalid data format in file. Please ensure all rows have valid data."
        );
        setFileName(file.name);
      } else {
        onFileData(processedData);
        setFileName(file.name);
        setError("");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="h-fit text-[1rem] w-fit">
      <h4 className="mb-2 text-black">{children}</h4>
      <div className="flex flex-col gap-2 rounded border border-black border-opacity-50 p-2">
        <div className="flex items-center gap-4">
          <label className="cursor-pointer rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
            Upload
            <input
              type="file"
              className="hidden"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
            />
          </label>
          <span className="text-gray-600">{fileName}</span>
          <button
            className="!bg-green-700 cursor-pointer hover:!bg-green-800 text-white px-2 py-1 !rounded-sm"
            onClick={handleDownload}
          >
            Format
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default FileUploadProduct;
