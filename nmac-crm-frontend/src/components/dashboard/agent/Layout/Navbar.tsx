import { Menu } from "lucide-react";
import { useGetUserProfileQuery } from "../../../../redux/services/auth/auth.api";
import GlobalSearch from "../../GlobalSearch";

interface NavbarProps {
  onMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onMenuClick
}) => {
  const { data: userInfo } = useGetUserProfileQuery();
  const userName = userInfo?.name;
  const userRole = userInfo?.role;
  const userImage = userInfo?.photo;
  return (
    <nav className="bg-[#F9FAFB] border-b border-gray-200 h-16 flex items-center px-4 lg:px-6">
      <div className="flex items-center justify-between w-full">

        {/* Left Side - Mobile Menu & Search */}
        <div className="flex items-center gap-3">

          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>

          {/* Search */}
          <GlobalSearch />

        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 lg:gap-4">

          {/* divider */}
          {/* <div className="h-8 w-px bg-gray-200 hidden sm:block"></div> */}

          {/* Notification Bell */}
          {/* <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
          </button> */}

          {/* Vertical Divider */}
          {/* <div className="h-8 w-px bg-gray-200 hidden sm:block"></div> */}

          {/* User Profile */}
          <div className="flex items-center gap-2 lg:gap-3">
            <img
              src={userImage}
              alt={userName}
              className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg object-cover"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-semibold text-gray-900">{userName}</span>
              <span className="text-sm text-gray-500">{userRole}</span>
            </div>
          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
