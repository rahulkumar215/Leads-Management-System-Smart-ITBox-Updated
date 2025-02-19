import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DNA } from "react-loader-spinner";
import Modal from "react-modal";
import { ThemeContext } from "./../../context/ThemeContext";
import Layout from "./../common/Layout";
import StagesTimeline from "./leadDetails/StagesTimelin";
import { ContactPersonsTable } from "./leadDetails/ContactPersonsTable";
import { ProductsTable } from "./leadDetails/ProductsTable";
import StageDetailsModal from "./leadDetails/StageDetailsModal";

// You can optionally set your app element for accessibility
Modal.setAppElement("#root");

const LeadDetails = () => {
  const { backendUrl } = useContext(ThemeContext);
  const { leadId } = useParams();
  const token = localStorage.getItem("token");

  const [lead, setLead] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchLeadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetching lead details with id
  const fetchLeadDetails = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/admin/getLeadDetailsForAdmin/${leadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response:", response.data);
      setLead(response.data.lead);
    } catch (error) {
      console.error("❌ Error fetching lead details:", error);
    }
  };

  const openModal = (stage) => {
    setSelectedStage(stage);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedStage(null);
    setModalIsOpen(false);
  };

  if (!lead) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <DNA
            visible={true}
            height="100"
            width="100"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-2 grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 h-full">
        <div className=" grid grid-cols-1  sm:grid-cols-2 gap-y-4">
          <div className=" col-start-1 col-span-1 order-1 sm:order-[0]">
            <div className="mb-4">
              <span className="text-2xl font-semibold tracking-wide text-gray-600">
                Lead ID:
              </span>{" "}
              <span
                className={`text-2xl font-semibold tracking-wide px-2 py-1 text-white rounded-md ${
                  lead.status === "open" ? "bg-green-700" : "bg-red-700"
                }`}
              >
                {lead._id.slice(-5).toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-md text-gray-700 font-semibold mr-2">
                Company Name:
              </span>
              <span className="text-md font-semibold ">
                {lead.companyName || "Unknown"}
              </span>
            </div>
            <div>
              <span className="text-md text-gray-700 font-semibold mr-2">
                Sales Executive:
              </span>
              <span className="text-md font-semibold ">
                {lead.assignedToSalesExecutive || "Not Assigned"}
              </span>
            </div>
            <div>
              <span className="text-md text-gray-700 font-semibold mr-2">
                Data Analyst:
              </span>
              <span className="text-md font-semibold ">
                {lead.createdBy || "N/A"}
              </span>
            </div>
            {lead.isCompanyLost && (
              <p className="bg-red-700 text-lg mt-4 text-white px-2 py-1 rounded-md text-left">
                Lost Reason: {lead.companyLostReason}
              </p>
            )}
          </div>

          <div
            className={`w-full px-3 py-1 text-xl rounded-md text-white sm:size-fit justify-self-end  ${
              lead.status === "open" ? "bg-green-700" : "bg-red-700"
            }`}
          >
            {lead.status.toUpperCase()}
          </div>

          {/* Contact Persons */}
          <ContactPersonsTable
            contactPoints={lead.contactPoints}
            className=" col-start-1 col-span-2 order-1 sm:order-[0]"
          />
        </div>

        <div className=" bg-gray-50 rounded-lg shadow-lg">
          <h3 className="px-5 text-2xl font-semibold text-gray-800">
            Process Pipeline Stages
          </h3>
          <StagesTimeline lead={lead} openModal={openModal} />
        </div>

        <StageDetailsModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          selectedStage={selectedStage}
        />
      </div>
    </Layout>
  );
};

export default LeadDetails;
