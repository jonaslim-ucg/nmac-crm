// import { useState } from "react";
// import tikMark from "../../../../assets/tik-mart.png";
// import wrongTik from '../../../../assets/wrong-tik.png';

// const PatientResponse = ({ formData, setFormData }: any) => {
//   const [patientAnswered, setPatientAnswered] = useState<boolean | null>(null);
//   const [interestLevel, setInterestLevel] = useState<string>('very-interested');

//   return (
//     <>
//       <h2 className="text-xl font-bold text-[#0A0A0A] mb-6">Step 2 of 4: Patient Response</h2>

//       <div className="mb-8">
//         <h3 className="text-xl font-bold text-[#0A0A0A] mb-4">Did the patient answer?</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <button
//             onClick={() => setPatientAnswered(true)}
//             className={`flex items-center gap-3 pl-10 py-4 rounded-3xl border-2 transition-all text-left ${patientAnswered === true ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
//               }`}
//           >
//             <div className="flex flex-col items-start text-left">
//               <div className="w-10 h-10 shrink-0">
//                 <img src={tikMark} alt="tikmark" className="w-6 h-6" />
//               </div>
//               <p className="text-gray-800 font-medium">Yes, spoke with patient</p>
//             </div>


//           </button>
//           <button
//             onClick={() => setPatientAnswered(false)}
//             className={`flex items-center gap-3 pl-10 py-5 rounded-3xl border-2 transition-all text-left ${patientAnswered === false ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
//               }`}
//           >
//             <div className="flex flex-col items-start text-left">
//               <div className="w-10 h-10 shrink-0">
//                 <img src={wrongTik} alt="tikmark" className="w-6 h-6" />
//               </div>
//               <p className="text-gray-800 font-medium">No, didn't speak</p>
//             </div>
//           </button>
//         </div>
//       </div>

//       {patientAnswered === true && (
//         <>
//           <div className="mb-8">
//             <h3 className="text-xl font-bold text-gray-900 mb-4">Patient Interest Level</h3>
//             <div className="space-y-3">
//               <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer">
//                 <input
//                   type="radio"
//                   name="interest"
//                   value="very-interested"
//                   checked={interestLevel === 'very-interested'}
//                   onChange={(e) => setInterestLevel(e.target.value)}
//                   className="w-4 h-4 text-blue-600 mt-0.5"
//                 />
//                 <div className="flex-1">
//                   <p className="font-semibold text-green-600">Very Interested</p>
//                   <p className="text-sm text-gray-500">Ready to book appointment</p>
//                 </div>
//               </label>

//               <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer">
//                 <input
//                   type="radio"
//                   name="interest"
//                   value="interested"
//                   checked={interestLevel === 'interested'}
//                   onChange={(e) => setInterestLevel(e.target.value)}
//                   className="w-4 h-4 text-blue-600 mt-0.5"
//                 />
//                 <div className="flex-1">
//                   <p className="font-semibold text-blue-600">Interested</p>
//                   <p className="text-sm text-gray-500">Needs to check schedule</p>
//                 </div>
//               </label>

//               <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer">
//                 <input
//                   type="radio"
//                   name="interest"
//                   value="neutral"
//                   checked={interestLevel === 'neutral'}
//                   onChange={(e) => setInterestLevel(e.target.value)}
//                   className="w-4 h-4 text-blue-600 mt-0.5"
//                 />
//                 <div className="flex-1">
//                   <p className="font-semibold text-gray-600">Neutral</p>
//                   <p className="text-sm text-gray-500">Will think about it</p>
//                 </div>
//               </label>

//               <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer">
//                 <input
//                   type="radio"
//                   name="interest"
//                   value="not-interested"
//                   checked={interestLevel === 'not-interested'}
//                   onChange={(e) => setInterestLevel(e.target.value)}
//                   className="w-4 h-4 text-blue-600 mt-0.5"
//                 />
//                 <div className="flex-1">
//                   <p className="font-semibold text-red-600">Not Interested</p>
//                   <p className="text-sm text-gray-500">Declined appointment</p>
//                 </div>
//               </label>
//             </div>
//           </div>

//           <div className="mb-8">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Concerns or Questions</h3>
//             <textarea
//               rows={3}
//               placeholder="Document any concerns, questions, or special requests the patient mentioned..."
//               className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none bg-[#F3F3F5] rounded-4xl text-left placeholder:text-left"
//             />
//           </div>

//         </>
//       )}
//     </>
//   )
// };


// export default PatientResponse;

import { useEffect, useState } from "react";
import tikMark from "../../../../assets/tik-mart.png";
import wrongTik from '../../../../assets/wrong-tik.png';

