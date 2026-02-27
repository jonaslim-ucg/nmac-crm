import React, { useState } from 'react';
import { useGetAllMessageTemplatesQuery, useUseTemplateMutation } from '../../../../redux/services/dashboard/manager/message.api';
import TemplateCard from './TemplateCard';
import Spinner from '../../../Spinner';
import PatientSelectionModal from './PatientSelectionModal';
import Swal from 'sweetalert2';

const ManagerMessageTemplate: React.FC = () => {
  const { data: templatesData, isLoading } = useGetAllMessageTemplatesQuery();
  const [useTemplate] = useUseTemplateMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  const handleUseTemplate = (templateId: number) => {
    setSelectedTemplateId(templateId);
    setIsModalOpen(true);
  };

  const handlePatientSelect = async (patientId: string) => {
    if (!selectedTemplateId) return;

    try {
      await useTemplate({ temp_id: selectedTemplateId, patient_id: patientId }).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Template sent successfully!',
        timer: 2000,
        showConfirmButton: false
      });
      setIsModalOpen(false);
      setSelectedTemplateId(null);
    } catch (error: any) {
      console.error("Failed to use template:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error?.data?.detail || 'Failed to send template.',
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const templates = templatesData?.data || [];

  return (
    <div className=" bg-white p-4">
      <div className="w-full">
        {/* Header */}
        <h1 className="text-xl font-normal text-gray-900 mb-4">Message Templates</h1>

        {/* Templates List */}
        <div className="space-y-4">
          {templates.length > 0 ? (
            templates.map((template: any) => (
              <TemplateCard
                key={template.id}
                title={template.subject}
                type={template.communication_type}
                content={template.message}
                onUse={() => handleUseTemplate(template.id)}
              />
            ))
          ) : (
            <p className="text-gray-500">No templates found.</p>
          )}
        </div>
      </div>

      <PatientSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handlePatientSelect}
      />
    </div>
  );
};

export default ManagerMessageTemplate;
