import { ChevronDown, MessageSquare } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useSendWhatsAppOrEmailMutation } from '../../../../redux/services/communications/communications.api';
import { useGetAllMessageTemplatesQuery } from '../../../../redux/services/dashboard/manager/message.api';
import { toast } from 'react-toastify';

interface SendWhatsAppProps {
  patientData: any;
}

const SendWhatsApp: React.FC<SendWhatsAppProps> = ({ patientData }) => {
  const [template, setTemplate] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: templatesData, isLoading: isLoadingTemplates } = useGetAllMessageTemplatesQuery();
  const [sendWhatsApp, { isLoading: isSending }] = useSendWhatsAppOrEmailMutation();

  // Filter templates for whatsapp or both
  const whatsappTemplates = Array.isArray(templatesData?.data)
    ? templatesData.data.filter((t: any) => t.communication_type === 'whatsapp' || t.communication_type === 'both')
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (!patientData?.id) {
      toast.error('Patient ID not found');
      return;
    }

    try {
      const payload = {
        patient_id: patientData.id.toString(),
        platform: 'whatsapp',
        subject: subject || 'WhatsApp Message',
        message: message,
      }
      console.log(payload);
      await sendWhatsApp({
        patient_id: patientData.id.toString(),
        platform: 'whatsapp',
        subject: subject || 'WhatsApp Message',
        message: message,
      }).unwrap();
      toast.success('WhatsApp message sent successfully');
      setMessage('');
      setTemplate('');
      setSubject('');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to send WhatsApp message');
    }
  };

  const handleTemplateSelect = (selectedTemplate: any) => {
    setTemplate(selectedTemplate.id.toString());
    setMessage(selectedTemplate.message);
    setSubject(selectedTemplate.subject || '');
    setIsDropdownOpen(false);
  };

  const selectedLabel = whatsappTemplates.find((opt: any) => opt.id.toString() === template)?.name || 'Select template';

  return (
    <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-gray-200">
      <h2 className="text-gray-900 text-base font-semibold mb-5">Send WhatsApp</h2>

      <div className="space-y-5">
        {/* Message Template Custom Dropdown */}
        <div>
          <label htmlFor="template" className="block text-gray-900 text-sm font-normal mb-2">
            Message Template
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              disabled={isLoadingTemplates}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#F3F3F5] text-gray-900 text-sm rounded-2xl px-4 py-2.5 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all disabled:opacity-50"
            >
              <span className={template ? 'text-gray-900' : 'text-gray-400'}>
                {isLoadingTemplates ? 'Loading templates...' : selectedLabel}
              </span>
            </button>
            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-2xl overflow-hidden max-h-60 overflow-y-auto shadow-lg">
                {whatsappTemplates.length > 0 ? (
                  whatsappTemplates.map((option: any) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleTemplateSelect(option)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors first:pt-3 last:pb-3"
                    >
                      {option.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-400 italic">No templates available</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Message Textarea */}
        <div>
          <label htmlFor="message" className="block text-gray-900 text-sm font-normal mb-2">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            rows={4}
            className="w-full bg-[#F3F3F5] text-gray-900 placeholder:text-gray-400 text-sm rounded-2xl py-2.5 px-4 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
          />
        </div>

        {/* Send WhatsApp Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={isSending}
          className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white rounded-full py-2.5 px-6 flex items-center justify-center gap-2 transition-colors mt-6 disabled:opacity-50"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-base font-normal">{isSending ? 'Sending...' : 'Send WhatsApp'}</span>
        </button>
      </div>
    </div>
  );
};

export default SendWhatsApp;
