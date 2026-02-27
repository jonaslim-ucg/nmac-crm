import { ChevronDown, Loader2, Send } from 'lucide-react';
import { useState } from 'react';
import { useGetAllPatientQuery } from '../../../../redux/services/dashboard/admin/admin.patient';
import { useSendMessageMutation } from '../../../../redux/services/dashboard/manager/manager.api';
import Swal from 'sweetalert2';

export default function ComposeMessage() {
  const [patientId, setPatientId] = useState('');
  const [platform, setPlatform] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const { data: patientsData } = useGetAllPatientQuery({ limit: 100, offset: 0 });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const patients = patientsData?.results || [];

  const handleSendMessage = async () => {
    if (!patientId || !platform || !message) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      await sendMessage({
        patient_id: patientId,
        platform,
        subject: subject || platform,
        message,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Sent!',
        text: `Message sent successfully via ${platform}.`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Clear form
      setPatientId('');
      setPlatform('');
      setSubject('');
      setMessage('');
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error?.data?.detail || error?.data?.message || 'Failed to send message.',
      });
    }
  };

  return (
    <div className=" bg-gray-50  flex items-center justify-center">
      <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-6">
        <h1 className="text-lg sm:text-2xl font-normal text-[#0A0A0A] mb-6">
          Compose New Message
        </h1>

        <div className="space-y-4">
          {/* Select Patient */}
          <div>
            <label className="block text-sm font-medium text-[#0A0A0A] mb-1">
              Select Patient *
            </label>
            <div className="relative">
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full appearance-none bg-[#F3F3F5] border-0 rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">Choose a patient</option>
                {patients.map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Platform *
            </label>
            <div className="relative">
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full appearance-none bg-[#F3F3F5] border-0 rounded-full px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="">Choose platform</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              className="w-full bg-[#F3F3F5] border-0 rounded-full px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="w-full bg-[#F3F3F5] border-0 rounded-2xl px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={isSending}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full py-2 px-4 flex items-center justify-center gap-2.5 text-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isSending ? 'Sending...' : 'Send Message'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
