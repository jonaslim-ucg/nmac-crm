// import React from 'react';
// import { CircleCheckBig, CircleAlert, Clock,} from 'lucide-react';
// import TaskCard from '../../../../../components/dashboard/agent/Tasks/MyTasks/TaskCard';
// import PatientSearchBar from '../../../../../components/dashboard/agent/Tasks/MyTasks/PatientSearchBar';
// import PatientTaskList from '../../../../../components/dashboard/agent/Tasks/MyTasks/PatientTaskList';
// import { useGetTasksQuery } from '../../../../../redux/services/dashboard/manager/task.api';

// const MyTasks: React.FC = () => {
//     const {data:taskData, isLoading} = useGetTasksQuery();
//     console.log(taskData)
//   const cards = [
//     {
//       title: 'Pending Tasks',
//       value: '3',
//       subtitle: '',
//       icon: <Clock className="w-6 h-6 text-[#155DFC]" />,
//       bgColor: 'bg-[#E4F4FF]',
//       iconColor: 'text-blue-500',
//     },
//     {
//       title: 'Completed Today',
//       value: '1',
//       subtitle: 'Calls, WhatsApp, Emails',
//       icon: <CircleCheckBig className="w-6 h-6 text-[#9810FA]" />,
//       bgColor: 'bg-[#FDE3D9]',
//       iconColor: 'text-orange-500',
//     },
//     {
//       title: 'High Priority',
//       value: '2',
//       subtitle: '',
//       icon: <CircleAlert className="w-6 h-6 text-[#F54900]" />,
//       bgColor: 'bg-[#E8F5E9]',
//       iconColor: 'text-green-500',
//     },
//   ];

//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-3xl font-semibold text-gray-900 mb-2">
//           My Tasks & Follow-ups
//         </h1>
//         <p className="text-base text-[#6A7282] font-normal">
//           Manage your patient callbacks and follow-up tasks
//         </p>
//       </div>

//       {/* Cards Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {cards.map((card, index) => (
//           <TaskCard
//             key={index}
//             title={card.title}
//             value={card.value}
//             subtitle={card.subtitle}
//             icon={card.icon}
//             bgColor={card.bgColor}
//             iconColor={card.iconColor}
//           />
//         ))}
//       </div>

//         {/* patient search bar  */}
//         <PatientSearchBar/>

//       {/* Patient Task List */}
//       <PatientTaskList/>
//     </div>
//   );
// };

// export default MyTasks;

import React from 'react';
import { CircleCheckBig, CircleAlert, Clock } from 'lucide-react';
import TaskCard from '../../../../../components/dashboard/agent/Tasks/MyTasks/TaskCard';
import PatientSearchBar from '../../../../../components/dashboard/agent/Tasks/MyTasks/PatientSearchBar';
import PatientTaskList from '../../../../../components/dashboard/agent/Tasks/MyTasks/PatientTaskList';
import { useGetTasksQuery } from '../../../../../redux/services/dashboard/manager/task.api';
import Spinner from '../../../../../components/Spinner';

const MyTasks: React.FC = () => {
    const { data: taskData, isLoading } = useGetTasksQuery();

    if (isLoading) return <Spinner />;

    // Extract dynamic counts from API data
    const pendingTasks = taskData?.task_count_on_status.find(
        (t: any) => t.status === 'PENDING'
    )?.status__count || 0;

    const highPriorityTasks = taskData?.count_on_priority.find(
        (t: any) => t.priority === 'HIGH'
    )?.priority__count || 0;

    const completedTodayTasks = taskData?.tasks.filter((task: any) => {
        const taskDate = new Date(task.due_date);
        const today = new Date();
        return (
            task.status === 'COMPLETED' &&
            taskDate.toDateString() === today.toDateString()
        );
    }).length || 0;

    const cards = [
        {
            title: 'Pending Tasks',
            value: pendingTasks,
            subtitle: '',
            icon: <Clock className="w-6 h-6 text-[#155DFC]" />,
            bgColor: 'bg-[#E4F4FF]',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Completed Today',
            value: completedTodayTasks,
            subtitle: 'Calls, WhatsApp, Emails',
            icon: <CircleCheckBig className="w-6 h-6 text-[#9810FA]" />,
            bgColor: 'bg-[#FDE3D9]',
            iconColor: 'text-orange-500',
        },
        {
            title: 'High Priority',
            value: highPriorityTasks,
            subtitle: '',
            icon: <CircleAlert className="w-6 h-6 text-[#F54900]" />,
            bgColor: 'bg-[#E8F5E9]',
            iconColor: 'text-green-500',
        },
    ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    My Tasks & Follow-ups
                </h1>
                <p className="text-base text-[#6A7282] font-normal">
                    Manage your patient callbacks and follow-up tasks
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {cards.map((card, index) => (
                    <TaskCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        subtitle={card.subtitle}
                        icon={card.icon}
                        bgColor={card.bgColor}
                        iconColor={card.iconColor}
                    />
                ))}
            </div>

            {/* Patient Search Bar */}
            <PatientSearchBar />

            {/* Patient Task List */}
            <PatientTaskList tasks={taskData?.tasks} />
        </div>
    );
};

export default MyTasks;
