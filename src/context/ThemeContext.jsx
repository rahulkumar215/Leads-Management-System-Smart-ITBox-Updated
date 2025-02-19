import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const [leadData, setLeadData] = useState([]);

  const getAllLeads = async () => {
    try {
      const response = await axios.get(backendUrl + `/api/lead/get-all-leads`);
      if (response.data.success) {
        console.log(response.data.allLeads);
        setLeadData(response.data.allLeads);
      }
    } catch (error) {
      console.log(error, "Error:- While getting all leads");
    }
  };

  useEffect(() => {
    getAllLeads();
  }, []);

  const value = { backendUrl, navigate, leadData, setLeadData };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
