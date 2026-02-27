// ManagerPatientsTable.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Loader2, Mail, Phone, Search, User, User2, X } from 'lucide-react';
import { useAssignAgentMutation, useGetAllPatientQuery } from '../../../../redux/services/dashboard/admin/admin.patient';
import { useGetUserQuery } from '../../../../redux/services/dashboard/admin/adminUserApi';
import type { ApiUser } from '../../../../redux/services/dashboard/admin/types/adminUser.type';
import Swal from 'sweetalert2';
// import { useGetPatientVisitTypeQuery } from '../../../../redux/services/dashboard/manager/manager.api';

interface Patient {
    id: string;
    name: string;
    phone: string;
    email: string;
    last_visit_type: string;
    last_visit_date: string;
    due_for: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
    primary_provider_name: string;
    agent: {
        id: number,
        name: string
    }
}



type ReassignModalProps = {
    open: boolean;
    patient?: Patient | null;
    onClose: () => void;
    // onAssign: (agent: string) => void;
};

// Reassign modal component
const ReassignModal: React.FC<ReassignModalProps> = ({
    open,
    patient,
    onClose,
}) => {
    const [selectedAgentId, setSelectedAgentId] = useState<string>("");

    const { data: usersData = [] } = useGetUserQuery();
    const [assignAgent, { isLoading: isAssignLoading }] = useAssignAgentMutation();

    const agent: ApiUser[] =
        usersData?.results?.filter((user: ApiUser) => user.role === 'AGENT') ?? [];
    // console.log(agent);

    React.useEffect(() => {
        if (!open) {
            setSelectedAgentId("");
        }
    }, [open]);

    if (!open || !patient) return null;

    const getPriorityStyle = (p: Patient["priority"]) => {
        switch (p) {
            case "HIGH":
                return "bg-red-100 text-red-700";
            case "MEDIUM":
                return "bg-yellow-100 text-yellow-700";
            case "LOW":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    console.log(patient.id, selectedAgentId);
    const handleAssignPatient = async () => {
        if (!selectedAgentId) return;

        try {
            await assignAgent({
                patientId: patient.id,
                agentId: selectedAgentId,
            }).unwrap();

            Swal.fire({
                icon: 'success',
                title: 'Assigned',
                text: 'Agent assigned successfully',
                timer: 2000,
                showConfirmButton: false,
            });

            onClose();
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: error?.data?.message || 'Assignment failed',
            });
        }
    };


    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
            aria-labelledby="reassign-modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal container */}
            <div className="relative max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-20 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Header */}
                <div className="pt-6 px-8 pb-4">
                    <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#F3F6FF] shrink-0">
                            <span><User className='w-5 h-5' /></span>
                        </div>
                        <div className="flex-1">
                            <h2 id="reassign-modal-title" className="text-xl font-semibold text-gray-900">
                                Assign Patient to Agent
                            </h2>
                            <p className="text-md text-gray-500 mt-1">
                                Assign {patient.name} to an agent for outreach
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-8 pb-8">

                    {/* Select Agent */}
                    <div className="mb-6 bg-[#EEF6FF] p-3 rounded-3xl">
                        <label className="block text-md font-medium text-[#1C398E] pl-3">
                            Select Agent
                        </label>

                        <div className="mt-2 px-4">
                            <div className="relative">
                                <select
                                    value={selectedAgentId}
                                    onChange={(e) => setSelectedAgentId(e.target.value)}
                                    className="w-full appearance-none border-0 text-lg text-[#717182] focus:outline-none bg-white px-5 py-2 pr-16 rounded-full focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Choose an agent</option>
                                    {agent.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} {a.patient_assigned === 0 ? "" : `(${a.patient_assigned} patients)`}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Patient Details */}
                    <div className="border border-gray-200 rounded-2xl p-4">
                        <h3 className="text-lg text-gray-500 mb-3">Patient Details</h3>

                        <div className="flex flex-col gap-4">

                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-md text-gray-500 font-bold">Name:</p>
                                    <p className="text-md text-gray-900">{patient.name}</p>
                                </div>

                                <div className="mt-1 space-y-1 text-sm">
                                    <p>
                                        <span className="text-gray-500 font-semibold">Phone: </span>
                                        <span className="text-gray-900">{patient.phone}</span>
                                    </p>
                                    <p>
                                        <span className="text-gray-500 font-semibold">Visit Type: </span>
                                        <span className="text-gray-900">{patient.last_visit_type}</span>
                                    </p>
                                    <p>
                                        <span className="text-gray-500 font-semibold">Last Visit: </span>
                                        <span className="text-gray-900">{patient.last_visit_date}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Priority Badge → now at bottom */}
                            <div>
                                <span
                                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                                        patient.priority
                                    )}`}
                                >
                                    {patient.priority} priority
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className=" cursor-pointer px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleAssignPatient}
                            // onClick={() => onAssign(selectedAgent || patient?.primary_provider_name)}
                            className=" cursor-pointer px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                            disabled={!selectedAgentId || isAssignLoading}
                        >
                            {
                                isAssignLoading ?
                                    (
                                        <span className="inline-flex items-center gap-2">
                                            <span><User2 className='w-4 h-4' /></span>
                                            <span><Loader2 className="w-4 h-4 animate-spin" />
                                                Assigning...
                                            </span>
                                        </span>)
                                    : 'Assign'
                            }
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};




// Main ManagerPatientsTable
const ManagerPatientsTable: React.FC = ({
    //   patientsData,
    //   limit,
    //   setLimit,
    //   page,
    //   setPage
}) => {
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);

    const offset = (page - 1) * limit;

    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const { data: patientsData } = useGetAllPatientQuery({ limit, offset });
    const patients = patientsData?.results as Patient[] || [];
    const totalPatients = patientsData?.count || 0;
    console.log(totalPatients)
    const totalPages = Math.ceil(totalPatients / limit);
    const [selectedAgent, setSelectedAgent] = useState("");
    const [selectedVisitType] = useState("");


    const { data: usersData = [] } = useGetUserQuery();
    // const {data:visitTypeData} = useGetPatientVisitTypeQuery();

    const agents: ApiUser[] =
        usersData?.results?.filter((user: ApiUser) => user.role === 'AGENT') ?? [];


    console.log(agents);


    console.log(patients)

    const getPriorityStyle = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-100 text-red-700';
            case 'MEDIUM': return 'bg-orange-100 text-orange-700';
            case 'LOW': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const openReassign = (patient: Patient) => {
        setSelectedPatient(patient);
        setModalOpen(true);
    };

    const closeReassign = () => {
        setModalOpen(false);
        setSelectedPatient(null);
    };

    // Basic filter for search (name, phone, email)
    // const filtered = patients.filter((p) =>
    //     [p.name, p.phone, p.email].join(' ').toLowerCase().includes(searchQuery.toLowerCase())
    // );

    const filtered = patients.filter((p) => {
        const matchesSearch =
            [p.name, p.phone, p.email]
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
        console.log(selectedAgent)
        console.log(p?.agent?.id)
        const matchesAgent =
            !selectedAgent || p?.agent?.id === Number(selectedAgent);

        const matchesVisitType =
            !selectedVisitType || p.last_visit_type === selectedVisitType;

        return matchesSearch && matchesAgent && matchesVisitType;
    });

    // Sort by last_visit_date descending (newest first)
    const sortedData = [...filtered].sort((a, b) => {
        const dateA = new Date(a.last_visit_date).getTime() || 0;
        const dateB = new Date(b.last_visit_date).getTime() || 0;
        return dateB - dateA;
    });

    return (
        <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden mt-8 px-4">
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                {/* Search Input Section */}
                <div className="p-6 border-gray-200 search-input w-full lg:w-[75%]">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search patients by name, phone, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 py-2 px-1 bg-[#F3F3F5] border-0 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
                        />
                    </div>
                </div>

                {/* Selection Inputs Wrapper */}
                <div className="selection-input flex flex-col sm:flex-row gap-4 justify-between w-full lg:w-1/2 p-6">
                    {/* Dropdown 1 */}
                    <div className="w-full">
                        <div className="relative">
                            <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="w-full appearance-none bg-[#F3F3F5] border border-gray-200 rounded-full px-4 py-1.5 pr-16 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                                <option value="">All Agents</option>

                                {agents.map((agent) => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.name}
                                    </option>

                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Dropdown 2 */}
                    {/* <div className="w-full">
                        <div className="relative">
                            <select value={selectedVisitType} onChange={(e) => setSelectedVisitType(e.target.value)} className="w-full appearance-none bg-[#F3F3F5] border border-gray-200 rounded-full px-4 py-1.5 pr-16 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent">
                                <option>All Visit</option>
                                {visitTypeData?.map((type:any, index:string) => (
                                        <option key={index}>{type?.visit_type}</option>
                                    ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Table - Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Patient Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Visit Type</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Visit</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Assigned To</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((patient) => (
                            <tr key={patient.id} className="border-b border-gray-100 last:border-b-0">
                                <td className="px-6 py-4 text-sm text-gray-900">{patient.name}</td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{patient.phone}</div>
                                    <div className="text-sm text-[#6A7282]">{patient.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{patient.last_visit_type}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{patient.last_visit_date}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{patient.due_for}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                                            patient.priority
                                        )}`}
                                    >
                                        {patient.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{patient?.agent?.name || "-"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Link to={`${patient.id}`}>
                                            <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full transition-colors hover:bg-gray-700 cursor-pointer">
                                                View
                                            </button>
                                        </Link>

                                        <button
                                            onClick={() => openReassign(patient)}
                                            className="px-4 py-2 text-black text-sm font-medium rounded-full border border-gray-200 transition-colors hover:bg-gray-50 cursor-pointer"
                                        >
                                            Reassign
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 mb-6 gap-4 mx-6">
                {/* Rows per page */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <select
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[5, 10, 20, 50].map((l) => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                    </select>
                </div>

                {/* {
                        loading &&
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Loading...</span>  
                        </div>
                    } */}

                {/* Pagination buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Previous */}
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                    >
                        &lt;
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(Math.max(page - 3, 0), page + 2)
                        .map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`px-4 py-1 rounded-full text-sm font-medium border transition
                                ${page === p
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md'
                                        : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                            >
                                {p}
                            </button>
                        ))}

                    {/* Next */}
                    <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Card View - Mobile/Tablet */}
            <div className="lg:hidden divide-y divide-gray-100">
                {sortedData.map((patient) => (
                    <div key={patient.id} className="p-6 space-y-4">
                        {/* Name & Priority */}
                        <div className="flex items-start justify-between">
                            <h3 className="text-base font-semibold text-gray-900">{patient.name}</h3>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                                    patient.priority
                                )}`}
                            >
                                {patient.priority}
                            </span>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1">
                            <p className="text-sm text-gray-900">{patient.phone}</p>
                            <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>

                        {/* Visit Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Visit Type</p>
                                <p className="text-gray-900">{patient.last_visit_type}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Last Visit</p>
                                <p className="text-gray-900">{patient.last_visit_date}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Status</p>
                                <p className="text-gray-900">{patient.due_for}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                            <Link to={`${patient.id}`} className="flex items-center justify-center cursor-pointer flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                                <button className="text-center">
                                    View
                                </button>
                            </Link>
                            <button
                                onClick={() => openReassign(patient)}
                                className="cursor-pointer px-4 py-2 text-black text-sm font-medium rounded-full border border-gray-200  hover:bg-gray-50 transition-colors"
                            >
                                Reassign
                            </button>

                            <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                                <Phone className="w-4 h-4 text-gray-700" />
                            </button>
                            <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                                <Mail className="w-4 h-4 text-gray-700" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reassign Modal */}
            <ReassignModal
                open={modalOpen}
                patient={selectedPatient || undefined}
                onClose={closeReassign}
            // onAssign={handleAssign}
            />
        </div>
    );
};

export default ManagerPatientsTable;
