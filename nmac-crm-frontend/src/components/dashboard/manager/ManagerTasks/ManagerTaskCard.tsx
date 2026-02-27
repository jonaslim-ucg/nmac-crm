import React from 'react';
import { User, Phone, Calendar, Clock, CheckCircle, User2 } from 'lucide-react';

interface PatientTask {
    task:any
}

const ManagerTaskCard: React.FC<PatientTask> = ({ task }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-1">
                <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">{task?.patient?.name}</h3>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.priority === 'HIGH'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-orange-50 text-orange-600'
                        }`}>
                        {task.priority}
                    </span>

                    {task.status === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            pending
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5" />
                            completed
                        </span>
                    )}

                     <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DBEAFE] text-[#155DFC] text-xs font-medium">
                            <User2 className="w-3.5 h-3.5" />
                            {task.agentName}
                        </span>
                </div>

                <div className="flex flex-col items-start gap-3">
                    {/* <Link to='/dashboard/manager/patients/1'>
                    <button className="w-full px-5 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                        View Patient
                    </button>
                    </Link> */}

                    {task.status === 'PENDING' && (
                        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                            Complete
                        </button>
                    )}
                </div>
            </div>

            {/* Patient Details */}
            <div className="space-y-3 mb-3">
                <div className="flex items-center gap-2.5 text-gray-600">
                    <User className="w-4 h-4" strokeWidth={2} />
                    <span className="text-md">Patient ID: {task?.patient?.id}</span>
                </div>

                <div className="flex items-center gap-2.5 text-gray-600">
                    <Phone className="w-4 h-4" strokeWidth={2} />
                    <span className="text-md">{task.title}</span>
                </div>

                <div className="flex items-center gap-2.5 text-gray-600">
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                    <span className="text-md">Due: {task.due_date.split('T')["0"]}</span>
                </div>
            </div>

            {/* Task Info */}
            <div>
                <p className="text-md text-gray-900 mb-1">
                    <span className="font-semibold">Task:</span> {task.task}
                </p>
                <p className="text-md text-gray-500 italic">{task.description}</p>
            </div>

        </div>
    );
};

export default ManagerTaskCard;




