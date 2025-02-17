import React, { useContext, useEffect, useState } from "react";
import Layout from "../common/Layout";
import { ThemeContext } from "../../context/ThemeContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { Bars, DNA } from "react-loader-spinner";

const EditLead = () => {
  const { backendUrl, navigate } = useContext(ThemeContext);
  const { leadId } = useParams();

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [salesExecutive, setSalesExecutive] = useState("");
  const [salesExecutiveData, setSalesExecutiveData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [contactPersons, setContactPersons] = useState([
    {
      name: "",
      designation: "",
      linkedInUrl: "",
      email: "",
      alternateEmail: "",
      phone: "",
      alternatePhone: "",
      whatsappNumber: "",
    },
  ]);

  const token = localStorage.getItem("token");

  // Fetch all sales executives
  const getAllSalesExecutive = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/lead/all-sales-executive"
      );
      if (response.data.success) {
        setSalesExecutiveData(response.data.allSaleExecuitve);
      }
    } catch (error) {
      console.log("Error while fetching sales executive", error);
    }
  };

  // Fetch single lead data
  useEffect(() => {
    const fetchLead = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/lead/single-lead/${leadId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const leadData = response.data.singleLead;
        setCompanyName(leadData.companyName);
        setIndustry(leadData.industry);
        setSalesExecutive(
          leadData.assignedToSalesExecutive
            ? leadData.assignedToSalesExecutive._id
            : ""
        );
        setContactPersons(
          leadData.contactPoints || [
            {
              name: "",
              designation: "",
              linkedInUrl: "",
              email: "",
              alternateEmail: "",
              phone: "",
              alternatePhone: "",
              whatsappNumber: "",
            },
          ]
        );
      } catch (error) {
        console.error("Error fetching lead:", error);
        toast.error("Failed to fetch lead data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLead();
  }, [leadId, backendUrl, token]);

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      {
        name: "",
        designation: "",
        linkedInUrl: "",
        email: "",
        alternateEmail: "",
        phone: "",
        alternatePhone: "",
        whatsappNumber: "",
      },
    ]);
  };

  const handleContactChange = (index, field, value) => {
    const updatedContacts = [...contactPersons];
    updatedContacts[index][field] = value;
    setContactPersons(updatedContacts);
  };

  // Delete a contact person by index
  const handleDeleteContact = (index) => {
    if (contactPersons.length === 1) {
      toast.error("At least one contact person is required.");
      return;
    }
    const updatedContacts = [...contactPersons];
    updatedContacts.splice(index, 1);
    setContactPersons(updatedContacts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await axios.put(
        `${backendUrl}/api/lead/edit/${leadId}`,
        {
          companyName,
          industry,
          contactPoints: contactPersons,
          assignedToSalesExecutive: salesExecutive,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.success) {
        toast.success("Lead updated successfully!");
        navigate("/analyst-lead");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error("Failed to update lead.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    getAllSalesExecutive();
  }, []);

  if (isLoading) {
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
      <div className="p-2">
        {isSaving && (
          <div className="absolute inset-0 flex justify-center h-full items-center bg-white/30 z-1000">
            <Bars
              height="40"
              width="40"
              color="#B43F3F"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        )}
        <h3 className="text-2xl font-semibold mb-4">Edit Lead</h3>
        <div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
              <div className="w-full">
                <label>
                  Company Name{" "}
                  <span className="text-red-600 font-semibold">*</span>
                </label>
                <input
                  placeholder="Company Name"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="w-full px-2 bg-white sm:bg-gray-50 py-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-full">
                <label>
                  Industry <span className="text-red-600 font-semibold">*</span>
                </label>
                <input
                  placeholder="Industry"
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  required
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-full">
                <label>Assign Sales Executive</label>
                <select
                  className="w-full px-2 py-1 border border-gray-300 rounded-md"
                  value={salesExecutive}
                  onChange={(e) => setSalesExecutive(e.target.value)}
                >
                  <option value="">Select Sales Executive</option>
                  {salesExecutiveData.map((data) => (
                    <option key={data._id} value={data._id}>
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden sm:grid grid-cols-[repeat(8,_1fr)_20px] gap-2 mb-2 bg-gray-300 py-1 rounded-md font-semibold tracking-wide text-sm">
              <span className="pl-2">
                Name <span className="text-red-600 font-semibold">*</span>
              </span>
              <span>
                Designation{" "}
                <span className="text-red-600 font-semibold">*</span>
              </span>
              <span>LinkedIn</span>
              <span>
                Email <span className="text-red-600 font-semibold">*</span>
              </span>
              <span>Alt. Email</span>
              <span>
                Phone <span className="text-red-600 font-semibold">*</span>
              </span>
              <span>Alt. Phone</span>
              <span>
                WhatsApp No.{" "}
                <span className="text-red-600 font-semibold">*</span>
              </span>
              <span>&nbsp;</span>
            </div>

            {/* Render Contact Persons */}
            <div>
              {contactPersons.map((contact, index) => (
                <div
                  key={index}
                  className="rounded-md bg-gray-50 sm:bg-white p-2 sm:p-0 mb-4 sm:mb-0 shadow-md sm:shadow-none"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="text-lg font-semibold block text-gray-500 sm:hidden">
                      Contact Person {index + 1}
                    </h6>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[repeat(8,_1fr)_20px] gap-2">
                    <div className="w-full">
                      <input
                        placeholder="Name *"
                        value={contact.name}
                        onChange={(e) =>
                          handleContactChange(index, "name", e.target.value)
                        }
                        required
                        className="w-full px-2 bg-white sm:bg-gray-50 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        placeholder="Designation *"
                        value={contact.designation}
                        onChange={(e) =>
                          handleContactChange(
                            index,
                            "designation",
                            e.target.value
                          )
                        }
                        required
                        className="w-full px-2 bg-white sm:bg-gray-50 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        placeholder="LinkedIn URL"
                        value={contact.linkedInUrl}
                        onChange={(e) =>
                          handleContactChange(
                            index,
                            "linkedInUrl",
                            e.target.value
                          )
                        }
                        className="w-full px-2 bg-white sm:bg-gray-50 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        placeholder="Email *"
                        value={contact.email}
                        onChange={(e) =>
                          handleContactChange(index, "email", e.target.value)
                        }
                        required
                        className="w-full px-2 bg-white sm:bg-gray-50 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        placeholder="Alt. Email (Optional)"
                        value={contact.alternateEmail}
                        onChange={(e) =>
                          handleContactChange(
                            index,
                            "alternateEmail",
                            e.target.value
                          )
                        }
                        className="w-full px-2 bg-white sm:bg-gray-50 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        placeholder="Phone *"
                        value={contact.phone}
                        onChange={(e) =>
                          handleContactChange(index, "phone", e.target.value)
                        }
                        required
                        className="w-full px-2 bg-white sm:bg-gray-50 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        placeholder="Alt. Phone No. (Optional)"
                        value={contact.alternatePhone}
                        onChange={(e) =>
                          handleContactChange(
                            index,
                            "alternatePhone",
                            e.target.value
                          )
                        }
                        className="w-full px-2 bg-white sm:bg-gray-50 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    <div className="w-full">
                      <input
                        placeholder="WhatsApp Number *"
                        value={contact.whatsappNumber}
                        onChange={(e) =>
                          handleContactChange(
                            index,
                            "whatsappNumber",
                            e.target.value
                          )
                        }
                        required
                        className="w-full px-2 bg-white sm:bg-gray-50 py-1 text-sm border border-gray-300 rounded-md"
                      />
                    </div>
                    {contactPersons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteContact(index)}
                        className="sm:text-red-500 sm:hover:text-red-700 cursor-pointer flex items-center justify-center bg-red-500 p-1 text-white sm:bg-white sm:p-0 rounded-md gap-1"
                      >
                        <FiTrash2 size={20} />
                        <span className="block sm:hidden text-lg">Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-end mt-4">
              <button
                type="button"
                onClick={addContactPerson}
                className="px-4 py-2 flex items-center cursor-pointer gap-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <FiPlus size={20} />
                Add More
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 cursor-pointer text-white rounded-md hover:bg-red-700"
              >
                {isSaving ? (
                  <Bars
                    height="20"
                    width="20"
                    color="#ffffff"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ) : (
                  "Update Lead"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditLead;
