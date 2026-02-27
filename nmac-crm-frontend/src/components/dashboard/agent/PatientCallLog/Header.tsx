import { Calendar, Phone, User } from 'lucide-react'

interface HeaderProps{
    patientData: any;
}
const Header: React.FC<HeaderProps> = ({
    patientData
}) => {
    return (
        <div className='w-full'>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Log Patient Call</h1>
                <p className="text-[#6A7282]">Recording call with Sarah Johnson</p>
            </div>

            {/* Patient Info Card */}
            <div className="rounded-2xl p-6 mb-6 border border-gray-200" style={{background:'rgba(228, 244, 255, 1)'}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-blue-600 mb-0.5">Patient</p>
                            <p className="font-semibold text-[#1C398E]">{patientData?.name || "-"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-blue-600 mb-0.5">Phone</p>
                            <p className="font-semibold text-[#1C398E]">{patientData?.contacts?.phone || "-"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm text-blue-600 mb-0.5">Last Visit</p>
                            <p className="font-semibold text-[#1C398E]">{patientData?.last_visit_date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                        </svg>
                        <div>
                            <p className="text-sm text-blue-600 mb-0.5">Recall Type</p>
                            <p className="font-normal text-blue-600 text-[14px] bg-[#DBEAFE] p-1.5 rounded-full">{patientData?.due_for} recall</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header