import React, { useState } from "react";
import {
  useAssignAgentMutation,
  useUploadPatientFileMutation,
  useGetAllPatientQuery,
  useGetSummaryQuery,
} from "../../../../redux/services/dashboard/admin/admin.patient";
import Spinner from "../../../Spinner";
import type { Patient } from "../../../../redux/services/dashboard/admin/types/adminPatient.type";
import { useGetUserQuery } from "../../../../redux/services/dashboard/admin/adminUserApi";
import type { ApiUser } from "../../../../redux/services/dashboard/admin/types/adminUser.type";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";
import ExcelUploadModal from "../../manager/MangerPatients/ExcelUploadModal";

const PatientManagement: React.FC = () => {
  const [limit, setLimit] = useState(10); // Patients per page
  const [page, setPage] = useState(1); // Current page
  const offset = (page - 1) * limit;
  // const [loading] = useState(false);

  const { data: adminSummary, isLoading: isSummaryLoading } =
    useGetSummaryQuery();
  const { data: patientsData, isLoading: isPatientsLoading } =
    useGetAllPatientQuery({ limit, offset });

  // const [assignPatient] = useAssignPatientMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedAgent, setSelectedAgent] = useState("");

  // const agents = [
  //     'John Agent (45 Patients)',
  //     'Maria Garcia (52 Patients)',
  //     'David Smith (38 Patients)',
  //     'Sarah Williams (34 Patients)'
  // ];
  const { data: usersData = [] } = useGetUserQuery();
  const [assignAgent, { isLoading: isAssignLoading }] =
    useAssignAgentMutation();
  // const agents =
  // usersData?.results?.filter((user: ApiUser) => user.role === 'AGENT')
  //     .map((user: ApiUser) => user.name ) ?? [];
  const agents: ApiUser[] =
    usersData?.results?.filter((user: ApiUser) => user.role === "AGENT") ?? [];

  console.log(agents);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadPatientFile] = useUploadPatientFileMutation();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-orange-100 text-orange-700";
      case "LOW":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };


  const handleAssignClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setSelectedAgent("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
    setSelectedAgent("");
  };

  const handleAssignPatient = async () => {
    if (!selectedPatient || !selectedAgent) return;

    try {
      await assignAgent({
        patientId: selectedPatient.id,
        agentId: selectedAgent,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Assigned",
        text: "Agent assigned successfully",
        timer: 2000,
        showConfirmButton: false,
      });

      handleCloseModal();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error?.data?.message || "Assignment failed",
      });
    }
  };

  const handleUpload = async (file: File) => {
    // Show loading alert
    Swal.fire({
      title: "Uploading...",
      text: "Please wait while we process the file.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadPatientFile(formData).unwrap();

      Swal.fire({
        icon: "success",
        title: "Upload Successful",
        text: response.message || "File uploaded successfully",
        timer: 3000,
        showConfirmButton: false,
      });
      setIsUploadModalOpen(false);
    } catch (error: any) {
      console.error("Upload failed:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text:
          error?.data?.detail?.[0]?.msg ||
          error?.data?.message ||
          "An error occurred while uploading the file.",
      });
    }
  };

  if (isSummaryLoading || isPatientsLoading) return <Spinner />;

  const patients = [...((patientsData?.results as Patient[]) || [])].sort(
    (a, b) => {
      const dateA = new Date(a.last_visit_date).getTime() || 0;
      const dateB = new Date(b.last_visit_date).getTime() || 0;
      return dateB - dateA;
    },
  );
  console.log(patients);
  const totalPatients = patientsData?.count || 0;
  const totalPages = Math.ceil(totalPatients / limit);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="flex justify-between items-center">
          <div className="">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Patient Management
            </h1>
            <p className="text-sm text-gray-500">
              Assign and reassign patients to agents for outreach
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-upload"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              Upload Client Data
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
          <div className="bg-[#EFF6FF] rounded-3xl p-4 flex flex-col justify-center">
            <div className="text-sm text-blue-700 mb-1">Total Patients</div>
            <div className="text-2xl font-semibold text-blue-900">
              {adminSummary?.total_patients}
            </div>
          </div>
          <div className="bg-[#F0FDF4] p-4 rounded-2xl">
            <div className="text-sm text-green-700 mb-2">Assigned Patients</div>
            <div className="text-2xl font-semibold text-green-900">
              {adminSummary?.assigned_patients}
            </div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4">
            <div className="text-sm text-red-700 mb-2">Unassigned Patients</div>
            <div className="text-2xl font-semibold text-red-900">
              {adminSummary?.unassigned_patients}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Patient Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Visit Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Last Visit
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Assigned To
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {patients?.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {patient.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {patient?.last_visit_type ?? "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {patient.last_visit_date ?? "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(patient.priority)}`}
                    >
                      {patient.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={
                        patient.agent === null
                          ? "text-red-600"
                          : "text-gray-900"
                      }
                    >
                      {patient.agent === null
                        ? "Unassigned"
                        : patient.agent?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleAssignClick(patient)}
                      // disabled={patient.agent === null}
                      className="px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                      {patient.agent === null ? "Assign" : "Reassign"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
          {/* Rows per page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 20, 50].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
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
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white border-gray-300 hover:bg-gray-100 text-gray-700"
                    }`}
                >
                  {p}
                </button>
              ))}

            {/* Next */}
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative p-6">
            <button
              onClick={handleCloseModal}
              className="absolute top-5 right-5 w-8 h-8 text-gray-400 hover:text-gray-600"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Assign Patient to Agent
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Select an agent to assign {selectedPatient?.name}
            </p>

            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border-0 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            >
              <option value="">Choose an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end">
              <button
                onClick={handleAssignPatient}
                disabled={!selectedAgent}
                className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isAssignLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Assigning...
                  </span>
                ) : (
                  "Assign Patient"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ExcelUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </>
  );
};

export default PatientManagement;
