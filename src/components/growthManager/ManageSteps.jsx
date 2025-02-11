import React, { useContext, useEffect, useState } from 'react';
import Layout from '../common/Layout';
import { ThemeContext } from '../../context/ThemeContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ManageSteps = () => {
    const { backendUrl } = useContext(ThemeContext);
    const { leadId } = useParams();
    const token = localStorage.getItem('token');

    const [stages, setStages] = useState([]);
    const [isCompanyLost, setIsCompanyLost] = useState(false);
    const [companyLostReason, setCompanyLostReason] = useState('');
    const [newStage, setNewStage] = useState({
        stage: '',
        callDate: new Date().toISOString().split('T')[0],
        followUpDate: '',
        followUpTime: '',
        remark: '',
        uselessLead: false,
        products: [],
        totalPrice: 0,
        tatDeadline: ''
    });

    const [tatAlert, setTatAlert] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showFollowUpFields, setShowFollowUpFields] = useState(false);

    // ✅ Define TAT Mapping
    const tatMapping = {
        "Discovery Call": 2,
        "Process Understanding": 7,
        "Solution Deck Creation": 3,
        "Solution Presentation": 7,
        "Requirement Finalization": 14,
        "Commercial Submission": 7,
        "Commercial Clarity": 7,
        "Negotiation": 15,
        "Commercial Finalization": 15,
        "Kick-off & Handover": 15
    };

    useEffect(() => {
        fetchLeadStages();
        fetchProducts();
    }, []);

    const fetchLeadStages = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/lead/get-lead-stages/${leadId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.pipeline) {
                setStages(response.data.pipeline);
                console.log('Stages :- ', response.data.pipeline);
                checkTatAlert(response.data.pipeline);
            }
        } catch (error) {
            console.error('Error fetching lead stages:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/admin/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setProducts(response.data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const checkTatAlert = (pipeline) => {
        const today = new Date();
        const overdueStage = pipeline.find(stage =>
            stage.tatDeadline && new Date(stage.tatDeadline) < today && !stage.completed
        );

        if (overdueStage) {
            setTatAlert(`TAT Alert: Stage '${overdueStage.stage}' is overdue!`);
        } else {
            setTatAlert(null);
        }
    };

    const handleStageChange = (e) => {
        const stage = e.target.value;
        const today = new Date();
        let tatDays = tatMapping[stage] || 0;
        const tatDeadline = new Date(today.setDate(today.getDate() + tatDays)).toISOString().split('T')[0];

        setNewStage(prev => ({
            ...prev,
            stage,
            callDate: new Date().toISOString().split('T')[0],
            tatDeadline,  // ✅ Save TAT Deadline
            delayDays: 0, // ✅ Initialize Delay Days as 0
            followUpDate: '',
            followUpTime: '',
            remark: '',
            products: [],
            totalPrice: 0
        }));

        setShowFollowUpFields(true);

        if (stage === "Solution Deck Creation") {
            setShowModal(true);
        } else {
            setShowModal(false);
        }
    };



    const handleMarkCompanyLost = async () => {
        if (!isCompanyLost || !companyLostReason) {
            alert("❗ Please select a reason for company lost.");
            return;
        }

        try {
            const response = await axios.put(`${backendUrl}/api/lead/mark-company-lost/${leadId}`, {
                isCompanyLost,
                companyLostReason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(response.data.message);
            fetchLeadStages();
        } catch (error) {
            console.error('❌ Error marking company as lost:', error);
        }
    };

    const handleProductSelection = (product, isChecked) => {
        if (isChecked) {
            setSelectedProducts(prev => [...prev, {
                productId: product._id,
                name: product.name,
                quantity: 1,
                pricePerUnit: 0,
                totalAmount: 0
            }]);
        } else {
            setSelectedProducts(prev => prev.filter(p => p.productId !== product._id));
        }
    };

    const handleProductChange = (productId, field, value) => {
        setSelectedProducts(prev => prev.map(p =>
            p.productId === productId ? {
                ...p,
                [field]: Number(value),
                totalAmount: (field === 'pricePerUnit' ? p.quantity * Number(value) : Number(value) * p.pricePerUnit)
            } : p
        ));
    };

    const handleSaveProducts = () => {
        let totalPrice = selectedProducts.reduce((sum, prod) => sum + prod.totalAmount, 0);

        setNewStage(prev => ({
            ...prev,
            products: [...selectedProducts],
            totalPrice: totalPrice
        }));

        setShowModal(false);
    };

    const handleAddStage = async () => {
        try {
            console.log("🚀 Sending API request with data:", newStage);

            const response = await axios.post(`${backendUrl}/api/lead/update-lead-stage/${leadId}`, newStage, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("🎯 API Response:", response.data.lead);
            if (response.data.lead) {
                setStages(response.data.lead.growthManagerPipeline);

                setNewStage({
                    stage: '',
                    callDate: new Date().toISOString().split('T')[0],
                    tatDeadline: '',
                    delayDays: 0,
                    followUpDate: '',
                    followUpTime: '',
                    remark: '',
                    uselessLead: false,
                    products: [],
                    totalPrice: 0,

                });

                setShowFollowUpFields(false);
                setSelectedProducts([]);
            }
        } catch (error) {
            console.error('❌ API Error:', error.response ? error.response.data : error.message);
            alert(`Error: ${error.response ? error.response.data.message : "Server Error. Try again."}`);
        }
    };

    return (
        <div>
            <Layout>
                <div className='custom_form'>

                    {tatAlert && <div className="tat-alert">{tatAlert}</div>}

                    <h2>Lead Stages</h2>
                    <div className='row'>
                        <div className='col-lg-8'>
                            <ul>
                                {stages.map((stage, index) => (

                                    <li key={index}>
                                        <strong>{stage.stage}</strong> -
                                        TAT Deadline: {stage.tatDeadline ? new Date(stage.tatDeadline).toLocaleDateString('en-GB') : 'Not Set'} |
                                        ⏳ {stage.completed ? "Completed" : "In Progress"}

                                        <br />
                                        <small>Follow-up Date: {stage.followUpDate ? new Date(stage.followUpDate).toLocaleDateString('en-GB') : "Not Set"}</small>
                                        <br />
                                        <small>Follow-up Time: {stage.followUpTime ? stage.followUpTime : "Not Set"}</small>
                                        <br />
                                        <small>Remark: {stage.remark ? stage.remark : "No Remark"}</small>

                                        {stage.products && stage.products.length > 0 && (
                                            <div>
                                                <strong>Products:</strong>
                                                <ul>
                                                    {stage.products.map((p, idx) => (
                                                        <li key={idx}>
                                                            {p.name} - {p.quantity} x ₹{p.pricePerUnit} = ₹{p.totalAmount}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <strong>Total Price:</strong> ₹{stage.totalPrice}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='col-lg-4'>
                            <h3>Add New Stage</h3>
                            <select className='select_item_box' value={newStage.stage} onChange={handleStageChange}>
                                <option value="">Select Stage</option>
                                {Object.keys(tatMapping).map(stage => (
                                    <option key={stage} value={stage}>{stage}</option>
                                ))}
                            </select>

                            {showFollowUpFields && (
                                <>
                                    <label>Follow-up Date:</label>
                                    <input type="date" value={newStage.followUpDate} onChange={(e) => setNewStage({ ...newStage, followUpDate: e.target.value })} />

                                    <label>Follow-up Time:</label>
                                    <input type="time" value={newStage.followUpTime} onChange={(e) => setNewStage({ ...newStage, followUpTime: e.target.value })} />

                                    <label>Remark:</label>
                                    <input value={newStage.remark} onChange={(e) => setNewStage({ ...newStage, remark: e.target.value })} />
                                </>
                            )}

                            <button className='global_btn' onClick={handleAddStage}>Add Stage</button>



                            {/* 🚨 Mark Company as Lost */}
                    <div className="company-lost-section">
                        <label className='marked_as_lost'>
                            <input
                                type="checkbox"
                                checked={isCompanyLost}
                                onChange={() => setIsCompanyLost(!isCompanyLost)}
                            />
                            ❌ Mark Company as Lost
                        </label>

                        {isCompanyLost && (
                            <select className='select_item_box' value={companyLostReason} onChange={(e) => setCompanyLostReason(e.target.value)}>
                                <option value="">Select Reason</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Credential">Credential</option>
                                <option value="Features">Features</option>
                            </select>
                        )}

                        <button className='global_btn' onClick={handleMarkCompanyLost}>Save</button>
                    </div>

                        </div>
                    </div>




                    {showModal && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h4>Select Products</h4>
                                {products.map(product => (
                                    <div className='product_model_inputs' key={product._id}>
                                        <input className='checkbox_input' type="checkbox" onChange={(e) => handleProductSelection(product, e.target.checked)} />
                                        <label>{product.name}</label>
                                        <input type="number" placeholder="Quantity" onChange={(e) => handleProductChange(product._id, 'quantity', e.target.value)} />
                                        <input type="number" placeholder="Price" onChange={(e) => handleProductChange(product._id, 'pricePerUnit', e.target.value)} />
                                    </div>
                                ))}
                                <button className='global_btn' onClick={handleSaveProducts}>Save Products</button>
                            </div>
                        </div>
                    )}
                </div>
            </Layout>
        </div>
    );
};

export default ManageSteps;
