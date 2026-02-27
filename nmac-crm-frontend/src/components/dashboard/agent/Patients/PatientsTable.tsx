import React, { useState } from 'react';
import { Search, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAllPatientQuery } from '../../../../redux/services/dashboard/admin/admin.patient';
import Spinner from '../../../Spinner';

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
}

const PatientsTable: React.FC = () => {
  const [limit, setLimit] = useState(10); // Patients per page
  const [page, setPage] = useState(1); // Current page
  const offset = (page - 1) * limit;
  const [searchQuery, setSearchQuery] = useState('');
  // const [modalOpen, setModalOpen] = useState(false);
  // const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { data: patientsData, isLoading: isPatientsLoading } = useGetAllPatientQuery({ limit, offset });
  console.log(patientsData)
  const patients = patientsData?.results as Patient[] || [];
  const totalPatients = patientsData?.count || 0;
  const totalPages = Math.ceil(totalPatients / limit);

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-700';
      case 'MEDIUM': return 'bg-orange-100 text-orange-700';
      case 'LOW': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filtered = patients.filter((p) =>
    [p.name, p.phone, p.email].join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by last_visit_date descending (newest first)
  const sortedData = [...filtered].sort((a, b) => {
    const dateA = new Date(a.last_visit_date).getTime() || 0;
    const dateB = new Date(b.last_visit_date).getTime() || 0;
    return dateB - dateA;
  });

  if (isPatientsLoading) {
    return <Spinner />;
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 overflow-hidden mt-8">
      {/* Search Bar */}
      <div className="p-6 border-gray-200">
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

      {/* Table - Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Patient Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Visit Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Last Visit
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Priority
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
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
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link to={`${patient.id}`}>
                      <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full  transition-colors hover:bg-gray-700 cursor-pointer">
                        View
                      </button>
                    </Link>
                    <Link to={`${patient.id}/call-log`}>
                      <button className="p-2 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-200">
                        <Phone className="w-4 h-4 text-gray-700" />
                      </button>
                    </Link>
                    <Link to="/dashboard/agent/messages">
                      <button className="p-2 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-200">
                        <Mail className="w-4 h-4 text-gray-700" />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="m-5 flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
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
              <button className="flex-1 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                View
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
    </div>
  );
};

export default PatientsTable;