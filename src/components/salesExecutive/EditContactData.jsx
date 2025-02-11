import React, { useContext, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { ThemeContext } from '../../context/ThemeContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import call from '../../assets/call.png';
import mail from '../../assets/gmail.png';
import whatsapp from "../../assets/logo (2).png";
import linkedin from "../../assets/linkedin (1).png";
import managerAvtar from '../../assets/avatar-design.png';
import man from '../../assets/man.png';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const EditContactData = ({ refreshData }) => {

    const { backendUrl, navigate } = useContext(ThemeContext)
    const { leadId } = useParams()
    const token = localStorage.getItem("token")

    const [lead, setLead] = useState([]);
    // const [growthManagerId, setGrowthManagerId] = useState('');

    const [contactPointId, setContactPointId] = useState('')
    const [selectedContact, setSelectedContact] = useState('');
    const [interactionType, setInteractionType] = useState('call');
    const [callStatus, setCallStatus] = useState('');
    const [interestStatus, setInterestStatus] = useState('');
    const [mailStatus, setMailStatus] = useState('');
    const [linkedInStatus, setLinkedInStatus] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpTime, setFollowUpTime] = useState('');
    const [remark, setRemark] = useState('');
    const [growthManagerId, setGrowthManagerId] = useState('');
    const [growthManagers, setGrowthManagers] = useState([]);
    const [leadInteractions, setLeadInteraction] = useState([]);
    const [filterType, setFilterType] = useState(''); //for data filter
    const [filterContactName, setFilterContactName] = useState('');

    // const filteredInteractions = leadInteractions.filter((interaction) =>
    //     filterType ? interaction.interactionType === filterType : true
    // );

    const filteredInteractions = leadInteractions.filter((interaction) =>
        (filterType ? interaction.interactionType === filterType : true) &&
        (filterContactName ? interaction.contactName === filterContactName : true)
    );

    console.log("contact person id selection", contactPointId);
    console.log('growth manager id', growthManagerId);


    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/lead/sale-executive/single-lead/${leadId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLead(response.data.lead.contactPoints);
                console.log("sales executive single lead data", response.data.lead.contactPoints);
            } catch (error) {
                console.error('Error fetching lead:', error);
                toast.error('Error fetching lead details');
            }
        };

        fetchLead();
    }, [backendUrl, leadId, token]);

    useEffect(() => {
        // Fetch available Growth Managers
        const fetchGrowthManagers = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/lead/get/growth-manager?role=growth_manager');
                setGrowthManagers(response.data.users);
                console.log('Growth Manager List', response.data.users);
            } catch (error) {
                console.error('Error fetching Growth Managers:', error);
            }
        };

        fetchGrowthManagers();
    }, []);

    const handleInteractionSubmit = async () => {
        if (!contactPointId) {
            toast.error('Please select a contact person.');
            return;
        }

        console.log('selected contact after click', selectedContact, 'leadId', leadId);

        try {
            const payload = {
                leadId,
                contactPointId,
                interactionType,
                callStatus: interactionType === 'call' ? callStatus : undefined,
                mailStatus: interactionType === 'mail' ? mailStatus : undefined,
                linkedInStatus: interactionType === 'linkedin' ? linkedInStatus : undefined,
                followUpDate,
                followUpTime,
                remark,
            };

            // ✅ Only include `interestStatus` if it's a call that is NOT a "Wrong Number"
            if (interactionType === "call" && callStatus !== "Wrong Number") {
                payload.interestStatus = interestStatus;
            }

            console.log('all data selected input', payload);

            await axios.post(backendUrl + `/api/lead/add-interaction/${leadId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Interaction added successfully');
            getAllInteractions();
        } catch (error) {
            console.error('Error adding interaction:', error);
            toast.error('Failed to add interaction');
        }
    };


    // const handleAssignGrowthManager = async () => {
    //     if (!contactPointId) {
    //         toast.error('Please select a contact person.');
    //         return;
    //     }

    //     // Ensure contact person is marked as Interested before assigning
    //     const selectedContact = contacts.find(contact => contact._id === contactPointId);
    //     if (!selectedContact?.isInterested) {
    //         toast.error("❌ Contact person must be marked as Interested before assigning to a Growth Manager.");
    //         return;
    //     }

    //     try {
    //         const payload = {
    //             leadId,
    //             contactPointId,
    //             assignedToGrowthManager: growthManagerId,
    //         };

    //         console.log('📡 Assigning Growth Manager:', payload);

    //         console.log('all data selected input of growth', leadId, contactPointId, growthManagerId);

    //         const assigntogrowth = await axios.put(backendUrl + `/api/lead/assign-growth-manager/${leadId}`, payload, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         // refreshData();
    //         console.log("saved data growth manager", assigntogrowth);
    //         toast.success('Growth Manager assigned successfully');

    //         // Optional: Refresh data after assignment
    //         fetchLeads();

    //     } catch (error) {
    //         console.error('Error assigning Growth Manager:', error);
    //         alert('Failed to assign Growth Manager');
    //     }
    // };



    const handleAssignGrowthManager = async () => {
        if (!contactPointId) {
            toast.error('Please select a contact person.');
            return;
        }
    
        try {
            // ✅ Fetch latest lead data before validation
            const response = await axios.get(`${backendUrl}/api/lead/sale-executive/single-lead/${leadId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            const latestLeadData = response.data.lead.contactPoints; // ✅ Updated lead data
            setLead(latestLeadData); // ✅ Ensure state is updated
    
            // ✅ Find the selected contact from updated lead data
            const selectedContact = latestLeadData.find(contact => contact._id === contactPointId);
    
            console.log("📌 Updated Contact Data:", selectedContact);
    
            if (!selectedContact) {
                toast.error("❌ Contact person not found.");
                return;
            }
    
            // ✅ Ensure `isInterested` is true
            if (!selectedContact.isInterested) {
                toast.error("❌ Contact person must be marked as Interested before assigning to a Growth Manager.");
                return;
            }
    
            // ✅ Proceed with Growth Manager Assignment
            const payload = {
                leadId,
                contactPointId,
                assignedToGrowthManager: growthManagerId,
            };
    
            console.log('📡 Assigning Growth Manager:', payload);
    
            const assignResponse = await axios.put(`${backendUrl}/api/lead/assign-growth-manager/${leadId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Growth Manager assigned successfully:", assignResponse.data);
    
            // ✅ Check if response contains expected data structure
            if (assignResponse.data.contactPoint) {
                toast.success('Growth Manager assigned successfully');
    
                // ✅ Update only the assigned contact in state
                setLead(prevLead =>
                    prevLead.map(contact =>
                        contact._id === contactPointId
                            ? { ...contact, assignedToGrowthManager: growthManagerId }
                            : contact
                    )
                );
            } else {
                console.warn("⚠ No updated lead data found in response.");
            }
    
        } catch (error) {
            console.error('❌ Error assigning Growth Manager:', error);
            toast.error('Failed to assign Growth Manager');
        }
    };
    
    
    
    
    


    // get all integration
    const getAllInteractions = async () => {
        try {
            const response = await axios.get(backendUrl + `/api/lead/interaction/${leadId}`)
            if (response.data.success) {
                console.log(response.data.interactions);
                setLeadInteraction(response.data.interactions)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllInteractions()
    }, [])

    function formatDateTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();

        // Remove time parts for accurate comparisons
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };

        const time = date.toLocaleTimeString('en-US', options);

        if (date >= today) {
            return `Today, ${time}`;
        } else if (date >= yesterday) {
            return `Yesterday, ${time}`;
        } else {
            // Format older dates
            return `${date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}, ${time}`;
        }
    }

    return (
        <div>
            <Layout>
                <h3>All Contact Persons</h3>
                <div className='row'>
                    <div className="col-lg-8">
                        <div className='row'>
                            {lead.map((data) => (
                                <div key={data._id} className="col-lg-6">
                                    <div className='contact_person_details_card'>
                                        <div className='name_and_designation'><h5>{data.name}</h5> <div><img style={{ width: "28px", marginRight: "3px" }} src={man} /><span>{data.designation}</span></div></div>
                                        <p><img style={{ width: "21px", marginRight: "8px" }} src={call} />{data.phone} / {data.alternatePhone}</p>
                                        <p><img style={{ width: "21px", marginRight: "8px" }} src={mail} />{data.email}</p>
                                        <p><img style={{ width: "21px", marginRight: "8px" }} src={whatsapp} />{data.whatsappNumber}</p>
                                        <p><img style={{ width: "21px", marginRight: "8px" }} src={linkedin} />{data.linkedInUrl}</p>
                                        {/* <button onClick={()=>navigate(`/manage/interaction/${data._id}`)} className='global_btn'>Add Interation</button> */}
                                    </div>
                                </div>
                            ))}
                        </div>


                        <div className='row filter_row custom_form'>
                            <div className='col-lg-6'>
                                {/* Filter Dropdown */}
                                <div className="filter-container">
                                    <label>Filter by Interaction Type:</label>
                                    <select
                                        id="filterType"
                                        className="select_item_box"
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                    >
                                        <option value="">All</option>
                                        <option value="call">Call</option>
                                        <option value="mail">Mail</option>
                                        <option value="linkedin">LinkedIn</option>
                                    </select>
                                </div>
                            </div>

                            <div className='col-lg-6'>
                                {/* Filter by Contact Name */}
                                <div className="filter-container">
                                    <label>Filter by Contact Name:</label>
                                    <select
                                        id="filterContactName"
                                        className="select_item_box"
                                        value={filterContactName}
                                        onChange={(e) => setFilterContactName(e.target.value)}
                                    >
                                        <option value="">All</option>
                                        {lead.map((contact) => (
                                            <option key={contact._id} value={contact.name}>
                                                {contact.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        {/* Integraction data table start */}

                        <div className='row'>

                            {filteredInteractions.reverse().map((interaction) => (
                                <div key={interaction._id} className='col-lg-4'>
                                    <div className='interaction_card' style={{
                                        background:
                                            interaction.interactionType === "mail"
                                                ? " linear-gradient(120deg, #f6d365 0%, #fda085 100%)"
                                                : interaction.interactionType === "call"
                                                    ? "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%) "
                                                    : interaction.interactionType === "linkedin"
                                                        ? "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
                                                        : "gray", // Default color
                                    }}>
                                        <p className='interaction_name'>{interaction.contactName}</p>
                                        <p>Interaction Type: {interaction.interactionType}</p>
                                        <p><span style={{ marginRight: "5px" }}>Status:</span>
                                            {interaction.interactionType === 'mail' && interaction.mailStatus}
                                            {interaction.interactionType === 'call' && interaction.callStatus}
                                            {interaction.interactionType === 'linkedin' && interaction.linkedInStatus}
                                        </p>
                                        <p>Date: {formatDateTime(interaction.date)}</p>

                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Integraction data table end */}


                    </div>
                    <div className="col-lg-4 right_side_interaction_box">
                        <h3>Add Interactions</h3>
                        <div>
                            <div className='custom_form'>
                                {/* Contact Person Selection */}
                                <label>Select Contact Person:</label>
                                <select className='select_item_box' value={contactPointId} onChange={(e) => setContactPointId(e.target.value)}>
                                    <option value="">Select Contact Person</option>
                                    {lead.map((contact) => (
                                        <option key={contact._id} value={contact._id}>
                                            {contact.name} - {contact.designation}
                                        </option>
                                    ))}
                                </select>

                                {/* Interaction Form */}
                                <label>Interaction Type:</label>
                                <select className='select_item_box' value={interactionType} onChange={(e) => setInteractionType(e.target.value)}>
                                    <option value="call">Call</option>
                                    <option value="mail">Mail</option>
                                    <option value="linkedin">LinkedIn</option>
                                </select>

                                {interactionType === 'call' && (
                                    <>
                                        <label>Call Status:</label>
                                        <select className='select_item_box' value={callStatus} onChange={(e) => setCallStatus(e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="Call Connected">Call Connected</option>
                                            <option value="Busy">Busy</option>
                                            <option value="Wrong Number">Wrong Number</option>
                                            <option value="Switch Off">Switch Off</option>
                                        </select>

                                        <label>Interest Status:</label>
                                        <select className='select_item_box' value={interestStatus} onChange={(e) => setInterestStatus(e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="Interested">Interested</option>
                                            <option value="Not Interested">Not Interested</option>
                                            <option value="Call Later">Call Later</option>
                                        </select>
                                    </>
                                )}

                                {interactionType === 'mail' && (
                                    <>
                                        <label>Mail Status:</label>
                                        <select className='select_item_box' value={mailStatus} onChange={(e) => setMailStatus(e.target.value)}>
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

                                {interactionType === 'linkedin' && (
                                    <>
                                        <label>LinkedIn Status:</label>
                                        <select className='select_item_box' value={linkedInStatus} onChange={(e) => setLinkedInStatus(e.target.value)}>
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

                                <div className='data_and_time'>
                                    <div className='data_and_time_input'>
                                        <label>Follow-Up Date:</label>
                                        <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} />
                                    </div>

                                    <div className='data_and_time_input'>
                                        <label>Follow-Up Time:</label>
                                        <input type="time" value={followUpTime} onChange={(e) => setFollowUpTime(e.target.value)} />
                                    </div>
                                </div>

                                <label>Remark:</label>
                                <textarea placeholder='Any Message....' value={remark} onChange={(e) => setRemark(e.target.value)} />

                                <button className='global_btn' onClick={handleInteractionSubmit}>Save Interaction</button>

                                {/* Assign Growth Manager */}
                                {interestStatus === 'Interested' && (
                                    <div className='growth_manager_assign_box'>
                                        <h5>Assign Growth Manager</h5>
                                        <label>Select Growth Manager:</label>
                                        <select className='select_item_box' value={growthManagerId} onChange={(e) => setGrowthManagerId(e.target.value)}>
                                            <option value="">Select Growth Manager</option>
                                            {growthManagers.map((manager) => (
                                                <option key={manager._id} value={manager._id}>
                                                    {manager.name}
                                                </option>
                                            ))}
                                        </select>

                                        <button className='global_btn' onClick={handleAssignGrowthManager}>Assign Growth Manager</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default EditContactData
