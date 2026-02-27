import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  X, 
  Users, 
  User, 
  ChartColumn, 
  ShieldAlert 
} from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
  onLogoutClick?: () => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({
  onNavigate,
  isMobileOpen = false,
  onClose,
  onLogoutClick,
}) => {

  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
    { icon: Users, label: 'User Management', path: '/dashboard/admin/user-management' },
    { icon: User, label: 'Patient Management', path: '/dashboard/admin/patient-management' },
    { icon: ChartColumn, label: 'Quick Analytics', path: '/dashboard/admin/analytics' },
    { icon: ShieldAlert, label: 'Security & Compliance', path: '/dashboard/admin/security' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', path: '/dashboard/admin/settings' },
    { icon: LogOut, label: 'Logout'}
  ];

    const isActiveRoute = (path?: string) => (path ? location.pathname === path : false);


  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-62 bg-gray-50 h-screen flex flex-col border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Close Icon for Mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-5 right-0 p-2 rounded-lg hover:bg-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="px-4 py-6">
          <h1 className="text-xl font-semibold text-gray-900">Northshore Medical</h1>
          <p className="text-sm text-gray-500 mt-1">Patient Recall System</p>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      onClose?.();
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="px-3 py-4 border-gray-200">
          <ul className="space-y-1">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              if (item.label === "Logout") {
                return (
                  <li key={item.label}>
                    <button
                      onClick={onLogoutClick}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link
                    to={item.path!}
                    onClick={() => onNavigate?.(item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActiveRoute(item.path) ? "bg-gray-200 text-gray-900" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;