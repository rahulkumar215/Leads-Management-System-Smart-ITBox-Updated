import React, { useContext, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const AddInteraction = ({leadId, contactPoints, refreshData}) => {

    console.log('lead id',leadId);

    const {backendUrl} = useContext(ThemeContext)
    const [selectedContact, setSelectedContact] = useState('');
    const [interactionType, setInteractionType] = useState('Call');
    const [callStatus, setCallStatus] = useState('');
    const [interestStatus, setInterestStatus] = useState('');
    const [mailStatus, setMailStatus] = useState('');
    const [linkedInStatus, setLinkedInStatus] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpTime, setFollowUpTime] = useState('');
    const [remark, setRemark] = useState('');
    const [growthManagerId, setGrowthManagerId] = useState('');
    const [growthManagers, setGrowthManagers] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch available Growth Managers
        const fetchGrowthManagers = async () => {
            try {
                const response = await axios.get(backendUrl+'/api/lead/get/growth-manager?role=growth_manager');
                setGrowthManagers(response.data.users);
                console.log(response.data.users);
            } catch (error) {
                console.error('Error fetching Growth Managers:', error);
            }
        };

        fetchGrowthManagers();
    }, []);

    const handleInteractionSubmit = async () => {
        if (!selectedContact) {
            toast.error('Please select a contact person.');
            return;
            
        }


        if (!token) {
            console.error("❌ Token is missing");
            toast.error("Authentication error: Token is missing");
            return;
        }

        try {
            const payload = {
                leadId,
                contactPointId: selectedContact,
                interactionType,
                callStatus: interactionType === 'Call' ? callStatus : undefined,
                interestStatus: interactionType === 'Call' ? interestStatus : undefined,
                mailStatus: interactionType === 'Mail' ? mailStatus : undefined,
                linkedInStatus: interactionType === 'LinkedIn' ? linkedInStatus : undefined,
                followUpDate,
                followUpTime,
                remark,
            };

            await axios.post('/api/lead/add-interaction', payload,{
                headers: { Authorization: `Bearer ${token}` },
            });
            refreshData();
            toast.success('Interaction added successfully');
        } catch (error) {
            console.error('Error adding interaction:', error);
            toast.error('Failed to add interaction');
        }
    };

    const handleAssignGrowthManager = async () => {
        if (!selectedContact) {
            toast.error('Please select a contact person.');
            return;
        }

        try {
            const payload = {
                leadId,
                contactPointId: selectedContact,
                growthManagerId,
            };

            await axios.post('/api/lead/assign-growth-manager', payload);
            refreshData();
            toast.success('Growth Manager assigned successfully');
        } catch (error) {
            console.error('Error assigning Growth Manager:', error);
            toast.error('Failed to assign Growth Manager');
        }
    };

    console.log('lead id 2',leadId);


  return (
    <div>
      <Layout>
        <h3>Add Interactions</h3>
        <div>
        <div>
            {/* Contact Person Selection */}
            {/* <label>Select Contact Person:</label>
            <select value={selectedContact} onChange={(e) => setSelectedContact(e.target.value)}>
                <option value="">Select Contact Person</option>
                {contactPoints.map((contact) => (
                    <option key={contact._id} value={contact._id}>
                        {contact.name} - {contact.designation}
                    </option>
                ))}
            </select> */}

            {/* Interaction Form */}
            <label>Interaction Type:</label>
            <select value={interactionType} onChange={(e) => setInteractionType(e.target.value)}>
                <option value="Call">Call</option>
                <option value="Mail">Mail</option>
                <option value="LinkedIn">LinkedIn</option>
            </select>

            {interactionType === 'Call' && (
                <>
                    <label>Call Status:</label>
                    <select value={callStatus} onChange={(e) => setCallStatus(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Call Connected">Call Connected</option>
                        <option value="Busy">Busy</option>
                        <option value="Wrong Number">Wrong Number</option>
                        <option value="Switch Off">Switch Off</option>
                    </select>

                    <label>Interest Status:</label>
                    <select value={interestStatus} onChange={(e) => setInterestStatus(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Call Later">Call Later</option>
                    </select>
                </>
            )}

            {interactionType === 'Mail' && (
                <>
                    <label>Mail Status:</label>
                    <select value={mailStatus} onChange={(e) => setMailStatus(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Cold Mail Done">Cold Mail Done</option>
                        <option value="Introductory Mail Done">Introductory Mail Done</option>
                        <option value="Follow Up on Cold Mail Done">Follow Up on Cold Mail Done</option>
                        <option value="Follow Up on Introductory Mail Done">
                            Follow Up on Introductory Mail Done
                        </option>
                    </select>
                </>
            )}

            {interactionType === 'LinkedIn' && (
                <>
                    <label>LinkedIn Status:</label>
                    <select value={linkedInStatus} onChange={(e) => setLinkedInStatus(e.target.value)}>
                        <option value="">Select</option>
                        <option value="Cold Message Done">Cold Message Done</option>
                        <option value="Introductory Message Done">Introductory Message Done</option>
                        <option value="Follow Up on Cold Message Done">Follow Up on Cold Message Done</option>
                        <option value="Follow Up on Introductory Message Done">
                            Follow Up on Introductory Message Done
                        </option>
                        <option value="Conversation on LinkedIn">Conversation on LinkedIn</option>
                    </select>
                </>
            )}

            <label>Follow-Up Date:</label>
            <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />

            <label>Follow-Up Time:</label>
            <input type="time" value={followUpTime} onChange={(e) => setFollowUpTime(e.target.value)} />

            <label>Remark:</label>
            <textarea value={remark} onChange={(e) => setRemark(e.target.value)} />

            <button onClick={handleInteractionSubmit}>Save Interaction</button>

            {/* Assign Growth Manager */}
            {interestStatus === 'Interested' && (
                <div>
                    <h3>Assign Growth Manager</h3>
                    <label>Select Growth Manager:</label>
                    <select value={growthManagerId} onChange={(e) => setGrowthManagerId(e.target.value)}>
                        <option value="">Select Growth Manager</option>
                        {growthManagers.map((manager) => (
                            <option key={manager._id} value={manager._id}>
                                {manager.name}
                            </option>
                        ))}
                    </select>

                    <button onClick={handleAssignGrowthManager}>Assign Growth Manager</button>
                </div>
            )}
        </div>
        </div>
      </Layout>
    </div>
  )
}

export default AddInteraction
