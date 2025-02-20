import { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ContactsCarousel } from "./ContactsCarousel";
import { InteractionsTable } from "./InteractionTable";
import { AddInteractionForm } from "./AddInteraction";
import { DNA } from "react-loader-spinner";

const EditContactData = () => {
  const { backendUrl } = useContext(ThemeContext);
  const { leadId } = useParams();
  const token = localStorage.getItem("token");

  const [leadContacts, setLeadContacts] = useState([]);
  const [growthManagers, setGrowthManagers] = useState([]);
  const [leadInteractions, setLeadInteractions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState({
    lead: true,
    interactions: true,
  });

  // Fetch leadContacts contacts
  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/lead/sale-executive/single-lead/${leadId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLeadContacts(response.data.lead.contactPoints);
      } catch (error) {
        console.error("Error fetching lead:", error);
        toast.error("Error fetching lead details");
      } finally {
        setIsDataLoading((prev) => ({ ...prev, lead: false }));
      }
    };
    fetchLead();
  }, [backendUrl, leadId, token]);

  // Fetch Growth Managers
  useEffect(() => {
    const fetchGrowthManagers = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/lead/get/growth-manager?role=growth_manager`
        );
        setGrowthManagers(response.data.users);
      } catch (error) {
        console.error("Error fetching Growth Managers:", error);
      }
    };
    fetchGrowthManagers();
  }, [backendUrl]);

  // Fetch interactions

  useEffect(() => {
    getAllInteractions();
  }, [backendUrl, leadId]);

  const getAllInteractions = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/lead/interaction/${leadId}`
      );
      if (response.data.success) {
        setLeadInteractions(response.data.interactions);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDataLoading((prev) => ({ ...prev, interactions: false }));
    }
  };

  if (Object.values(isDataLoading).some((value) => value === true)) {
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
      <div className="container mx-auto p-2">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
          <h3 className="text-2xl font-semibold">Lead Interactions</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-red-600 text-white w-full sm:w-fit cursor-pointer rounded-md hover:bg-red-700 focus:outline-none"
          >
            Add Interactoins
          </button>
        </div>
        {/* Contacts Carousel */}
        <div className=" w-[80%] mx-auto">
          <ContactsCarousel contacts={leadContacts} />
        </div>

        {/* Interactions Table */}
        <InteractionsTable interactions={leadInteractions} />

        {/* Add Interaction Form */}
        {isModalOpen && (
          <AddInteractionForm
            contacts={leadContacts}
            growthManagers={growthManagers}
            backendUrl={backendUrl}
            leadId={leadId}
            token={token}
            refreshInteractions={getAllInteractions}
            closeModal={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default EditContactData;
