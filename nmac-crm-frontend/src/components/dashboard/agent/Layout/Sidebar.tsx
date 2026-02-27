import { LayoutDashboard, User, ClipboardList, Phone, MessageSquare, Settings, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
// import { useAppDispatch } from '../../../../redux/hooks';

interface SidebarProps {
  activeItem?: string;  
  onNavigate?: (item: string) => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
  onLogoutClick?: () => void;
}


const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  isMobileOpen = false,
  onClose,
  onLogoutClick,
}) => {
  const location = useLocation();
  // const dispatch = useAppDispatch();


  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', badge: null, path: '/dashboard/agent' },
    { icon: User, label: 'Patients', badge: null, path: '/dashboard/agent/patients' },
    { icon: ClipboardList, label: 'Tasks', badge: null, path: '/dashboard/agent/tasks' },
    { icon: Phone, label: 'Call Logs', badge: null, path: '/dashboard/agent/call-logs' },
    { icon: MessageSquare, label: 'Messages', badge: null, path: '/dashboard/agent/messages' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings', path: '/dashboard/agent/settings' },
    { icon: LogOut, label: 'Logout', path: '/' }
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
        <button
          onClick={onClose}
          className="lg:hidden absolute top-5 right-0 p-2 rounded-lg hover:bg-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="px-4 py-6">
          <h1 className="text-xl font-semibold text-gray-900">Northshore Medical</h1>
          <p className="text-sm text-gray-500 mt-1">Patient Recall System</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path);

              return (
                <li key={item.label}>
                  <Link to={item.path}>
                    <button
                      onClick={() => {
                        onNavigate?.(item.label);
                        onClose?.();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-200 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span className="bg-indigo-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-5 text-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

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

export default Sidebar;