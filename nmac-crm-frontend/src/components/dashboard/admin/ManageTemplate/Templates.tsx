import { ChevronDown, Download, Eye, Pencil, Trash2, X } from 'lucide-react';
import React, { useState } from 'react';
import { useDeleteMessageTemplateMutation, useUpdateMessageTemplateMutation } from '../../../../redux/services/dashboard/manager/message.api';
import Swal from 'sweetalert2';


interface Template {
    id:number;
    name: string;
    type: 'whatsapp' | 'email' | 'both';
    category: string;
    status: 'active' | 'draft';
    usage: number;
    successRate: number;
    message:string;
    subject:string;
    lastModified: string;
}

interface TemplatePreviewModalProps {
    template: Template;
    onClose: () => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({ template, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[540px] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative px-8 pt-8 ">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                        Template Preview: {template.name}
                    </h2>
                    <p className="text-md text-gray-500">
                        Preview how this template will appear to patients
                    </p>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                    {/* Type and Category Row */}
                    <div className="grid grid-cols-2 gap-8 mb-6">
                        <div>
                            <div className="text-md font-medium text-gray-500 mb-2">Type</div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-md font-medium ${template.type === 'whatsapp' ? 'bg-green-100 text-green-800 rounded-full' :
                                    template.type === 'email' ? 'bg-blue-100 text-blue-800 rounded-full' :
                                        'bg-purple-100 text-purple-800 rounded-full'
                                }`}>
                                {template.type}
                            </span>
                        </div>
                        <div>
                            <div className="text-md font-medium text-gray-500 mb-2">Category</div>
                            <div className="text-md text-gray-900">{template.category}</div>
                        </div>
                    </div>

                    {/* Usage Count and Success Rate Row */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <div className="text-md font-medium text-gray-500 mb-2">Usage Count</div>
                            <div className="text-md text-gray-900">{template.usage} times</div>
                        </div>
                        {/* <div>
                            <div className="text-md font-medium text-gray-500 mb-2">Success Rate</div>
                            <div className="text-md text-gray-900">{template.successRate}%</div>
                        </div> */}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 mb-6"></div>

                    {/* Subject */}
                    <div className="mb-6">
                        <div className="text-md font-semibold text-gray-900 mb-3">Subject</div>
                        <div className="bg-gray-50 rounded-full px-4 py-3">
                            <div className="text-md text-gray-900">{template.subject}</div>
                        </div>
                    </div>

                    {/* Message Content */}
                    <div className="mb-6">
                        <div className="text-md font-semibold text-gray-900 mb-3">Message Content</div>
                        <div className="bg-gray-50 rounded-2xl px-4 py-4">
                            <div className="text-sm text-gray-900 space-y-3">
                                {template.message}
                                {/* <p>Hi [Patient Name],</p>
                                <p>
                                    It's time for your annual physical examination at Northshore Medical.
                                    Dr. Kyjuan Brown would like to see you.
                                </p>
                                <p>Please call us at (555) 123-4567 to schedule your appointment.</p>
                                <div className="pt-1">
                                    <p>Best regards,</p>
                                    <p>[Agent Name]</p>
                                    <p>Northshore Medical</p>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    {/* Add Image Button */}
                    {/* <div className="flex justify-end">
                        <button className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors">
                            Add Image
                        </button>
                    </div> */}
                </div>

                {/* Footer */}
              <div className='p-6'>
                  <div className="px-3 py-1 bg-blue-50 rounded-full flex items-center justify-between">
                    <div className="text-md text-gray-600">
                        Created by Dr. Kyjuan Brown on {template.lastModified}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-white text-md font-medium text-gray-700 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
              </div>
            </div>
        </div>
    );
};

interface EditTemplateModalProps {
    template: Template;
    onClose: () => void;
    onSave: (updatedTemplate: Template) => void;
}

const EditTemplateModal: React.FC<EditTemplateModalProps> = ({ template, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: template.name,
        type: template.type,
        category: template.category,
        status: template.status,
        messageContent:template.message ||
        `Hi [Patient Name],

It's time for your annual physical examination at Northshore Medical. Dr. Kyjuan Brown would like to see you.

Please call us at (555) 123-4567 to schedule your appointment.

Best regards,
[Agent Name]
Northshore Medical`
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
    const updatedTemplate: Template = {
        ...template,
        name: formData.name,
        type: formData.type as 'whatsapp' | 'email' | 'both',
        category: formData.category,
        status: formData.status as 'active' | 'draft',
        message: formData.messageContent,
        lastModified: new Date().toISOString().split('T')[0],
    };

    try {
        await onSave(updatedTemplate); // onSave now returns a promise
        Swal.fire({
            title: 'Saved!',
            text: `Template "${updatedTemplate.name}" has been updated.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
        onClose();
    } catch (err) {
        console.error('Failed to save template:', err);
        Swal.fire({
            title: 'Error!',
            text: 'Failed to save changes. Please try again.',
            icon: 'error',
        });
    }
};



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
                        Edit Template
                    </h2>
                    <p className="text-md text-gray-500">
                        Update the template details and content
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
                                className="w-full px-4 py-2 text-sm  rounded-full bg-[#F3F3F5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[#717182]"
                                placeholder="Enter template name"
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
                                    <option value="Results">Reminder</option>
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
                                className="w-full px-4 py-3 text-sm bg-[#F3F3F5]  border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-[#717182]"
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
                            onClick={handleSave}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-[#030213] rounded-full hover:bg-gray-500 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};



interface TemplateDataModalProps {
  templateData: any;
}
const Templates: React.FC<TemplateDataModalProps> = ({templateData}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
const [templatesList, setTemplatesList] = useState<Template[]>(
  Array.isArray(templateData)
    ? templateData.map(t => ({
        ...t,
        type: t.communication_type as 'whatsapp' | 'email' | 'both',
        lastModified: t.updated_at.split('T')[0],
      }))
    : []
);
    const [deleteMessageTemplate] = useDeleteMessageTemplateMutation();

const [updateMessageTemplate] = useUpdateMessageTemplateMutation();


    const handlePreview = (template: Template) => {
        setSelectedTemplate(template);
    };

    const handleEdit = (template: Template) => {
        setEditingTemplate(template);
    };

    const handleCloseModal = () => {
        setSelectedTemplate(null);
        setEditingTemplate(null);
    };

const handleSaveTemplate = async (updatedTemplate: Template) => {
    try {
        // Call backend API with all updated fields
        await updateMessageTemplate({
            template_id: updatedTemplate.id,
            // name: updatedTemplate.name,
            // type: updatedTemplate.type,
            // category: updatedTemplate.category,
            // status: updatedTemplate.status,
            message: updatedTemplate.message,
        }).unwrap();

        // Update local state
        setTemplatesList(prev =>
            prev.map(template =>
                template.id === updatedTemplate.id ? { ...template, ...updatedTemplate } : template
            )
        );
    } catch (err) {
        console.error('Failed to update template:', err);
        throw err; // so modal can show error
    }
};

const handleDeleteTemplate = async (template: Template) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to delete "${template.name}"? This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626', // red
    cancelButtonColor: '#6b7280', // gray
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    try {
      await deleteMessageTemplate({ template_id: template.id }).unwrap();

      setTemplatesList(prev => prev.filter(t => t.id !== template.id));

      Swal.fire({
        title: 'Deleted!',
        text: `"${template.name}" has been deleted.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Failed to delete template:", err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete template. Please try again.',
        icon: 'error',
      });
    }
  }
};



    const filteredTemplates = templatesList.filter((template) =>
  template.name.toLowerCase().includes(searchTerm.toLowerCase())
);
console.log(templatesList)


    return (
        <div className="bg-gray-50 mt-6 w-full">
            <div className="bg-white rounded-2xl border border-gray-200">
                {/* Header */}
                <div className="px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Communication Templates</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Manage pre-approved message templates for patient outreach</p>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-3xl hover:bg-gray-50 transition-colors">
                        <Download size={16} />
                        Export
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-[#F3F3F5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative min-w-[180px]">
                            <select className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-gray-200 rounded-full bg-[#F3F3F5] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer">
                                <option>All Types</option>
                                <option>WhatsApp</option>
                                <option>Email</option>
                                <option>Both</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative min-w-[180px]">
                            <select className="w-full appearance-none px-4 py-2 pr-10 text-sm border border-[#F3F3F5] rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer">
                                <option>All Statuses</option>
                                <option>Active</option>
                                <option>Draft</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto overflow-y-hidden px-6 pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="min-w-max border border-gray-200 rounded-3xl overflow-hidden">
                        <table className="w-full border-0">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 border-t-0">
                                    <th className="px-6 py-3 text-left text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                                        Template Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                                        Usage
                                    </th>
                                    {/* <th className="px-6 py-3 text-left text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                                        Success Rate
                                    </th> */}
                                    <th className="px-6 py-3 text-left text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                                        Last Modified
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-bold text-[#0A0A0A] uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTemplates.map((template, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Template Name */}
                                        <td className="px-6 py-4 whitespace-nowrap text-md font-bold text-gray-900">
                                            {template.name}
                                        </td>

                                        {/* Type */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${template.type === "whatsapp"
                                                        ? "bg-green-100 text-green-800"
                                                        : template.type === "email"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-purple-100 text-purple-800"
                                                    }`}
                                            >
                                                {template.type}
                                            </span>
                                        </td>

                                        {/* Category */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {template.category}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${template.status === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {template.status}
                                            </span>
                                        </td>

                                        {/* Usage */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {template.usage}
                                        </td>

                                        {/* Success Rate */}
                                        {/* <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900 w-8">
                                                    {template.successRate}%
                                                </span>

                                                <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                                                    <div
                                                        className={`h-2 rounded-full ${getSuccessRateColor(
                                                            template.successRate
                                                        )}`}
                                                        style={{
                                                            width: `${template.successRate}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </td> */}

                                        {/* Last Modified */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {template.lastModified}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handlePreview(template)}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 rounded-xl"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleEdit(template)}
                                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors border border-gray-200 rounded-xl"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteTemplate(template)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors border border-gray-200 rounded-xl">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {selectedTemplate && (
                <TemplatePreviewModal
                    template={selectedTemplate}
                    onClose={handleCloseModal}
                />
            )}

            {/* Edit Modal */}
            {editingTemplate && (
                <EditTemplateModal
                    template={editingTemplate}
                    onClose={handleCloseModal}
                    onSave={handleSaveTemplate}
                />
            )}
        </div>
    );
};

export default Templates;