import { MessageSquare, Mail } from 'lucide-react';

interface Message {
  id: string;
  name: string;
  phone: string;
  message: string;
  timestamp: string;
  status: 'Delivered' | 'Read' | 'Sent';
  communication_type: "whatsapp" | 'email';
}

const MessageCard: React.FC<{ message: Message }> = ({ message }) => {
  console.log(message)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-[#DBEAFE] text-blue-700';
      case 'Read':
        return 'bg-[#DCFCE7] text-green-700';
      case 'Sent':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
   <div>
     <div className="bg-gray-50 p-4 rounded-2xl shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">

        {/* Left */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1.5">{message.name}</h3>
          <p className="text-sm text-gray-500">{message.phone}</p>
        </div>

        {/* Right (Vertical items) */}
        <div className="flex flex-col items-start gap-3 shrink-0">

          {/* Status */}
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
            {message.status}
          </span>

          {/* Platform */}
          <div className="flex items-center gap-1.5 text-gray-600">
            {message.communication_type === "whatsapp" ? (
              <>
                <MessageSquare className="w-4 h-4" strokeWidth={2} />
                <span className="text-xs font-normal">WhatsApp</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" strokeWidth={2} />
                <span className="text-xs font-normal">Email</span>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Message Text */}
      <p className="text-sm text-gray-700 leading-relaxed mb-4">{message.message}</p>

      {/* Timestamp */}
      <p className="text-xs text-gray-400">{message.timestamp}</p>
    </div>
   </div>

  );
};

export default MessageCard;
