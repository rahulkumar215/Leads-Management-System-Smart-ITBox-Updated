import React, { useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

const CalendarFilter = ({ onFilterChange }) => {
    const [filterMode, setFilterMode] = useState("date"); // Default: Single Date
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);

  const handleDateChange = (date) => {
    if (filterMode === "range") {
      setDateRange(date);
      if (date[0] && date[1]) {
        onFilterChange({
          type: "range",
          value: { start: format(date[0], "yyyy-MM-dd"), end: format(date[1], "yyyy-MM-dd") },
        });
      }
    } else if (filterMode === "month") {
      setSelectedMonth(date);
      onFilterChange({
        type: "month",
        value: { month: format(date, "MM"), year: format(date, "yyyy") },
      });
    } else {
      setSelectedDate(date);
      onFilterChange({ type: "date", value: format(date, "yyyy-MM-dd") });
    }
  };
    return (
        <div className="filters">
            <label>Filter By:</label>
            <select value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
                <option value="date">Single Date</option>
                <option value="month">Month & Year</option>
                <option value="range">Date Range</option>
            </select>

            <DatePicker
                selected={filterMode === "month" ? selectedMonth : selectedDate}
                onChange={handleDateChange}
                dateFormat={filterMode === "month" ? "MM/yyyy" : "yyyy-MM-dd"}
                showMonthYearPicker={filterMode === "month"}
                selectsRange={filterMode === "range"}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                placeholderText="Select date..."
            />
        </div>
    )
}

export default CalendarFilter
