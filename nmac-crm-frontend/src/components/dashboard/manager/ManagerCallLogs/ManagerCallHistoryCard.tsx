import { Calendar, Clock, Phone } from 'lucide-react';

interface CallRecord {
    id: string;
    name: string;
    status: 'Booked' | 'No Answer' | 'Callback';
    phone: string;
    time: string;
    duration: string;
    date: string;
    note: string;
}


const ManagerCallHistoryCard: React.FC<{ call: CallRecord }> = ({ call }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Booked':
                return 'bg-[#DCFCE7] text-green-700';
            case 'No Answer':
                return 'bg-[#FEF9C2] text-yellow-700';
            case 'Callback':
                return 'bg-[#DBEAFE] text-blue-700';
            default:
                return 'bg-gray-50 text-gray-700';
        }
    };

    return (
        <div className="bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 w-full">

                {/* Left Section */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-semibold text-gray-900">{call.name}</h3>
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${getStatusColor(call.status)}`}>
                            {call.status}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-600">
                        <Phone className="w-4 h-4" strokeWidth={2} />
                        <span className="text-sm">{call.phone}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-gray-600">
                        <Calendar className="w-4 h-4" strokeWidth={2} />
                        <span className="text-sm">{call.date}</span>
                    </div>

                    <p className="text-sm text-gray-500 italic">{call.note}</p>
                </div>

                {/* Time Section (Center) */}
                <div className="flex items-center gap-2 text-black sm:self-center sm:mx-auto">
                    <Clock className="w-4 h-4" strokeWidth={2} />
                    <span className="text-sm">{call.time} · {call.duration}</span>
                </div>

                {/* View Patient Button (Right but slightly lower) */}
                <div className="sm:self-start">
                    <button  className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                        View Patient
                    </button>
                </div>

            </div>
        </div>


    );
};

export default ManagerCallHistoryCard;