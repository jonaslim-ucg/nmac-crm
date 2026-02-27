import React from 'react';
import messageIcon from '../../../../assets/message.png';
import waveIcon from '../../../../assets/wave.png'
import waveIcon2 from '../../../../assets/wave2.png'
import ManagerMessageCard from '../../../../components/dashboard/manager/ManagerMessage/ManagerMessageCard';
import ManagerMessageHistory from '../../../../components/dashboard/manager/ManagerMessage/ManagerMessageHistory';
import Spinner from '../../../../components/Spinner';
import { useGetAllMessagesQuery } from '../../../../redux/services/dashboard/manager/message.api';
import { useGetAllPatientQuery } from '../../../../redux/services/dashboard/admin/admin.patient';

const ManagerMessage: React.FC = () => {
    const { data, isLoading} = useGetAllMessagesQuery({ limit: 50, offset: 0 });
      const { data: patientsData, isLoading: isPatientsLoading } = useGetAllPatientQuery();
    
      console.log(patientsData)
    
      const patientMessages =  data?.data;
    
      console.log(patientMessages);
    //   const mappedMessages = patientMessages?.map((msg: any) => ({
    //   id: msg.id,
    //   name: msg.patient_id,
    //   phone: 'N/A', 
    //   message: msg.message,
    //   timestamp: new Date(msg.created_at).toLocaleString(),
    //   status: 'Delivered', 
    //   communication_type: msg.communication_type,
    // }));
    
    // patientMessages is your array of messages
    // patientsData is your array of patient objects
    
    const updatedMessages = patientMessages?.map((msg: any) => {
      // Find the patient by matching patient_id
      const patient = patientsData?.results?.find((p: any) => p.id === msg.patient_id);
    
      return {
        ...msg,
        name: patient?.name || msg.patient_id, // replace ID with patient name if found
        phone: patient?.phone || 'N/A',       // populate phone
        preferred_channel: patient?.preferred_channel || 'unknown', // optional
        timestamp: new Date(msg.created_at).toLocaleString(), // format timestamp
        status: 'Delivered',                    // optional, if you want a default
      };
    });
    
    
    console.log(updatedMessages);
    
    
        const cards = [
            {
                title: 'My Messages Sent',
                value: '3',
                subtitle: '',
                icon: <img src={messageIcon} alt="message-icon" className='w-6 h-6' />,
                bgColor: 'bg-[#E4F4FF]',
                iconColor: 'text-blue-500',
            },
            {
                title: 'My Read Rate',
                value: '78%',
                subtitle: '',
                icon: <img src={waveIcon} alt="wave-icon" className='w-6 h-6' />,
                bgColor: 'bg-[#E8F5E9]',
                iconColor: 'text-orange-500',
            },
            {
                title: 'My Conversion Rate',
                value: '60%',
                subtitle: '',
                icon: <img src={waveIcon2} alt="wave-icon" className='w-6 h-6' />,
                bgColor: 'bg-[#F3E9FF]',
                iconColor: 'text-green-500',
            },
        ];
    
        if(isLoading || isPatientsLoading) return <Spinner />
    // const cards = [
    //     {
    //         title: 'My Messages Sent',
    //         value: '3',
    //         subtitle: '',
    //         icon: <img src={messageIcon} alt="message-icon" className='w-6 h-6' />,
    //         bgColor: 'bg-[#E4F4FF]',
    //         iconColor: 'text-blue-500',
    //     },
    //     {
    //         title: 'My Read Rate',
    //         value: '78%',
    //         subtitle: '',
    //         icon: <img src={waveIcon} alt="wave-icon" className='w-6 h-6' />,
    //         bgColor: 'bg-[#E8F5E9]',
    //         iconColor: 'text-orange-500',
    //     },
    //     {
    //         title: 'My Conversion Rate',
    //         value: '60%',
    //         subtitle: '',
    //         icon: <img src={waveIcon2} alt="wave-icon" className='w-6 h-6' />,
    //         bgColor: 'bg-[#F3E9FF]',
    //         iconColor: 'text-green-500',
    //     },
    // ];

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                    My Messages
                </h1>
                <p className="text-base text-[#6A7282] font-normal">
                    Manage your patient communications via WhatsApp and Email
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card, index) => (
                    <ManagerMessageCard
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

            {/* message history */}
            <ManagerMessageHistory messages={updatedMessages}/>

        </div>
    );
};

export default ManagerMessage;