import { Calendar, FileText } from 'lucide-react';
import React from 'react';
import { useGetAppointmentsQuery } from '../../../../redux/services/dashboard/manager/appointment.api';
import { useParams } from 'react-router-dom';

interface Appointment {
    id: string;
    date: string;
    visitType: string;
    provider: string;
    diagnosis: string;
    duration: string;
}
// interface Appointment {
//     appointe
// }

// interface VisitNote {
//     id: string;
//     title: string;
//     date: string;
//     notes: string;
//     provider: string;
//     duration: string;
// }

interface AppointmentHistoryProps {
    appointments?: Appointment[];
    patientData?: any
}

const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({
    // appointments,
    patientData,
}) => {
    const { patientId } = useParams();
    const { data: appointmentData } = useGetAppointmentsQuery();

    const patientAppointments = appointmentData?.appointments?.filter(
        (appt: any) => appt.patient.id === patientId
    ) || [];

    const mappedAppointments = patientAppointments.map((appt: any) => ({
        id: appt.id,
        date: appt.appointment_date,
        visitType: appt.status,
        provider: appt.agent?.name || 'N/A',
        diagnosis: appt.notes,
        duration: appt.appointment_time || 'N/A',
    }));

    const appointmentList = [...mappedAppointments].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    console.log(patientData)
    // Get last two visits from patientData
    // Get last two visits safely
    const lastTwoVisits = patientData?.visits
        ? [...patientData.visits] // make a copy before sorting
            .sort((a: any, b: any) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())
            .slice(0, 2)
            .map((visit: any) => ({
                id: visit.id,
                date: visit.visit_date,
                visitType: visit.visit_type,
                provider: visit.provider?.name || 'N/A',
                diagnosis: visit.visit_note || 'N/A',
                duration: 'N/A', // if duration not available
            }))
        : [];



    // const defaultVisitNotes: VisitNote[] = [
    //     {
    //         id: '1',
    //         title: 'Annual Physical',
    //         date: '04/15/2024',
    //         notes: 'Blood pressure: 120/80, Weight: 145 lbs, Patient in good health',
    //         provider: 'Dr. Kyjuan Brown',
    //         duration: '45 min',
    //     },
    //     {
    //         id: '2',
    //         title: 'Annual Physical',
    //         date: '10/12/2023',
    //         notes: 'Recommended annual follow-up in 12 months',
    //         provider: 'Dr. Kyjuan Brown',
    //         duration: '40 min',
    //     },
    // ];

    // const appointmentList = appointments || defaultAppointments;
    const notesList = lastTwoVisits;

    return (
        <div className="w-full space-y-8 mt-6 ">
            {/* Appointment History Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 lg:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Appointment History
                    </h2>
                    <span className="text-sm text-gray-600 border border-gray-300 rounded-2xl px-2 py-1">
                        {appointmentList.length} Total Visits
                    </span>
                </div>

                {/* Table - Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 bg-[#F9FAFB]">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Visit Type
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Provider
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Diagnosis
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                    Duration
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentList.map((appointment: any) => (
                                <tr
                                    key={appointment.id}
                                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-100"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-gray-400" strokeWidth={2} />
                                            <span className="text-sm text-gray-900">{appointment.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {appointment.visitType}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {appointment.provider}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {appointment.diagnosis}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {appointment.duration}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card View - Mobile/Tablet */}
                <div className="lg:hidden space-y-4">
                    {appointmentList.map((appointment: any) => (
                        <div
                            key={appointment.id}
                            className="border border-gray-200 rounded-lg p-4 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" strokeWidth={2} />
                                    <span className="text-sm font-semibold text-gray-900">
                                        {appointment.date}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-600">{appointment.duration}</span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-500">Visit Type: </span>
                                    <span className="text-gray-900">{appointment.last_visit_type}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Provider: </span>
                                    <span className="text-gray-900">{appointment.primary_provider_name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Diagnosis: </span>
                                    <span className="text-gray-900">{appointment.primary_provider_name}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Recent Visit Notes Section */}
                <div className='mt-6'>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Recent Visit Notes
                    </h2>
                    <div className="space-y-4">
                        {notesList.map((note: any) => (
                            <div
                                key={note.id}
                                className="bg-blue-50 rounded-2xl border border-blue-100 p-5"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-blue-600" strokeWidth={2} />
                                        <h3 className="text-base font-semibold text-blue-900">
                                            {note.visitType} - {note.date}
                                        </h3>
                                    </div>
                                    <span className="text-sm text-gray-700 border border-gray-300 rounded-2xl px-2 py-1">{note.duration}</span>
                                </div>
                                <p className="text-sm text-blue-700 mb-2 ml-8">{note.note}</p>
                                <p className="text-xs text-blue-600 ml-8">Provider: {note.provider}</p>
                            </div>
                        ))}
                    </div>
                </div>


            </div>


        </div>
    );
};

export default AppointmentHistory;