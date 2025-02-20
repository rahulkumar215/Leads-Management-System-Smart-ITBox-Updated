import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { DNA } from "react-loader-spinner";

function parseMessage(message) {
  const elements = [];
  let remainingText = message;

  // First, if the message starts with "TAT Alert:", style it in bold red and remove it.
  if (remainingText.startsWith("TAT Alert:")) {
    elements.push(
      <strong key="tat-alert" className="text-red-500">
        TAT Alert:
      </strong>
    );
    remainingText = remainingText.slice("TAT Alert:".length);
  }

  /**
   * The regex below uses alternation with capturing groups:
   *
   * Option A: Matches "for" followed by a quoted text.
   *   - Group 1: The literal "for " (with trailing whitespace).
   *   - Group 2: The full quoted text (including quotes).
   *   - Group 3: The inner content of the quoted text.
   *
   * Option B: Matches any quoted text (not preceded by "for").
   *   - Group 4: The full quoted text.
   *   - Group 5: The inner content (if needed).
   *
   * Option C: Matches "overdue by" followed by days.
   *   - Group 6: The literal "overdue by " (with trailing space).
   *   - Group 7: The days text (e.g. "3 days").
   *
   * Option D: Matches "has not been contacted within" followed by days.
   *   - Group 8: The literal "has not been contacted within " (with trailing space).
   *   - Group 9: The days text.
   */
  const regex =
    /(for\s*)('([^']+)')|('([^']+)')|(overdue by\s*)(\d+\s*days)|(has not been contacted within\s*)(\d+\s*days)/gi;

  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = regex.exec(remainingText)) !== null) {
    // Push any plain text that appears before the current match.
    if (match.index > lastIndex) {
      elements.push(remainingText.slice(lastIndex, match.index));
    }

    // Option A: Matched "for" followed by quoted text.
    if (match[1]) {
      // match[1] holds the literal "for " and match[3] holds the inner content.
      elements.push(match[1]); // keep "for " as plain text.
      elements.push(
        <span
          key={`for-quoted-${idx}`}
          // className="inline-block mx-1 px-2 bg-yellow-100 border border-yellow-300 rounded-4xl"
        >
          {match[3]}
        </span>
      );
    }
    // Option B: Matched quoted text not following "for".
    else if (match[4]) {
      // match[5] holds the inner content without the quotes.
      elements.push(
        <span
          key={`quoted-${idx}`}
          className="inline-block mx-1 px-2 bg-green-100 border border-green-300 rounded-4xl"
        >
          {match[5]}
        </span>
      );
    }
    // Option C: Matched "overdue by" followed by days.
    else if (match[6]) {
      elements.push(match[6]); // output "overdue by " as plain text.
      elements.push(
        <strong
          key={`overdue-${idx}`}
          className="inline-block mx-1 text-red-500 px-2 border border-red-300 rounded-4xl"
        >
          {match[7]}
        </strong>
      );
    }
    // Option D: Matched "has not been contacted within" followed by days.
    else if (match[8]) {
      elements.push(match[8]); // output the prefix as plain text.
      elements.push(
        <strong
          key={`contact-${idx}`}
          className="inline-block mx-1 text-red-500 px-2 border border-red-300 rounded-4xl"
        >
          {match[9]}
        </strong>
      );
    }

    lastIndex = regex.lastIndex;
    idx++;
  }

  // Append any remaining text after the last match.
  if (lastIndex < remainingText.length) {
    elements.push(remainingText.slice(lastIndex));
  }

  return elements;
}

// Helper to map role names for chip display
const mapRole = (role) => {
  if (role === "data_analyst") return "Data Analyst";
  if (role === "sales_executive") return "Sales Executive";
  if (role === "growth_manager") return "Growth Manager";
  return role;
};

function Notifications() {
  const [adminAlerts, setAdminAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { backendUrl } = useContext(ThemeContext);
  const token = localStorage.getItem("token");

  // Fetch TAT Alerts (Admin)
  useEffect(() => {
    const fetchAdminAlerts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/all-tat-alerts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdminAlerts(response.data.alerts);
      } catch (error) {
        console.error("Error fetching Admin TAT Alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminAlerts();
  }, [backendUrl, token]);

  return (
    <div className="col-start-2 col-span-1">
      <h3 className="text-xl tracking-wide font-semibold mb-2">TAT Alerts</h3>
      <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-500">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-500 ">
            <tr>
              <th className="px-4 py-2 min-w-38 text-left text-white text-sm font-medium">
                Role
              </th>
              <th className="px-4 py-2 min-w-[40rem] text-left text-white text-sm font-medium">
                Message
              </th>
              <th className="px-4 py-2 text-left text-white text-sm font-medium">
                Assigned To
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8}>
                  <div className="flex justify-center">
                    <DNA
                      visible={true}
                      height="40"
                      width="40"
                      ariaLabel="dna-loading"
                      wrapperStyle={{}}
                      wrapperClass="dna-wrapper"
                    />
                  </div>
                </td>
              </tr>
            ) : adminAlerts && adminAlerts.length > 0 ? (
              adminAlerts.map((alert, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 divide-x divide-gray-200"
                >
                  <td className="px-4 py-2">
                    <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {mapRole(alert.type)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{parseMessage(alert.message)}</td>
                  <td className="px-4 py-2 font-semibold">
                    {alert.assignedTo}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2" colSpan="3">
                  No pending alerts.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notifications;
