import { CheckCircle, ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Option {
  value: string;
  label: string;
}

const ManagerLogNewCall: React.FC = () => {
  const [outcome, setOutcome] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const outcomeOptions: Option[] = [
    { value: 'no-answer', label: 'No Answer' },
    { value: 'voicemail', label: 'Left Voicemail' },
    { value: 'wrong-number', label: 'Wrong Number' },
    { value: 'declined', label: 'Declined' },
    { value: 'appointment', label: 'Booked Appointment' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    console.log({ outcome, notes });
  };

  const handleOptionSelect = (value: string) => {
    setOutcome(value);
    setIsDropdownOpen(false);
  };

  const selectedLabel = outcomeOptions.find(opt => opt.value === outcome)?.label || 'Select outcome';

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-gray-200">
      <h2 className="text-gray-900 text-base font-semibold mb-5">Log New Call</h2>

      <div className="space-y-5">
        {/* Call Outcome Custom Dropdown */}
        <div>
          <label htmlFor="outcome" className="block text-gray-900 text-sm mb-2">
            Call Outcome
          </label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-[#F3F3F5] text-gray-900 text-sm rounded-2xl px-4 py-2.5 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              <span className={outcome ? 'text-gray-900' : 'text-gray-400'}>
                {selectedLabel}
              </span>
            </button>
            <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl  overflow-hidden">
                {outcomeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionSelect(option.value)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors first:pt-3 last:pb-3"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes Textarea */}
        <div>
          <label htmlFor="notes" className="block text-gray-900 text-sm mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add call notes..."
            rows={4}
            className="w-full bg-[#F3F3F5] text-gray-900 placeholder:text-gray-400 text-sm rounded-2xl py-2.5 px-4 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
          />
        </div>

        {/* Log Call Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-gray-900 hover:bg-gray-800 active:bg-gray-950 text-white rounded-full py-2 px-6 flex items-center justify-center gap-2 transition-colors mt-6"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="text-base font-normal">Log Call</span>
        </button>
      </div>
    </div>
  );
};

export default ManagerLogNewCall;