import "./App.css";
import { Route, Routes } from "react-router-dom";
import SignIn from "./components/auth/SignIn";
import Sidebar from "./components/dashboard/Sidebar";
import Header from "./components/dashboard/Header";
import LeadList from "./components/dataAnalyst/LeadList";
import PrivateRoute from "./components/auth/PrivateRoute";
// import AdminDashboard from "./components/admin/AdminDashboard";
import NotFound from "./components/NotFound";
import CreateLead from "./components/dataAnalyst/CreateLead";
import { ToastContainer } from "react-toastify";
import EditLead from "./components/dataAnalyst/EditLead";
import SalesExecutiveLeads from "./components/salesExecutive/SalesExecutiveLeads";
import EditContactData from "./components/salesExecutive/EditContactData";
import AddInteraction from "./components/salesExecutive/AddInteraction";
import SalesExecutiveDashboard from "./components/salesExecutive/SalesExecutiveDashboard";
import GrowthManagerDashboard from "./components/growthManager/GrowthManagerDashboard";
import GrowthManagerLeads from "./components/growthManager/GrowthManagerLeads";
import ManageSteps from "./components/growthManager/ManageSteps";
import ProductList from "./components/admin/product/ProductList";
import ManageAccounts from "./components/admin/ManageAccounts";
import AllLeads from "./components/admin/AllLeads";
import FollowUpAlerts from "./components/growthManager/FollowUpAlerts";
import LeadDetails from "./components/admin/LeadDetails";
import DataAnalystDashboard from "./components/dataAnalyst/DataAnalystDashboard";
import GrowthManagerAnalytics from "./components/growthManager/GrowthManagerAnalytics";
// import AdminAnalytics from "./components/admin/AdminAnalytics";
import { useEffect, useState } from "react";
import AdminDashboard from "./components/admin/dashboard/AdminDashboard";
import Notifications from "./components/admin/Notifications";
import AdminReports from "./components/admin/reports/AdminReports";
import Alerts from "./components/dataAnalyst/Alerts";

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
        {/* Protected Routes (requires authentication) */}
        {/* data analyst routes */}
        <Route
          path="/analyst-lead"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <LeadList />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/create-lead"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <CreateLead />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-lead/:leadId"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <EditLead />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/analyst-alerts"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Alerts />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/analyst-dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <DataAnalystDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        {/* sales executive routes */}
        <Route
          path="/sales-dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <SalesExecutiveDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/sales-executive-leads"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <SalesExecutiveLeads />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/contact/:leadId"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <EditContactData />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/manage/interaction/:leadId"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AddInteraction />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        {/* Growth Manager Routes */}
        <Route
          path="/growth-dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <GrowthManagerDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/growth-manager-leads"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <GrowthManagerLeads />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/growth-manager-leads/:leadId"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ManageSteps />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/follow-ups"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <FollowUpAlerts />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/growth-manager-analytics"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <GrowthManagerAnalytics />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        {/* admin routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-reports"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AdminReports />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/product-list"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ProductList />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manager-accounts"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ManageAccounts />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/all-leads"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AllLeads />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/lead-details/:leadId"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <LeadDetails />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        {/* <Route  
          path="/admin/analytics"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <AdminAnalytics />
              </DashboardLayout>
            </PrivateRoute>
          }
        />*/}
        <Route
          path="/admin/notification"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Notifications />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Open sidebar by default on desktop, closed on mobile
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Ensure correct state on initial render

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div
          className={`flex-1 overflow-hidden transition-all duration-300 ease-in-out ${
            isMobile
              ? sidebarOpen
                ? "translate-x-60"
                : "translate-x-0"
              : sidebarOpen
              ? "ml-60"
              : "ml-0"
          }`}
        >
          <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
          <div className="flex-1 max-w-full m-2 rounded-md">{children}</div>
        </div>
      </div>
    </div>
  );
};
// <div>
//   <div className="row">
//     <div className="col-lg-2" style={{ padding: 0 }}>
//       <Sidebar style={{ height: "100vh" }} />
//     </div>
//     <div className="col-lg-10" style={{ padding: 0 }}>
//       <div className="flex-grow-1 d-flex flex-column">
//         <Header />
//         <div className="dashboard_main flex-grow-1 overflow-auto">
//           {children}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

export default App;
