// import { CircleAlert, CircleCheckBig, CircleX, MessageSquare} from "lucide-react";
// import { useState } from "react";
// type CallOutcome = 'answered' | 'voicemail' | 'no-answer' | 'wrong-number' | null;

// const CallDetails = () => {
//   const [selectedOutcome, setSelectedOutcome] = useState<CallOutcome>('answered');
//   const [callDuration, setCallDuration] = useState('');
//   const [contactMethod, setContactMethod] = useState('Phone Call');
//   const callOutcomes = [
//     {
//       id: 'answered' as CallOutcome,
//       icon: CircleCheckBig,
//       title: 'Patient Answered',
//       subtitle: 'Had conversation with patient',
//       color: 'text-green-600',
//       bgColor: 'bg-green-50',
//     },
//     {
//       id: 'voicemail' as CallOutcome,
//       icon: MessageSquare,
//       title: 'Left Voicemail',
//       subtitle: "Patient didn't answer, left message",
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50',
//     },
//     {
//       id: 'no-answer' as CallOutcome,
//       icon: CircleX,
//       title: 'No Answer',
//       subtitle: 'No voicemail option available',
//       color: 'text-red-600',
//       bgColor: 'bg-red-50',
//     },
//     {
//       id: 'wrong-number' as CallOutcome,
//       icon: CircleAlert,
//       title: 'Wrong Number',
//       subtitle: 'Number not in service or incorrect',
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-50',
//     },
//   ];

//   return (
//     <>
//       <h2 className="text-xl font-bold text-gray-900 mb-8">Step 1 of 4: Call Details</h2>

//       <div className="mb-8 border-b border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Outcome</h3>
//         <div className="space-y-3 mb-6">
//           {callOutcomes.map((outcome) => {
//             const Icon = outcome.icon;
//             const isSelected = selectedOutcome === outcome.id;
//             return (
//               <button
//                 key={outcome.id}
//                 onClick={() => setSelectedOutcome(outcome.id)}
//                 className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${isSelected
//                     ? 'border-blue-600 bg-blue-50'
//                     : 'border-gray-200 bg-white hover:border-gray-300'
//                   }`}
//               >
//                 <div
//                   className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? outcome.bgColor : 'bg-gray-100'
//                     }`}
//                 >
//                   <Icon className={`w-4 h-4 ${isSelected ? outcome.color : 'text-gray-400'}`} />
//                 </div>
//                 <div className="flex-1 text-left">
//                   <p className="font-semibold text-gray-900">{outcome.title}</p>
//                   <p className="text-sm text-[#6A7282]">{outcome.subtitle}</p>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div>
//           <label className="block text-lg font-semibold text-gray-900 mb-2">
//             Call Duration <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             placeholder="e.g., 5 minutes"
//             value={callDuration}
//             onChange={(e) => setCallDuration(e.target.value)}
//             className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-[#F3F3F5]"
//           />
//         </div>
//         <div>
//           <label className="block text-lg font-semibold text-gray-900 mb-2">
//             Contact Method
//           </label>
//           <select
//             value={contactMethod}
//             onChange={(e) => setContactMethod(e.target.value)}
//             className="w-full px-4 py-2 rounded-full  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent appearance-none bg-[#F3F3F5]"
//           >
//             <option>Phone Call</option>
//             <option>Video Call</option>
//             <option>In Person</option>
//           </select>
//         </div>
//       </div>
//     </>
//   )

// };
// export default CallDetails;


import { CircleAlert, CircleCheckBig, CircleX, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type CallOutcome = 'PATIENT_ANSWERED' | 'LEFT_VOICEMAIL' | 'NO_ANSWER' | 'WRONG_NUMBER' | null;

type Props = {
  formData:any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};


const CallDetails: React.FC<Props> = ({ setFormData }) => {
  const { patientId } = useParams<{ patientId: string }>();
  const [selectedOutcome, setSelectedOutcome] = useState<CallOutcome>('PATIENT_ANSWERED');
  const [callDuration, setCallDuration] = useState('');
  const [contactMethod, setContactMethod] = useState('PHONE');
  const [error, setError] = useState('');
  const isValidDuration = (value: string) => {
  // Matches 0-99 hours and 0-59 minutes
  const regex = /^([0-9]{1,2}):([0-5][0-9])$/;
  return regex.test(value);
};


  // ---------------------------
  // MAP UI → API VALUES
  // ---------------------------

  const mapOutcomeToApi = (value: CallOutcome) => {
    switch (value) {
      case 'PATIENT_ANSWERED':
        return 'PATIENT_ANSWERED';
      case 'LEFT_VOICEMAIL':
        return 'LEFT_VOICEMAIL';
      case 'NO_ANSWER':
        return 'NO_ANSWER';
      case 'WRONG_NUMBER':
        return 'WRONG_NUMBER';
      default:
        return '';
    }
  };

  const mapContactMethod = (value: string) => {
    switch (value) {
      case 'PHONE':
        return 'PHONE';
      case 'WHATSAPP':
        return 'WHATSAPP';
      case 'EMAIL':
        return 'EMAIL';
      default:
        return 'PHONE';
    }
  };

  useEffect(() => {

  setFormData((prev: any) => ({
    ...prev,
    patient_id: patientId,
    outcome: mapOutcomeToApi(selectedOutcome),
    call_duration: callDuration, // <--- formatted
    contact_method: mapContactMethod(contactMethod),
  }));
}, [selectedOutcome, callDuration, contactMethod]);



  const callOutcomes = [
    {
      id: 'PATIENT_ANSWERED' as CallOutcome,
      icon: CircleCheckBig,
      title: 'Patient Answered',
      subtitle: 'Had conversation with patient',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'LEFT_VOICEMAIL' as CallOutcome,
      icon: MessageSquare,
      title: 'Left Voicemail',
      subtitle: "Patient didn't answer, left message",
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'NO_ANSWER' as CallOutcome,
      icon: CircleX,
      title: 'No Answer',
      subtitle: 'No voicemail option available',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      id: 'WRONG_NUMBER' as CallOutcome,
      icon: CircleAlert,
      title: 'Wrong Number',
      subtitle: 'Number not in service or incorrect',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-8">
        Step 1 of 4: Call Details
      </h2>

      <div className="mb-8 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Call Outcome
        </h3>

        <div className="space-y-3 mb-6">
          {callOutcomes.map((outcome) => {
            const Icon = outcome.icon;
            const isSelected = selectedOutcome === outcome.id;

            return (
              <button
                key={outcome.id}
                onClick={() => setSelectedOutcome(outcome.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isSelected ? outcome.bgColor : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? outcome.color : 'text-gray-400'
                    }`}
                  />
                </div>

                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900">
                    {outcome.title}
                  </p>
                  <p className="text-sm text-[#6A7282]">
                    {outcome.subtitle}
                  </p>
                </div>

              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* <div>
          <label className="block text-lg font-semibold text-gray-900 mb-2">
            Call Duration <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            placeholder="e.g., 05:00"
            value={callDuration}
            onChange={(e) => setCallDuration(e.target.value)}
            className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#F3F3F5]"
          />
        </div> */}
        <div>
  <label className="block text-lg font-semibold text-gray-900 mb-2">
    Call Duration <span className="text-red-500">*</span>
  </label>

  <input
    type="text"
    placeholder="e.g., 05:00"
    value={callDuration}
    onChange={(e) => {
      const value = e.target.value;
      setCallDuration(value);
      
      if (value && !isValidDuration(value)) {
        setError("Invalid format. Use HH:MM");
      } else {
        setError("");
      }
    }}
    className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#F3F3F5]"
  />
  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
</div>


        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-2">
            Contact Method
          </label>

          <select
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
            className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none bg-[#F3F3F5]"
          >
            <option value="PHONE">Phone</option>
            <option value="WHATSAPP">Whatsapp</option>
            <option value="EMAIL">Email</option>
          </select>
        </div>

      </div>
    </>
  );
};

export default CallDetails;
