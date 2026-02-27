// import { Calendar } from "lucide-react";
// import { useState } from "react";
// import tikMark from '../../../../assets/tik-mart.png';
// import wrongTik from "../../../../assets/wrong-tik.png";

// const Appointment = () => {
//   const [showSchedule, setShowSchedule] = useState(false);

//   return (
//     <>
//       <h2 className="text-xl font-bold text-gray-900 mb-6">
//         Step 3 of 5: Appointment
//       </h2>

//       <div className="mb-8">
//         <h3 className="text-xl font-bold text-gray-900 mb-4">
//           Was an appointment booked?
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* YES BUTTON */}
//           <button
//             onClick={() => setShowSchedule(true)}
//             className={`flex flex-col items-start gap-2 p-5 rounded-3xl border-2 bg-white transition-all text-left 
//             ${showSchedule
//                 ? "border-blue-500"
//                 : "border-gray-200 hover:border-gray-300"
//               }`}
//           >
//             <Calendar className="w-6 h-6 text-green-600" />
//             <p className="font-medium text-gray-900">Yes, appointment scheduled</p>
//           </button>

//           {/* NO BUTTON */}
//           <button
//             onClick={() => setShowSchedule(false)}
//             className={`flex flex-col items-start gap-2 p-5 rounded-3xl border-2 bg-white transition-all text-left 
//             ${!showSchedule
//                 ? "border-blue-500"
//                 : "border-gray-200 hover:border-gray-300"
//               }`}
//           >
//             <img src={wrongTik} alt="image" className="w-6 h-6" />
//             <p className="font-medium text-gray-900">No appointment scheduled</p>
//           </button>
//         </div>
//       </div>

//       {/* SHOW ONLY IF YES IS SELECTED */}
//       {showSchedule && (
//         <div className="appointment-schedule">
//           <div className="mb-8 p-5 rounded-2xl bg-green-50 border border-green-200">
//             <div className="flex items-start gap-3">
//               <img src={tikMark} className="w-5 h-5" alt="" />
//               <div>
//                 <p className="font-semibold text-green-900 mb-1">
//                   Appointment Booking
//                 </p>
//                 <p className="text-sm text-green-700">
//                   Great! Enter the appointment details below. A confirmation will
//                   be sent to the patient automatically.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* INPUT FIELDS */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-2">
//                 Appointment Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-1 rounded-full focus:outline-none focus:ring-2 
//                 focus:ring-blue-600 focus:border-transparent bg-[#F3F3F5]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-2">
//                 Appointment Time <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 className="w-full px-4 py-1 rounded-full borderfocus:outline-none focus:ring-2 
//                 focus:ring-blue-600 focus:border-transparent bg-[#F3F3F5]"
//               />
//             </div>
//           </div>

//           <div className="mb-8">
//             <label className="block text-sm font-semibold text-gray-900 mb-2">
//               Appointment Type
//             </label>
//             <select
//               className="w-full px-4 py-1 rounded-full  focus:outline-none focus:ring-2 
//               focus:ring-blue-600 focus:border-transparent appearance-none bg-[#F3F3F5]"
//             >
//               <option className="text-sm">Annual Physical</option>
//               <option className="text-sm">Follow-up Visit</option>
//               <option className="text-sm">Consultation</option>
//               <option className="text-sm">Procedure</option>
//             </select>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Appointment;

// import { Calendar } from "lucide-react";
// import { useEffect, useState } from "react";
// import tikMark from '../../../../assets/tik-mart.png';
// import wrongTik from "../../../../assets/wrong-tik.png";
// import { useCreateAppointmentMutation } from "../../../../redux/services/dashboard/manager/appointment.api";
// import { useParams } from "react-router-dom";

// const Appointment = ({  setFormData }: any) => {
//   const { patientId } = useParams<{ patientId: string }>();
//   const [createAppointment] = useCreateAppointmentMutation();
//   const [showSchedule, setShowSchedule] = useState(false);
//   const [appointmentDate, setAppointmentDate] = useState('');
//   const [appointmentTime, setAppointmentTime] = useState('');
//   const [appointmentType, setAppointmentType] = useState('');

//   // ------------------------
//   // SYNC TO MAIN FORM DATA
//   // ------------------------

//   const handleCreateAppointment = () => {

//   }

//   useEffect(() => {
//     setFormData((prev: any) => ({
//       ...prev,
//       appointment_booked: showSchedule,
//       appointment_date: showSchedule ? appointmentDate : null,
//       appointment_time: showSchedule ? appointmentTime : null,
//       appointment_type: showSchedule ? appointmentType : null,
//     }));
//   }, [showSchedule, appointmentDate, appointmentTime, appointmentType]);

//   // ------------------------
//   // UI (UNCHANGED)
//   // ------------------------

//   return (
//     <>
//       <h2 className="text-xl font-bold text-gray-900 mb-6">
//         Step 3 of 5: Appointment
//       </h2>

