import React, { useContext, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { ThemeContext } from '../../context/ThemeContext'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FiPlus } from "react-icons/fi";


const EditLead = () => {

    const { backendUrl, navigate } = useContext(ThemeContext)
    const { leadId } = useParams()
    console.log('lead id',leadId);

    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [salesExecutive, setSalesExecutive] = useState('');
    const [salesExecutiveData,setSalesExecutiveData] = useState([])
    const [contactPersons, setContactPersons] = useState([{ name: '', designation: '', linkedInUrl: '', email: '', alternateEmail: "", phone: "", alternatePhone: "", whatsappNumber: '' }]);
    const token = localStorage.getItem('token');

    console.log('sale executive privous' , salesExecutive);

    // get all sales executive
    const getAllSalesExecutive = async () => {
        try {
            const response = await axios.get(backendUrl+'/api/lead/all-sales-executive')
            if(response.data.success){
                console.log(response.data.allSaleExecuitve);
                setSalesExecutiveData(response.data.allSaleExecuitve)
            }
        } catch (error) {
            console.log("Error while fetching sales executive",error);
        }
    }

    // fetch single lead data
    useEffect(() => {
        const fetchLead = async () => {
            try {
                const response = await axios.get(backendUrl + `/api/lead/single-lead/${leadId}`, { headers: { Authorization: `Bearer ${token}` } })
                const leadData = response.data.singleLead
                console.log('lead data',leadData);

                setCompanyName(leadData.companyName)
                setIndustry(leadData.industry)
                setSalesExecutive(leadData.assignedToSalesExecutive ? leadData.assignedToSalesExecutive._id : '')
                setContactPersons(leadData.contactPoints || [[{ name: '', designation: '', linkedInUrl: '', email: '', alternateEmail: "", phone: "", alternatePhone: "", whatsappNumber: '' }]]);
            } catch (error) {
                console.error('Error fetching lead:', error);
                toast.error('Failed to fetch lead data.');
            }
        }
        fetchLead()
    }, [leadId, backendUrl, token])

    const addContactPerson = () => {
        setContactPersons([...contactPersons, { name: '', designation: '', linkedInUrl: '', email: '', alternateEmail: "", phone: "", alternatePhone: "", whatsappNumber: '' }]);
    };

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...contactPersons];
        updatedContacts[index][field] = value;
        setContactPersons(updatedContacts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${backendUrl}/api/lead/edit/${leadId}`, {
                companyName,
                industry,
                contactPoints: contactPersons,
                assignedToSalesExecutive: salesExecutive
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (response?.data?.success) {
                toast.success('Lead updated successfully!');
                navigate('/analyst-dashboard');
            } else {
                toast.error("Something went wrong")
            }

        } catch (error) {
            console.error('Error updating lead:', error);
            toast.error('Failed to update lead.');
        }
    };

    useEffect(()=>{
        getAllSalesExecutive()
    },[])



    return (
        <div>
            <Layout>
                <h3 className='page_heading'>Edit Lead</h3>
                <form className='custom_form' onSubmit={handleSubmit}>
                    <div className='row company_details'>
                        <div className='col-lg-4'>
                            <label>Company Name:</label>
                            <input placeholder='Company Name' type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                        </div>
                        <div className='col-lg-4'>
                            <label>Industry:</label>
                            <input placeholder='Industry' type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
                        </div>
                        <div className='col-lg-4'>
                            {/* <label>Assign Sales Executive:</label>
                            <input value={salesExecutive.name} onChange={(e) => setSalesExecutive(e.target.value)} required /> */}

                            <div>
                                <label>Assign Sales Executive:</label>
                                    <select className='select_item_box' value={salesExecutive} onChange={(e)=>setSalesExecutive(e.target.value)}>
                                        <option value="">Select Sales Executive</option>
                                        {salesExecutiveData.map((data)=>(
                                            <option key={data._id} value={data._id}>{data.name}</option>
                                        ))}
                                    </select>
                                </div>
                        </div>
                    </div>

                    {/* Render Contact Persons */}
                    {contactPersons.map((contact, index) => (
                        <div className='contact_forms' key={index}>
                            <h6>Contact Person {index + 1}</h6>
                            <div className='row'>
                                <div className="col-lg-4">
                                    <input placeholder="Name" value={contact.name} onChange={(e) => handleContactChange(index, 'name', e.target.value)} />
                                </div>
                                <div className="col-lg-4">
                                    <input placeholder="Designation" value={contact.designation} onChange={(e) => handleContactChange(index, 'designation', e.target.value)} />
                                </div>
                                <div className="col-lg-4">
                                    <input placeholder="LinkedIn URL" value={contact.linkedInUrl} onChange={(e) => handleContactChange(index, 'linkedInUrl', e.target.value)} />
                                </div>
                                <div className="col-lg-4">
                                    <input placeholder="Email" value={contact.email} onChange={(e) => handleContactChange(index, 'email', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="Alternate Email" value={contact.alternateEmail} onChange={(e) => handleContactChange(index, 'alternateEmail', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="Phone" value={contact.phone} onChange={(e) => handleContactChange(index, 'phone', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="Alternate Phone" value={contact.alternatePhone} onChange={(e) => handleContactChange(index, 'alternatePhone', e.target.value)} />
                                </div>
                                <div className="col-lg-4">
                                    <input placeholder="WhatsApp Number" value={contact.whatsappNumber} onChange={(e) => handleContactChange(index, 'whatsappNumber', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className='contact_create_btns'>
                        <button className='global_btn' type="button" onClick={addContactPerson}>Add New Contact<FiPlus /></button>
                        <button className='global_btn' type="submit">Update Lead</button>
                    </div>
                </form>
            </Layout>
        </div>
    )
}

export default EditLead
