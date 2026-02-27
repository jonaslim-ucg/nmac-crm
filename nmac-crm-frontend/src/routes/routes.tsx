import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Layout from "../components/dashboard/agent/Layout/Layout";
import ForgotPassword from "../pages/auth/ForgotPassword/ForgotPassword";
import Login from "../pages/auth/Login/Login";
import PasswordChanged from "../pages/auth/PasswordChanged/PasswordChanged";
import ResetPassword from "../pages/auth/ResetPassword/ResetPassword";
import Summary from "../pages/dashboard/agent/Summary/Summary";
import Patients from "../pages/dashboard/agent/Patients/Patients";
import PatientDetails from "../pages/dashboard/agent/PatientDetails/PatientDetails";
import PatientCallLog from "../pages/dashboard/agent/PatientCallLog/PatientCallLog";
import MyTasks from "../pages/dashboard/agent/Tasks/MyTasks/MyTasks";
import MyCallLogs from "../pages/dashboard/agent/CallLogs/MyCallLogs/MyCallLogs";
import AgentMessage from "../pages/dashboard/agent/AgentMessage/AgentMessage";
import Settings from "../pages/dashboard/agent/Settings/Settings";
import ManagerLayout from "../components/dashboard/manager/ManagerLayout/ManagerLayout";
import ManagerSummary from "../pages/dashboard/manager/Summary/ManagerSummary";
import ManagerPatients from "../pages/dashboard/manager/ManagerPatients/ManagerPatients";
import ManagerPatientDetails from "../pages/dashboard/manager/ManagerPatientDetails/ManagerPatientDetails";
import ManagerTasks from "../pages/dashboard/manager/ManagerTasks/ManagerTasks";
import ManagerCallLogs from "../pages/dashboard/manager/ManagerCallLogs/ManagerCallLogs";
import ManagerMessage from "../pages/dashboard/manager/ManagerMessage/ManagerMssage";
import ManagerReports from "../pages/dashboard/manager/MangerReports/ManagerReports";
import ManagerSettings from "../pages/dashboard/manager/ManagerSettings/ManagerSetting";
import AdminLayout from "../components/dashboard/admin/AdminLayout/AdminLayout";
import AdminSummary from "../pages/dashboard/admin/AdminSummary/AdminSummary";
import ManageTemplate from "../pages/dashboard/admin/ManageTemplate/ManageTemplate";
import UserManagement from "../pages/dashboard/admin/UserManagement/UserManagement";
import SingleUser from "../pages/dashboard/admin/UserManagement/SingleUser";
import EditUser from "../pages/dashboard/admin/UserManagement/EditUser";
import AssignAgent from "../pages/dashboard/admin/UserManagement/AssignAgent";
import PatientManagement from "../components/dashboard/admin/PatientManagement/PatientManagement";
import Analytics from "../pages/dashboard/admin/Analytics/Analytics";
import AdminSecurity from "../components/dashboard/admin/AdminSecurity/AdminSecurity";
import AdminSettings from "../pages/dashboard/admin/AdminSettings/AdminSettings";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestRoute><App /></GuestRoute>,
        children: [
            {
                index: true,
                element: < Login />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
            {
                path: 'reset-password',
                element: <ResetPassword />
            },
            {
                path: 'password-changed',
                element: <PasswordChanged />
            }
        ]
    },
    {
        path: '/dashboard/agent',
        element:<ProtectedRoute role='AGENT'><Layout /></ProtectedRoute>,
        children:[
            {
                index:true,
                element:<Summary/>
            },
            {
                path:'patients',
                element:<Patients/>
            },
            {
                path:'patients/:patientId',
                element:<PatientDetails/>
            },
            {
                path:'patients/:patientId/call-log',
                element:<PatientCallLog/>
            },
            {
                path:'tasks',
                element:<MyTasks/>
            },
            {
                path:'call-logs',
                element:<MyCallLogs/>
            },
            {
                path:'messages',
                element:<AgentMessage/>
            },
            {
                path:'settings',
                element:<Settings/>
            }
        ]

    },

    {
        path:'/dashboard/admin',
        element:<ProtectedRoute role='ADMIN'><AdminLayout/></ProtectedRoute>,
        children:[
            {
                index:true,
                element:<AdminSummary/>
            },
            {
                path:'manage-template',
                element:<ManageTemplate/>
            },
            {
                path:'user-management',
                element:<UserManagement/>
            },
            {
                path:'user-management/user/:userId',
                element:<SingleUser/>
            },
            {
                path:'user-management/edit/:userId',
                element:<EditUser/>
            },
            {
                path:'user-management/assign-agent',
                element:<AssignAgent/>
            },
            {
                path:'patient-management',
                element:<PatientManagement/>
            },
            {
                path:'analytics',
                element:<Analytics/>
            },
            {
                path:'security',
                element:<AdminSecurity/>
            },
            {
                path:'settings',
                element:<AdminSettings/>
            }
        ]
    },

    {
        path:'/dashboard/manager',
        element:<ProtectedRoute role='MANAGER'><ManagerLayout/></ProtectedRoute>,
        children:[
            {
                index:true,
                element:<ManagerSummary/>
            },
            {
                path:'patients',
                element:<ManagerPatients/>
            },
           {
            path:'patients/:patientId',
            element:<ManagerPatientDetails/>
           },
           {
            path:'tasks',
            element:<ManagerTasks/>
           },
           {
            path:'call-logs',
            element:<ManagerCallLogs/>
           },
           {
            path:'messages',
            element:<ManagerMessage/>
           },
           {
            path:'reports',
            element:<ManagerReports/>
           },
           {
            path:'settings',
            element:<ManagerSettings/>
           }
        ]
    }
]);

export default router;