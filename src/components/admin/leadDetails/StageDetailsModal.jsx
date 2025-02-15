// StageDetailsModal.jsx
import Modal from "react-modal";
import { ProductsTable } from "./ProductsTable";

export const StageDetailsModal = ({
  modalIsOpen,
  closeModal,
  selectedStage,
}) => {
  console.log(selectedStage);
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Stage Details"
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        },
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "600px",
          width: "90%",
          padding: 0,
          border: "none",
          background: "transparent",
          zIndex: 1001,
        },
      }}
    >
      {selectedStage && (
        <div className="bg-white shadow-md rounded-lg border border-gray-300 p-4">
          <div className="flex items-center mb-2">
            <h2 className="text-2xl font-bold">{selectedStage.stage}</h2>
            <span
              className={`ml-3 inline-block px-2 py-1 text-xs font-semibold text-white rounded ${
                selectedStage.completed
                  ? "bg-green-700"
                  : "bg-yellow-500 !text-black"
              }`}
            >
              {selectedStage.completed ? "Completed" : "Pending"}
            </span>
          </div>
          <p className="mb-1">
            <strong>Deadline:</strong>{" "}
            {selectedStage.tatDeadline &&
              new Date(selectedStage.tatDeadline).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
          </p>
          <p className="mb-1">
            <strong>Remark:</strong> {selectedStage.remark}
          </p>
          {selectedStage.products && selectedStage.products.length > 0 && (
            <div className="products-section mt-4">
              <ProductsTable stage={{ products: selectedStage.products }} />
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="mt-5 px-3 py-1 bg-slate-600 text-white rounded-md cursor-pointer hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default StageDetailsModal;
