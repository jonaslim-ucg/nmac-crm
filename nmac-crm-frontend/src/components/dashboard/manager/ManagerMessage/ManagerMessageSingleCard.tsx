
import { MessageSquare, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  name: string;
  phone: string;
  message: string;
  timestamp: string;
  status: 'Delivered' | 'Read' | 'Sent';
  platform: 'WhatsApp' | 'Email';
  patient_id: string;
}

const ManagerMessageSignleCard: React.FC<{ message: Message }> = ({ message }) => {
  console.log(message)


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#DBEAFE] text-blue-600';
      case 'Read':
        return 'bg-[#DCFCE7] text-green-600';
      case 'Sent':
        return 'bg-gray-50 text-gray-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="">
      <div className="bg-gray-50 rounded-3xl shadow-sm p-3 mb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-md font-normal text-gray-900 mb-0.5">{message.name}</h2>
            <p className="text-sm text-gray-500 mb-0.5">{message.phone}</p>
            <p className="text-xs text-gray-400">
              Sent by: {message.name.split(' ')[0]} Agent
            </p>
          </div>

          <div className="flex flex-col items-start gap-0.5">
            {/* Status */}
            <span
              className={`px-2 py-0.5 text-[10px] font-normal rounded-full ${getStatusColor(
                message.status
              )}`}
            >
              {message.status}
            </span>

            {/* Platform */}
            <div className="flex items-center gap-1 text-gray-500">
              {message.platform === "WhatsApp" ? (
                <>
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="text-xs">WhatsApp</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span className="text-xs">Email</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mb-2">
          <p className="text-sm text-gray-700 leading-snug">{message.message}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">{message.timestamp}</p>
        <Link to={`/dashboard/manager/patients/${message.patient_id}`}>
          <button className="px-2.5 py-1 text-sm text-black bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
            View Patient
          </button>
        </Link>
        </div>
      </div>
    </div>

  );
};

export default ManagerMessageSignleCard;