import { useState } from 'react';
import { Users, Search, Filter, Phone, Calendar, User, Save } from 'lucide-react';

interface Patient {
    id: string;
    name: string;
    phone: string;
    lastVisit: string;
    visitType: string;
    priority: 'high' | 'medium' | 'low';
}

const AssignAgent: React.FC = () => {
    const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAgent, setSelectedAgent] = useState('');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [priorityFilter, setPriorityFilter] = useState('All Priorities');

    const patients: Patient[] = [
        { id: '1', name: 'Sarah Johnson', phone: '(504) 555-1234', lastVisit: '2024-04-15', visitType: 'AP', priority: 'high' },
        { id: '2', name: 'Michael Chen', phone: '(504) 555-5678', lastVisit: '2024-03-20', visitType: 'CH', priority: 'medium' },
        { id: '3', name: 'Emily Davis', phone: '(504) 555-9012', lastVisit: '2024-02-10', visitType: 'SV', priority: 'high' },
        { id: '4', name: 'Robert Wilson', phone: '(504) 555-3456', lastVisit: '2024-01-25', visitType: 'AP', priority: 'low' },
        { id: '5', name: 'Lisa Anderson', phone: '(504) 555-7890', lastVisit: '2024-03-15', visitType: 'CH', priority: 'medium' },
        { id: '6', name: 'David Martinez', phone: '(504) 555-2345', lastVisit: '2024-02-28', visitType: 'SV', priority: 'high' },
        { id: '7', name: 'Jennifer Taylor', phone: '(504) 555-6789', lastVisit: '2024-04-05', visitType: 'AP', priority: 'medium' },
        { id: '8', name: 'James Brown', phone: '(504) 555-0123', lastVisit: '2024-01-30', visitType: 'CH', priority: 'low' }
    ];

    const togglePatient = (id: string) => {
        const newSelected = new Set(selectedPatients);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedPatients(newSelected);
    };

    const toggleAll = () => {
        if (selectedPatients.size === patients.length) {
            setSelectedPatients(new Set());
        } else {
            setSelectedPatients(new Set(patients.map(p => p.id)));
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700';
            case 'medium':
                return 'bg-orange-100 text-orange-700';
            case 'low':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="">
                <div className="w-full">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">Assign Patients to Agent</h1>
                    <p className="text-md text-gray-500">Bulk assign patients to agents for outreach and follow-up</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full mt-6">
                {/* Select Agent Section */}
                <div className="bg-blue-50 rounded-3xl border border-blue-100 p-5 mb-6">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        Select Agent
                    </label>
                    <select
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                    >
                        <option value="">Choose an agent...</option>
                        <option value="john">John Agent</option>
                        <option value="sarah">Sarah Manager</option>
                        <option value="mike">Mike Representative</option>
                    </select>
                </div>

                {/* Available Patients Section */}
                <div className="bg-white rounded-xl border border-gray-200">
                    {/* Section Header */}
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-700" />
                                <h2 className="text-base font-semibold text-gray-900">
                                    Available Patients <span className="text-gray-500 font-normal">(8 unassigned)</span>
                                </h2>
                            </div>
                            <button
                                onClick={toggleAll}
                                className="text-sm font-medium text-black hover:text-gray-600 border border-gray-200 rounded-full p-2
                "
                            >
                                Select All (8)
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 px-6">

                        {/* Search (2/3) */}
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full
                  text-sm text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filters section (1/3) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Type Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-full
                  text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  appearance-none cursor-pointer"
                                >
                                    <option>All Types</option>
                                    <option>Annual Physical</option>
                                    <option>Checkup</option>
                                    <option>Sick Visit</option>
                                </select>
                            </div>

                            {/* Priority Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-full
                  text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  appearance-none cursor-pointer"
                                >
                                    <option>All Priorities</option>
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                            </div>
                        </div>

                    </div>


                    {/* Table */}
                   <div className='px-6 mb-6'>
                     <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedPatients.size === patients.length}
                                            onChange={toggleAll}
                                            className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Patient Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Last Visit
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Visit Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Priority
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {patients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => togglePatient(patient.id)}
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedPatients.has(patient.id)}
                                                onChange={() => togglePatient(patient.id)}
                                                className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-900">
                                                <User className="w-4 h-4 text-gray-400" />
                                                {patient.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                {patient.phone}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {patient.lastVisit}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2 py-1 border border-gray-200 text-gray-700 text-xs font-medium rounded-2xl">
                                                {patient.visitType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-2xl ${getPriorityColor(patient.priority)}`}>
                                                {patient.priority}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                   </div>

                    {/* Footer */}
                    <div className="px-6 py-4  border-gray-200 flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                            Showing 8 of 8 unassigned patients
                        </span>
                        <button
                            disabled={selectedPatients.size === 0}
                            className={`px-5 py-2 text-sm font-medium text-white rounded-full flex items-center gap-2 transition-colors ${selectedPatients.size === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gray-700 hover:bg-gray-800'
                                }`}
                        >
                            <Save className="w-4 h-4" />
                            Assign Selected ({selectedPatients.size})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignAgent;