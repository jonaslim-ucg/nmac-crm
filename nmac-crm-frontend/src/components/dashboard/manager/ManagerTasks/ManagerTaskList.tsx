/* eslint-disable @typescript-eslint/no-explicit-any */

import ManagerTaskCard from "./ManagerTaskCard";

interface PatientTaskListProps {
  tasks?: any[]; // Optional tasks prop from API
}

const ManagerTaskList: React.FC<PatientTaskListProps> = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="w-full bg-gray-50 mt-5 p-4 text-center text-gray-500">
        No tasks available
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 mt-5">
      <div>
        <div className="space-y-4">
          {tasks.map((task:any) => (
            <ManagerTaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerTaskList;