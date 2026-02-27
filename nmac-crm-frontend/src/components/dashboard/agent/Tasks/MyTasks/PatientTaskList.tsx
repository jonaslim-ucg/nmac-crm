// /* eslint-disable @typescript-eslint/no-explicit-any */
// import PatientTaskCard from "./PatientTaskCard";

// const patientTasks = [
//   {
//     id: '1',
//     name: 'Sarah Johnson',
//     priority: 'high',
//     status: 'pending',
//     patientId: 'P12345',
//     phone: '(555) 123-4567',
//     dueDate: '10/24/2024',
//     task: 'Follow-up Call',
//     description: 'Patient requested callback after 2 PM'
//   },
//   {
//     id: '2',
//     name: 'Michael Chen',
//     priority: 'medium',
//     status: 'pending',
//     patientId: 'P12346',
//     phone: '(555) 234-5678',
//     dueDate: '10/24/2024',
//     task: 'Send WhatsApp',
//     description: 'Send appointment reminder'
//   },
//   {
//     id: '3',
//     name: 'Robert Wilson',
//     priority: 'high',
//     status: 'completed',
//     patientId: 'P12348',
//     phone: '(555) 456-7890',
//     dueDate: '10/23/2024',
//     task: 'Follow-up Call',
//     description: 'Patient booked appointment for next week'
//   },
//   {
//     id: '4',
//     name: 'Jennifer Martinez',
//     priority: 'high',
//     status: 'pending',
//     patientId: 'P12349',
//     phone: '(555) 567-8901',
//     dueDate: '10/24/2024',
//     task: 'Callback Request',
//     description: 'Patient wants to discuss insurance coverage'
//   }
// ];


// const PatientTaskList: React.FC = () => {
//   return (
//     <div className="w-full bg-gray-50 mt-5">
//       <div>
//         <div className="space-y-4">
//           {patientTasks.map((task:any) => (
//             <PatientTaskCard key={task.id} task={task} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientTaskList;

/* eslint-disable @typescript-eslint/no-explicit-any */
import PatientTaskCard from "./PatientTaskCard";

interface PatientTaskListProps {
  tasks?: any[]; // Optional tasks prop from API
}

const PatientTaskList: React.FC<PatientTaskListProps> = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="w-full bg-gray-50 mt-5 p-4 text-center text-gray-500">
        No tasks available
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 mt-5 p-4 rounded-lg shadow-sm">
      <div className="space-y-4">
        {tasks.map((task: any) => (
          <PatientTaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default PatientTaskList;
