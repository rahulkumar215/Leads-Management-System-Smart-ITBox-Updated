import axios from "axios";
import { useState } from "react";
import { HiOutlineX } from "react-icons/hi";
import { toast } from "react-toastify";

export const AddInteractionForm = ({
  contacts,
  growthManagers,
  backendUrl,
  leadId,
  token,
  refreshInteractions,
  closeModal,
}) => {
  const [contactPointId, setContactPointId] = useState("");
  const [interactionType, setInteractionType] = useState("call");
  const [callStatus, setCallStatus] = useState("");
  const [interestStatus, setInterestStatus] = useState("");
  const [mailStatus, setMailStatus] = useState("");
  const [linkedInStatus, setLinkedInStatus] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  const [remark, setRemark] = useState("");
  const [growthManagerId, setGrowthManagerId] = useState("");

  const handleInteractionSubmit = async () => {
    if (!contactPointId) {
      toast.error("Please select a contact person.");
      return;
    }

    try {
      const payload = {
        leadId,
        contactPointId,
        interactionType,
        callStatus: interactionType === "call" ? callStatus : undefined,
        mailStatus: interactionType === "mail" ? mailStatus : undefined,
        linkedInStatus:
          interactionType === "linkedin" ? linkedInStatus : undefined,
        followUpDate,
        followUpTime,
        remark,
      };

      if (interactionType === "call" && callStatus !== "Wrong Number") {
        payload.interestStatus = interestStatus;
      }

      await axios.post(
        `${backendUrl}/api/lead/add-interaction/${leadId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Interaction added successfully");
      refreshInteractions();

      // Automatically assign Growth Manager if the contact is Interested and a manager is selected
      if (interestStatus === "Interested" && growthManagerId) {
        const assignPayload = {
          leadId,
          contactPointId,
          assignedToGrowthManager: growthManagerId,
        };

        try {
          const assignResponse = await axios.put(
            `${backendUrl}/api/lead/assign-growth-manager/${leadId}`,
            assignPayload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (assignResponse.data.contactPoint) {
            toast.success("Growth Manager assigned successfully");
          } else {
            console.warn("No updated lead data found in response.");
          }
        } catch (error) {
          console.error("Error assigning Growth Manager:", error);
          toast.error("Failed to assign Growth Manager");
        }
      }

      // Reset form fields
      setContactPointId("");
      setInteractionType("call");
      setCallStatus("");
      setInterestStatus("");
      setMailStatus("");
      setLinkedInStatus("");
      setFollowUpDate("");
      setFollowUpTime("");
      setRemark("");
      setGrowthManagerId("");
      closeModal();
    } catch (error) {
      console.error("Error adding interaction:", error);
      toast.error("Failed to add interaction");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/50 flex justify-center items-center z-50">
      <div className="relative bg-white p-4 m-4 rounded-lg shadow-lg w-full sm:w-[30rem] max-h-[90vh] overflow-x-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-slate-800">
            Add Interaction
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-600 cursor-pointer hover:text-red-800"
          >
            <HiOutlineX size={24} />
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Contact Person:
            </label>
            <select
              value={contactPointId}
              onChange={(e) => setContactPointId(e.target.value)}
              className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="">Select Contact Person</option>
              {contacts.map((contact) => (
                <option key={contact._id} value={contact._id}>
                  {contact.name} - {contact.designation}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interaction Type:
            </label>
            <select
              value={interactionType}
              onChange={(e) => setInteractionType(e.target.value)}
              className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="call">Call</option>
              <option value="mail">Mail</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
          {interactionType === "call" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Call Status:
                </label>
                <select
                  value={callStatus}
                  onChange={(e) => setCallStatus(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">Select</option>
                  <option value="Call Connected">Call Connected</option>
                  <option value="Busy">Busy</option>
                  <option value="Wrong Number">Wrong Number</option>
                  <option value="Switch Off">Switch Off</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Status:
                </label>
                <select
                  value={interestStatus}
                  onChange={(e) => setInterestStatus(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
                >
                  <option value="">Select</option>
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Call Later">Call Later</option>
                </select>
              </div>
            </>
          )}

          {interestStatus === "Interested" && interactionType === "call" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Growth Manager:
              </label>
              <select
                value={growthManagerId}
                onChange={(e) => setGrowthManagerId(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select Growth Manager</option>
                {growthManagers.map((manager) => (
                  <option key={manager._id} value={manager._id}>
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {interactionType === "mail" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mail Status:
              </label>
              <select
                value={mailStatus}
                onChange={(e) => setMailStatus(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select</option>
                <option value="Cold Mail Done">Cold Mail Done</option>
                <option value="Introductory Mail Done">
                  Introductory Mail Done
                </option>
                <option value="Follow Up on Cold Mail Done">
                  Follow Up on Cold Mail Done
                </option>
                <option value="Follow Up on Introductory Mail Done">
                  Follow Up on Introductory Mail Done
                </option>
              </select>
            </div>
          )}
          {interactionType === "linkedin" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Status:
              </label>
              <select
                value={linkedInStatus}
                onChange={(e) => setLinkedInStatus(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
              >
                <option value="">Select</option>
                <option value="Cold Message Done">Cold Message Done</option>
                <option value="Introductory Message Done">
                  Introductory Message Done
                </option>
                <option value="Follow Up on Cold Message Done">
                  Follow Up on Cold Message Done
                </option>
                <option value="Follow Up on Introductory Message Done">
                  Follow Up on Introductory Message Done
                </option>
                <option value="Conversation on LinkedIn">
                  Conversation on LinkedIn
                </option>
              </select>
            </div>
          )}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow-Up Date:
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow-Up Time:
              </label>
              <input
                type="time"
                value={followUpTime}
                onChange={(e) => setFollowUpTime(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remark:
            </label>
            <textarea
              placeholder="Any Message...."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring focus:ring-blue-300"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2 bg-gray-200 text-gray-700 cursor-pointer rounded-md hover:bg-gray-300 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleInteractionSubmit}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer py-2 px-4 rounded-md"
            >
              Save Interaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
