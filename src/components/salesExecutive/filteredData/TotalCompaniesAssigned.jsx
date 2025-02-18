import React from "react";
import { useContext, useEffect, useState } from "react";
// import Layout from '../common/Layout';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import axios from "axios";
import { ThemeContext } from "../../../context/ThemeContext";
import CalendarFilter from "./CalendarFilter";

const TotalCompaniesAssigned = () => {
  const { backendUrl } = useContext(ThemeContext);

  const [leads, setLeads] = useState([]);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [touchLeads, setTouchLeads] = useState(0);
  const [mailAndLinkedInCount, setMailAndLinkedInCount] = useState(0);
  const [callStatusData, setCallStatusData] = useState(0);

  const [filteredLeads, setFilteredLeads] = useState([]);
  const [filterMode, setFilterMode] = useState("date"); // 'date', 'month', or 'range'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);

  const token = localStorage.getItem("token");

  // Get all leads linked with sales executive
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/lead/sales-executive/leads",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLeads(response.data.leads);
        setFilteredLeads(response.data.leads);
        console.log("sales executive data", response.data.leads);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast.error("Error fetching leads");
      }
    };

    fetchLeads();
  }, [backendUrl, token]);

  // Handle Filter Change
  const handleFilterChange = (filterData) => {
    if (!leads.length) return;

    let filtered = leads;
    if (filterData.type === "date") {
      setSelectedDate(filterData.value);
      filtered = leads.filter(
        (lead) =>
          format(new Date(lead.assignedDate), "yyyy-MM-dd") === filterData.value
      );
    } else if (filterData.type === "month") {
      setSelectedMonth(filterData.value);
      filtered = leads.filter((lead) => {
        const assignedDate = new Date(lead.assignedDate);
        return (
          format(assignedDate, "MM") === filterData.value.month &&
          format(assignedDate, "yyyy") === filterData.value.year
        );
      });
    } else if (filterData.type === "range") {
      setDateRange([filterData.value.start, filterData.value.end]);
      filtered = leads.filter((lead) => {
        const assignedDate = new Date(lead.assignedDate);
        return (
          assignedDate >= new Date(filterData.value.start) &&
          assignedDate <= new Date(filterData.value.end)
        );
      });
    }

    setFilteredLeads(filtered);
  };

  return (
    <div>
      <div className="dashboard_card">
        {/* New Calendar Filter */}
        {/* <CalendarFilter onFilterChange={handleFilterChange} /> */}
        <p className="number_heading">Total Companies Assigned</p>
        <p className="number_text">{filteredLeads.length}</p>
      </div>
    </div>
  );
};

export default TotalCompaniesAssigned;
