/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, ChevronDown, X } from 'lucide-react';
import React, { useState } from 'react';
import Templates from '../../../../components/dashboard/admin/ManageTemplate/Templates';
import TemplateSummaryCard from '../../../../components/dashboard/admin/ManageTemplate/TemplateSummaryCard';
import { useAddMessageTemplateMutation, useGetAllMessageTemplatesQuery } from '../../../../redux/services/dashboard/manager/message.api';
import Spinner from '../../../../components/Spinner';
import { toast } from 'react-toastify';

interface CreateTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (template: any) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'whatsapp',
        category: 'Annual Physical',
        status: 'active',
        messageContent: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCreate = () => {
  // Validate
  if (!formData.name.trim() || !formData.messageContent.trim()) {
    toast.error('Please fill all required fields');
    return;
  }

  const newTemplate = {
    name: formData.name,
    type: formData.type,
    category: formData.category,
    status: formData.status,
    messageContent: formData.messageContent
  };

  onCreate(newTemplate); // Parent handles API
  onClose();

  setFormData({
    name: '',
    type: 'whatsapp',
    category: 'Annual Physical',
    status: 'active',
    messageContent: ''
  });
};


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative px-8 pt-8">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        Create New Template
                    </h2>
                    <p className="text-md text-gray-500">
                        Create a new communication template for patient outreach
                    </p>
                </div>

                {/* Form Content */}
                <div className="px-8 py-6 space-y-6">
                    {/* Template Name and Communication Type Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-md font-bold text-gray-700 mb-2">
                                Template Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-4 py-2 text-sm rounded-full bg-[#F3F3F5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#717182]"
                                placeholder="e.g. Annual Physical Follow-up"
                            />
                        </div>
                        <div>
                            <label className="block text-md font-bold text-gray-700 mb-2">
                                Communication Type *
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.type}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                    className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-gray-300 rounded-full bg-[#F3F3F5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-[#717182]"
                                >
                                    <option value="whatsapp">WhatsApp Only</option>
                                    <option value="email">Email Only</option>
                                    <option value="both">Both Channels</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Category and Status Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-md font-bold text-gray-700 mb-2">
                                Category *
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-gray-300 rounded-full bg-[#F3F3F5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-[#717182]"
                                >
                                    <option value="Annual Physical">Annual Physical</option>
                                    <option value="Colon Hydrotherapy">Colon Hydrotherapy</option>
                                    <option value="Spa">Spa Services</option>
                                    <option value="Follow Up">Follow Up</option>
                                    <option value="Appointment">Appointment</option>
                                    <option value="Results">Test Results</option>
                                    <option value="Reminder">Reminder</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Status *
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-gray-300 rounded-full bg-[#F3F3F5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer text-[#717182]"
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Message Content */}
                    <div>
                        <label className="block text-md font-bold text-gray-700 mb-2">
                            Message Content *
                        </label>
                        <div className="">
                            <textarea
                                value={formData.messageContent}
                                onChange={(e) => handleInputChange('messageContent', e.target.value)}
                                rows={8}
                                className="w-full px-4 py-3 text-sm bg-[#F3F3F5] border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[#717182]"
                                placeholder="Enter your message template here..."
                            />
                            <div className="mt-3">
                                <p className="text-sm text-gray-500 mb-2">
                                    Available placeholders: [Patient Name], [Agent Name], [Visit Type], [Date], [Time], [Months Since Last Visit]
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 border-t border-gray-200">
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-[#030213] rounded-full hover:bg-gray-500 transition-colors"
                        >
                            Create Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManageTemplate: React.FC = () => {
    const [addMessageTemplate,{isLoading}] = useAddMessageTemplateMutation();
    const { data:messageTemplateData, isLoading: isTemplateLoading} = useGetAllMessageTemplatesQuery();
    console.log(messageTemplateData)
    const templatesData = messageTemplateData?.data ?? [];
    const totalTemplates = messageTemplateData?.total_count ?? 0;

    // WhatsApp count
    const whatsappCount =
    messageTemplateData?.counts?.find(
        (item: any) => item.communication_type === 'whatsapp'
    )?.total ?? 0;

    // Email count
    const emailCount =
    messageTemplateData?.counts?.find(
        (item: any) => item.communication_type === 'email'
    )?.total ?? 0;

    // Active templates
    const activeCount =
    messageTemplateData?.status_counts?.find(
        (item: any) => item.status === 'active'
    )?.total ?? 0;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const cards = [
        {
            title: 'Total Templates',
            value: totalTemplates,
            subtitle: `${activeCount} active`,
            bgColor: 'bg-[#E4F4FF]',
        },
        {
            title: 'WhatsApp Templates',
            value: whatsappCount,
            subtitle: 'Quick messaging',
            bgColor: 'bg-[#E8F5E9]',
        },
        {
            title: 'Email Templates',
            value: emailCount,
            subtitle: 'Formal communication',
            bgColor: 'bg-[#F3E9FF]',
        },
        {
            title: 'Active Templates',
            value: activeCount,
            subtitle: 'Currently usable',
            bgColor: 'bg-[#FDE3D9]',
        },
    ];


    const handleCreateTemplate = async (newTemplate: any) => {
  try {
    await addMessageTemplate({
      name: newTemplate.name,
      communication_type: newTemplate.type,
      category: newTemplate.category,
      status: newTemplate.status,
      content: newTemplate.messageContent,
      subject: "FollowUp Patient", // optional, you can make dynamic
    }).unwrap(); // unwrap ensures errors are thrown
    // Close modal and reset form is handled in modal
    alert('Template created successfully!');
  } catch (error) {
    console.error(error);
    alert('Failed to create template');
  }
};

    if(isTemplateLoading) return <Spinner />

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6 flex justify-between">
              <div>
                  <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                   Template Management
                </h1>
                <p className="text-base text-[#6A7282] font-normal">
                   Create and manage WhatsApp and Email communication templates
                </p>
              </div>
              <div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className='bg-[#526FFF] text-white text-lg pl-6 pr-8 py-2.5 rounded-full flex gap-x-4 hover:bg-blue-700 transition-colors'
                >
                    <span><Plus className='w-7 h-7' /></span>
                    {isLoading ? "Creating Template..." : "Create Template"}
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-9">
                {cards.map((card, index) => (
                    <TemplateSummaryCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        subtitle={card.subtitle}
                        bgColor={card.bgColor}
                    />
                ))}
            </div>

            {/* Templates Table */}
            <Templates templateData={templatesData}/>

            {/* Create Template Modal */}
            <CreateTemplateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateTemplate}
            />
        </div>
    );
};

export default ManageTemplate;