const PatientResponse = ({ setFormData }: any) => {

  const [patientAnswered, setPatientAnswered] = useState<boolean | null>(null);
  const [interestLevel, setInterestLevel] = useState<string>('VERY_INTERESTED');
  const [concern, setConcern] = useState('');

  // -------------------------
  // MAP UI → API VALUES
  // -------------------------

  const mapInterestLevel = (value: string) => {
    switch (value) {
      case 'VERY_INTERESTED':
        return 'VERY_INTERESTED';
      case 'INTERESTED':
        return 'INTERESTED';
      case 'NEUTRAL':
        return 'NEUTRAL';
      case 'NOT_INTERESTED':
        return 'NOT_INTERESTED';
      default:
        return null;
    }
  };

  // -------------------------
  // SYNC TO MAIN FORM STATE
  // -------------------------

useEffect(() => {
  setFormData((prev: any) => ({
    ...prev,
    patient_response: patientAnswered,
    interest_level: patientAnswered ? mapInterestLevel(interestLevel) : null,
    concern: patientAnswered ? concern : null,
  }));
}, [patientAnswered, interestLevel, concern]);

   
  return (
    <>
      <h2 className="text-xl font-bold text-[#0A0A0A] mb-6">
        Step 2 of 4: Patient Response
      </h2>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#0A0A0A] mb-4">
          Did the patient answer?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <button
            onClick={() => setPatientAnswered(true)}
            className={`flex items-center gap-3 pl-10 py-4 rounded-3xl border-2 transition-all text-left ${
              patientAnswered === true
                ? 'border-green-600 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <div className="w-10 h-10 shrink-0">
                <img src={tikMark} alt="tikmark" className="w-6 h-6" />
              </div>
              <p className="text-gray-800 font-medium">
                Yes, spoke with patient
              </p>
            </div>
          </button>

          <button
            onClick={() => setPatientAnswered(false)}
            className={`flex items-center gap-3 pl-10 py-5 rounded-3xl border-2 transition-all text-left ${
              patientAnswered === false
                ? 'border-red-600 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <div className="w-10 h-10 shrink-0">
                <img src={wrongTik} alt="tikmark" className="w-6 h-6" />
              </div>
              <p className="text-gray-800 font-medium">
                No, didn't speak
              </p>
            </div>
          </button>

        </div>
      </div>

      {patientAnswered === true && (
        <>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Patient Interest Level
            </h3>

            <div className="space-y-3">

              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer">
                <input
                  type="radio"
                  name="interest"
                  value="VERY_INTERESTED"
                  checked={interestLevel === 'VERY_INTERESTED'}
                  onChange={(e) => setInterestLevel(e.target.value)}
                  className="w-4 h-4 text-blue-600 mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-semibold text-green-600">
                    Very Interested
                  </p>
                  <p className="text-sm text-gray-500">
                    Ready to book appointment
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer">
                <input
                  type="radio"
                  name="interest"
                  value="INTERESTED"
                  checked={interestLevel === 'INTERESTED'}
                  onChange={(e) => setInterestLevel(e.target.value)}
                  className="w-4 h-4 text-blue-600 mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-semibold text-blue-600">
                    Interested
                  </p>
                  <p className="text-sm text-gray-500">
                    Needs to check schedule
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer">
                <input
                  type="radio"
                  name="interest"
                  value="NEUTRAL"
                  checked={interestLevel === 'NEUTRAL'}
                  onChange={(e) => setInterestLevel(e.target.value)}
                  className="w-4 h-4 text-blue-600 mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-600">
                    Neutral
                  </p>
                  <p className="text-sm text-gray-500">
                    Will think about it
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer">
                <input
                  type="radio"
                  name="interest"
                  value="NOT_INTERESTED"
                  checked={interestLevel === 'NOT_INTERESTED'}
                  onChange={(e) => setInterestLevel(e.target.value)}
                  className="w-4 h-4 text-blue-600 mt-0.5"
                />
                <div className="flex-1">
                  <p className="font-semibold text-red-600">
                    Not Interested
                  </p>
                  <p className="text-sm text-gray-500">
                    Declined appointment
                  </p>
                </div>
              </label>

            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Patient Concerns or Questions
            </h3>

            <textarea
              rows={3}
              value={concern}
              onChange={(e) => setConcern(e.target.value)}
              placeholder="Document any concerns, questions, or special requests the patient mentioned..."
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none bg-[#F3F3F5] rounded-4xl placeholder:text-left"
            />
          </div>
        </>
      )}
    </>
  );
};

export default PatientResponse;
