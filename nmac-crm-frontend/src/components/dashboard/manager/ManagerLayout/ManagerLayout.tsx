import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ManagerSidebar from "./ManagerSidebar";
import ManagerNavbar from "./ManagerNavbar";
import Footer from "../../agent/Layout/Footer";
import { useAppDispatch } from "../../../../redux/hooks";
import { logout } from "../../../../redux/services/auth/auth.slice";

interface LayoutProps {
    userName?: string;
    userRole?: string;
    userImage?: string;
}

const ManagerLayout: React.FC<LayoutProps> = () => {
// const ManagerLayout: React.FC<LayoutProps> = ({ userName, userRole, userImage }) => {
    const [activeItem, setActiveItem] = useState("Dashboard");

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [openLogoutModal, setOpenLogoutModal] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleNavigate = (item: string) => setActiveItem(item);
    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };
    const handleLogout = () => {
            dispatch(logout());
            setOpenLogoutModal(false);
            navigate("/");
          };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <ManagerSidebar
                activeItem={activeItem}
                onNavigate={handleNavigate}
                isMobileOpen={isMobileSidebarOpen}
                onClose={closeMobileSidebar}
                onLogoutClick={() => setOpenLogoutModal(true)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <ManagerNavbar
                    // userName={userName}
                    // userRole={userRole}
                    // userImage={userImage}
                    onMenuClick={toggleMobileSidebar}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F9FAFB] flex flex-col">
                    <div className="flex-1 px-4 lg:px-6 py-6">
                        <Outlet />
                    </div>
                    <div className="px-4 lg:px-6">
                        <Footer />
                    </div>
                </main>
            </div>
            {/* Logout Modal */}
            {openLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-xl w-80 p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-900">
                    Confirm Logout
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                    Are you sure you want to logout?
                    </p>
                    <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => setOpenLogoutModal(false)}
                        className="px-4 py-2 rounded-lg text-sm bg-gray-100 hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
                    >
                        Logout
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default ManagerLayout;