//       <div className="mb-8">
//         <h3 className="text-xl font-bold text-gray-900 mb-4">
//           Was an appointment booked?
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//           {/* YES BUTTON */}
//           <button
//             onClick={() => setShowSchedule(true)}
//             className={`flex flex-col items-start gap-2 p-5 rounded-3xl border-2 bg-white transition-all text-left 
//             ${showSchedule
//                 ? "border-blue-500"
//                 : "border-gray-200 hover:border-gray-300"
//               }`}
//           >
//             <Calendar className="w-6 h-6 text-green-600" />
//             <p className="font-medium text-gray-900">
//               Yes, appointment scheduled
//             </p>
//           </button>

//           {/* NO BUTTON */}
//           <button
//             onClick={() => setShowSchedule(false)}
//             className={`flex flex-col items-start gap-2 p-5 rounded-3xl border-2 bg-white transition-all text-left 
//             ${!showSchedule
//                 ? "border-blue-500"
//                 : "border-gray-200 hover:border-gray-300"
//               }`}
//           >
//             <img src={wrongTik} alt="image" className="w-6 h-6" />
//             <p className="font-medium text-gray-900">
//               No appointment scheduled
//             </p>
//           </button>

//         </div>
//       </div>

//       {/* SHOW ONLY IF YES IS SELECTED */}
//       {showSchedule && (
//         <div className="appointment-schedule">

//           <div className="mb-8 p-5 rounded-2xl bg-green-50 border border-green-200">
//             <div className="flex items-start gap-3">
//               <img src={tikMark} className="w-5 h-5" alt="" />
//               <div>
//                 <p className="font-semibold text-green-900 mb-1">
//                   Appointment Booking
//                 </p>
//                 <p className="text-sm text-green-700">
//                   Great! Enter the appointment details below. A confirmation will
//                   be sent to the patient automatically.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* INPUT FIELDS */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-2">
//                 Appointment Date <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 value={appointmentDate}
//                 onChange={(e) => setAppointmentDate(e.target.value)}
//                 className="w-full px-4 py-1 rounded-full focus:outline-none focus:ring-2 
//                 focus:ring-blue-600 bg-[#F3F3F5]"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-900 mb-2">
//                 Appointment Time <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="time"
//                 value={appointmentTime}
//                 onChange={(e) => setAppointmentTime(e.target.value)}
//                 className="w-full px-4 py-1 rounded-full focus:outline-none focus:ring-2 
//                 focus:ring-blue-600 bg-[#F3F3F5]"
//               />
//             </div>

//           </div>

//           <div className="mb-8">
//             <label className="block text-sm font-semibold text-gray-900 mb-2">
//               Appointment Type
//             </label>
//             <select
//               value={appointmentType}
//               onChange={(e) => setAppointmentType(e.target.value)}
//               className="w-full px-4 py-1 rounded-full focus:outline-none focus:ring-2 
//               focus:ring-blue-600 appearance-none bg-[#F3F3F5]"
//             >
//               <option value="">Select Type</option>
//               <option>Annual Physical</option>
//               <option>Follow-up Visit</option>
//               <option>Consultation</option>
//               <option>Procedure</option>
//             </select>
//           </div>

//         </div>
//       )}
//     </>
//   );
// };

// export default Appointment;


import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import tikMark from '../../../../assets/tik-mart.png';
import wrongTik from "../../../../assets/wrong-tik.png";
// import { useCreateAppointmentMutation } from "../../../../redux/services/dashboard/manager/appointment.api";
// import { useParams } from "react-router-dom";

const Appointment = ({ setFormData }: any) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  // ------------------------
  // SYNC TO MAIN FORM DATA
  // ------------------------
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      appointment_booked: showSchedule,
      appointment_date: showSchedule ? appointmentDate : null,
      appointment_time: showSchedule ? appointmentTime : null,
      notes: showSchedule ? notes : null,
    }));
  }, [showSchedule, appointmentDate, appointmentTime, notes]);


  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Step 3 of 5: Appointment
      </h2>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Was an appointment booked?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowSchedule(true)}
            className={`flex flex-col items-start gap-2 p-5 rounded-3xl border-2 bg-white transition-all text-left ${showSchedule ? "border-blue-500" : "border-gray-200 hover:border-gray-300"}`}
          >
            <Calendar className="w-6 h-6 text-green-600" />
            <p className="font-medium text-gray-900">Yes, appointment scheduled</p>
          </button>

          <button
            onClick={() => setShowSchedule(false)}
            className={`flex flex-col items-start gap-2 p-5 rounded-3xl border-2 bg-white transition-all text-left ${!showSchedule ? "border-blue-500" : "border-gray-200 hover:border-gray-300"}`}
          >
            <img src={wrongTik} alt="image" className="w-6 h-6" />
            <p className="font-medium text-gray-900">No appointment scheduled</p>
          </button>
        </div>
      </div>

      {showSchedule && (
        <div className="appointment-schedule">
          <div className="mb-8 p-5 rounded-2xl bg-green-50 border border-green-200">
            <div className="flex items-start gap-3">
              <img src={tikMark} className="w-5 h-5" alt="" />
              <div>
                <p className="font-semibold text-green-900 mb-1">Appointment Booking</p>
                <p className="text-sm text-green-700">
                  Great! Enter the appointment details below. A confirmation will be sent automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-4 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#F3F3F5]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Appointment Time
              </label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full px-4 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#F3F3F5]"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-2">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none bg-[#F3F3F5] rounded-4xl placeholder:text-left"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Appointment;

