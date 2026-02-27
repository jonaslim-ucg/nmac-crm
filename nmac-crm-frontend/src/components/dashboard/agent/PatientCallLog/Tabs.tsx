import { Calendar, FileText, Phone, User, } from 'lucide-react';
import React, { useState } from 'react';
import Appointment from './Appointment';
import CallDetails from './CallDetails';
import NotesSummary from './NotesSummary';
import PatientResponse from './PatientResponse';
import { useCreateCallMutation } from '../../../../redux/services/dashboard/manager/callLog.api';
import { useCreateAppointmentMutation } from '../../../../redux/services/dashboard/manager/appointment.api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

type TabType = 'call-details' | 'patient-response' | 'appointment' | 'notes-summary';

const LogPatientCall: React.FC = () => {

  const [activeTab, setActiveTab] = useState<TabType>('call-details');
  const navigate = useNavigate()

  // const [activeTab, setActiveTab] = useState<TabType>('call-details');
  const [createCall, { isLoading }] = useCreateCallMutation();
  const [createAppointment] = useCreateAppointmentMutation();

  // ----------------------------
  // HANDLE FINAL SUBMIT
  // ----------------------------
  const [formData, setFormData] = useState({
  patient_id: '',
  outcome: '',
  call_duration: '',
  contact_method: '',
  
  patient_response: false,
  interest_level: '',
  concern: '',
  
  appointment_booked: false,
  appointment_date: '',
  appointment_time: '',
  // appointment_type: '',
  appointment_id: null,

  notes: ''
});

const handleNext = () => {
  const currentIndex = tabs.findIndex(t => t.id === activeTab);

  if (currentIndex < tabs.length - 1) {
    setActiveTab(tabs[currentIndex + 1].id);
  }
};


const handleComplete = async () => {
  try {
    let appointmentId = formData.appointment_id; // start with existing id

    // 1️⃣ Create appointment if booked and not already created
    if (formData.appointment_booked && !appointmentId) {
      if (!formData.appointment_date) {
        Swal.fire({ title: "Appointment date is required", icon: "warning" });
        return;
      }

      const payload: any = new URLSearchParams({
        patient_id: formData.patient_id || '',
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time
          ? `${formData.appointment_time}:00`
          : '',
        notes: formData.notes || '',
      });
      console.log(payload)

      const res = await createAppointment(payload).unwrap();
      console.log(res)

      appointmentId = res?.appointment?.id;
      console.log(appointmentId)
      if (!appointmentId) {
        Swal.fire({ title: "Failed to get appointment ID", icon: "error" });
        return;
      }

      setFormData(prev => ({
        ...prev,
        appointment_id: appointmentId,
      }));

      Swal.fire({
        title: "Appointment created successfully ✅",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });
    }

    // 2️⃣ Create the call log using the **actual appointmentId**
    const callPayload = { ...formData, appointment_id: appointmentId };
    console.log("Call Payload:", callPayload);

    const callRes = await createCall(callPayload).unwrap();
    console.log(callRes);

    Swal.fire({
      title: "Call log completed successfully ✅",
      icon: "success",
      confirmButtonText: "OK",
      timer: 3000,
      timerProgressBar: true,
    });
    navigate("/dashboard/agent/patients")

  } catch (error) {
    console.error("Failed to complete call log:", error);
    Swal.fire({
      title: "Something went wrong",
      text: "Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

  const tabs = [
    { id: 'call-details' as TabType, icon: Phone, label: 'Call Details', step: 1 },
    { id: 'patient-response' as TabType, icon: User, label: 'Patient Response', step: 2 },
    { id: 'appointment' as TabType, icon: Calendar, label: 'Appointment', step: 3 },
    { id: 'notes-summary' as TabType, icon: FileText, label: 'Notes & Summary', step: 4 },
  ];

  // <div>
  //   <CallDetails  />
  //   <PatientResponse />
  //   <Appointment />
  //   <NotesSummary />
  // </div>


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-xs border-gray-200 border">
          <div className="flex items-center justify-between">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isCompleted = tabs.findIndex(t => t.id === activeTab) > index;

              return (
                <React.Fragment key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-col items-center flex-1 cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${isActive ? 'bg-blue-600' : isCompleted ? 'bg-green-500' : 'bg-gray-200 group-hover:bg-gray-300'
                      }`}>
                      <Icon className={`w-6 h-6 ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                      {tab.label}
                    </p>
                  </button>
                  {index < tabs.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 mb-8 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border-gray-100 border">
          {/* {activeTab === 'call-details' && <CallDetails />}
          {activeTab === 'patient-response' && <PatientResponse />}
          {activeTab === 'appointment' && <Appointment />}
          {activeTab === 'notes-summary' && <NotesSummary />} */}
          {activeTab === 'call-details' && (
            <CallDetails
              formData={formData}
              setFormData={setFormData}
            />

            )}

            {activeTab === 'patient-response' && (
              <PatientResponse
                formData={formData}
              setFormData={setFormData}
              />
            )}

            {activeTab === 'appointment' && (
              <Appointment
                formData={formData}
              setFormData={setFormData}
              />
            )}

            {activeTab === 'notes-summary' && (
              <NotesSummary
                formData={formData}
              setFormData={setFormData}
              />
            )}


          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].id);
                }
              }}
              disabled={activeTab === 'call-details'}
              className="px-6 py-2.5 text-gray-600 font-medium hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 p-2 rounded-full"
            >
              Previous
            </button>
            <button
            onClick={() => {
              if (activeTab === 'notes-summary') {
                handleComplete(); // Only call final API here
              } else {
                handleNext(); // Just move tabs
              }
            }}
              // onClick={handleNext}
              // onClick={() => {
              //   const currentIndex = tabs.findIndex(t => t.id === activeTab);
              //   if (currentIndex < tabs.length - 1) {
              //     setActiveTab(tabs[currentIndex + 1].id);
              //   }
              // }}

              className="px-8 py-2.5 bg-black text-white font-medium rounded-full hover:bg-gray-900 transition-colors flex items-center gap-2"
            >

              {activeTab === 'notes-summary' 
                ? 
                  isLoading ? 'Completing...' : "Complete" 
                : 'Next Step'}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            {/* <button
                onClick={() => {
                  const currentIndex = tabs.findIndex(t => t.id === activeTab);

                  if (activeTab === 'notes-summary') {
                    handleComplete();   // ✅ SUBMIT API
                  } else {
                    setActiveTab(tabs[currentIndex + 1].id);
                  }
                }}
                disabled={isLoading}
                className="px-8 py-2.5 bg-black text-white font-medium rounded-full 
                hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-60"
              >
                {isLoading ? 'Saving...' : activeTab === 'notes-summary' ? 'Complete' : 'Next Step'}

                {!isLoading && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default LogPatientCall;