import React, { useContext, useEffect, useState } from 'react'
import Layout from '../common/Layout'
import { ThemeContext } from '../../context/ThemeContext';
import axios from 'axios';

const GrowthManagerAnalytics = () => {

    const { backendUrl } = useContext(ThemeContext);
    const [dashboardOne, setDashboardOne] = useState(null);
    const [dashboardTwo, setDashboardTwo] = useState(null);

    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchGrowthManagerAnalytics();
    }, [backendUrl]);

    const fetchGrowthManagerAnalytics = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/lead/growth-manager-analytics`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setDashboardOne(response.data.dashboardOne || {}); // Ensure safe data
                setDashboardTwo(response.data.dashboardTwo || {}); // Ensure safe data
            }
        } catch (error) {
            console.error('❌ Error fetching Growth Manager Analytics:', error);
        }
    };


    return (
        <div>
            <Layout>
                <h3 style={{marginBottom:"15px"}}>Growth Manager Analytics</h3>

                {/* Dashboard One */}
                <div className="dashboard-one">
                    {/* <h3>YTD & MTD - Overall Numbers</h3> */}


                    {dashboardOne ? (
                        <div className='row'>
                            <div className='col-lg-3'>
                                <div className='dashboard_card'>
                                    <p className='number_heading'>Companies Assigned</p>
                                    <p className='number_text'>{dashboardOne.interestedCompaniesAssigned || 0}</p>
                                </div>
                            </div>
                            {/* <p>📌 Companies Touched: {dashboardOne.companiesTouched || 0}</p> */}
                            <div className='col-lg-3'>
                                <div className='dashboard_card'>
                                    <p className='number_heading'>Companies Touched</p>
                                    <p className='number_text'>{dashboardOne.companiesTouched || 0}</p>
                                </div>
                            </div>

                            <div className='col-lg-3'>
                                <div className='dashboard_card'>
                                    <p className='number_heading'>Companies Lost</p>
                                    <p className='number_text'>{dashboardOne.companiesLost || 0}</p>
                                </div>
                            </div>
                            {/* <p>📌 Companies Lost: {dashboardOne.companiesLost || 0}</p> */}
                        </div>
                    ) : (
                        <p>Loading data...</p>
                    )}

                </div>

                {/* Dashboard Two */}
                <div className="dashboard-two">
                    <h3 style={{marginBottom:"15px"}}>Companies In Stages</h3>
                    <div className='row'>

                        {dashboardTwo ? (
                            Object.entries(dashboardTwo).map(([stage, count]) => (
                                <div key={stage} className='col-lg-3'>
                                {/* <p key={stage}>📍 {stage}: {count} leads</p> */}
                                    {/* <p key={stage}>📍 {stage}: {count} leads</p> */}
                                    <div className='dashboard_card'>
                                        <p className='number_heading'>{stage}</p>
                                        <p className='number_text'>{count}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Loading stage data...</p>
                        )}
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default GrowthManagerAnalytics
