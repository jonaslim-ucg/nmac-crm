// const NotesSummary = () => {
//   return (
//     <>
//       <h2 className="text-xl font-bold text-gray-900 mb-6">Step 5 of 5: Notes & Summary</h2>

//       <div className="mb-6">
//         <label className="block text-lg font-bold text-gray-900 mb-2">
//           Call Notes <span className="text-red-500">*</span>
//         </label>
//         <textarea
//           rows={3}
//           placeholder="Provide a detailed summary of the call conversation, patient's responses, and any important information discussed..."
//           className="w-full px-4 py-2 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none bg-[#F3F3F5] text-[#717182] text-lg placeholder:text-left text-left"
//         />

//         <p className="text-lg text-[#6A7282] mt-2">This will be visible to managers and other agents</p>
//       </div>

//       <div className="mb-8">
//         <label className="block text-lg font-bold text-gray-900 mb-2">
//           Private Notes (Optional)
//         </label>
//         <textarea
//           rows={3}
//           placeholder="Add any private notes or reminders for yourself......"
//           className="w-full px-4 py-2 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none bg-[#F3F3F5] text-[#717182] text-lg placeholder:text-left text-left"
//         />
//         <p className="text-lg text-[#6A7282] mt-2 border-b border-[#0000001A] pb-5">Only visible to you</p>
//       </div>

//       <div className="mb-8 p-6 rounded-2xl border border-gray-200 bg-white">
//         <h3 className="text-lg font-semibold text-gray-900 mb-6">Call Summary</h3>

//         <div className="space-y-4">
//           <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-2xl">
//             <span className="text-gray-600">Call Outcome</span>
//             <span className="px-3 py-1 bg-black text-white text-sm rounded-full">Answered</span>
//           </div>

//           <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-2xl">
//             <span className="text-gray-600">Duration</span>
//             <span className="text-gray-900">Not set</span>
//           </div>

//           <div className="flex items-center justify-between py-2 px-4 bg-green-50 rounded-2xl">
//             <span className="text-green-700 font-medium">Appointment Scheduled</span>
//             <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">2025-10-24 at 19:41</span>
//           </div>

//           <div className="flex items-center justify-between py-2 px-4 bg-blue-50 rounded-2xl">
//             <span className="text-blue-700 font-medium">Follow-up Scheduled</span>
//             <span className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full">2025-11-07</span>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// };

// export default NotesSummary;

import { useEffect, useState } from "react";

const NotesSummary = ({ formData, setFormData }: any) => {

  const [callNote, setCallNote] = useState('');
  const [privateNote, setPrivateNote] = useState('');

  // ------------------------
  // SYNC WITH MAIN FORM DATA
  // ------------------------

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      note: callNote,
      concern: privateNote,
    }));
  }, [callNote, privateNote]);

  // ------------------------
  // HELPERS FOR SUMMARY VIEW
  // ------------------------

  const formatOutcome = (val: string) => {
    if (!val) return 'Not set';
    return val.replace('_', ' ').toUpperCase();
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Step 5 of 5: Notes & Summary
      </h2>

      {/* CALL NOTES */}
      <div className="mb-6">
        <label className="block text-lg font-bold text-gray-900 mb-2">
          Call Notes <span className="text-red-500">*</span>
        </label>

        <textarea
          rows={3}
          value={callNote}
          onChange={(e) => setCallNote(e.target.value)}
          placeholder="Provide a detailed summary of the call conversation, patient's responses, and any important information discussed..."
          className="w-full px-4 py-2 rounded-3xl focus:outline-none focus:ring-2 
          focus:ring-blue-600 resize-none bg-[#F3F3F5] text-[#717182] text-lg placeholder:text-left text-left"
        />

        <p className="text-lg text-[#6A7282] mt-2">
          This will be visible to managers and other agents
        </p>
      </div>

      {/* PRIVATE NOTES */}
      <div className="mb-8">
        <label className="block text-lg font-bold text-gray-900 mb-2">
          Private Notes (Optional)
        </label>

        <textarea
          rows={3}
          value={privateNote}
          onChange={(e) => setPrivateNote(e.target.value)}
          placeholder="Add any private notes or reminders for yourself......"
          className="w-full px-4 py-2 rounded-3xl focus:outline-none focus:ring-2 
          focus:ring-blue-600 resize-none bg-[#F3F3F5] text-[#717182] text-lg placeholder:text-left text-left"
        />

        <p className="text-lg text-[#6A7282] mt-2 border-b border-[#0000001A] pb-5">
          Only visible to you
        </p>
      </div>

      {/* SUMMARY BOX */}
      <div className="mb-8 p-6 rounded-2xl border border-gray-200 bg-white">

        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Call Summary
        </h3>

        <div className="space-y-4">

          {/* Outcome */}
          <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-2xl">
            <span className="text-gray-600">Call Outcome</span>
            <span className="px-3 py-1 bg-black text-white text-sm rounded-full">
              {formatOutcome(formData?.outcome)}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-2xl">
            <span className="text-gray-600">Duration</span>
            <span className="text-gray-900">
              {formData?.call_duration || 'Not set'}
            </span>
          </div>

          {/* Appointment */}
          {formData?.appointment_booked && (
            <div className="flex items-center justify-between py-2 px-4 bg-green-50 rounded-2xl">
              <span className="text-green-700 font-medium">
                Appointment Scheduled
              </span>
              <span className="px-3 py-1 bg-green-500 text-white text-sm rounded-full">
                {formData?.appointment_date} at {formData?.appointment_time}
              </span>
            </div>
          )}

        </div>

      </div>
    </>
  );
};

export default NotesSummary;
