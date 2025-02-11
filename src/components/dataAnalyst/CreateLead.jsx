import React, { useContext, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import axios from 'axios'
import { FiPlus } from "react-icons/fi";
import { toast } from 'react-toastify';
import { ThemeContext } from '../../context/ThemeContext';


const CreateLead = () => {

    const { backendUrl,navigate } = useContext(ThemeContext)

    const [companyName, setCompanyName] = useState('')
    const [industry, setIndustry] = useState('')
    const [salesExecutive, setSalesExecutive] = useState('')
    const [salesExecutiveData,setSalesExecutiveData] = useState([])
    const [contactPersons, setContactPersons] = useState([{ name: '', designation: '', linkedInUrl: '', email: '', alternateEmail: "", phone: "", alternatePhone: "", whatsappNumber: '' }]);

    const token = localStorage.getItem('token')


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

    const addContactPerson = () => {
        setContactPersons([...contactPersons, { name: "", designation: "", linkedInUrl: "", email: "", alternateEmail: "", phone: "", alternatePhone: "", whatsappNumber: "" }])
    }

    const handleContactChange = (index, field, value) => {
        const updatedContacts = [...contactPersons];
        updatedContacts[index][field] = value;
        setContactPersons(updatedContacts)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(backendUrl + '/api/lead/create', {
                companyName,
                industry,
                contactPoints: contactPersons,
                assignedToSalesExecutive: salesExecutive || null // Send null if no sales executive is selected
            }, { headers: { Authorization: `Bearer ${token}` } });
            // alert('Lead created successfully!');
            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/analyst-dashboard');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error creating lead.');
        }
    }

    useEffect(()=>{
        getAllSalesExecutive()
    },[])


    return (
        // <div>
            <Layout>
                <h3 className='page_heading'>Create Lead</h3>
                <div>
                    <form className='custom_form' onSubmit={handleSubmit}>
                        <div className='row company_details'>
                            <div className='col-lg-4'>
                                <div>
                                    <label>Company Name:</label>
                                    <input placeholder='Company Name' type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
                                </div>
                            </div>

                            <div className='col-lg-4'>
                                <div>
                                    <label>Industry:</label>
                                    <input placeholder='Industry' type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} required />
                                </div>
                            </div>

                            <div className='col-lg-4'>
                                {/* <div>
                                    <label>Assign Sales Executive:</label>
                                    <input value={salesExecutive} onChange={(e) => setSalesExecutive(e.target.value)} required />
                                </div> */}
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




                        {/* Render First Contact Person by Default */}
                        <div className='contact_forms first_contact_form'>
                            <h6>Contact Persons 1</h6>
                            <div className='row'>
                                <div className="col-lg-4">
                                    <input placeholder="Name" onChange={(e) => handleContactChange(0, 'name', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="Designation" onChange={(e) => handleContactChange(0, 'designation', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="LinkedIn URL" onChange={(e) => handleContactChange(0, 'linkedInUrl', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="Email" onChange={(e) => handleContactChange(0, 'email', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="Alternate Email (Optional)" onChange={(e) => handleContactChange(0, 'alternateEmail', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="Phone" onChange={(e) => handleContactChange(0, 'phone', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="Alternate Phone No. (Optional)" onChange={(e) => handleContactChange(0, 'alternatePhone', e.target.value)} />
                                </div>

                                <div className="col-lg-4">
                                    <input placeholder="WhatsApp Number" onChange={(e) => handleContactChange(0, 'whatsappNumber', e.target.value)} />
                                </div>



                            </div>
                        </div>

                        {/* Render Additional Contact Persons */}
                        <div >
                            {contactPersons.slice(1).map((contact, index) => (
                                <div className='contact_forms' key={index}>
                                    <h6>Contact Persons {index + 2}</h6>
                                    <div className='row'>
                                        <div className="col-lg-4">
                                            <input placeholder="Name" onChange={(e) => handleContactChange(index + 1, 'name', e.target.value)} />

                                        </div>
                                        <div className="col-lg-4">
                                            <input placeholder="Designation" onChange={(e) => handleContactChange(index + 1, 'designation', e.target.value)} />

                                        </div>
                                        <div className="col-lg-4">
                                            <input placeholder="LinkedIn URL" onChange={(e) => handleContactChange(index + 1, 'linkedInUrl', e.target.value)} />

                                        </div>
                                        <div className="col-lg-4">
                                            <input placeholder="Email" onChange={(e) => handleContactChange(index + 1, 'email', e.target.value)} />

                                        </div>

                                        <div className="col-lg-4">
                                            <input placeholder="Alternate Email (Optional)" onChange={(e) => handleContactChange(index + 1, 'alternateEmail', e.target.value)} />
                                        </div>

                                        <div className="col-lg-4">
                                            <input placeholder="Phone" onChange={(e) => handleContactChange(index + 1, 'phone', e.target.value)} />
                                        </div>

                                        <div className="col-lg-4">
                                            <input placeholder="Alternate Phone No. (Optional)" onChange={(e) => handleContactChange(index +1, 'alternatePhone', e.target.value)} />
                                        </div>

                                        <div className="col-lg-4">
                                            <input placeholder="WhatsApp Number" onChange={(e) => handleContactChange(index + 1, 'whatsappNumber', e.target.value)} />

                                        </div>
                                        <div className="col-lg-4"></div>
                                        <div className="col-lg-4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='contact_create_btns'>
                            <button className='global_btn' type="submit">Create Lead</button>
                            <button className='global_btn blue_btn' type="button" onClick={addContactPerson}>Add New Contact<FiPlus /></button>
                        </div>
                    </form>
                </div>
            </Layout>
        // </div>
    )
}

export default CreateLead
